import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'history.json');

export function readHistory() {
  try {
    if (!fs.existsSync(DB)) return [];
    const content = fs.readFileSync(DB, 'utf-8');
    if (!content.trim()) return [];
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: {
  type: 'created' | 'sent' | 'test';
  newsletterId: string;
  subject: string;
  details?: string;
}) {
  const history = readHistory();
  const newEntry = {
    id: Date.now().toString(),
    ...entry,
    date: new Date().toISOString(),
  };
  history.unshift(newEntry);
  const utf8NoBom = Buffer.from(JSON.stringify(history, null, 2), 'utf-8');
  fs.writeFileSync(DB, utf8NoBom);
  return newEntry;
}

export async function GET() {
  return NextResponse.json(readHistory());
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      const history = readHistory();
      const filtered = history.filter((e: { id: string }) => e.id !== id);
      const utf8NoBom = Buffer.from(JSON.stringify(filtered, null, 2), 'utf-8');
      fs.writeFileSync(DB, utf8NoBom);
    } else {
      const utf8NoBom = Buffer.from('[]', 'utf-8');
      fs.writeFileSync(DB, utf8NoBom);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}