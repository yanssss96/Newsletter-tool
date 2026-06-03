import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

function getRecipients() {
  const filePath = path.join(process.cwd(), 'data', 'recipients.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getNewsletter(newsletterId: string) {
  const filePath = path.join(process.cwd(), 'data', 'newsletters.json');
  const newsletters = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return newsletters.find((n: { id: string }) => n.id === newsletterId);
}

export async function POST(req: NextRequest) {
  const { newsletterId, testEmail } = await req.json();

  const newsletter = getNewsletter(newsletterId);
  if (!newsletter) {
    return NextResponse.json({ error: 'Newsletter introuvable' }, { status: 404 });
  }

  const recipients = testEmail
    ? [{ email: testEmail, prenom: 'Test' }]
    : getRecipients();

  let success = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const html = newsletter.html?.replace(/\{\{prenom\}\}/g, recipient.prenom || '');

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: recipient.email,
        subject: newsletter.subject || '(sans sujet)',
        html: html,
      });
      success++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ success, failed });
}