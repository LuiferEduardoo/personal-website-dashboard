import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ProjectEditor from '../../features/projects/components/ProjectEditor';
import { useProjects } from '../../features/projects/context';
import type { ProjectUpdatePayload } from '../../features/projects/types';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById, updateProject, loading } = useProjects();

  const projectId = Number(id);
  const project = Number.isFinite(projectId) ? getById(projectId) : undefined;
  usePageTitle(project ? `Editar: ${project.name}` : 'Editar proyecto');

  if (!Number.isFinite(projectId)) {
    return <Navigate to="/projects" replace />;
  }

  if (loading) {
    return (
      <section className="py-12 text-center text-sm text-gray-500">
        Cargando proyecto…
      </section>
    );
  }

  if (!project) {
    return (
      <section className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <h2 className="text-base font-medium text-gray-900">
          Proyecto no encontrado
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          El proyecto que intentas editar no existe o fue eliminado.
        </p>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Volver al listado
        </button>
      </section>
    );
  }

  const handleUpdate = async (payload: ProjectUpdatePayload) => {
    await updateProject(project.id, payload);
    navigate('/projects');
  };

  return (
    <ProjectEditor
      project={project}
      onCancel={() => navigate('/projects')}
      onSubmitUpdate={handleUpdate}
    />
  );
}
