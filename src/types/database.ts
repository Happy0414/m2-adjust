// events テーブルの型定義
export type Event = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  created_at: string;
};

// candidate_dates テーブルの型定義
export type CandidateDate = {
  id: string;
  event_id: string;
  date: string;
};

// answers テーブルの型定義
export type Answer = {
  id: string;
  event_id: string;
  candidate_date_id: string;
  name: string;
  status: Status;
  comment: string;
  created_at: string;
};

type Status = "yes" | "maybe" | "no";
