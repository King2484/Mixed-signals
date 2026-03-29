import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function test() {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log("Sending email...");
  const response = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'ushiedaniel2484@gmail.com',
    subject: 'Direct API Test',
    html: '<p>Testing resend</p>'
  });
  console.log("Response:", JSON.stringify(response, null, 2));
}

test().catch(console.error);
