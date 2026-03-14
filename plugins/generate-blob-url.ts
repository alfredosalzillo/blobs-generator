import type { BlobDescriptor } from "@alfredo.salzillo/blobs";
import { encodeBlob, encoderVersion } from "@/plugins/blob-encoder";

export const generateBlobUrl = (host: string, blob: BlobDescriptor) =>
  encodeURI(`${host}/api/blob?version=${encoderVersion}&d=${encodeBlob(blob)}`);