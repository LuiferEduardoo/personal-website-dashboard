import { useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import BlogPage from './pages/BlogPage';
import ProjectsPage from './pages/ProjectsPage';
import ImagesPage from './pages/ImagesPage';
import DashboardLayout from './components/layout/DashboardLayout';
import type { NavItem } from './components/layout/Sidebar';
import { BlogIcon, ImagesIcon, ProjectsIcon } from './components/icons';

type SectionId = 'blog' | 'projects' | 'images';

const NAV_ITEMS: (NavItem & { id: SectionId })[] = [
  { id: 'blog', label: 'Blog', icon: <BlogIcon /> },
  { id: 'projects', label: 'Proyectos', icon: <ProjectsIcon /> },
  { id: 'images', label: 'Imágenes', icon: <ImagesIcon /> },
];

const SECTION_PAGES: Record<SectionId, ReactNode> = {
  blog: <BlogPage />,
  projects: <ProjectsPage />,
  images: <ImagesPage />,
};

export default function App() {
  const { isAuthenticated } = useAuth();
  const [section, setSection] = useState<SectionId>('blog');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout
      items={NAV_ITEMS}
      activeId={section}
      onSelect={(id) => setSection(id as SectionId)}
    >
      {SECTION_PAGES[section]}
    </DashboardLayout>
  );
}
