import type { ReactNode } from 'react';
import { LogoIcon, LogoutIcon } from '../icons';
import { useAuth } from '../../context/AuthContext';
import UserBadge from './UserBadge';

export type NavItem = {
  id: string;
  label: string;
  icon: ReactNode;
};

type Props = {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

const labelClasses =
  'whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100';

export default function Sidebar({ items, activeId, onSelect }: Props) {
  const { user, logout } = useAuth();

  return (
    <aside
      aria-label="Navegación principal"
      className="group fixed inset-y-0 left-0 z-20 flex w-16 flex-col justify-between overflow-hidden border-r border-gray-200 bg-white py-5 shadow-sm transition-[width] duration-200 ease-out hover:w-60"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LogoIcon width={22} height={22} />
          </div>
          <span className={`${labelClasses} text-gray-900`}>Dashboard</span>
        </div>

        <nav aria-label="Secciones" className="flex flex-col gap-1 px-3">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelect(item.id)}
                className={
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
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1 px-3">
        {user && <UserBadge user={user} />}

        <button
          type="button"
          onClick={logout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="flex h-10 items-center gap-3 rounded-lg px-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center">
            <LogoutIcon />
          </span>
          <span className={labelClasses}>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
