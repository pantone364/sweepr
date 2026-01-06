export interface Sweepstake {
  id: string
  name: string
  image_url: string | null
  countries: string[]
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  location: string
  rating: number
  avatar_url: string | null
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Country {
  code: string
  name: string
  active: boolean
}
