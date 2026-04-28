import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  BlogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImagesIcon,
  ProjectsIcon,
} from '../icons';
import { useAuth } from '../../context/AuthContext';
import UserMenu from './UserMenu';

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { to: '/blogs', label: 'Blog', icon: <BlogIcon /> },
  { to: '/projects', label: 'Proyectos', icon: <ProjectsIcon /> },
  { to: '/images', label: 'Imágenes', icon: <ImagesIcon /> },
];

type Props = {
  expanded: boolean;
  onToggle: () => void;
};

export default function Sidebar({ expanded, onToggle }: Props) {
  const { user, logout } = useAuth();

  const labelClasses = expanded
    ? 'whitespace-nowrap text-sm font-medium opacity-100 transition-opacity duration-200'
    : 'pointer-events-none whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200';

  return (
    <aside
      aria-label="Navegación principal"
      className={
        'fixed inset-y-0 left-0 z-20 flex flex-col justify-between border-r border-gray-200 bg-white py-5 shadow-sm transition-[width] duration-200 ease-out ' +
        (expanded ? 'w-60' : 'w-16')
      }
    >
      <div className="flex flex-col gap-6">
        <div
          className={
            'flex items-center gap-2 px-3 ' +
            (expanded ? 'justify-between' : 'justify-center')
          }
        >
          {expanded && (
            <img src="/logo.svg" alt="Logo" className="h-10 w-10 shrink-0" />
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-label={expanded ? 'Colapsar menú' : 'Expandir menú'}
            aria-expanded={expanded}
            title={expanded ? 'Colapsar menú' : 'Expandir menú'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
        </div>

        <nav aria-label="Secciones" className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              aria-label={item.label}
              className={({ isActive }) =>
                'flex h-10 items-center gap-3 rounded-lg px-2.5 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ' +
                (isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900')
              }
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {item.icon}
              </span>
              <span className={labelClasses}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 px-3 pb-2">
        {user && <UserMenu user={user} expanded={expanded} onLogout={logout} />}
      </div>
    </aside>
  );
}
