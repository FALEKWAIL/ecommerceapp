import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VORN — Seller Dashboard',
  description: 'VORN Admin — Manage your products and orders.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

