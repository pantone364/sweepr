import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [sweepstakesResult, testimonialsResult] = await Promise.all([
    supabase.from('sweepstakes').select('id', { count: 'exact' }),
    supabase.from('testimonials').select('id', { count: 'exact' }),
  ])

  const sweepstakesCount = sweepstakesResult.count ?? 0
  const testimonialsCount = testimonialsResult.count ?? 0

  const stats = [
    {
      label: 'Sweepstakes',
      count: sweepstakesCount,
      href: '/admin/sweepstakes',
      color: 'bg-blue-500',
    },
    {
      label: 'Testimonials',
      count: testimonialsCount,
      href: '/admin/testimonials',
      color: 'bg-green-500',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white text-xl font-bold">{stat.count}</span>
              </div>
              <div>
                <p className="text-[var(--muted)] text-sm">Total</p>
                <p className="text-[var(--foreground)] font-semibold">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/sweepstakes/new"
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Sweepstake
          </Link>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Testimonial
          </Link>
        </div>
      </div>
    </div>
  )
}
