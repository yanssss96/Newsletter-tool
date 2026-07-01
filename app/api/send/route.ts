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

function addHistory(entry: { type: 'created' | 'sent' | 'test'; newsletterId: string; subject: string; details?: string }) {
  const dbPath = path.join(process.cwd(), 'data', 'history.json');
  let history = [];
  try {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      if (content.trim()) history = JSON.parse(content);
    }
  } catch {}
  history.unshift({ id: Date.now().toString(), ...entry, date: new Date().toISOString() });
  fs.writeFileSync(dbPath, Buffer.from(JSON.stringify(history, null, 2), 'utf-8'));
}

export async function POST(req: NextRequest) {
  const { newsletterId, testEmail, recipientEmails } = await req.json();
  const newsletter = getNewsletter(newsletterId);

  if (!newsletter) {
    return NextResponse.json({ error: 'Newsletter introuvable' }, { status: 404 });
  }

  let recipients;
  if (testEmail) {
    recipients = [{ email: testEmail, prenom: 'Test' }];
  } else if (recipientEmails && Array.isArray(recipientEmails)) {
    const allRecipients = getRecipients();
    recipients = allRecipients.filter((r: { email: string }) =>
      recipientEmails.includes(r.email)
    );
  } else {
    recipients = getRecipients();
  }

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

  // Enregistre dans l'historique
  if (testEmail) {
    addHistory({
      type: 'test',
      newsletterId,
      subject: newsletter.subject || '(sans sujet)',
      details: `Email de test envoyé à ${testEmail}`,
    });
  } else {
    addHistory({
      type: 'sent',
      newsletterId,
      subject: newsletter.subject || '(sans sujet)',
      details: `Envoyée à ${success} destinataire${success > 1 ? 's' : ''}${failed > 0 ? `, ${failed} échec${failed > 1 ? 's' : ''}` : ''}`,
    });
  }

  return NextResponse.json({ success, failed });
}