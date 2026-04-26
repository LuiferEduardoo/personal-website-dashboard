import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../../lib/api';
import ProjectsList from '../../features/projects/components/ProjectsList';
import { useProjects } from '../../features/projects/context';
import type { ProjectRead } from '../../features/projects/types';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function ProjectsListPage() {
  usePageTitle('Proyectos');
  const { projects, loading, error: listError, removeProject } = useProjects();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<ProjectRead | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await removeProject(pendingDelete.id);
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo borrar el proyecto.',
      );
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, removeProject]);

  const error = deleteError ?? listError;

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
        loading={loading}
        onCreate={() => navigate('/projects/new')}
        onEdit={(project) => navigate(`/projects/${project.id}/edit`)}
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
