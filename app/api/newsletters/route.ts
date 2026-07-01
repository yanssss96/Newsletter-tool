import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'newsletters.json');

function read() {
  try {
    if (!fs.existsSync(DB)) return [];
    const content = fs.readFileSync(DB, 'utf-8');
    if (!content.trim()) return [];
    return JSON.parse(content);
  } catch (error) {
    console.error('Erreur lecture newsletters.json:', error);
    return [];
  }
}

function write(data: object) {
  const dir = path.dirname(DB);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB, Buffer.from(JSON.stringify(data, null, 2), 'utf-8'));
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

export async function GET() {
  try {
    return NextResponse.json(read());
  } catch (error) {
    console.error('Erreur GET /api/newsletters:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newsletters = read();
    const newNewsletter = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    newsletters.push(newNewsletter);
    write(newsletters);

    // Enregistre dans l'historique
    addHistory({
      type: 'created',
      newsletterId: newNewsletter.id,
      subject: newNewsletter.subject || '(sans sujet)',
      details: 'Newsletter créée et sauvegardée',
    });

    return NextResponse.json(newNewsletter);
  } catch (error) {
    console.error('Erreur POST /api/newsletters:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}