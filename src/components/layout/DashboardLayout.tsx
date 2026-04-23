import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-16 px-6 py-8 md:px-10">
        <Outlet />
      </main>
    </div>
  );
}
