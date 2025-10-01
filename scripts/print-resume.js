#!/usr/bin/env node
/*
  Generate static PDF of the Resume page into dist/DIMFLIX-Resume.pdf using headless Chrome.
  - Serves the built dist/ folder on http://localhost:5050
  - Opens /en/resume with print CSS
  - Saves PDF with A4 format and 10mm margins
*/

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const PORT = 5050;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.ico': return 'image/x-icon';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    case '.ttf': return 'font/ttf';
    default: return 'application/octet-stream';
  }
}

function createStaticServer(rootDir) {
  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURI(req.url.split('?')[0]);
      let filePath = path.join(rootDir, urlPath);

      // Prevent path traversal
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403); res.end('Forbidden'); return;
      }

      // If path is directory or no extension -> serve index.html (SPA fallback)
      if (!path.extname(filePath)) {
        filePath = path.join(rootDir, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        // SPA fallback
        filePath = path.join(rootDir, 'index.html');
      }

      const mime = getMimeType(filePath);
      fs.createReadStream(filePath)
        .on('open', () => { res.writeHead(200, { 'Content-Type': mime }); })
        .on('error', (err) => { res.writeHead(500); res.end(String(err)); })
        .pipe(res);
    } catch (e) {
      res.writeHead(500); res.end(String(e));
    }
  });
  return server;
}

(async () => {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist/ not found. Run `npm run build` first.');
    process.exit(1);
  }

  const server = createStaticServer(DIST_DIR);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[pdf] Serving ${DIST_DIR} at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    async function exportLocale(loc) {
      const url = `http://localhost:${PORT}/${loc}/resume?pdf=1`;
      console.log(`[pdf] Opening ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      if (typeof page.emulateMedia === 'function') {
        await page.emulateMedia('print');
      }
      // Wait for app render event (from main.ts) to ensure Vue mounted
      try {
        await page.evaluate(() => new Promise((resolve) => {
          document.addEventListener('render-event', () => resolve(null), { once: true });
          // If already fired, resolve shortly
          setTimeout(() => resolve(null), 500);
        }));
      } catch {}
      // Extra small delay to allow images to settle
      await new Promise((r) => setTimeout(r, 800));

      const OUT_PDF_LOC = path.resolve(DIST_DIR, `DIMFLIX-Resume.${loc}.pdf`);
      console.log(`[pdf] Saving to ${OUT_PDF_LOC}`);
      await page.pdf({
        path: OUT_PDF_LOC,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false, // гарантированно без колонтитулов
        margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
        scale: 1,
        preferCSSPageSize: true,
      });

      // No copy to public/: avoid modifying repo files during deploy
    }

    await exportLocale('en');
    await exportLocale('ru');

    // Remove default PDF if it was copied from public/ during the build step
    try {
      const DEFAULT_DIST = path.resolve(DIST_DIR, 'DIMFLIX-Resume.pdf');
      if (fs.existsSync(DEFAULT_DIST)) {
        fs.unlinkSync(DEFAULT_DIST);
        console.log(`[pdf] Removed ${DEFAULT_DIST}`);
      }
    } catch (e) {
      console.warn('[pdf] Failed to remove default DIMFLIX-Resume.pdf:', e && e.message ? e.message : e);
    }

    console.log('[pdf] Done.');
  } finally {
    await browser.close();
    server.close();
  }
})();

