import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import BlogListPage from './pages/blog/BlogListPage';
import BlogCreatePage from './pages/blog/BlogCreatePage';
import BlogEditPage from './pages/blog/BlogEditPage';
import ProjectsListPage from './pages/projects/ProjectsListPage';
import ProjectCreatePage from './pages/projects/ProjectCreatePage';
import ProjectEditPage from './pages/projects/ProjectEditPage';
import ImagesPage from './pages/ImagesPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import { BlogPostsProvider } from './features/blog/context';
import { ProjectsProvider } from './features/projects/context';

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BlogPostsProvider>
      <ProjectsProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="/blogs" replace />} />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/new" element={<BlogCreatePage />} />
            <Route path="/blogs/:id/edit" element={<BlogEditPage />} />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/new" element={<ProjectCreatePage />} />
            <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
            <Route path="/images" element={<ImagesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/blogs" replace />} />
          </Route>
        </Routes>
      </ProjectsProvider>
    </BlogPostsProvider>
  );
}
