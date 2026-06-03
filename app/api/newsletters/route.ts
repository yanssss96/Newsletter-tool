import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'newsletters.json');

function read() {
  if (!fs.existsSync(DB)) return [];
  return JSON.parse(fs.readFileSync(DB, 'utf-8'));
}

function write(data: object) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newsletters = read();
  const newNewsletter = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString(),
  };
  newsletters.push(newNewsletter);
  write(newsletters);
  return NextResponse.json(newNewsletter);
}