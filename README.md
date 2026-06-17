# Tareas Cloud — Aplicación Colaborativa en Tiempo Real

Aplicación web para la gestión colaborativa de tareas con sincronización en tiempo real, desarrollada como práctica didáctica de la asignatura **Tecnologías Emergentes** (Cloud Computing) de la **UAB CIS**.

## Demo

**URL de producción:** [tareas-cloud-gamma.vercel.app](https://tareas-cloud-gamma.vercel.app)

## Tecnologías Utilizadas

| Herramienta | Función | Modelo |
|------------|---------|--------|
| **HTML + CSS** | Frontend estático | — |
| **Supabase** | Base de datos PostgreSQL, API REST y Realtime | PaaS |
| **Git / GitHub** | Control de versiones y repositorio remoto | SaaS |
| **Vercel** | Hosting y despliegue serverless | PaaS |

## Arquitectura

```
[Usuario] → Vercel (CDN) → Supabase API → PostgreSQL + Realtime
     ↑______________ WebSocket (tiempo real) _____________|
```

- **Vercel** sirve los archivos estáticos (HTML, CSS, JS) con CDN global.
- **Supabase** actúa como backend: almacena las tareas en PostgreSQL y emite cambios en tiempo real vía WebSocket.
- La suscripción a cambios se hace mediante `Supabase Realtime` (basado en PostgreSQL replication + WebSocket), lo que permite que múltiples usuarios vean las actualizaciones sin recargar la página.

## Funcionalidades

- Agregar tareas con título y responsable
- Marcar tareas como completadas / reabrir
- Eliminar tareas
- Filtros por estado: Todas / Pendientes / Completadas
- Contador de tareas pendientes
- Fecha de creación formateada
- Sincronización en tiempo real entre dispositivos
- Diseño responsivo (mobile-friendly)

## Capturas de Pantalla

*(Agregar aquí capturas de la aplicación funcionando)*

### Vista principal
![]()

### Tareas agregadas
![]()

### Filtro por estado
![]()

## Instalación y Uso Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/adrianescalantejaime99-rgb/tareas-cloud.git
   cd tareas-cloud
   ```

2. Abrir `index.html` en el navegador (doble clic) o usar Live Server en VS Code.

   > **Nota:** La aplicación ya está configurada con las credenciales de Supabase. Si deseas usar tu propio proyecto, edita `app.js` y reemplaza `SUPABASE_URL` y `SUPABASE_ANON_KEY`.

## Configuración de Supabase (propio proyecto)

1. Crear una cuenta en [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. Ir a **SQL Editor** y ejecutar:
   ```sql
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
   ```
4. Ir a **Project Settings → API**, copiar `Project URL` y `anon public key`
5. Pegar esos valores en `app.js`

## Despliegue en Vercel

1. Subir el código a GitHub
2. Ingresar a [vercel.com](https://vercel.com) e iniciar sesión con GitHub
3. Hacer clic en **Add New Project** → importar `tareas-cloud`
4. Vercel detecta automáticamente que es un proyecto HTML estático
5. Hacer clic en **Deploy**

Cada vez que se hace `git push` a la rama `main`, Vercel redeployea automáticamente (CI/CD).

## Créditos

**Docente:** Ing. Hermes Rodriguez Rivero  
**Asignatura:** Tecnologías Emergentes — Cloud Computing  
**Universidad:** UAB CIS  
**Semestre:** 7mo — Ingeniería de Sistemas
