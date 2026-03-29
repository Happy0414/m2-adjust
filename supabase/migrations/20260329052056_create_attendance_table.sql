DROP TABLE IF EXISTS answers;

-- 回答テーブル
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW (),
    UNIQUE (event_id, name)
);

-- 出欠テーブル 
CREATE TABLE attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    answer_id UUID NOT NULL REFERENCES answers (id) ON DELETE CASCADE,
    candidate_date_id UUID NOT NULL REFERENCES candidate_dates (id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('yes', 'maybe', 'no')),
    UNIQUE (answer_id, candidate_date_id)
);

CREATE INDEX idx_answers_event_id ON answers (event_id);
CREATE INDEX idx_attendances_answer_id ON attendances (answer_id);
CREATE INDEX idx_attendances_candidate_date_id ON attendances (candidate_date_id);

-- RLS 有効化
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- Public Policy
-- answers
CREATE POLICY "public can read answers" ON answers FOR SELECT USING (true);
CREATE POLICY "public can insert answers" ON answers FOR INSERT WITH CHECK (true);
CREATE POLICY "public can update answers" ON answers FOR UPDATE USING (true);
CREATE POLICY "public can delete answers" ON answers FOR DELETE USING (true);

-- attendances
CREATE POLICY "public can read attendances" ON attendances FOR SELECT USING (true);
CREATE POLICY "public can insert attendances" ON attendances FOR INSERT WITH CHECK (true);
CREATE POLICY "public can update attendances" ON attendances FOR UPDATE USING (true);
CREATE POLICY "public can delete attendances" ON attendances FOR DELETE USING (true);
