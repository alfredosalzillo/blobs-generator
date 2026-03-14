import { type NextRequest, NextResponse } from "next/server";
import { type BlobDescriptor, generateBlob } from "@alfredo.salzillo/blobs";
import { encodeBlob, encoderVersion } from "@/plugins/blob-encoder";

const generateBlobUrl = (host: string, blob: BlobDescriptor) =>
  encodeURI(`${host}/api/blob?version=${encoderVersion}&d=${encodeBlob(blob)}`);

export async function GET(req: NextRequest) {
  const host = req.nextUrl.origin;
  const { searchParams } = new URL(req.url);

  const width = Number(searchParams.get("width") || "200");
  const height = Number(searchParams.get("height") || "200");
  const descriptor = generateBlob(width, height);

  return NextResponse.json({
    type: "blob",
    version: encoderVersion,
    descriptor,
    link: generateBlobUrl(host, descriptor),
  });
}
