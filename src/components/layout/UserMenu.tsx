import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import type { UserRead } from '../../features/user/types';
import { SettingsIcon, LogoutIcon, UserIcon } from '../icons';

type Props = {
  user: UserRead;
  expanded: boolean;
  onLogout: () => void;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function UserMenu({ user, expanded, onLogout }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {user.profile_photo ? (
          <img
            src={user.profile_photo.url}
            alt={user.name}
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(user.name) || '?'}
          </div>
        )}
        <div
          className={
            'flex min-w-0 flex-col transition-opacity duration-200 ' +
            (expanded ? 'opacity-100' : 'pointer-events-none absolute opacity-0')
          }
        >
          <span className="truncate text-sm font-medium text-gray-900">
            {user.name}
          </span>
          <span className="truncate text-xs text-gray-500">{user.email}</span>
        </div>
      </button>

      {isOpen && (
        <div
          className={
            'absolute z-50 w-48 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ' +
            (expanded ? 'bottom-full left-0 mb-2' : 'bottom-0 left-full ml-3')
          }
        >
          <div className="flex flex-col py-1">
            <NavLink
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                'flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ' +
                (isActive ? 'bg-gray-50 font-medium text-primary' : '')
              }
            >
              <UserIcon width={16} height={16} />
              Perfil
            </NavLink>
            <NavLink
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                'flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ' +
                (isActive ? 'bg-gray-50 font-medium text-primary' : '')
              }
            >
              <SettingsIcon width={16} height={16} />
              Configuración
            </NavLink>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogoutIcon width={16} height={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}