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
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:wght@300;400;500&display=swap');
            </style>
          </head>
          <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Cormorant Garamond', 'Times New Roman', serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
              <tr>
                <td align="center" style="padding: 60px 15px;">
                  <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width: 600px; width: 100%; border: 1px solid #eeeeee; border-radius: 4px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                      <td align="center" style="padding: 60px 40px 40px 40px; border-bottom: 1px solid #eeeeee;">
                        <img src="https://mixedsignalss.com/preview-transparent.png" alt="Mixed Signals Logo" style="width: 80px; height: auto; margin-bottom: 20px; display: block;" onerror="this.style.display='none'" />
                        <h1 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase; color: #000000;">Mixed Signals</h1>
                        <p style="margin: 15px 0 0 0; font-family: 'Cormorant Garamond', serif; font-size: 13px; letter-spacing: 0.2em; color: #666666; text-transform: uppercase;">SS — 26 | Liverpool</p>
                      </td>
                    </tr>
                    <!-- Feature Image -->
                    <tr>
                      <td align="center" style="padding: 0; background-color: #ffffff; line-height: 0;">
                        <img src="https://mixedsignalss.com/_MG_1361.jpg.jpeg" alt="Mixed Signals Collection" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0; outline: none; margin: 0; padding: 0;" />
                      </td>
                    </tr>
                    <!-- Hero Area -->
                    <tr>
                      <td align="center" style="padding: 60px 50px;">
                        <h2 style="margin: 0 0 25px 0; font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 400; color: #000000; font-style: italic;">Thank you for registering your interest.</h2>
                        <div style="width: 30px; height: 1px; background-color: #dddddd; margin: 0 auto 30px auto;"></div>
                        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; color: #333333; text-align: center; text-transform: uppercase;">
                          FOR THE ONES WHO FEEL DEEPLY, THINK DIFFERENTLY AND MOVE BETWEEN WORLDS WITHOUT VALIDATION.
                        </p>
                        <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #333333; text-align: center;">
                          You will be the first to know about our upcoming collections, exclusive previews, and editorial pieces. 
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td align="center" bgcolor="#fafafa" style="padding: 40px; border-top: 1px solid #eeeeee;">
                        <p style="margin: 0 0 15px 0; font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: #333333;">Mixed Signals</p>
                        <p style="margin: 0 0 20px 0; font-size: 12px; font-family: 'Cormorant Garamond', serif; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;">
                          <a href="mailto:info@mixedsignalss.com" style="color: #666666; text-decoration: none;">info@mixedsignalss.com</a>
                        </p>
                        <p style="margin: 0; font-family: 'Cormorant Garamond', serif; font-size: 10px; color: #999999; letter-spacing: 0.1em; text-transform: uppercase;">
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
      }).then(response => {
        if (response.error) {
          console.error(`[Registration] Resend rejected confirmation for user ${email}:`, response.error)
        }
        return response
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
