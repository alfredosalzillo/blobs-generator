import { type NextRequest, NextResponse } from "next/server";
import { type BlobDescriptor, generateBlob } from "@alfredo.salzillo/blobs";
import StaticBlob from "@alfredo.salzillo/blobs/StaticBlob";
import { decodeBlob, encodeBlob, encoderVersion } from "@/plugins/blob-encoder";

const generateBlobUrl = (host: string, blob: BlobDescriptor) =>
  encodeURI(`${host}/api/blob?version=${encoderVersion}&d=${encodeBlob(blob)}`);

export async function GET(req: NextRequest) {
  const host = req.nextUrl.origin;
  const { searchParams } = new URL(req.url);

  const width = Number(searchParams.get("width") || "200");
  const height = Number(searchParams.get("height") || "200");
  const d = searchParams.get("d");

  if (!d) {
    const blob = generateBlob(width, height);
    const redirectUrl = generateBlobUrl(host, blob);
    return NextResponse.redirect(redirectUrl, 302);
  }

  try {
    const blob = decodeBlob(d);

    const { renderToStaticMarkup } = await import('react-dom/server');
    const svg = renderToStaticMarkup(<StaticBlob {...blob} />);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  } catch (_) {
    console.error("Invalid blob descriptor", _);
    return new NextResponse("Invalid blob descriptor", { status: 400 });
  }
}
