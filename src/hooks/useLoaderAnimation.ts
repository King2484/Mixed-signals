'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import type { LoaderRef } from '@/components/Loader'

interface Refs {
  loader: React.RefObject<HTMLDivElement>
  hero: React.RefObject<HTMLDivElement>
  video: React.RefObject<HTMLVideoElement>
  barTop: React.RefObject<HTMLDivElement>
  barBottom: React.RefObject<HTMLDivElement>
  heroId: React.RefObject<HTMLDivElement>
  landing: React.RefObject<HTMLDivElement>
  loaderRefs: React.MutableRefObject<LoaderRef>
}

export function useLoaderAnimation(refs: Refs) {
  useEffect(() => {
    let ctx: { revert: () => void } | null = null

    const init = () => {

      const {
        loader,
        hero,
        video,
        barTop,
        barBottom,
        heroId,
        landing,
        loaderRefs,
      } = refs

      if (!loader.current || !hero.current) return

      // ── Init SVG stroke dashoffsets ──
      const strokes = document.querySelectorAll<SVGGeometryElement>('#lw .logo-stroke')
      strokes.forEach((el) => {
        let length = 200
        try { length = el.getTotalLength() } catch {}
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length })
      })

      // ── Hide sections initially ──
      gsap.set([hero.current, landing.current], { opacity: 0 })

      // ── Slot counter ──
      const runCounter = (dur: number) => {
        const dcEl = document.querySelector<HTMLElement>('.digit-col')
        if (!dcEl) return
        const em = parseFloat(getComputedStyle(dcEl).fontSize)
        gsap.to('#s0', { y: -(em * 9),  duration: dur * 0.85, ease: 'power1.inOut' })
        gsap.to('#s1', { y: -(em * 20), duration: dur,        ease: 'power1.inOut' })
      }

      const vw = () => window.innerWidth
      const vh = () => window.innerHeight

      ctx = gsap.context(() => {
        const tl = gsap.timeline()

        // ── PHASE 1: loader UI appears ──
        tl
          .to(['#lb-brand', '#lb-year', '#lb-col'], {
            opacity: 1, duration: 0.5, ease: 'power1.out', stagger: 0.06,
          }, 0.0)
          .to(['#r1', '#r2'], {
            scaleX: 1, duration: 0.95, ease: 'power2.inOut', stagger: 0.1,
          }, 0.06)
          .to('#ctr', { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.14)
          .add(() => runCounter(2.55), 0.14)

        // ── PHASE 2: logo appears & animates ──
          .to('#lw', { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.2)
          .fromTo('#lw', 
            { rotation: -15, scale: 0.8 }, 
            { rotation: 10, scale: 1.1, duration: 4.0, ease: 'power1.out' }, 0.2)

        // ── PHASE 3: fade loader UI, show collage ──
          .to(['#lb-brand', '#lb-year', '#lb-col', '#r1', '#r2', '#ctr', '#lw'], {
            opacity: 0, duration: 0.38, ease: 'power1.inOut', stagger: 0.025,
          }, 2.0)
          
          // Cards appear in sequence
          .to('.card-item', { 
            opacity: 1, 
            duration: 0.6, 
            ease: 'power2.out', 
            stagger: 0.15 
          }, 2.2)
          
          // Images slowly scale down inside cards for parallax
          .fromTo(['#img-a', '#img-b', '#img-c', '#img-d'], 
            { scale: 1.25 }, 
            { scale: 1.05, duration: 1.8, ease: 'power2.out', stagger: 0.15 }, 
            2.2)

        // ── PHASE 4: Hero card (D) expansion ──
          // Hide A, B, C cards before D expands
          .to(['#ca', '#cb', '#cc'], {
             opacity: 0, scale: 0.9, duration: 0.6, ease: 'power2.inOut'
          }, 3.8)
          
          // Expand D to full screen
          .to('#cd', {
            width: () => vw(), height: () => vh(),
            borderRadius: 0,
            x: 0, y: 0, 
            left: 0, top: 0,
            transform: 'none',
            duration: 1.4, ease: 'expo.inOut',
          }, 4.0)
          .to('#img-d', { scale: 1, duration: 1.4, ease: 'expo.inOut' }, 4.0)

        // ── PHASE 6: reveal video hero ──
          .to(loader.current, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 5.52)
          .to(hero.current,   { opacity: 1, duration: 0.01 }, 5.53)

          .fromTo(barTop.current,
            { height: '9vh' }, { height: 0, duration: 0.85, ease: 'power2.inOut' }, 5.56)
          .fromTo(barBottom.current,
            { height: '9vh' }, { height: 0, duration: 0.85, ease: 'power2.inOut' }, 5.56)

          .fromTo(video.current,
            { scale: 1.14 }, { scale: 1.0, duration: 2.4, ease: 'power2.out' }, 5.6)

          .to(heroId.current,    { opacity: 1, duration: 0.7, ease: 'power1.out' }, 6.1)
          .to(landing.current,   { opacity: 1, duration: 0.6, ease: 'power1.out' }, 6.6)
          .fromTo('.fade-up', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.1 }, 
            6.7)

          .add(() => {
            if (loader.current) loader.current.style.display = 'none'
            document.body.classList.add('ready')
          }, 6.2)
      })
    }

    init()

    return () => {
      ctx?.revert()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
