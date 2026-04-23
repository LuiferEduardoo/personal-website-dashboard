import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import ProjectsList from '../features/projects/components/ProjectsList';
import ProjectEditor from '../features/projects/components/ProjectEditor';
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from '../features/projects/api';
import type {
  ProjectCreatePayload,
  ProjectRead,
  ProjectUpdatePayload,
} from '../features/projects/types';

type View =
  | { kind: 'list' }
  | { kind: 'create' }
  | { kind: 'edit'; project: ProjectRead };

const LIST_LIMIT = 50;

export default function ProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<ProjectRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>({ kind: 'list' });
  const [pendingDelete, setPendingDelete] = useState<ProjectRead | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listProjects({ limit: LIST_LIMIT })
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
  }, []);

  const handleCreate = useCallback(
    async (payload: ProjectCreatePayload) => {
      if (!token) throw new Error('Sesión expirada.');
      const created = await createProject(payload, token);
      setProjects((prev) => [created, ...prev]);
      setView({ kind: 'list' });
    },
    [token],
  );

  const handleUpdate = useCallback(
    async (project: ProjectRead, payload: ProjectUpdatePayload) => {
      if (!token) throw new Error('Sesión expirada.');
      const updated = await updateProject(project.id, payload, token);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setView({ kind: 'list' });
    },
    [token],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete || !token) return;
    setDeleting(true);
    try {
      await deleteProject(pendingDelete.id, token);
      setProjects((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo borrar el proyecto.',
      );
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, token]);

  if (view.kind === 'create') {
    return (
      <ProjectEditor
        onCancel={() => setView({ kind: 'list' })}
        onSubmitCreate={handleCreate}
      />
    );
  }

  if (view.kind === 'edit') {
    const currentProject = view.project;
    return (
      <ProjectEditor
        project={currentProject}
        onCancel={() => setView({ kind: 'list' })}
        onSubmitUpdate={(payload) => handleUpdate(currentProject, payload)}
      />
    );
  }

  if (loading) {
    return (
      <section className="py-12 text-center text-sm text-gray-500">
        Cargando proyectos…
      </section>
    );
  }

  return (
    <>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <ProjectsList
        projects={projects}
        onCreate={() => setView({ kind: 'create' })}
        onEdit={(project) => setView({ kind: 'edit', project })}
        onDelete={(project) => setPendingDelete(project)}
      />

      {pendingDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-project-title"
          className="fixed inset-0 z-30 flex items-center justify-center bg-gray-900/50 px-4"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2
              id="delete-project-title"
              className="text-lg font-semibold text-gray-900"
            >
              Borrar proyecto
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Seguro que quieres borrar{' '}
              <span className="font-medium text-gray-900">
                "{pendingDelete.name}"
              </span>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? 'Borrando…' : 'Borrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
