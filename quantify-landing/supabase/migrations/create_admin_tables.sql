-- =============================================
-- Tables Admin pour Quantify
-- À exécuter dans l'éditeur SQL de Supabase
-- =============================================

-- 1. Table landing_content : contenu modifiable de la landing page
CREATE TABLE IF NOT EXISTS landing_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT DEFAULT '',
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'html', 'json')),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (section, key)
);

ALTER TABLE landing_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on landing_content"
  ON landing_content FOR SELECT
  USING (true);

CREATE POLICY "Allow admin insert on landing_content"
  ON landing_content FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE auth_user_id = auth.uid()
      AND user_type = 'admin'
    )
  );

CREATE POLICY "Allow admin update on landing_content"
  ON landing_content FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE auth_user_id = auth.uid()
      AND user_type = 'admin'
    )
  );

CREATE POLICY "Allow admin delete on landing_content"
  ON landing_content FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE auth_user_id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- 2. Table admin_notifications : historique des notifications envoyées
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  audience TEXT DEFAULT 'all' CHECK (audience IN ('all', 'pending', 'invited')),
  recipients_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin full access on admin_notifications"
  ON admin_notifications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE auth_user_id = auth.uid()
      AND user_type = 'admin'
    )
  );
