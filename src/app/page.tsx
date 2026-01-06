import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

export default async function Home() {
  const supabase = await createClient()

  const [sweepstakesResult, testimonialsResult] = await Promise.all([
    supabase
      .from('sweepstakes')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true }),
  ])

  const sweepstakes = sweepstakesResult.data || []
  const testimonials = testimonialsResult.data || []

  return (
    <HomeClient
      sweepstakes={sweepstakes}
      testimonials={testimonials}
    />
  )
}
