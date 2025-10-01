<template>
  <div class="resume-page">
    <div class="resume-container">
      <div class="actions">
        <button @click="downloadPDF" class="download-btn" :disabled="isDownloading" :aria-busy="isDownloading ? 'true' : 'false'" :aria-disabled="isDownloading ? 'true' : 'false'">
          <span v-if="isDownloading" class="spinner" aria-hidden="true"></span>
          <span>{{ isDownloading ? t('resume.preparingPdf') : t('resume.downloadPdf') }}</span>
        </button>
      </div>
      <div id="resume-content">
        <div class="markdown-body" v-html="resumeHtml"></div>

        <div v-if="!isPdf" class="page-break" aria-hidden="true"></div>

        <!-- Attachments section -->
        <section class="attachments">
          <!-- Patents: normal on screen -->
          <template v-if="!isPdf">
            <h2>{{ t('resume.patents') }}</h2>
            <div class="patents">
              <template v-for="(patent, idx) in patents" :key="'p-'+idx">
                <div v-for="(pageSrc, pi) in patent.pages" :key="'p-'+idx + '-' + pi" class="page-item">
                  <Image :src="pageSrc" :alt="tpatent(patent) + ' — ' + t('resume.page') + ' ' + (pi+1)" class="grid-img fit-screen fit-print" />
                  <div class="caption">{{ tpatent(patent) }} — {{ t('resume.page') }} {{ pi+1 }}</div>
                </div>
              </template>
            </div>
          </template>
          <!-- Patents: PDF mode — keep heading with first page -->
          <template v-else>
            <div class="patents">
              <div v-if="patentFirst" class="page-item section-start">
                <h2>{{ t('resume.patents') }}</h2>
                <img :src="patentFirst.src" :alt="tpatent(patentFirst.patent) + ' — ' + t('resume.page') + ' ' + (patentFirst.pageIndex+1)" class="pdf-img" />
                <div class="caption">{{ tpatent(patentFirst.patent) }} — {{ t('resume.page') }} {{ patentFirst.pageIndex + 1 }}</div>
              </div>
              <div v-for="(pp, ri) in patentRest" :key="'pr-'+ri" class="page-item">
                <img :src="pp.src" :alt="tpatent(pp.patent) + ' — ' + t('resume.page') + ' ' + (pp.pageIndex+1)" class="pdf-img" />
                <div class="caption">{{ tpatent(pp.patent) }} — {{ t('resume.page') }} {{ pp.pageIndex + 1 }}</div>
              </div>
            </div>
          </template>

          <div v-if="!isPdf" class="page-break" aria-hidden="true"></div>

          <!-- Awards: normal on screen -->
          <template v-if="!isPdf">
            <h2>{{ t('resume.awards') }}</h2>
            <div class="grid">
              <div v-for="(award, i) in awards" :key="'a-'+i" class="page-item">
                <Image :src="award.src" :alt="talt(award)" class="grid-img fit-screen fit-print" />
              </div>
            </div>
          </template>
          <!-- Awards: PDF mode — keep heading with first item -->
          <template v-else>
            <div class="grid">
              <div v-if="awardsFirst" class="page-item section-start">
                <h2>{{ t('resume.awards') }}</h2>
                <img :src="awardsFirst.src" :alt="talt(awardsFirst)" class="pdf-img" />
              </div>
              <div v-for="(award, i) in awardsRest" :key="'ar-'+i" class="page-item">
                <img :src="award.src" :alt="talt(award)" class="pdf-img" />
              </div>
            </div>
          </template>

          <div v-if="!isPdf" class="page-break" aria-hidden="true"></div>

          <!-- Certificates: normal on screen -->
          <template v-if="!isPdf">
            <h2>{{ t('resume.certificates') }}</h2>
            <div class="grid">
              <div v-for="(cert, j) in certificates" :key="'c-'+j" class="page-item">
                <Image :src="cert.src" :alt="talt(cert)" class="grid-img fit-screen fit-print" />
              </div>
            </div>
          </template>
          <!-- Certificates: PDF mode — keep heading with first item -->
          <template v-else>
            <div class="grid">
              <div v-if="certificatesFirst" class="page-item section-start">
                <h2>{{ t('resume.certificates') }}</h2>
                <img :src="certificatesFirst.src" :alt="talt(certificatesFirst)" class="pdf-img" />
              </div>
              <div v-for="(cert, j) in certificatesRest" :key="'cr-'+j" class="page-item">
                <img :src="cert.src" :alt="talt(cert)" class="pdf-img" />
              </div>
            </div>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import MarkdownIt from 'markdown-it';
// Загружаем markdown в зависимости от языка
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import resumeMarkdownRu from '!!raw-loader!@/content/RESUME.md';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import resumeMarkdownEn from '!!raw-loader!@/content/RESUME.en.md';
import { awardsList, certificatesList, patentsList } from '@/data/achievements';
import Image from 'primevue/image';
import MultiPageImage from '@/components/primevue/MultiPageImage.vue';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default defineComponent({
  name: 'ResumePage',
  components: { Image, MultiPageImage },
  setup() {
    const { t, locale } = useI18n();
    const resumeHtml = ref('');
    const md = new MarkdownIt();

    const awards = ref(awardsList as any[]);
    const certificates = ref(certificatesList as any[]);
    const patents = ref(patentsList as any[]);

    const isDownloading = ref(false);

    const isPdf = ref(false);
    onMounted(() => {
      try { isPdf.value = new URLSearchParams(window.location.search).has('pdf'); } catch {}
    });

    const patentPagesFlat = computed(() => {
      try {
        return (patents.value || []).flatMap((p: any) => (p.pages || []).map((src: string, pi: number) => ({ src, patent: p, pageIndex: pi })));
      } catch { return []; }
    });
    const patentFirst = computed(() => patentPagesFlat.value[0] || null);
    const patentRest = computed(() => patentPagesFlat.value.slice(1));

    const awardsFirst = computed(() => (awards.value && awards.value.length ? awards.value[0] : null));
    const awardsRest = computed(() => (awards.value || []).slice(1));

    const certificatesFirst = computed(() => (certificates.value && certificates.value.length ? certificates.value[0] : null));
    const certificatesRest = computed(() => (certificates.value || []).slice(1));

    const pickResumeMarkdown = () => (locale.value === 'ru' ? (resumeMarkdownRu as string) : (resumeMarkdownEn as string));
    const renderResume = () => {
      try {
        // Поддержка маркера разрыва страниц в markdown: <!-- pagebreak -->
        const src = pickResumeMarkdown();
        const withBreaks = src.replace(/<!--\s*pagebreak\s*-->/gi, '<div class="page-break"></div>');
        resumeHtml.value = md.render(withBreaks);
      } catch {}
    };

    onMounted(() => { renderResume(); });
    watch(() => locale.value, () => { renderResume(); });

    const talt = (item: any) => (locale.value === 'ru' ? (item.alt?.ru || item.alt?.en) : (item.alt?.en || item.alt?.ru));
    const tpatent = (p: any) => (locale.value === 'ru' ? (p.title?.ru || p.title?.en) : (p.title?.en || p.title?.ru));

    // Кэш для изображений (ускоряет генерацию PDF за счёт предварительной подготовки данных)
    const imageCache = new Map<string, { dataUrl: string; width: number; height: number; format: 'JPEG' | 'PNG' }>();
    const IMAGE_MAX_WIDTH_PX = 1400; // ограничиваем ширину, чтобы не встраивать гигапиксельные изображения
    const IMAGE_JPEG_QUALITY = 0.88; // баланс качества/размера для фото и сканов
    const MD_CANVAS_SCALE = 2; // повышаем плотность рендера текста для чёткости

    // Загружает изображение и преобразует к оптимальному DataURL (с возможным даунскейлом)
    const ensureImageCached = async (src: string) => {
      if (!src) return;
      if (imageCache.has(src)) return;
      try {
        // Пытаемся загрузить через Image() и перекодировать в JPEG для снижения веса
        const img = new window.Image() as HTMLImageElement;
        // Для безопасности на случай CDN — но для того же домена обычно не требуется
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        const loaded: Promise<void> = new Promise((resolve, reject) => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', (e) => reject(e), { once: true });
        });
        img.src = src;
        await loaded;

        const naturalW = img.naturalWidth || img.width;
        const naturalH = img.naturalHeight || img.height;
        const scale = naturalW > IMAGE_MAX_WIDTH_PX ? IMAGE_MAX_WIDTH_PX / naturalW : 1;
        const targetW = Math.max(1, Math.round(naturalW * scale));
        const targetH = Math.max(1, Math.round(naturalH * scale));

        // Рисуем в canvas для уменьшения размера и последующей быстрой вставки в PDF
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No canvas context');
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // Предпочитаем JPEG для скорости/размера; если нужна абсолютная безпотерьность — заменить на PNG
        const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_JPEG_QUALITY);
        imageCache.set(src, { dataUrl, width: targetW, height: targetH, format: 'JPEG' });
      } catch (e) {
        // Фолбэк: пробуем через fetch+FileReader без перекодирования (может быть тяжелее)
        try {
          const res = await fetch(src, { mode: 'cors' });
          const blob = await res.blob();
          const reader: Promise<string> = new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.onerror = reject;
            r.readAsDataURL(blob);
          });
          const dataUrl = await reader;
          // Тип определяем приблизительно по dataURL
          const format = dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
          imageCache.set(src, { dataUrl, width: 0, height: 0, format });
        } catch (err) {
          console.warn('Не удалось подготовить изображение для PDF:', src, err);
        }
      }
    };

    // Предварительно прогреваем кэш изображений в фоне (не блокирует UI)
    // Делает клик «Скачать PDF» почти мгновенным, т.к. данные уже готовы
    const prewarmImages = () => {
      // Берём URL-ы из данных (патенты/награды/сертификаты)
      const urls: string[] = [];
      try {
        for (const p of patents.value || []) { for (const u of (p.pages || [])) urls.push(u); }
        for (const a of awards.value || []) urls.push(a.src);
        for (const c of certificates.value || []) urls.push(c.src);
      } catch {}
      const unique = Array.from(new Set(urls.filter(Boolean)));
      // Стартуем без await, в фоне
      unique.forEach((u) => { ensureImageCached(u); });
    };

    // Создаём песочницу (offscreen) с клоном контента, чтобы не ломать текущую страницу
    const createSandbox = (): { sandbox: HTMLElement; sandboxContent: HTMLElement } | null => {
      const original = document.getElementById('resume-content');
      if (!original) return null;
      const sandbox = document.createElement('div');
      sandbox.className = 'pdf-sandbox pdf-export';
      const clone = original.cloneNode(true) as HTMLElement;
      sandbox.appendChild(clone);
      document.body.appendChild(sandbox);
      return { sandbox, sandboxContent: clone };
    };

    // Стартуем прогрев изображений после первичной отрисовки
    setTimeout(() => { try { prewarmImages(); } catch {} }, 0);

    const destroySandbox = (sandbox: HTMLElement | null) => {
      if (sandbox && sandbox.parentNode) sandbox.parentNode.removeChild(sandbox);
    };

    // Генерация PDF (общая), можно открыть в новой вкладке или скачать
    const generatePdf = async (filename = 'DIMFLIX-Resume.pdf') => {
      const s = createSandbox();
      if (!s) return;

      try {
        // Разбиваем markdown по <!-- pagebreak --> в песочнице
        const md = s.sandbox.querySelector('.markdown-body') as HTMLElement | null;
        if (md) {
          const parts: HTMLElement[] = [];
          let current = document.createElement('div');
          current.className = 'page-item md-page';
          const nodes = Array.from(md.childNodes) as ChildNode[];
          for (const node of nodes) {
            const isBreak = node.nodeType === 1 && (node as HTMLElement).classList?.contains('page-break');
            if (isBreak) {
              if (current.childNodes.length) {
                parts.push(current);
                current = document.createElement('div');
                current.className = 'page-item md-page';
              }
            } else {
              current.appendChild(node);
            }
          }
          if (current.childNodes.length) parts.push(current);
          parts.forEach((p) => md.parentElement?.insertBefore(p, md));
          md.remove();
        }

        // Собираем все страницы
        const pages = Array.from(s.sandbox.querySelectorAll('.page-item')) as HTMLElement[];
        if (pages.length === 0) pages.push(s.sandbox as HTMLElement);

        // 1) Предзагрузка данных для страниц, где контент — одно изображение (ускоряет дальнейшую вставку)
        const imgSrcs: string[] = [];
        const isImagePage = (el: HTMLElement): { ok: boolean; src?: string; img?: HTMLImageElement } => {
          const imgEl = el.querySelector('img') as HTMLImageElement | null;
          if (imgEl && imgEl.src) return { ok: true, src: imgEl.src, img: imgEl };
          return { ok: false };
        };
        pages.forEach((p) => { const r = isImagePage(p); if (r.ok && r.src) imgSrcs.push(r.src); });
        const uniqueImgSrcs = Array.from(new Set(imgSrcs));
        await Promise.all(uniqueImgSrcs.map((src) => ensureImageCached(src)));

        // 2) Создание PDF
        const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        const margin = 10; // mm
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const targetW = pageWidth - margin * 2;
        const targetH = pageHeight - margin * 2;

        // Добавление изображения во всю ширину листа (с отступами), выравнивание по верхнему краю
        const addFullWidthTop = (dataUrl: string, format: 'JPEG' | 'PNG', isFirst: boolean) => {
          if (!isFirst) pdf.addPage();
          const imgProps = (pdf as any).getImageProperties ? (pdf as any).getImageProperties(dataUrl) : null;
          const imgW = imgProps?.width || 1;
          const imgH = imgProps?.height || 1;
          const pdfW = targetW;
          const pdfH = (imgH * pdfW) / imgW;
          const x = margin; // слева отступ
          const y = margin; // сверху отступ
          pdf.addImage(dataUrl, format, x, y, pdfW, pdfH, undefined, 'FAST');
        };

        // Для markdown-страниц: не уменьшаем ширину из-за высоты, а режем на страницы A4
        const renderMdPagePaged = async (el: HTMLElement, isFirst: boolean) => {
          // Удаляем оверлеи предпросмотра PrimeVue, чтобы не мешали рендеру
          (el.querySelectorAll('.p-image-preview-container') as any).forEach((x: HTMLElement) => x.remove());

          // Временно снимаем ограничение max-height, чтобы захватить весь контент целиком
          const prevMaxHeight = el.style.getPropertyValue('max-height');
          const prevPriority = (el.style as any).getPropertyPriority?.('max-height') || '';
          el.style.setProperty('max-height', 'none', 'important');

          const rect = el.getBoundingClientRect();
          const canvas = await html2canvas(el, {
            backgroundColor: '#ffffff',
            useCORS: true,
            scale: MD_CANVAS_SCALE,
            scrollX: 0,
            scrollY: 0,
            windowWidth: Math.max(800, rect.width),
            windowHeight: Math.max(600, rect.height),
          });

          // Возвращаем предыдущее значение max-height
          if (prevMaxHeight) el.style.setProperty('max-height', prevMaxHeight, prevPriority || undefined);
          else el.style.removeProperty('max-height');

          const srcW = canvas.width;
          const srcH = canvas.height;
          const chunkH = Math.max(1, Math.floor(srcW * (targetH / targetW))); // px высота одного листа A4 при текущей ширине

          if (srcH <= chunkH) {
            // Влезает в одну страницу — добавляем как есть
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            addFullWidthTop(dataUrl, 'JPEG', isFirst);
            return;
          }

          let first = isFirst;
          for (let y = 0; y < srcH; y += chunkH) {
            const h = Math.min(chunkH, srcH - y);
            const chunk = document.createElement('canvas');
            chunk.width = srcW;
            chunk.height = h;
            const ctx = chunk.getContext('2d');
            if (!ctx) break;
            ctx.drawImage(canvas, 0, y, srcW, h, 0, 0, srcW, h);
            const dataUrl = chunk.toDataURL('image/jpeg', 0.9);
            addFullWidthTop(dataUrl, 'JPEG', first);
            first = false;
          }
        };

        const renderComplexPage = async (el: HTMLElement, isFirst: boolean) => {
          // Удаляем оверлеи предпросмотра PrimeVue, чтобы не мешали рендеру
          (el.querySelectorAll('.p-image-preview-container') as any).forEach((x: HTMLElement) => x.remove());
          const rect = el.getBoundingClientRect();
          const canvas = await html2canvas(el, {
            backgroundColor: '#ffffff',
            useCORS: true,
            scale: 1, // быстрее, чем 1.2, качество остаётся приемлемым при вставке в A4
            scrollX: 0,
            scrollY: 0,
            windowWidth: Math.max(800, rect.width),
            windowHeight: Math.max(600, rect.height),
          });
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          addFullWidthTop(dataUrl, 'JPEG', isFirst);
        };

        for (let i = 0; i < pages.length; i++) {
          const el = pages[i];

          // Markdown-текстовые страницы рендерим постранично, чтобы не уменьшать шрифт
          if (el.classList.contains('md-page')) {
            await renderMdPagePaged(el, i === 0);
            continue;
          }

          const imgEl = el.querySelector('img') as HTMLImageElement | null;
          if (imgEl && imgEl.src && imageCache.has(imgEl.src)) {
            const cached = imageCache.get(imgEl.src)!;
            // Если знаем физические px — используем их; иначе оцениваем из CSS-ширины
            addFullWidthTop(cached.dataUrl, cached.format, i === 0);
          } else {
            await renderComplexPage(el, i === 0);
          }
        }

        pdf.save(filename);
      } catch (e) {
        console.error(e);
      } finally {
        destroySandbox(s.sandbox);
      }
    };

    const downloadPDF = async () => {
      isDownloading.value = true;
      // Всегда скачиваем предсобранный статический PDF с корректной BASE_URL даже для GitHub Pages project pages
      const computeBase = (): string => {
        const tag = (document.querySelector('base[href]') as HTMLBaseElement | null)?.getAttribute('href') || '';
        let base = tag || (process.env.BASE_URL as string) || '/';
        if (!base || base === '/') {
          // Попытка определить префикс проекта из URL: /<repo>/(en|ru)/...
          const seg = window.location.pathname.split('/').filter(Boolean);
          const first = seg[0];
          if (first && first !== 'en' && first !== 'ru') {
            base = '/' + first + '/';
          } else {
            base = '/';
          }
        }
        if (!base.endsWith('/')) base += '/';
        return base;
      };
      const base = computeBase();
      const lang = (locale.value === 'ru' ? 'ru' : 'en');
      const primaryName = `DIMFLIX-Resume.${lang}.pdf`;
      const fallbackName = 'DIMFLIX-Resume.pdf';

      const fetchPdf = async (name: string) => {
        const url = new URL(base + name, window.location.origin).toString();
        const res = await fetch(url + '?t=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) throw new Error('PDF not found: ' + url);
        const ct = res.headers.get('content-type') || '';
        if (ct && !/application\/pdf|application\/octet-stream/i.test(ct)) throw new Error('Unexpected content-type: ' + ct);
        const blob = await res.blob();
        return { blob, url };
      };

      try {
        let file;
        try {
          file = await fetchPdf(primaryName);
        } catch {
          file = await fetchPdf(fallbackName);
        }
        const dl = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = dl;
        a.download = primaryName; // имя файла зависит от языка
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(dl), 5000);
      } catch (e) {
        const url = base + primaryName;
        alert(t('resume.pdfNotFound', { url }));
      } finally {
        isDownloading.value = false;
      }
    };

    return {
      resumeHtml,
      awards,
      certificates,
      patents,
      isPdf,
      isDownloading,
      patentFirst,
      patentRest,
      awardsFirst,
      awardsRest,
      certificatesFirst,
      certificatesRest,
      t,
      talt,
      tpatent,
      downloadPDF,
    };
  },
});
</script>

<style scoped>
.resume-page {
  padding: 2rem;
  display: flex;
  justify-content: center;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.resume-container {
  max-width: 980px;
  width: 100%;
  background-color: var(--sbg1-color);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
}

.download-btn {
  background-color: var(--button-color);
  color: var(--button-text-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.download-btn[disabled] {
  opacity: 0.85;
  cursor: not-allowed;
}

.download-btn:hover:not([disabled]) {
  filter: brightness(1.1);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.6);
  border-top-color: rgba(255,255,255,1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.markdown-body {
  color: var(--text-color);
  line-height: 1.6;
}
/* Предотвращаем выход длинных слов/URL за границы контейнера на экране */
.markdown-body :deep(p),
.markdown-body :deep(li),
.markdown-body :deep(a),
.caption {
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}
/* Инлайновый код допускаем переносы, но блоки кода — скроллим */
.markdown-body :deep(code) { white-space: break-spaces; word-break: break-word; }
.markdown-body :deep(pre) { overflow-x: auto; white-space: pre; -webkit-overflow-scrolling: touch; }
.markdown-body :deep(pre) :deep(code) { white-space: pre; }

/* Таблицы на экране с видимыми границами */
.markdown-body :deep(table) { border-collapse: collapse; width: 100%; }
.markdown-body :deep(th),
.markdown-body :deep(td) { border: 1px solid rgba(127,127,127,0.3); padding: 6px 8px; }
.markdown-body :deep(thead) :deep(th) { background: rgba(127,127,127,0.08); }

/* Стили для контента, отрисованного через v-html */
.markdown-body :deep(a) {
  color: var(--blue-color);
  text-decoration: none;
}
.markdown-body :deep(a:hover) {
  text-decoration: underline;
}
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  color: var(--text-color);
  margin-top: 1.2em;
}
.markdown-body :deep(ul),
.markdown-body :deep(ol),
.markdown-body :deep(p) {
  color: var(--text-color);
}

.attachments {
  margin-top: 2rem;
}
.attachments h2 {
  margin: 1.5rem 0 1rem;
}
.patents {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.patent .caption {
  font-size: 0.9rem;
  opacity: 0.8;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (min-width: 900px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
.grid-img, .image {
  width: 100%;
  height: auto;
  display: block;
}
/* Внутреннее изображение PrimeVue Image */
.grid-img :deep(img) {
  width: 100% !important;
  height: auto !important;
  max-width: 100% !important;
}

/* Ограничение размеров на экране */
.fit-screen,
.fit-screen :deep(img) {
  max-height: 60vh !important;
  object-fit: contain !important;
}

.page-item {
  margin-bottom: 16px;
}

.page-break {
  break-before: page;
  page-break-before: always; /* legacy */
  height: 0; margin: 0; border: 0; padding: 0;
}

@media print {
  @page { size: A4; margin: 10mm; }

  /* Скрываем всё кроме содержимого резюме */
  body * { visibility: hidden; }
  #resume-content, #resume-content * { visibility: visible; }
  #resume-content {
    position: absolute;
    left: 0; top: 0; width: 100%;
    color: #000; background: #fff; padding: 0;
  }
  .resume-container { padding: 0 !important; background: #fff !important; box-shadow: none !important; }
  .actions { display: none; }

  /* Скрыть технические разрывы внутри контента при печати (используем .page-item для разбиения) */
  #resume-content .page-break { display: none !important; }

  /* Чёрный цвет текста для печати */
  #resume-content h1,
  #resume-content h2,
  #resume-content h3,
  #resume-content h4,
  #resume-content h5,
  #resume-content h6,
  #resume-content p,
  #resume-content li,
  #resume-content span,
  #resume-content div,
  #resume-content .caption,
  #resume-content .attachments h2 {
    color: #000 !important;
  }
  #resume-content .caption { opacity: 1 !important; }

  /* На печати показываем по одной картинке на страницу */
  .grid { display: block !important; }
  .page-item { page-break-after: always; break-after: page; }
  .page-item:last-child { page-break-after: auto; break-after: auto; }

  /* Вписываем изображение в страницу с учетом полей */
  .fit-print,
  .fit-print :deep(img),
  .multi-page-image-container img,
  #resume-content img.pdf-img {
    width: auto !important;
    max-width: 190mm !important; /* ширина области контента (210 - 2*10) */
    height: auto !important;
    max-height: 250mm !important; /* оставляем запас под подписи */
    object-fit: contain !important;
    display: block;
    margin: 0 auto;
  }
  /* Для самой первой страницы патентов, где есть заголовок, ещё сильнее уменьшаем высоту */
  #resume-content .attachments .page-item.section-start img.pdf-img {
    max-height: 230mm !important;
  }
  /* Отступ для подписи, чтобы она не налезала на изображение */
  #resume-content .caption {
    margin-top: 6mm;
  }

  /* Скрыть глобальные UI элементы (FAB, pill и т.п.) */
  :global(.fab-menu), :global(.floating-pill) { display: none !important; }

  /* Избежать «висячих» заголовков: держим заголовок с последующим блоком (работает и для v-html через :deep) */
  #resume-content :deep(h1),
  #resume-content :deep(h2),
  #resume-content :deep(h3),
  #resume-content h1,
  #resume-content h2,
  #resume-content h3 { break-after: avoid-page; page-break-after: avoid; }
  #resume-content :deep(h1) + *,
  #resume-content :deep(h2) + *,
  #resume-content :deep(h3) + *,
  #resume-content h1 + *,
  #resume-content h2 + *,
  #resume-content h3 + * { break-before: avoid-page; page-break-before: avoid; }

  /* Начинать разделы вложений с новой страницы и давать место под заголовок */
  #resume-content .attachments h2 {
    break-before: auto; page-break-before: auto;
    margin-top: 0; margin-bottom: 6mm;
  }

  /* Сжать первое изображение после заголовка раздела, чтобы поместилось на той же странице */
  #resume-content .attachments h2 + .patents .page-item:first-child :deep(img),
  #resume-content .attachments h2 + .grid .page-item:first-child :deep(img) {
    max-height: 240mm !important;
  }

  /* И сам первый .page-item не разрывать */
  #resume-content .attachments h2 + .patents .page-item:first-child,
  #resume-content .attachments h2 + .grid .page-item:first-child {
    break-inside: avoid; page-break-inside: avoid;
  }

  /* Не разрывать единицы контента */
  #resume-content .page-item { break-inside: avoid; page-break-inside: avoid; }
  #resume-content .section-start { break-inside: avoid; page-break-inside: avoid; }
  #resume-content .patents,
  #resume-content .grid { break-inside: avoid; page-break-inside: avoid; }

  /* Орфаны/вдовы для текста */
  #resume-content :deep(p),
  #resume-content :deep(li),
  #resume-content p,
  #resume-content li { orphans: 3; widows: 3; }

  /* Таблицы: видимые границы при печати (v-html) */
  #resume-content :deep(table) { border-collapse: collapse; width: 100%; }
  #resume-content :deep(th),
  #resume-content :deep(td) { border: 1px solid #000; padding: 4px 6px; }
  #resume-content :deep(thead) :deep(th) { background: #f2f2f2; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}

/* На экране визуально показываем место разрыва (тонкая линия) */
.page-break { border-top: 1px dashed rgba(127,127,127,0.3); margin: 24px 0; }

/* Мобильная адаптация */
@media (max-width: 600px) {
  .resume-page { padding: 1rem; }
  .resume-container { padding: 1rem; border-radius: 6px; }
  .actions { position: sticky; top: 0; background: var(--sbg1-color); padding: 0.5rem 0; z-index: 5; border-bottom: 1px solid rgba(0,0,0,0.08); }
  .download-btn { width: 100%; }
  .grid { grid-template-columns: 1fr; gap: 8px; }
  .fit-screen, .fit-screen :deep(img) { max-height: 50vh !important; }
  .page-item { margin-bottom: 12px; }
  .markdown-body { font-size: 1rem; line-height: 1.65; }
  /* Таблицы в v-html горизонтально прокручиваемы при узком экране */
  .markdown-body :deep(table) { display: block; overflow-x: auto; width: 100%; }
}

/* Режим экспорта в PDF через html2pdf: чёрный текст, белый фон, по одной картинке на страницу */
.pdf-sandbox { position: fixed; left: -99999px; top: -99999px; z-index: -1; width: 720px; opacity: 0; pointer-events: none; }
.pdf-sandbox #resume-content { background: #fff !important; color: #000 !important; }
.pdf-sandbox #resume-content h1,
.pdf-sandbox #resume-content h2,
.pdf-sandbox #resume-content h3,
.pdf-sandbox #resume-content h4,
.pdf-sandbox #resume-content h5,
.pdf-sandbox #resume-content h6,
.pdf-sandbox #resume-content p,
.pdf-sandbox #resume-content li,
.pdf-sandbox #resume-content span,
.pdf-sandbox #resume-content div,
.pdf-sandbox #resume-content .caption,
.pdf-sandbox #resume-content .attachments h2 { color: #000 !important; }
.pdf-sandbox #resume-content .caption { opacity: 1 !important; }
/* Крупнее шрифт для PDF, сохраняем читабельность */
.pdf-sandbox #resume-content .markdown-body { font-size: 18px; line-height: 1.7; }

.pdf-sandbox .grid { display: block !important; }
.pdf-sandbox .page-item { page-break-after: always; break-after: page; }
.pdf-sandbox .page-item:last-child { page-break-after: auto; break-after: auto; }

/* Размеры для html2pdf (экранный CSS) */
.pdf-sandbox .fit-print,
.pdf-sandbox .fit-print :deep(img),
.pdf-sandbox .multi-page-image-container img,
.pdf-sandbox .md-page {
  width: auto !important;
  max-width: 100% !important;
  height: auto !important;
  max-height: 1100px !important; /* приблизительная высота A4 за вычетом полей при рендере на экране */
  object-fit: contain !important;
  display: block;
  margin: 0 auto;
}

</style>

