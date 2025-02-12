import type { Readable } from "node:stream";

/** @see {@link https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs} */
export type DataUri = `data:${string};base64,${string}`;
export type FileInput = string | Buffer | Readable | File | Blob | DataUri;

export interface ProcessedFile {
  buffer: Buffer;
  filename: string;
  contentType: string;
  size: number;
  dataUri: DataUri;
}
