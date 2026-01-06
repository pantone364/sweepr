'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/lib/supabase/types'

interface Props {
  initialTestimonials: Testimonial[]
}

export default function TestimonialsList({ initialTestimonials }: Props) {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    setDeleting(id)
    const { error } = await supabase.from('testimonials').delete().eq('id', id)

    if (error) {
      alert('Error deleting testimonial: ' + error.message)
    } else {
      setTestimonials(testimonials.filter((t) => t.id !== id))
    }
    setDeleting(null)
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ active: !currentActive })
      .eq('id', id)

    if (error) {
      alert('Error updating testimonial: ' + error.message)
    } else {
      setTestimonials(
        testimonials.map((t) =>
          t.id === id ? { ...t, active: !currentActive } : t
        )
      )
    }
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = testimonials.findIndex((t) => t.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === testimonials.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newTestimonials = [...testimonials]
    const [item] = newTestimonials.splice(index, 1)
    newTestimonials.splice(newIndex, 0, item)

    const updates = newTestimonials.map((t, i) => ({
      id: t.id,
      sort_order: i,
    }))

    setTestimonials(newTestimonials.map((t, i) => ({ ...t, sort_order: i })))

    for (const update of updates) {
      await supabase
        .from('testimonials')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id)
    }

    router.refresh()
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  if (testimonials.length === 0) {
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-[var(--muted)] mt-4">No testimonials yet</p>
        <Link
          href="/admin/testimonials/new"
          className="inline-block mt-4 text-[var(--primary)] hover:underline"
        >
          Add your first testimonial
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
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Avatar</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Quote</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Rating</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">Status</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-[var(--muted)]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {testimonials.map((testimonial, index) => (
            <tr key={testimonial.id} className="hover:bg-[var(--secondary)]/50">
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleReorder(testimonial.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleReorder(testimonial.id, 'down')}
                    disabled={index === testimonials.length - 1}
                    className="p-1 text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                {testimonial.avatar_url ? (
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[var(--secondary)] rounded-full flex items-center justify-center">
                    <span className="text-[var(--muted)] text-sm font-medium">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{testimonial.name}</p>
                  <p className="text-sm text-[var(--muted)]">{testimonial.location}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="text-[var(--muted)] text-sm truncate max-w-xs">
                  "{testimonial.quote}"
                </p>
              </td>
              <td className="px-4 py-3">{renderStars(testimonial.rating)}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleToggleActive(testimonial.id, testimonial.active)}
                  className={`px-2 py-1 text-xs rounded ${
                    testimonial.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {testimonial.active ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}`}
                    className="p-2 text-[var(--muted)] hover:text-[var(--primary)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={deleting === testimonial.id}
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
