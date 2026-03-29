import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "../types/database.ts";

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

// TODO: 回答する

// TODO: 回答を編集
