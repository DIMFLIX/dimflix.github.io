<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'
import MarkdownArticle from '@/components/MarkdownArticle.vue'

const route = useRoute()
const router = useRouter()

const { t } = useI18n();

const articleId = route.params.id as string

// Inject BlogPosting JSON-LD for SEO with dates/keywords
import { getArticleMeta } from '@/utils/articles'
let ldEl: HTMLScriptElement | null = null
onMounted(async () => {
  try {
    const url = typeof window !== 'undefined' ? window.location.href : `https://dimflix.github.io/articles/${articleId}`
    const lang = (route.params.lang as string) || 'en'
    const meta = await getArticleMeta(lang, articleId)
    const data: any = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: (meta?.title || document.title || `Article ${articleId}`),
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@type': 'Person', name: 'DIMFLIX', url: 'https://x.com/dimflix' }
    }
    if (meta?.date) data.datePublished = meta.date
    if (meta?.updatedAt) data.dateModified = meta.updatedAt
    if (meta?.keywords?.length) data.keywords = meta.keywords

    ldEl = document.createElement('script')
    ldEl.type = 'application/ld+json'
    ldEl.text = JSON.stringify(data)
    document.head.appendChild(ldEl)
  } catch {}
})

onBeforeUnmount(() => {
  if (ldEl && ldEl.parentNode) ldEl.parentNode.removeChild(ldEl)
})
</script>

<template>
    <div class="page">
        <div class="article-page">
            <button class="back-button" @click="router.go(-1)">← {{ t('articles.back') }}</button>
            <MarkdownArticle :article-name="articleId" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page {
    width: 100%;
	height: 100vh;
	max-width: 100%;
	display: flex;
	flex-direction: column;
	background-color: var(--bg-color);
	color: var(--text-color);
	gap: 100px;
	padding: 1rem 5vw 50px 5vw;
	box-sizing: border-box;
	overflow: scroll;

    @media (max-width: 768px) {
        gap: 50px;
        padding: 1rem 3vw 30px 3vw;
    }

    @media (max-width: 480px) {
        gap: 30px;
        padding: 1rem 2vw 20px 2vw;
    }

    .article-page {
        min-width: 800px;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
        border: 2px solid var(--sbg1-color);
        border-radius: 15px;

        @media (max-width: 850px) {
            min-width: unset;
            width: 100%;
            max-width: 100%;
        }

        @media (max-width: 768px) {
            padding: 1.5rem 1rem;
            border-radius: 12px;
        }

        @media (max-width: 480px) {
            padding: 1rem 0.75rem;
            border-radius: 10px;
            border-width: 1px;
        }
    }

    .back-button {
        background: none;
        border: none;
        color: var(--mauve-color);
        cursor: pointer;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        transition: all 0.3s ease;

        @media (max-width: 768px) {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
        }

        @media (max-width: 480px) {
            font-size: 0.85rem;
            padding: 0.3rem 0.6rem;
        }
    }

    .back-button:hover {
        text-decoration: underline;
    }
}
</style>
