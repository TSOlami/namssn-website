const PDF_SCALE = 4;

export async function ocrPdfWithTesseract(buffer) {
  if (!buffer?.length) return null;
  let worker;
  try {
    const { pdf } = await import('pdf-to-img');
    const { createWorker } = await import('tesseract.js');

    const dataUrl = `data:application/pdf;base64,${buffer.toString('base64')}`;
    const document = await pdf(dataUrl, { scale: PDF_SCALE });

    worker = await createWorker('eng');
    const parts = [];

    for await (const image of document) {
      const { data } = await worker.recognize(image);
      if (data?.text?.trim()) parts.push(data.text.trim());
    }

    await worker.terminate();
    worker = null;

    const text = parts.join('\n\n').trim();
    return text || null;
  } catch (err) {
    if (worker) try { await worker.terminate(); } catch { }
    console.error('OCR (Tesseract) error:', err?.message ?? err);
    return null;
  }
}
