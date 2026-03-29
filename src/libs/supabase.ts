import { SupabaseClient, createClient } from "@supabase/supabase-js";
import type { Database, Tables } from "../types/database.ts";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

type createEventInput = {
  title: string;
  description?: string;
  dates: Date[];
};

type createEventOutput = {
  id: string;
};

// イベントを作成する
export const createEvent = async (
  client: SupabaseClient<Database>,
  event: createEventInput,
): Promise<createEventOutput> => {
  const slug = crypto.randomUUID();

  const { data: eventRow, error: errEvent } = await client
    .from("events")
    .insert({
      title: event.title,
      description: event.description ?? null,
      slug,
    })
    .select("id")
    .single();

  if (errEvent) {
    throw new Error("failed to create event", { cause: errEvent });
  }

  const candidateDateRows = event.dates.map((d) => {
    return { event_id: eventRow.id, date: d.toISOString() };
  });
  const { error: errDates } = await client
    .from("candidate_dates")
    .insert(candidateDateRows);

  if (errDates) {
    throw new Error("failed to insert candidate dates", { cause: errDates });
  }

  return { id: eventRow.id };
};

type getEventOutput = Tables<"events"> & {
  candidate_dates: Tables<"candidate_dates">[];
  answers: (Tables<"answers"> & {
    attendances: Tables<"attendances">[];
  })[];
};

// イベント取得
export const getEventByID = async (
  client: SupabaseClient<Database>,
  id: string,
): Promise<getEventOutput> => {
  const { data, error } = await client
    .from("events")
    .select("*, candidate_dates(*), answers(*, attendances(*))")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("failed to get event", { cause: error });
  }

  return data;
};

type answerCandidateDatesInput = {
  eventId: string;
  name: string;
  comment?: string;
  attendances: {
    candidateDateId: string;
    status: "yes" | "maybe" | "no";
  }[];
};

type answerCandidateDatesOutput = {
  answerId: string;
};

// 回答する
export const answerCandidateDates = async (
  client: SupabaseClient<Database>,
  input: answerCandidateDatesInput,
): Promise<answerCandidateDatesOutput> => {
  const { data: answerRow, error: errAnswer } = await client
    .from("answers")
    .insert({
      event_id: input.eventId,
      name: input.name,
      comment: input.comment ?? null,
    })
    .select("id")
    .single();

  if (errAnswer) {
    throw new Error("failed to create answer", { cause: errAnswer });
  }

  const attendanceRows = input.attendances.map((a) => ({
    answer_id: answerRow.id,
    candidate_date_id: a.candidateDateId,
    status: a.status,
  }));

  const { error: errAttendances } = await client
    .from("attendances")
    .insert(attendanceRows);

  if (errAttendances) {
    throw new Error("failed to insert attendances", { cause: errAttendances });
  }

  return { answerId: answerRow.id };
};

type editAnswerInput = {
  answerId: string;
  name: string;
  comment?: string;
  attendances: {
    candidateDateId: string;
    status: "yes" | "maybe" | "no";
  }[];
};

// 回答を編集
export const editAnswer = async (
  client: SupabaseClient<Database>,
  input: editAnswerInput,
): Promise<void> => {
  const { error: errAnswer } = await client
    .from("answers")
    .update({
      name: input.name,
      comment: input.comment ?? null,
    })
    .eq("id", input.answerId);

  if (errAnswer) {
    throw new Error("failed to update answer", { cause: errAnswer });
  }

  const results = await Promise.all(
    input.attendances.map((a) =>
      client
        .from("attendances")
        .update({ status: a.status })
        .eq("answer_id", input.answerId)
        .eq("candidate_date_id", a.candidateDateId),
    ),
  );

  const errAttendance = results.find((r) => r.error)?.error;
  if (errAttendance) {
    throw new Error("failed to update attendances", { cause: errAttendance });
  }
};
