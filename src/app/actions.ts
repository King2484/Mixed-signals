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
      return { error: 'Action Required: Add Supabase & Resend keys to Vercel Environment Variables.' }
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
    const FROM_EMAIL = 'Mixed Signals <info@mixedsignalss.com>'
    
    // Team Notification List
    const recipients = [
      'derrick.amankwah@mixedsignalss.com',
      'daniel@mixedsignalss.com',
      'ushiedaniel2484@gmail.com'
    ]

    // Concurrent Team Notifications (Fast & Isolated)
    const notifyPromises = recipients.map(recipient => 
      resend.emails.send({
        from: FROM_EMAIL,
        to: recipient,
        subject: 'New Interest Registration',
        html: `<p>A new user has registered their interest: <strong>${email}</strong></p>`
      }).then(response => {
        if (response.error) {
           console.error(`[Registration] Resend rejected notification for ${recipient}:`, response.error)
        }
        return response
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
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Mixed Signals</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: 'Times New Roman', Times, serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f7f7f7">
              <tr>
                <td align="center" style="padding: 40px 10px;">
                  <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width: 600px; width: 100%; border: 1px solid #eaeaeb;">
                    <!-- Header -->
                    <tr>
                      <td align="center" style="padding: 50px 40px 30px 40px; border-bottom: 1px solid #f0f0f0;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase; color: #111111;">Mixed Signals</h1>
                        <p style="margin: 10px 0 0 0; font-size: 11px; letter-spacing: 0.15em; color: #666666; text-transform: uppercase;">SS — 25 | Liverpool</p>
                      </td>
                    </tr>
                    <!-- Hero Area -->
                    <tr>
                      <td align="center" style="padding: 60px 40px;">
                        <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 400; color: #111111; font-style: italic;">Thank you for registering your interest.</h2>
                        <div style="width: 40px; height: 1px; background-color: #111111; margin: 0 auto 30px auto;"></div>
                        <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #444444; text-align: center;">
                          A menswear narrative guided by a curiosity to intertwine nuanced perspectives with an essence of familiarity. We are thrilled to welcome you to our inner circle.
                        </p>
                        <br>
                        <p style="margin: 0; font-size: 15px; line-height: 1.8; color: #444444; text-align: center;">
                          You will be the first to know about our upcoming collections, exclusive previews, and editorial pieces. 
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td align="center" bgcolor="#111111" style="padding: 40px;">
                        <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: #ffffff;">Mixed Signals</p>
                        <p style="margin: 0 0 20px 0; font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.1em;">
                          <a href="mailto:info@mixed-signals.co" style="color: #bbbbbb; text-decoration: none;">info@mixed-signals.co</a>
                        </p>
                        <div style="width: 100%; border-top: 1px solid #333333; margin: 20px 0;"></div>
                        <p style="margin: 0; font-size: 10px; color: #666666; letter-spacing: 0.1em; text-transform: uppercase;">
                          &copy; 2026 MIXED SIGNALS &mdash; ALL FREQUENCIES RESERVED
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
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
