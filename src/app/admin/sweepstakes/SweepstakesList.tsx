'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Sweepstake } from '@/lib/supabase/types'

interface Props {
  initialSweepstakes: Sweepstake[]
}

export default function SweepstakesList({ initialSweepstakes }: Props) {
  const [sweepstakes, setSweepstakes] = useState(initialSweepstakes)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sweepstake?')) return

    setDeleting(id)
    const { error } = await supabase.from('sweepstakes').delete().eq('id', id)

    if (error) {
      alert('Error deleting sweepstake: ' + error.message)
    } else {
      setSweepstakes(sweepstakes.filter((s) => s.id !== id))
    }
    setDeleting(null)
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from('sweepstakes')
      .update({ active: !currentActive })
      .eq('id', id)

    if (error) {
      alert('Error updating sweepstake: ' + error.message)
    } else {
      setSweepstakes(
        sweepstakes.map((s) =>
          s.id === id ? { ...s, active: !currentActive } : s
        )
      )
    }
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = sweepstakes.findIndex((s) => s.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sweepstakes.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newSweepstakes = [...sweepstakes]
    const [item] = newSweepstakes.splice(index, 1)
    newSweepstakes.splice(newIndex, 0, item)

    // Update sort_order for affected items
    const updates = newSweepstakes.map((s, i) => ({
      id: s.id,
      sort_order: i,
    }))

    setSweepstakes(newSweepstakes.map((s, i) => ({ ...s, sort_order: i })))

    for (const update of updates) {
      await supabase
        .from('sweepstakes')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id)
    }

    router.refresh()
  }

  if (sweepstakes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg
          className="w-16 h-16 mx-auto text-[var(--muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
        <p className="text-[var(--muted)] mt-4">No sweepstakes yet</p>
        <Link
          href="/admin/sweepstakes/new"
          className="inline-block mt-4 text-[var(--primary)] hover:underline"
        >
          Add your first sweepstake
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-[var(--secondary)]">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Order</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Image</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Countries</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Status</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-[var(--muted)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {sweepstakes.map((sweepstake, index) => (
            <tr key={sweepstake.id} className="hover:bg-[var(--secondary)]/50">
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleReorder(sweepstake.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleReorder(sweepstake.id, 'down')}
                    disabled={index === sweepstakes.length - 1}
                    className="p-1 text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                {sweepstake.image_url ? (
                  <img
                    src={sweepstake.image_url}
                    alt={sweepstake.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[var(--secondary)] rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                {sweepstake.name}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  {sweepstake.countries?.map((code) => (
                    <span
                      key={code}
                      className="px-2 py-1 bg-[var(--secondary)] text-[var(--muted)] text-xs rounded"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleToggleActive(sweepstake.id, sweepstake.active)}
                  className={`px-2 py-1 text-xs rounded ${
                    sweepstake.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {sweepstake.active ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  <Link
                    href={`/admin/sweepstakes/${sweepstake.id}`}
                    className="p-2 text-[var(--muted)] hover:text-[var(--primary)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(sweepstake.id)}
                    disabled={deleting === sweepstake.id}
                    className="p-2 text-[var(--muted)] hover:text-red-600 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
