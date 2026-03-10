'use client'

interface VideoHeroProps {
  heroRef: React.RefObject<HTMLDivElement>
  videoRef: React.RefObject<HTMLVideoElement>
  barTopRef: React.RefObject<HTMLDivElement>
  barBottomRef: React.RefObject<HTMLDivElement>
  heroIdRef: React.RefObject<HTMLDivElement>
}

export default function VideoHero({
  heroRef,
  videoRef,
  barTopRef,
  barBottomRef,
  heroIdRef,
}: VideoHeroProps) {
  return (
    <div id="hero" className="hero" ref={heroRef}>
      <video
        ref={videoRef}
        id="hero-video"
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=85&fit=crop"
      >
        <source
          src="/hero-video.mp4"
          type="video/mp4"
        />
      </video>

      <div className="hero-bar-top"  ref={barTopRef} />
      <div className="hero-bar-bottom" ref={barBottomRef} />

      <div className="hero-id" ref={heroIdRef}>
        <span className="hero-brand-txt" style={{ fontFamily: 'var(--font-playfair)' }}>
          Mixed Signals
        </span>
        <span className="hero-season" style={{ fontFamily: 'var(--font-cormorant)' }}>
          SS 2025
        </span>
      </div>

    </div>
  )
}
