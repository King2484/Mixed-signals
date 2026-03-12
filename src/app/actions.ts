'use server'

import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function registerInterest(formData: FormData) {
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' }
  }

  try {
    console.log(`[Registration] Starting flow for: ${email}`)

    // 1. Save to Supabase
    const { error: supabaseError } = await supabase
      .from('interest_registrations')
      .insert([{ email }])

    if (supabaseError) {
      if (supabaseError.code === '23505') {
        console.warn(`[Registration] Email already exists: ${email}`)
        return { error: 'This email is already registered.' }
      }
      console.error(`[Registration] Supabase error:`, supabaseError)
      throw supabaseError
    }
    console.log(`[Registration] Successfully saved to database: ${email}`)

    // 2. Send notification emails to the team individually
    const recipients = [
      'ushiedaniel2484@gmail.com',
      'daniel@mixed-signals.co',
      'derrick.amankwah@mixed-signals.co',
      'richmond.ojo@mixed-signals.co'
    ]

    const fromAddress = 'Mixed Signals <onboarding@resend.dev>'

    // We send individually because Resend's sandbox often rejects entire batches if one recipient is unverified
    for (const recipient of recipients) {
      try {
        const teamNotify = await resend.emails.send({
          from: fromAddress,
          to: recipient,
          subject: 'New Interest Registration',
          text: `A new user has registered their interest: ${email}`,
          html: `<p>A new user has registered their interest: <strong>${email}</strong></p>`
        })
        
        if (teamNotify.error) {
           console.warn(`[Registration] Resend Notify failed for ${recipient}:`, teamNotify.error.message)
        } else {
           console.log(`[Registration] Notification sent to ${recipient}: ${teamNotify.data?.id}`)
        }
      } catch (e) {
        console.error(`[Registration] Critical error sending to ${recipient}:`, e)
      }
    }

    // 3. Send confirmation email to the registrant
    try {
      const userConfirm = await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: 'Thank you for your interest | Mixed Signals',
        text: `Thank you for registering your interest in Mixed Signals. We will keep you updated on our latest frequencies.`,
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

      if (userConfirm.error) {
        console.warn(`[Registration] Resend User Confirm Error (Sandbox?):`, userConfirm.error)
      }
    } catch (e) {
      console.error(`[Registration] Confirm email failed:`, e)
    }

    return { success: true }
  } catch (error: any) {
    console.error('[Registration] Critical error:', error)
    return { error: error.message || 'Something went wrong. Please try again later.' }
  }
}
