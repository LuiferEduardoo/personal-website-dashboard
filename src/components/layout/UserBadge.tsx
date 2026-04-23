import type { UserRead } from '../../features/user/types';

type Props = {
  user: UserRead;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function UserBadge({ user }: Props) {
  return (
    <div className="flex items-center gap-3 px-1 py-2">
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
      <div className="flex min-w-0 flex-col opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="truncate text-sm font-medium text-gray-900">
          {user.name}
        </span>
        <span className="truncate text-xs text-gray-500">{user.email}</span>
      </div>
    </div>
  );
}
