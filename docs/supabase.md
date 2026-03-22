# DB Setup with Supabase

- バックエンドは Supabase を使用する
- ORM は無し

## MEMO

**Init supabase project**

```bash
supabase init
```

**Login Supabase CLI**

```bash
supabase login
```

**Link Supabase Project**

```bash
supabase link --project-ref <project-ref>
```

**Create Migration file**

```bash
supabase migration new create_tables
```

**Apply Schema**

```bash
supabase db push
```

**Other Commands**

```bash
# 新しいマイグレーションファイルを作成
supabase migration new <name>

# ローカルの未適用マイグレーションをリモートに反映
supabase db push

# リモートの現在のスキーマをローカルに取得
supabase db pull

# 適用済み/未適用の一覧確認
supabase migration list
```

**ローカル Supabase を使う場合**

```bash
# Supabase コンテナを起動
supabase start

# migration + 初期データ投入
supabase db reset
```
