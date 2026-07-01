import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'recipients.json');

function read() {
  try {
    if (!fs.existsSync(DB)) return [];
    const content = fs.readFileSync(DB, 'utf-8');
    if (!content.trim()) return [];
    return JSON.parse(content);
  } catch (error) {
    console.error('Erreur lecture recipients.json:', error);
    return [];
  }
}

function write(data: object) {
  const dir = path.dirname(DB);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const utf8NoBom = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
  fs.writeFileSync(DB, utf8NoBom);
}

export async function GET() {
  try {
    return NextResponse.json(read());
  } catch (error) {
    console.error('Erreur GET /api/recipients:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, prenom } = body;

    if (!email || !prenom) {
      return NextResponse.json({ error: 'Email et prénom requis' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const recipients = read();

    if (recipients.some((r: { email: string }) => r.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'Cet email existe déjà' }, { status: 409 });
    }

    recipients.push({ email, prenom });
    write(recipients);

    return NextResponse.json({ email, prenom });
  } catch (error) {
    console.error('Erreur POST /api/recipients:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const recipients = read();
    const filtered = recipients.filter(
      (r: { email: string }) => r.email.toLowerCase() !== email.toLowerCase()
    );

    write(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE /api/recipients:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}