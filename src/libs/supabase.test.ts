import { test, beforeEach, describe, expect } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createEvent } from "./supabase.ts";
import dotenv from "dotenv";

const supabaseTest = describe.skipIf(process.env.CI);

supabaseTest("supabase integration tests", () => {
  let supabase: SupabaseClient;

  beforeEach(async () => {
    dotenv.config({ path: ".env.test" });
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY must be set",
      );
    }
    supabase = createClient(supabaseUrl, supabaseKey);
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
    expect(event.id).toBe(id);
    expect(event.title).toBe(newEvent.title);
    expect(event.description).toBe(newEvent.description);

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
});
