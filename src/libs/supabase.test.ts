import { test, beforeEach, describe, expect } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  createEvent,
  getEventByID,
  answerCandidateDates,
  editAnswer,
} from "./supabase.ts";
import type { Database } from "../types/database.ts";
import dotenv from "dotenv";

const supabaseTest = describe.skipIf(process.env.CI);

supabaseTest("supabase integration tests", () => {
  let supabase: SupabaseClient<Database>;

  beforeEach(async () => {
    dotenv.config({ path: ".env.test" });
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY must be set",
      );
    }
    supabase = createClient<Database>(supabaseUrl, supabaseKey);
  });

  test("create new event", async () => {
    const newEvent = {
      title: "TestEvent",
      description: "This is test.",
      dates: [
        new Date("2026-04-01T19:00:00+09:00"),
        new Date("2026-04-02T19:00:00+09:00"),
        new Date("2026-04-03T19:00:00+09:00"),
      ],
    };
    const { id } = await createEvent(supabase, newEvent);

    const { data: event, error: errEvent } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
    expect(errEvent).toBeNull();
    expect(event).not.toBeNull();
    expect(event!.id).toBe(id);
    expect(event!.title).toBe(newEvent.title);
    expect(event!.description).toBe(newEvent.description);

    const { data: dates, error: errDate } = await supabase
      .from("candidate_dates")
      .select("*")
      .eq("event_id", id);
    expect(errDate).toBeNull();
    expect(dates).not.toBeNull();
    expect(dates).toHaveLength(3);

    newEvent.dates.forEach((date, i) => {
      expect(dates![i].event_id).toBe(id);
      expect(dates![i].date).toBe(date.toISOString().replace(".000Z", "")); // Supabase が UTC で保存するため合わせる
    });
  });

  test("create event and get it by id", async () => {
    const newEvent = {
      title: "GetEventTest",
      description: "get event test.",
      dates: [
        new Date("2026-04-01T19:00:00+09:00"),
        new Date("2026-04-02T19:00:00+09:00"),
      ],
    };
    const { id } = await createEvent(supabase, newEvent);

    const event = await getEventByID(supabase, id);
    expect(event.id).toBe(id);
    expect(event.title).toBe(newEvent.title);
    expect(event.description).toBe(newEvent.description);
    expect(event.candidate_dates).toHaveLength(2);
    event.candidate_dates.forEach((cd) => {
      expect(cd.event_id).toBe(id);
    });
    expect(event.answers).toEqual([]);
  });

  test("answer candidate dates", async () => {
    const newEvent = {
      title: "AnswerTest",
      description: "answer test.",
      dates: [
        new Date("2026-04-01T19:00:00+09:00"),
        new Date("2026-04-02T19:00:00+09:00"),
      ],
    };
    const { id: eventId } = await createEvent(supabase, newEvent);

    const created = await getEventByID(supabase, eventId);
    const [cd1, cd2] = created.candidate_dates;

    const input = {
      eventId,
      name: "テスト太郎",
      comment: "よろしくお願いします",
      attendances: [
        { candidateDateId: cd1.id, status: "yes" as const },
        { candidateDateId: cd2.id, status: "maybe" as const },
      ],
    };
    const { answerId } = await answerCandidateDates(supabase, input);

    const event = await getEventByID(supabase, eventId);
    expect(event.answers).toHaveLength(1);

    const answer = event.answers[0];
    expect(answer.id).toBe(answerId);
    expect(answer.name).toBe(input.name);
    expect(answer.comment).toBe(input.comment);
    expect(answer.attendances).toHaveLength(2);
    expect(answer.attendances[0].candidate_date_id).toBe(cd1.id);
    expect(answer.attendances[0].status).toBe("yes");
    expect(answer.attendances[1].candidate_date_id).toBe(cd2.id);
    expect(answer.attendances[1].status).toBe("maybe");
  });

  test("edit answer", async () => {
    const newEvent = {
      title: "EditAnswerTest",
      description: "edit answer test.",
      dates: [
        new Date("2026-04-01T19:00:00+09:00"),
        new Date("2026-04-02T19:00:00+09:00"),
      ],
    };
    const { id: eventId } = await createEvent(supabase, newEvent);

    const created = await getEventByID(supabase, eventId);
    const [cd1, cd2] = created.candidate_dates;

    const { answerId } = await answerCandidateDates(supabase, {
      eventId,
      name: "田中",
      attendances: [
        { candidateDateId: cd1.id, status: "yes" },
        { candidateDateId: cd2.id, status: "no" },
      ],
    });

    await editAnswer(supabase, {
      answerId,
      name: "田中",
      comment: "変更しました",
      attendances: [
        { candidateDateId: cd1.id, status: "maybe" },
        { candidateDateId: cd2.id, status: "yes" },
      ],
    });

    const event = await getEventByID(supabase, eventId);
    const answer = event.answers[0];
    expect(answer.name).toBe("田中");
    expect(answer.comment).toBe("変更しました");
    expect(answer.attendances[0].candidate_date_id).toBe(cd1.id);
    expect(answer.attendances[0].status).toBe("maybe");
    expect(answer.attendances[1].candidate_date_id).toBe(cd2.id);
    expect(answer.attendances[1].status).toBe("yes");
  });
});
