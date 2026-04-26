import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      <main
        className={
          'px-6 py-8 transition-[margin] duration-200 ease-out md:px-10 ' +
          (expanded ? 'ml-60' : 'ml-16')
        }
      >
        <Outlet />
      </main>
    </div>
  );
}
