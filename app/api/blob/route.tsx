import { type NextRequest, NextResponse } from 'next/server';
import { renderToStaticMarkup } from 'react-dom/server.browser';
import SvgBlob from '@/components/SvgBlob';
import { type Blob, randomBlob } from '@/lib/blob';
import { decodeBlob, encodeBlob, encoderVersion } from '@/lib/blob-encoder';

export const version = encoderVersion;

export const generateBlobUrl = (host: string, blob: Blob) => 
  encodeURI(`${host}/api/blob?version=${version}&d=${encodeBlob(blob)}`);

export async function GET(req: NextRequest) {
  const host = req.nextUrl.origin;
  const { searchParams } = new URL(req.url);
  
  const width = Number(searchParams.get('width') || '200');
  const height = Number(searchParams.get('height') || '200');
  const d = searchParams.get('d');

  if (!d) {
    const blob = randomBlob(width, height);
    const redirectUrl = generateBlobUrl(host, blob);
    return NextResponse.redirect(redirectUrl, 302);
  }

  try {
    const blob = decodeBlob(d);
    const svg = renderToStaticMarkup(<SvgBlob {...blob}/>);
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  } catch (_) {
    return new NextResponse('Invalid blob descriptor', { status: 400 });
  }
}
