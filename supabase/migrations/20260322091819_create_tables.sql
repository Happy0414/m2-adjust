-- UUID 生成用
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- イベントテーブル
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW ()
);

-- 候補日テーブル
CREATE TABLE candidate_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL
);

-- 回答テーブル
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    candidate_date_id UUID NOT NULL REFERENCES candidate_dates (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('yes', 'maybe', 'no')),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW (),
    UNIQUE (event_id, candidate_date_id, name)
);

-- インデックス
CREATE INDEX idx_candidate_dates_event_id ON candidate_dates (event_id);
CREATE INDEX idx_answers_event_id ON answers (event_id);
CREATE INDEX idx_answers_candidate_date_id ON answers (candidate_date_id);

-- RLS 有効化
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- パブリックポリシー
-- TODO: 見直しが必要
-- events
CREATE POLICY "public can read events" ON events FOR SELECT USING (true);
CREATE POLICY "public can insert events" ON events FOR INSERT WITH CHECK (true);

-- candidate_dates
CREATE POLICY "public can read candidate_dates" ON candidate_dates FOR SELECT USING (true);
CREATE POLICY "public can insert candidate_dates" ON candidate_dates FOR INSERT WITH CHECK (true);

-- answers
CREATE POLICY "public can read answers" ON answers FOR SELECT USING (true);
CREATE POLICY "public can insert answers" ON answers FOR INSERT WITH CHECK (true);
CREATE POLICY "public can update answers" ON answers FOR UPDATE USING (true);
CREATE POLICY "public can delete answers" ON answers FOR DELETE USING (true);
