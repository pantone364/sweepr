import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

const countries = [
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "UK", name: "United Kingdom" },
]

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
      countries={countries}
    />
  )
}
