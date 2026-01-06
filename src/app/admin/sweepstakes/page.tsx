import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SweepstakesList from './SweepstakesList'

export default async function SweepstakesPage() {
  const supabase = await createClient()

  const { data: sweepstakes, error } = await supabase
    .from('sweepstakes')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        Error loading sweepstakes: {error.message}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Sweepstakes</h1>
        <Link
          href="/admin/sweepstakes/new"
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-hover)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Sweepstake
        </Link>
      </div>

      <SweepstakesList initialSweepstakes={sweepstakes || []} />
    </div>
  )
}
