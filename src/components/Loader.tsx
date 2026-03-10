'use client'

import { useRef } from 'react'

export interface LoaderRef {
  loaderEl: HTMLDivElement | null
  cardAEl: HTMLDivElement | null
  cardBEl: HTMLDivElement | null
  cardCEl: HTMLDivElement | null
  cardDEl: HTMLDivElement | null
  imgAEl: HTMLImageElement | null
  imgBEl: HTMLImageElement | null
  imgCEl: HTMLImageElement | null
  imgDEl: HTMLImageElement | null
  r1El: HTMLDivElement | null
  r2El: HTMLDivElement | null
  s0El: HTMLDivElement | null
  s1El: HTMLDivElement | null
}

interface LoaderProps {
  refs: React.MutableRefObject<LoaderRef>
  loaderRef: React.RefObject<HTMLDivElement>
}

export default function Loader({ refs, loaderRef }: LoaderProps) {
  return (
    <div
      id="loader"
      className="loader"
      ref={(el) => {
        if (refs.current) refs.current.loaderEl = el
        if (loaderRef) (loaderRef as any).current = el
      }}
    >
      {/* Top labels */}
      <span id="lb-brand" className="loader-brand" style={{ fontFamily: 'var(--font-playfair)' }}>
        Mixed Signals
      </span>
      <span id="lb-year" className="loader-year" style={{ fontFamily: 'var(--font-cormorant)' }}>
        SS — 25
      </span>
      <span id="lb-col" className="loader-col" style={{ fontFamily: 'var(--font-cormorant)' }}>
        Liverpool
      </span>

      {/* Thin rules */}
      <div
        id="r1"
        className="rule rule-top"
        ref={(el) => { if (refs.current) refs.current.r1El = el }}
      />
      <div
        id="r2"
        className="rule rule-bottom"
        ref={(el) => { if (refs.current) refs.current.r2El = el }}
      />

      {/* Animated logo */}
      <div id="lw" className="logo-wrap">
        <img src="/preview-transparent.png" alt="Mixed Signals Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* Card A */}
      <div
        id="ca"
        className="card-a card-item"
        ref={(el) => { if (refs.current) refs.current.cardAEl = el }}
      >
        <img
          id="img-a"
          src="/m1xedsignals-20260310-0003.jpg"
          alt=""
          ref={(el) => { if (refs.current) refs.current.imgAEl = el }}
        />
      </div>

      {/* Card B */}
      <div
        id="cb"
        className="card-b card-item"
        ref={(el) => { if (refs.current) refs.current.cardBEl = el }}
      >
        <img
          id="img-b"
          src="/m1xedsignals-20260310-0001.jpg"
          alt=""
          ref={(el) => { if (refs.current) refs.current.imgBEl = el }}
        />
      </div>

      {/* Card C */}
      <div
        id="cc"
        className="card-c card-item"
        ref={(el) => { if (refs.current) refs.current.cardCEl = el }}
      >
        <img
          id="img-c"
          src="/m1xedsignals-20260310-0002.jpg"
          alt=""
          ref={(el) => { if (refs.current) refs.current.imgCEl = el }}
        />
      </div>

      {/* Card D (Final Hero Reveal Card) */}
      <div
        id="cd"
        className="card-d card-item"
        ref={(el) => { if (refs.current) refs.current.cardDEl = el }}
      >
        <img
          id="img-d"
          src="/IMG-20260309-WA0006-opt.jpg"
          alt=""
          ref={(el) => { if (refs.current) refs.current.imgDEl = el }}
        />
      </div>

      {/* Counter */}
      <div
        id="ctr"
        className="loader-counter"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        <div className="digit-col">
          <div
            className="digit-strip"
            id="s0"
            ref={(el) => { if (refs.current) refs.current.s0El = el }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
        <div className="digit-col">
          <div
            className="digit-strip"
            id="s1"
            ref={(el) => { if (refs.current) refs.current.s1El = el }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) => (
              <span key={i}>{n}</span>
            ))}
          </div>
        </div>
        <span id="pct" className="loader-pct">%</span>
      </div>
    </div>
  )
}
