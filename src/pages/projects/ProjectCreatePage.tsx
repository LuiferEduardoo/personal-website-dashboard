import { useNavigate } from 'react-router-dom';
import ProjectEditor from '../../features/projects/components/ProjectEditor';
import { useProjects } from '../../features/projects/context';
import type { ProjectCreatePayload } from '../../features/projects/types';

export default function ProjectCreatePage() {
  const { createProject } = useProjects();
  const navigate = useNavigate();

  const handleCreate = async (payload: ProjectCreatePayload) => {
    await createProject(payload);
    navigate('/projects');
  };

  return (
    <ProjectEditor
      onCancel={() => navigate('/projects')}
      onSubmitCreate={handleCreate}
    />
  );
}
