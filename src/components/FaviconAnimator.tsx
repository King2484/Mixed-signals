'use client'

import { useEffect } from 'react'

export default function FaviconAnimator() {
  useEffect(() => {
    // Look for both icon and apple-touch-icon
    const icon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement
    
    if (!icon) return

    const canvas = document.createElement('canvas')
    canvas.width = 64 // Using 64 for better quality
    canvas.height = 64
    const ctx = canvas.getContext('2d', { alpha: true })
    
    const img = new Image()
    img.src = '/favicon-white.png'
    
    let angle = 0
    let animationFrameId: number
    let lastUpdate = 0
    const fps = 30 // Throttle updates for performance
    const interval = 1000 / fps

    const animate = (time: number) => {
      if (!ctx || !img.complete) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      // Throttle to 30fps to avoid excessive CPU usage
      if (time - lastUpdate > interval) {
        ctx.clearRect(0, 0, 64, 64)
        ctx.save()
        ctx.translate(32, 32)
        ctx.rotate(angle)
        ctx.drawImage(img, -32, -32, 64, 64)
        ctx.restore()
        
        const dataUrl = canvas.toDataURL('image/png')
        icon.href = dataUrl
        if (appleIcon) appleIcon.href = dataUrl
        
        angle += 0.03 // Adjust speed of rotation
        lastUpdate = time
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }

    img.onload = () => {
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return null
}
