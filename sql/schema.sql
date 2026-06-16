CREATE TABLE tareas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  responsable TEXT NOT NULL,
  completada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acceso_publico" ON tareas
  FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE tareas;
