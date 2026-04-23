import type { ReactNode } from 'react';
import Sidebar, { type NavItem } from './Sidebar';

type Props = {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  children: ReactNode;
};

export default function DashboardLayout({
  items,
  activeId,
  onSelect,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={items} activeId={activeId} onSelect={onSelect} />
      <main className="ml-16 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
