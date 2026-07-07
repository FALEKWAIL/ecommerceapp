// ConditionalShell is no longer used.
// Admin/store route separation is now handled server-side in layout.tsx
// via middleware-injected x-pathname header. This file is kept as a placeholder.
export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
