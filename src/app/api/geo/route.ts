import { NextRequest, NextResponse } from 'next/server'

// Map country codes to our supported regions
const COUNTRY_MAPPING: Record<string, string> = {
  // Australia
  'AU': 'AU',
  // United States
  'US': 'US',
  // United Kingdom and related
  'GB': 'UK',
  'UK': 'UK',
}

export async function GET(request: NextRequest) {
  // Vercel provides geo information in x-vercel-ip-country header
  const country = request.headers.get('x-vercel-ip-country') || 'AU'

  const mappedCountry = COUNTRY_MAPPING[country] || 'AU'

  return NextResponse.json({
    country: mappedCountry,
    detectedCountry: country
  })
}
