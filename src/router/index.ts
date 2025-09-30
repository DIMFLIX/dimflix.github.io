import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ArticlesPage from "@/views/ArticlesPage.vue";
import ArticlePage from "@/views/ArticlePage.vue";
import Portfolio from "@/views/Portfolio.vue";
import About from "@/views/About.vue";
import i18n from "@/i18n";
import { getArticleMeta } from "@/utils/articles";

const SITE_BASE = 'https://dimflix.github.io';

const localizedChildren: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'DIMFLIX | Full-Stack & AI/ML Developer',
      description: 'Full-Stack, AI/ML, Data — портфолио, статьи, проекты. Разработка под ключ: веб, бэкэнд, алгоритмы.',
      canonicalSegment: ''
    }
  },
  {
    path: 'about',
    name: 'about',
    component: About,
    meta: {
      title: 'DIMFLIX | About',
      description: 'Обо мне: опыт, стек, награды, сертификаты. Full-Stack & AI/ML разработчик.',
      canonicalSegment: '/about'
    }
  },
  {
    path: 'portfolio',
    name: 'portfolio',
    component: Portfolio,
    meta: {
      title: 'DIMFLIX | Portfolio',
      description: 'Портфолио: реальные проекты, Full-Stack и AI/ML решения.',
      canonicalSegment: '/portfolio'
    }
  },
  {
    path: 'articles',
    name: 'Articles',
    component: ArticlesPage,
    meta: {
      title: 'DIMFLIX | Articles',
      description: 'Статьи про AI/ML, Full-Stack, Rust, Vue и не только.',
      canonicalSegment: '/articles'
    }
  },
  {
    path: 'articles/:id',
    name: 'Article',
    component: ArticlePage,
    props: true,
    meta: {
      title: 'DIMFLIX | Article',
      description: 'Статья от DIMFLIX по теме разработки/AI/ML.',
      canonicalSegment: (route: any) => `/articles/${route.params.id}`
    }
  },
  {
    path: 'resume',
    name: 'resume',
    component: () => import('@/views/Resume.vue'),
    meta: {
      title: 'DIMFLIX | Resume',
      description: 'Резюме Full-Stack & AI/ML разработчика.',
      canonicalSegment: '/resume'
    }
  }
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:lang(en|ru)',
    component: { template: '<router-view />' },
    children: localizedChildren
  },
  // Redirect any non-localized path to default language (preserve the rest of the path)
  {
    path: '/:pathMatch(.*)*',
    redirect: (to: any) => {
      try {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
        const defaultLang = saved === 'ru' ? 'ru' : 'en'
        const p = to.fullPath.startsWith('/') ? to.fullPath : `/${to.fullPath}`
        const m = p.match(/^\/(en|ru)(?:\/|$)/)
        if (m) {
          // already has prefix but route not found -> go to language root to avoid loops
          return `/${m[1]}/`
        }
        // no prefix -> add default language prefix
        return `/${defaultLang}${p}`
      } catch {
        return `/en/`
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

function upsertMetaName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el) }
  el.setAttribute('content', content)
}
function upsertMetaProperty(prop: string, content: string) {
  let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el) }
  el.setAttribute('content', content)
}
function upsertLinkRel(rel: string, href: string, attrs: Record<string,string> = {}) {
  let el = document.querySelector(`link[rel="${rel}"]${attrs.hreflang ? `[hreflang="${attrs.hreflang}"]` : ''}`) as HTMLLinkElement | null
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el) }
  el.setAttribute('href', href)
  if (attrs.hreflang) el.setAttribute('hreflang', attrs.hreflang)
}

router.beforeEach(async (to, from, next) => {
  // Ensure localized prefix
  const path = to.path
  if (!/^\/(en|ru)(\/|$)/.test(path)) {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
      const lang = saved === 'ru' ? 'ru' : 'en'
      return next({ path: `/${lang}${path}` })
    } catch {
      return next({ path: `/en${path}` })
    }
  }

  const lang = (to.params.lang as string) || 'en'
  try {
    const g: any = i18n.global
    if (g && g.locale) {
      if (typeof g.locale === 'string') g.locale = lang
      else if (g.locale && 'value' in g.locale) g.locale.value = lang
    }
    localStorage.setItem('lang', lang)
    document.documentElement.setAttribute('lang', lang)
  } catch {}

  // Title
  const baseTitle = (to.meta?.title as string) || 'DIMFLIX'
  const articleId = to.params?.id as string | undefined
  const finalTitle = (to.name === 'Article' && articleId) ? `${baseTitle}: ${articleId}` : baseTitle
  document.title = finalTitle

  // Description
  const rawDesc: any = (to.meta as any)?.description
  const desc = typeof rawDesc === 'function' ? rawDesc(to) : (rawDesc || 'Full-Stack & AI/ML разработчик.')
  upsertMetaName('description', desc)

  // Canonical
  const rawCanon: any = (to.meta as any)?.canonicalSegment
  const segment = typeof rawCanon === 'function' ? rawCanon(to) : (rawCanon || to.path.replace(/^\/(en|ru)/, ''))
  const canonicalHref = `${SITE_BASE}/${lang}${segment}`
  upsertLinkRel('canonical', canonicalHref)

  // hreflang alternates
  const seg = segment.startsWith('/') ? segment : `/${segment}`
  upsertLinkRel('alternate', `${SITE_BASE}/en${seg}`, { hreflang: 'en' })
  upsertLinkRel('alternate', `${SITE_BASE}/ru${seg}`, { hreflang: 'ru' })
  upsertLinkRel('alternate', `${SITE_BASE}${seg}`, { hreflang: 'x-default' })

  // Open Graph / Twitter (defaults)
  upsertMetaProperty('og:title', finalTitle)
  upsertMetaProperty('og:description', desc)
  upsertMetaProperty('og:url', canonicalHref)
  upsertMetaProperty('og:image', `${SITE_BASE}/og-cover.jpg`)
  upsertMetaProperty('og:image:alt', finalTitle)
  upsertMetaProperty('og:image:width', '1200')
  upsertMetaProperty('og:image:height', '630')
  upsertMetaProperty('og:locale', lang === 'ru' ? 'ru_RU' : 'en_US')

  const tw = [
    ['twitter:card','summary_large_image'],
    ['twitter:title', finalTitle],
    ['twitter:description', desc],
    ['twitter:image', `${SITE_BASE}/og-cover.jpg`],
    ['twitter:site', '@dimflix'],
    ['twitter:creator', '@dimflix']
  ] as const
  tw.forEach(([k,v]) => upsertMetaName(k, v))

  // Article-specific OG
  if (to.name === 'Article') {
    const slug = (to.params.id as string)
    const meta = await getArticleMeta(lang, slug)
    if (meta) {
      // og:type
      upsertMetaProperty('og:type', 'article')
      // article meta
      upsertMetaProperty('article:published_time', meta.date)
      if (meta.updatedAt) upsertMetaProperty('article:modified_time', meta.updatedAt)
      upsertMetaProperty('article:author', 'https://x.com/dimflix')
      if (meta.keywords && meta.keywords.length) {
        // join into single tag (platforms also accept multiple entries, but we keep it simple)
        upsertMetaProperty('article:tag', meta.keywords.join(', '))
      }
      // Prefer article title/desc
      upsertMetaProperty('og:title', meta.title)
      upsertMetaProperty('og:description', meta.excerpt || desc)
      upsertMetaProperty('og:image:alt', meta.title)
      const tPairs = [
        ['twitter:title', meta.title],
        ['twitter:description', meta.excerpt || desc],
      ] as const
      tPairs.forEach(([k,v]) => upsertMetaName(k, v))
      document.title = meta.title
    }
  }

  next();
});

export default router;
