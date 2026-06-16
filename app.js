const SUPABASE_URL = 'https://vgcyfydxzhkmbdaqdnvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnY3lmeWR4emhrbWJkYXFkbnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NjA4NTQsImV4cCI6MjA5NzEzNjg1NH0.0H8Jpzmf_ig96yKAhQd4UG3Ivw_JBF72e6rncytpNL0';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cargarTareas() {
  const { data, error } = await db.from('tareas').select('*').order('created_at');
  if (error) { console.error(error); return; }
  renderTareas(data);
}

db.channel('tareas-canal')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, () => {
    cargarTareas();
  })
  .subscribe();

async function agregarTarea() {
  const titulo = document.getElementById('titulo').value.trim();
  const responsable = document.getElementById('responsable').value.trim();
  if (!titulo || !responsable) { alert('Completa todos los campos'); return; }
  await db.from('tareas').insert({ titulo, responsable });
  document.getElementById('titulo').value = '';
  document.getElementById('responsable').value = '';
}

async function toggleEstado(id, estado) {
  await db.from('tareas').update({ completada: !estado }).eq('id', id);
}

async function eliminarTarea(id) {
  if (confirm('¿Eliminar esta tarea?')) {
    await db.from('tareas').delete().eq('id', id);
  }
}

function renderTareas(tareas) {
  const cont = document.getElementById('tareas-container');
  document.getElementById('contador').textContent = '(' + tareas.length + ')';
  if (tareas.length === 0) { cont.innerHTML = '<p class="vacio">No hay tareas aún.</p>'; return; }
  cont.innerHTML = tareas.map(t => `
    <div class="tarea ${t.completada ? 'completada' : ''}">
      <div class="tarea-info">
        <strong>${t.titulo}</strong>
        <span>Responsable: ${t.responsable}</span>
      </div>
      <div class="tarea-acciones">
        <button onclick="toggleEstado('${t.id}', ${t.completada})">${t.completada ? 'Reabrir' : 'Completar'}</button>
        <button class="btn-eliminar" onclick="eliminarTarea('${t.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

cargarTareas();
