'use client'

import { useState, useRef, useEffect } from 'react'
import { registerInterest } from '@/app/actions'
import { gsap } from 'gsap'

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)


interface LandingSectionProps {
  landingRef: React.RefObject<HTMLDivElement>
}

export default function LandingSection({ landingRef }: LandingSectionProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'success') {
      // Ultra-Premium Success Morph & Stagger
      const tl = gsap.timeline()
      tl.to(formRef.current, { 
        opacity: 0, 
        y: -40, 
        scale: 0.9, 
        filter: "blur(10px)",
        duration: 0.8, 
        ease: "expo.inOut" 
      })
      .fromTo(".status-message", 
        { 
          opacity: 0, 
          y: 40, 
          letterSpacing: "1.5em",
          filter: "blur(15px)"
        }, 
        { 
          opacity: 1, 
          y: 0, 
          letterSpacing: "0.4em", 
          filter: "blur(0px)",
          duration: 2, 
          ease: "expo.out" 
        }, 
        "-=0.4"
      )
    }
  }, [status])

  async function handleSubmit(formData: FormData) {
    if (status === 'loading') return
    
    setStatus('loading')
    setMessage('')

    // Subtle loading state
    gsap.to(formRef.current, { opacity: 0.5, scale: 0.98, duration: 0.4, ease: "power2.inOut" })

    try {
      const result = await registerInterest(formData)
      if (result.error) {
        setStatus('error')
        setMessage(result.error)
        
        // Premium Error Shake (Elastic & Physical)
        gsap.to(formRef.current, {
          x: 12,
          duration: 0.08,
          repeat: 5,
          yoyo: true,
          ease: "none",
          onComplete: () => {
            gsap.set(formRef.current, { clearProps: "x" })
            gsap.to(formRef.current, { opacity: 1, scale: 1, duration: 0.3 })
          }
        })
      } else {
        setStatus('success')
        setMessage('THANK YOU FOR YOUR INTEREST')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
      gsap.to(formRef.current, { opacity: 1, scale: 1, duration: 0.3 })
    }
  }

  return (
    <div id="landing" className="landing" ref={landingRef}>

      <div className="tagline-block fade-up">
        <p className="tagline" style={{ fontFamily: 'var(--font-cormorant)' }}>
          FOR THE ONES WHO FEEL DEEPLY, THINK DIFFERENTLY
          <br />
          AND MOVE BETWEEN WORLDS WITHOUT VALIDATION.
        </p>
      </div>

      <div className="register-block">

        <div className="mini-logo fade-up">
          <img src="/preview-transparent.png" alt="Mixed Signals Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <p className="register-label fade-up" style={{ fontFamily: 'var(--font-cormorant)' }}>
          Register your interest
        </p>

        <form 
          ref={formRef}
          action={handleSubmit} 
          className={`email-field fade-up ${status === 'error' ? 'shake' : ''} ${status === 'success' ? 'success' : ''}`}
        >
          <input
            ref={inputRef}
            name="email"
            type="email"
            placeholder={status === 'success' ? "" : "E-mail"}
            aria-label="Email address"
            required
            style={{ 
              fontFamily: 'var(--font-cormorant)',
            }}
            disabled={status === 'loading' || status === 'success'}
          />
          <button 
            type="submit" 
            aria-label="Submit" 
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? '...' : (status === 'success' ? '' : '→')}
          </button>
        </form>

        {message && (
          <p className={`status-message fade-up ${status}`} style={{ 
            fontFamily: 'var(--font-cormorant)',
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: status === 'success' ? '14px' : '12px',
            letterSpacing: status === 'success' ? '0.3em' : '0.15em',
            color: status === 'error' ? '#ff4444' : '#000000',
            fontWeight: status === 'success' ? 500 : 400
          }}>
            {message}
          </p>
        )}

        <div className="social-row fade-up">
          <a href="https://www.instagram.com/m1xedsignals?igsh=czhoaXZ5b2cxbXE1&utm_source=qr" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
          </a>
          <a href="https://youtube.com/@m1xedsignals?si=O6d2rJ7kh2tulxD4" className="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <YouTubeIcon />
          </a>
        </div>

      </div>

      <footer className="footer fade-up">
        <span className="footer-brand" style={{ fontFamily: 'var(--font-playfair)' }}>
          Mixed Signals
        </span>
        <span className="footer-copy" style={{ fontFamily: 'var(--font-cormorant)' }}>
          © 2025 — All frequencies reserved
        </span>
      </footer>

    </div>
  )
}
