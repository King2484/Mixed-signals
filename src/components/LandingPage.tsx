'use client'

import { useRef } from 'react'
import Loader, { type LoaderRef } from './Loader'
import VideoHero from './VideoHero'
import LandingSection from './LandingSection'
import { useLoaderAnimation } from '@/hooks/useLoaderAnimation'

export default function LandingPage() {
  // Section refs
  const loaderRef    = useRef<HTMLDivElement>(null)
  const heroRef      = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const barTopRef    = useRef<HTMLDivElement>(null)
  const barBottomRef = useRef<HTMLDivElement>(null)
  const heroIdRef    = useRef<HTMLDivElement>(null)
  const landingRef   = useRef<HTMLDivElement>(null)

  // Loader's internal element refs (cards, counter strips, etc.)
  const loaderRefs = useRef<LoaderRef>({
    loaderEl: null,
    cardAEl:  null,
    cardBEl:  null,
    cardCEl:  null,
    cardDEl:  null,
    imgAEl:   null,
    imgBEl:   null,
    imgCEl:   null,
    imgDEl:   null,
    r1El:     null,
    r2El:     null,
    s0El:     null,
    s1El:     null,
  })

  // Fire the master GSAP timeline
  useLoaderAnimation({
    loader:     loaderRef,
    hero:       heroRef,
    video:      videoRef,
    barTop:     barTopRef,
    barBottom:  barBottomRef,
    heroId:     heroIdRef,
    landing:    landingRef,
    loaderRefs,
  })

  return (
    <>
      {/* Grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* Cinematic preloader */}
      <Loader refs={loaderRefs} loaderRef={loaderRef} />

      {/* Full-screen video hero */}
      <VideoHero
        heroRef={heroRef}
        videoRef={videoRef}
        barTopRef={barTopRef}
        barBottomRef={barBottomRef}
        heroIdRef={heroIdRef}
      />

      {/* Landing content */}
      <LandingSection landingRef={landingRef} />
    </>
  )
}
