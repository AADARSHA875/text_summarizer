function normalizeExtractedText(text) {
  return text
    .replace(/([A-Za-z])-\s+([A-Za-z])/g, "$1$2")
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/([.!?])([A-Z])/g, "$1 $2")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function appendToken(parts, token, state) {
  const text = token?.str ?? "";
  if (!text.trim()) return;

  const x = token.transform?.[4] ?? 0;
  const y = token.transform?.[5] ?? state.lastY;
  const width = token.width ?? 0;
  const height = Math.abs(token.transform?.[3] ?? 12);

  const lineBreakByY =
    state.lastY != null && y != null && Math.abs(y - state.lastY) > Math.max(4, height * 0.6);
  const paragraphBreakByY =
    state.lastY != null && y != null && Math.abs(y - state.lastY) > Math.max(12, height * 1.4);
  const lineBreakByPdf = !!token.hasEOL;
  const needsSpaceByGap =
    state.lastX != null && x > state.lastX + state.lastWidth + 2;

  if (parts.length > 0) {
    if (paragraphBreakByY) {
      parts.push("\n\n");
    } else if (lineBreakByY || lineBreakByPdf) {
      parts.push("\n");
    } else if (needsSpaceByGap && !parts[parts.length - 1].endsWith("\n")) {
      parts.push(" ");
    }
  }

  parts.push(text);
  state.lastX = x;
  state.lastY = y;
  state.lastWidth = width;
}

function textContentToPlainText(content) {
  const parts = [];
  const state = { lastX: null, lastY: null, lastWidth: 0 };

  for (const item of content.items || []) {
    appendToken(parts, item, state);
  }

  return parts.join("");
}

export async function extractTextFromPdf(file) {
  const pdfjs = await import("pdfjs-dist/build/pdf.mjs");

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    });
    const pageText = textContentToPlainText(content);
    if (pageText.trim()) pages.push(pageText.trim());
  }

  return normalizeExtractedText(pages.join("\n\n"));
}
