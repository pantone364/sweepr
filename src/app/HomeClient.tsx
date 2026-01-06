"use client";

import { useState, useEffect } from "react";
import type { Sweepstake, Testimonial } from "@/lib/supabase/types";

interface Props {
  sweepstakes: Sweepstake[]
  testimonials: Testimonial[]
}

// Location-specific content
const LOCATION_CONTENT: Record<string, {
  heroHeading: string;
  heroParagraph: string;
  aboutParagraph: string;
  testimonialSubheading: string;
  footerTagline: string;
}> = {
  AU: {
    heroHeading: "Australians' favourite sweepstakes",
    heroParagraph: "Discover verified giveaways tailored to you. Enter in minutes, win prizes that matter, and join thousands of Australians winning every day.",
    aboutParagraph: "Sweepr works with sweepstake holders all across Australia and beyond to find and promote the best sweepstakes and giveaways currently available. Our team verifies each opportunity to ensure legitimacy, so you can enter with confidence. We personalise recommendations based on your location and preferences, giving you access to relevant prizes with higher odds of winning.",
    testimonialSubheading: "Join thousands of happy winners across Australia",
    footerTagline: "Australia's trusted sweepstakes platform",
  },
  US: {
    heroHeading: "Americans' favorite sweepstakes",
    heroParagraph: "Discover verified giveaways tailored to you. Enter in minutes, win prizes that matter, and join thousands of Americans winning every day.",
    aboutParagraph: "Sweepr works with sweepstake holders all across the USA and beyond to find and promote the best sweepstakes and giveaways currently available. Our team verifies each opportunity to ensure legitimacy, so you can enter with confidence. We personalize recommendations based on your location and preferences, giving you access to relevant prizes with higher odds of winning.",
    testimonialSubheading: "Join thousands of happy winners across the USA",
    footerTagline: "America's trusted sweepstakes platform",
  },
  UK: {
    heroHeading: "Great Britain's favourite sweepstakes",
    heroParagraph: "Discover verified giveaways tailored to you. Enter in minutes, win prizes that matter, and join thousands of Brits winning every day.",
    aboutParagraph: "Sweepr works with sweepstake holders all across Great Britain and beyond to find and promote the best sweepstakes and giveaways currently available. Our team verifies each opportunity to ensure legitimacy, so you can enter with confidence. We personalise recommendations based on your location and preferences, giving you access to relevant prizes with higher odds of winning.",
    testimonialSubheading: "Join thousands of happy winners across Great Britain",
    footerTagline: "Great Britain's trusted sweepstakes platform",
  },
}

export default function HomeClient({ sweepstakes, testimonials }: Props) {
  const [selectedCountry, setSelectedCountry] = useState("AU");

  // Auto-detect country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        if (data.country && ['AU', 'US', 'UK'].includes(data.country)) {
          setSelectedCountry(data.country);
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
      }
    };
    detectCountry();
  }, []);

  const filteredSweepstakes = sweepstakes.filter((item) =>
    item.countries?.includes(selectedCountry)
  );

  const filteredTestimonials = testimonials.filter((item) =>
    item.countries?.includes(selectedCountry)
  );

  // Get location-specific content (fallback to AU)
  const content = LOCATION_CONTENT[selectedCountry] || LOCATION_CONTENT.AU;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              SWEEPR
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/brand/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {content.heroHeading}
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-xl mx-auto">
              {content.heroParagraph}
            </p>
            <div className="mt-8">
              <a
                href="#sweepstakes"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-colors"
              >
                Browse Sweepstakes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              About Sweepr
            </h3>
            <p className="text-lg text-muted leading-relaxed">
              {content.aboutParagraph}
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Verified */}
            <div className="text-center p-8 rounded-2xl bg-secondary hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Verified</h4>
              <p className="text-muted">
                Sweepr verifies each sweepstake individually and those running them to ensure legitimate opportunities you can trust.
              </p>
            </div>

            {/* Higher Odds */}
            <div className="text-center p-8 rounded-2xl bg-secondary hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Higher Odds</h4>
              <p className="text-muted">
                By verifying and displaying only relevant sweepstakes personalised to you, your odds of winning are higher than other providers.
              </p>
            </div>

            {/* Quick to Enter */}
            <div className="text-center p-8 rounded-2xl bg-secondary hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Quick to Enter</h4>
              <p className="text-muted">
                Each sweepstake can be entered within minutes—perfect for earning extra cash or rewards during your commute or downtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sweepstakes Grid */}
      <section id="sweepstakes" className="py-16 sm:py-24 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Find Sweepstakes Near You
            </h3>
          </div>

          {/* Sweepstakes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredSweepstakes.map((sweepstake) => (
              <a
                key={sweepstake.id}
                href={sweepstake.url || '#'}
                target={sweepstake.url ? '_blank' : undefined}
                rel={sweepstake.url ? 'noopener noreferrer' : undefined}
                className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${sweepstake.image_url || '/placeholder.jpg'}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm sm:text-base font-semibold text-white">{sweepstake.name}</p>
                </div>
              </a>
            ))}
          </div>

          {filteredSweepstakes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No sweepstakes available for this country yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Our Winners Say
            </h3>
            <p className="text-lg text-muted">
              {content.testimonialSubheading}
            </p>
          </div>

          {filteredTestimonials.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-secondary rounded-2xl p-8 hover:shadow-lg transition-shadow"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted">{testimonial.location}</p>
                    </div>
                    {testimonial.avatar_url ? (
                      <div
                        className="w-12 h-12 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${testimonial.avatar_url}')` }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                        <span className="text-muted font-medium">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No testimonials available for this region yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight mb-4">SWEEPR</h2>
            <p className="text-white/60 mb-6">
              {content.footerTagline}
            </p>
            <div className="flex justify-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="mt-8 text-sm text-white/40">
              © {new Date().getFullYear()} Sweepr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
