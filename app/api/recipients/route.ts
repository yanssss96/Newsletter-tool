import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB = path.join(process.cwd(), 'data', 'recipients.json');

export async function GET() {
  const data = JSON.parse(fs.readFileSync(DB, 'utf-8'));
  return NextResponse.json(data);
}