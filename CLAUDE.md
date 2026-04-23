# CLAUDE.md

Guía para trabajar en este proyecto. Sigue estas convenciones al generar o modificar código.

## Stack tecnológico

- **React 19** — librería de UI basada en componentes funcionales y hooks.
- **Vite 8** — bundler y dev server (`npm run dev`, `npm run build`, `npm run preview`).
- **Tailwind CSS 4** — framework utility-first, integrado vía `@tailwindcss/vite` e importado con `@import "tailwindcss";` en [src/index.css](src/index.css).
- **ESLint 9** — linter configurado en [eslint.config.js](eslint.config.js) con `eslint-plugin-react-hooks` y `eslint-plugin-react-refresh`.
- **JavaScript (ESM)** — `"type": "module"` en [package.json](package.json).

## API backend

- **Base URL (desarrollo):** `http://localhost:8000`
- **Documentación (Swagger/OpenAPI):** `http://localhost:8000/docs`
- Antes de implementar cualquier feature que consuma datos, consulta `/docs` para conocer endpoints, schemas, métodos y códigos de respuesta.
- Centraliza la configuración del cliente HTTP en `src/lib/api.js` (o equivalente) y expón funciones por recurso (`getProjects`, `updateProject`).
- La URL base debe venir de una variable de entorno (`VITE_API_URL`) con fallback a `http://localhost:8000`.

## Scripts

- `npm run dev` — inicia el servidor de desarrollo.
- `npm run build` — genera el build de producción.
- `npm run lint` — ejecuta ESLint sobre el proyecto.
- `npm run preview` — sirve el build localmente.

## Buenas prácticas

### Clean Code
- Nombres descriptivos y en inglés para variables, funciones y componentes (`UserCard`, `fetchProjects`, `isLoading`).
- Funciones cortas, con una sola responsabilidad (SRP).
- Evita comentarios que expliquen el *qué*; deja que los nombres lo hagan. Usa comentarios solo para el *por qué* no evidente.
- Prefiere `const` sobre `let`. No uses `var`.
- Early return para reducir anidamiento.

### DRY (Don't Repeat Yourself)
- Si un bloque de lógica se repite 2+ veces, extráelo a una función, hook o componente.
- Centraliza constantes, rutas de API y configuraciones en módulos dedicados (`src/constants/`, `src/config/`).
- Reutiliza hooks personalizados para lógica compartida entre componentes.

### KISS & YAGNI
- Soluciona el problema actual, no casos hipotéticos futuros.
- Evita abstracciones prematuras: tres líneas similares son mejores que una abstracción apresurada.
- Prefiere soluciones simples y legibles sobre soluciones "inteligentes".

### SOLID aplicado a React
- **SRP**: cada componente hace una sola cosa.
- **OCP**: componentes extensibles vía props y composición (`children`), no modificando internals.
- **DIP**: depende de abstracciones (props, hooks) en lugar de acoplarse a implementaciones concretas.

### Calidad
- Sin `console.log` en código final.
- Sin código muerto, imports sin usar ni variables declaradas y no utilizadas.
- Maneja estados de carga, error y vacío explícitamente en la UI.
- Valida únicamente en los bordes del sistema (input del usuario, APIs externas), no entre funciones internas.

## Componetización

### Estructura de carpetas sugerida

```
src/
├── assets/          # imágenes, íconos, fuentes
├── components/      # componentes reutilizables (UI genérica)
│   ├── ui/          # primitivos: Button, Input, Card, Modal
│   └── layout/      # Header, Sidebar, Footer
├── features/        # módulos por dominio (dashboard, auth, projects)
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       └── index.js
├── hooks/           # hooks globales (useFetch, useLocalStorage)
├── pages/           # vistas/rutas top-level
├── lib/             # utilidades, helpers, clientes de API
├── constants/       # constantes y configuración
└── styles/          # estilos globales si aplica
```

### Reglas para componentes

- **Un componente por archivo**. El nombre del archivo coincide con el componente (`UserCard.jsx`).
- **Componentes funcionales + hooks**. No usar clases.
- **Props explícitas**: evita pasar objetos gigantes; pasa solo lo que el componente necesita.
- **Separación de responsabilidades**:
  - *Presentational* (UI pura, recibe props, no tiene lógica de negocio).
  - *Container* (orquesta datos, hooks, side effects).
- **Composición sobre configuración**: prefiere `children` y slots a props booleanas que activen variantes complejas.
- **Tamaño razonable**: si un componente supera ~150 líneas, probablemente necesita dividirse.
- **Custom hooks** para lógica reutilizable con estado o efectos (`useAuth`, `useTheme`).

### Evitar prop drilling — usar Context

- **No pases props a través de 3+ niveles** solo para que un componente profundo las consuma (prop drilling). Es señal de que necesitas Context o composición.
- **Usa React Context** para estado que es *global por naturaleza*: tema, usuario autenticado, idioma, configuración del dashboard, datos de sesión.
- **No abuses de Context**: no todo estado debe ser global. Si solo lo usan 2 componentes hermanos, levanta el estado al padre común.
- **Un Context por dominio**, no un mega-context. Ejemplo: `AuthContext`, `ThemeContext`, `DashboardContext` separados.
- **Patrón recomendado** para cada Context:
  ```
  src/context/
  └── AuthContext/
      ├── AuthContext.jsx    # createContext + Provider
      ├── useAuth.js         # hook consumer con validación
      └── index.js
  ```
- Expón siempre un **custom hook** (`useAuth`) que encapsule `useContext` y lance error si se usa fuera del Provider. Nunca consumas el contexto crudo en los componentes.
- **Memoriza el value** del Provider con `useMemo` para evitar re-renders innecesarios en todos los consumers.
- **Alternativas a Context** cuando el estado es complejo o muy compartido: composición con `children`, component composition (slots), o una librería de estado (Zustand, Redux Toolkit) si el proyecto lo justifica.

### Señales de que un componente tiene demasiadas props

- Más de **5-7 props** → considera agrupar en un objeto, usar composición con `children`, o mover estado a Context.
- Props que solo se pasan *hacia abajo* sin usarse en el nivel intermedio → prop drilling, mueve a Context.
- Props booleanas múltiples (`isActive`, `isDisabled`, `isLoading`, `isPrimary`) → probablemente el componente hace demasiado, divídelo.

## Manejo de datos y sincronización con la API

### Regla: no re-fetch tras mutaciones
Cuando el usuario crea, actualiza o elimina un recurso, **NO vuelvas a llamar al endpoint de listado** para refrescar la UI. Actualiza el estado local con los datos ya conocidos.

**Por qué:** re-fetching innecesario genera latencia, parpadeos en la UI, carga extra al backend y mala experiencia de usuario. Ya tienes los datos en memoria y la respuesta de la mutación.

**Cómo aplicarlo:**

- **Update (PUT/PATCH):** reemplaza el item en el array local por el objeto devuelto por la API (o por el payload enviado si el backend no retorna el recurso completo).
  ```js
  // ✅ correcto
  const updated = await api.updateProject(id, payload);
  setProjects(prev => prev.map(p => p.id === id ? updated : p));

  // ❌ incorrecto
  await api.updateProject(id, payload);
  const all = await api.getProjects(); // re-fetch innecesario
  setProjects(all);
  ```

- **Create (POST):** agrega el item devuelto por la API al array local (normalmente con `id` y `createdAt` generados por el backend).
  ```js
  const created = await api.createProject(payload);
  setProjects(prev => [...prev, created]);
  ```

- **Delete (DELETE):** filtra el item del array local tras confirmar el éxito.
  ```js
  await api.deleteProject(id);
  setProjects(prev => prev.filter(p => p.id !== id));
  ```

### Optimistic updates (opcional, para UX premium)
Para acciones rápidas y de baja probabilidad de fallo (toggle, like, reordenar), actualiza la UI *antes* de la respuesta de la API y revierte si falla:

```js
const previous = projects;
setProjects(prev => prev.map(p => p.id === id ? { ...p, ...payload } : p));
try {
  await api.updateProject(id, payload);
} catch (err) {
  setProjects(previous); // rollback
  showError(err);
}
```

### Cuándo sí re-fetch es válido
- Cambios que afectan campos calculados por el backend que no retorna la mutación (totales, rankings, timestamps derivados).
- Paginación o filtros que dependen del orden global del servidor.
- Invalidación explícita tras operaciones batch o migraciones.

En esos casos, documenta en el código *por qué* se hace el re-fetch.

### Fuente única de verdad
- El estado del servidor vive en un solo lugar por recurso (Context, store o hook de fetching).
- Los componentes **no duplican** listas del mismo recurso en estados locales paralelos.
- Al mutar, actualiza ese estado central — todos los consumidores se re-renderizan automáticamente.

### Convenciones de estilos (Tailwind)

- Usa clases utility directamente en el JSX.
- Extrae componentes cuando el conjunto de clases se repite, no uses `@apply` como atajo para evitar componentización.
- Orden sugerido de clases: layout → spacing → sizing → typography → colors → effects.
- Para variantes condicionales, usa helpers como `clsx` o `cn` en lugar de concatenar strings.

### Exports

- Export nombrado por defecto para componentes (`export default function Button() {}`).
- Un `index.js` por feature para exponer la API pública del módulo.

## Flujo de trabajo con Claude

- Antes de agregar una dependencia, confirma que no hay una alternativa ya instalada.
- Antes de crear un archivo, verifica si puedes editar uno existente.
- Al terminar un cambio, corre `npm run lint` y `npm run build` para validar.
