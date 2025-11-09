import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function simpleMarkdownToHtml(md) {
  // Very light conversion: preserve newlines and bullets
  const safe = escapeHtml(md);
  const withLines = safe
    .replace(/\r\n/g, '\n')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n-\s/g, '<br/>• ')
    .replace(/\n\*\s/g, '<br/>• ')
    .replace(/\n/g, '<br/>');
  return `<p>${withLines}</p>`;
}

function buildHtml({ title = 'ProdigyPM Export', category, text }) {
  const body = simpleMarkdownToHtml(text || '');
  const categoryLabel = category ? `<div class="pill">${category}</div>` : '';
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #0f172a; }
  h1 { font-size: 20px; margin: 0 0 8px; }
  .meta { color: #475569; font-size: 12px; margin-bottom: 16px; display:flex; gap:8px; align-items:center; }
  .pill { display:inline-block; padding: 4px 8px; background:#eef2ff; color:#3730a3; border-radius:999px; font-size:12px; }
  .card { border:1px solid #e5e7eb; border-radius:12px; padding:16px; }
  p { line-height: 1.5; }
</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">${categoryLabel}<span>${new Date().toLocaleString()}</span></div>
  <div class="card">${body}</div>
</body>
</html>`;
}

export async function exportTextToPDF({ text, title, category }) {
  const html = buildHtml({ text, title, category });
  const file = await Print.printToFileAsync({ html });
  let shared = false;
  if (await Sharing.isAvailableAsync()) {
    try {
      await Sharing.shareAsync(file.uri, { UTI: 'com.adobe.pdf', dialogTitle: title || 'Export PDF' });
      shared = true;
    } catch {}
  }
  return { uri: file.uri, shared };
}
