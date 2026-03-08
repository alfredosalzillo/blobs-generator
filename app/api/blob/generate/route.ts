import { NextRequest, NextResponse } from 'next/server';
import { randomBlob } from '@/lib/blob';
import { generateBlobUrl, version } from '../route';

export async function GET(req: NextRequest) {
  const host = req.nextUrl.origin;
  const { searchParams } = new URL(req.url);
  
  const width = Number(searchParams.get('width') || '200');
  const height = Number(searchParams.get('height') || '200');
  const descriptor = randomBlob(width, height);
  
  return NextResponse.json({
    type: 'blob',
    version,
    descriptor,
    link: generateBlobUrl(host, descriptor),
  });
}
