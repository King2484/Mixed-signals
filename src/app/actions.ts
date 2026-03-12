'use server'

import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'


export async function registerInterest(formData: FormData) {
  const rawEmail = formData.get('email') as string
  const email = (rawEmail || '').trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' }
  }

  try {
    console.log(`[Registration] Starting flow for: ${email}`)

    // 1. Save to Supabase (Priority #1)
    if (!supabase) {
      console.error('[Registration] Supabase client is not initialized. Check your environment variables.')
      return { error: 'Service is temporarily unavailable (Missing Database Config).' }
    }

    const { error: supabaseError } = await supabase
      .from('interest_registrations')
      .insert([{ email }])

    if (supabaseError) {
      if (supabaseError.code === '23505') {
        console.warn(`[Registration] Email already exists: ${email}`)
        return { error: 'This email is already registered.' }
      }
      console.error(`[Registration] Supabase insertion error:`, supabaseError)
      throw supabaseError
    }
    console.log(`[Registration] Successfully saved to database: ${email}`)

    // 2. Email Flow (Fail-Safe / Suppressed for non-critical errors)
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[Registration] Skipping emails: RESEND_API_KEY is missing.')
      return { success: true } // Still return success since DB save worked
    }

    const resend = new Resend(apiKey)
    const FROM_EMAIL = 'Mixed Signals <onboarding@resend.dev>'
    
    // Team Notification List
    const recipients = [
      'ushiedaniel2484@gmail.com',
      'daniel@mixed-signals.co',
      'derrick.amankwah@mixed-signals.co',
      'richmond.ojo@mixed-signals.co'
    ]

    // Concurrent Team Notifications (Fast & Isolated)
    const notifyPromises = recipients.map(recipient => 
      resend.emails.send({
        from: FROM_EMAIL,
        to: recipient,
        subject: 'New Interest Registration',
        html: `<p>A new user has registered their interest: <strong>${email}</strong></p>`
      }).catch(err => {
        console.error(`[Registration] Failed to notify ${recipient}:`, err.message)
        return null
      })
    )

    // Fire team notifications concurrently
    Promise.allSettled(notifyPromises).then(results => {
      results.forEach((res, i) => {
        if (res.status === 'fulfilled' && res.value) {
           console.log(`[Registration] Notification attempt for ${recipients[i]} recorded.`)
        }
      })
    })

    // 3. User Confirmation (Attempt independently)
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Thank you for your interest | Mixed Signals',
        html: `
          <div style="font-family: serif; color: #000; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 10px;">Mixed Signals</h1>
            <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">Thank you for registering your interest.</p>
            <p style="font-size: 16px; line-height: 1.6; font-style: italic;">A menswear narrative guided by a curiosity to intertwine nuanced perspectives with an essence of familiarity.</p>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #999; letter-spacing: 0.1em;">© 2025 MIXED SIGNALS — ALL FREQUENCIES RESERVED</p>
            </div>
          </div>
        `
      })
    } catch (e: any) {
      console.warn(`[Registration] User confirmation suppressed (Sandbox/API limit):`, e.message)
    }

    return { success: true }
  } catch (error: any) {
    console.error('[Registration] Critical error:', error)
    return { error: 'Registration failed. Please try again later.' }
  }
}
