import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ApiError } from '../../../lib/api';
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from '../api';
import type {
  ProjectCreatePayload,
  ProjectRead,
  ProjectUpdatePayload,
} from '../types';

type ProjectsContextValue = {
  projects: ProjectRead[];
  loading: boolean;
  error: string | null;
  getById: (id: number) => ProjectRead | undefined;
  createProject: (payload: ProjectCreatePayload) => Promise<ProjectRead>;
  updateProject: (id: number, payload: ProjectUpdatePayload) => Promise<ProjectRead>;
  removeProject: (id: number) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ProjectsContext = createContext<ProjectsContextValue | null>(null);

const LIST_LIMIT = 50;

type Props = { children: ReactNode };

export function ProjectsProvider({ children }: Props) {
  const { token } = useAuth();
  const [projects, setProjects] = useState<ProjectRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    listProjects(token, { limit: LIST_LIMIT })
      .then((res) => {
        if (!cancelled) setProjects(res.items);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : 'No se pudieron cargar los proyectos.',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleCreate = useCallback(
    async (payload: ProjectCreatePayload) => {
      if (!token) throw new Error('Sesión expirada.');
      const created = await createProject(payload, token);
      setProjects((prev) => [created, ...prev]);
      return created;
    },
    [token],
  );

  const handleUpdate = useCallback(
    async (id: number, payload: ProjectUpdatePayload) => {
      if (!token) throw new Error('Sesión expirada.');
      const updated = await updateProject(id, payload, token);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      return updated;
    },
    [token],
  );

  const handleRemove = useCallback(
    async (id: number) => {
      if (!token) throw new Error('Sesión expirada.');
      await deleteProject(id, token);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    },
    [token],
  );

  const getById = useCallback(
    (id: number) => projects.find((p) => p.id === id),
    [projects],
  );

  const value = useMemo<ProjectsContextValue>(
    () => ({
      projects,
      loading,
      error,
      getById,
      createProject: handleCreate,
      updateProject: handleUpdate,
      removeProject: handleRemove,
    }),
    [projects, loading, error, getById, handleCreate, handleUpdate, handleRemove],
  );

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  );
}
