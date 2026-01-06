import AdminNav from '@/components/admin/AdminNav'

export const metadata = {
  title: 'Admin | Sweepr',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[var(--secondary)]">
      <AdminNav />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
