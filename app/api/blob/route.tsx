import { type NextRequest, NextResponse } from "next/server";
import { type BlobDescriptor, generateBlob } from "@alfredo.salzillo/blobs";
import { decodeBlob, encodeBlob, encoderVersion } from "@/plugins/blob-encoder";

// Re-implementing spline logic from @alfredo.salzillo/blobs/dist/spline.es.js
// since it's not exported in the public API and the Blob component is a Client Component.
const formatPoints = (points: { x: number; y: number }[], closed = false) => {
  const n = [...points].map(({ x: t, y: o }) => [t, o]);
  if (closed) {
    const t = n[n.length - 1],
      o = n[n.length - 2],
      a = n[0],
      f = n[1];
    // biome-ignore lint/complexity/noCommaOperator: allowed
    n.unshift(t), n.unshift(o), n.push(a), n.push(f);
  }
  return n.flat();
};

const spline = (
  points: { x: number; y: number }[] = [],
  tension = 1,
  closed = false,
) => {
  const t = formatPoints(points, closed),
    o = t.length,
    a = o - 4,
    f = closed ? t[2] : t[0],
    u = closed ? t[3] : t[1];
  let l = `M${[f, u]}`;
  const x = closed ? 2 : 0,
    P = closed ? o - 4 : o - 2,
    y = 2;
  for (let s = x; s < P; s += y) {
    const d = s ? t[s - 2] : t[0],
      g = s ? t[s - 1] : t[1],
      p = t[s],
      h = t[s + 1],
      i = t[s + 2],
      r = t[s + 3],
      m = s !== a ? t[s + 4] : i,
      I = s !== a ? t[s + 5] : r,
      $ = p + ((i - d) / 6) * tension,
      z = h + ((r - g) / 6) * tension,
      C = i - ((m - p) / 6) * tension,
      L = r - ((I - h) / 6) * tension;
    l += `C${[$, z, C, L, i, r]}`;
  }
  return l;
};

export const generateBlobUrl = (host: string, blob: BlobDescriptor) =>
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

    // Manual SVG rendering to avoid using the Client Component @alfredo.salzillo/blobs/Blob
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${blob.width} ${blob.height}" width="${blob.width}" height="${blob.height}">
        <path d="${spline(blob.body, 1, true)}" stroke-width="2" stroke="${blob.colors.dark}" fill="${blob.colors.primary}" />
        <g>
          ${blob.eyes
            .map(
              (eye) => `
            <g transform="matrix(1,0,0,1,${eye.x},${eye.y})">
              <circle r="${eye.size}" cx="0" cy="0" stroke-width="2" stroke="${blob.colors.dark}" fill="${blob.colors.light}" />
              <circle r="${eye.size / 2}" cx="0" cy="0" fill="${blob.colors.dark}" />
            </g>
          `,
            )
            .join("")}
        </g>
      </svg>
    `.trim();

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
