/** Saves bytes made on this device as a file. A blob: URL stays in the browser; nothing is uploaded. */
export function saveFile(bytes: Uint8Array, fileName: string): void {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  // Give the browser time to start the download before the URL is freed.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
