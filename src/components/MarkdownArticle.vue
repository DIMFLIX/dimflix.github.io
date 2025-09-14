<template>
  <div v-if="content" class="markdown-content" ref="contentRef" v-html="content"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import matter from 'gray-matter'

const props = defineProps<{
  articleName: string
}>()

const { locale } = useI18n()
const route = useRoute()
const contentRef = ref<HTMLElement | null>(null)

// Configure MarkdownIt with anchor plugin
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// Custom renderer for headings with IDs
const defaultHeadingOpen = md.renderer.rules.heading_open || function(tokens, idx, options, env, renderer) {
  return renderer.renderToken(tokens, idx, options)
}

md.renderer.rules.heading_open = function(tokens, idx, options, env, renderer) {
  const token = tokens[idx]
  const nextToken = tokens[idx + 1]
  
  if (nextToken && nextToken.type === 'inline') {
    // Generate ID from heading text
    const headingText = nextToken.content
    const headingId = headingText
      .toLowerCase()
      .replace(/[^\w\s\u0400-\u04FF-]/g, '') // Keep Latin and Cyrillic chars
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    // Add id attribute
    token.attrSet('id', headingId)
  }
  
  return defaultHeadingOpen(tokens, idx, options, env, renderer)
}

const content = ref<string | null>(null)

const loadMarkdown = async (): Promise<void> => {
  try {
    const rawModule = await import(
      /* webpackChunkName: "content" */
      `@/assets/articles/${locale.value}/${props.articleName}.md`
    )

    // Парсим Front Matter и получаем чистый контент
    const { content: markdownContent } = matter(rawModule.default)

    // Рендерим только основной контент без Front Matter
    content.value = DOMPurify.sanitize(md.render(markdownContent), {
      ADD_ATTR: ['id'] // Allow id attributes for headings
    })
    
    // Add anchor links after content is rendered
    await nextTick()
    addAnchorLinks()
    
    // Scroll to hash if present
    if (route.hash) {
      scrollToHash(route.hash)
    }
  } catch (e) {
    content.value = null
  }
}

const addAnchorLinks = () => {
  if (!contentRef.value) return
  
  const headings = contentRef.value.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
  
  headings.forEach((heading) => {
    const id = heading.getAttribute('id')
    if (!id) return
    
    // Create anchor link element
    const anchor = document.createElement('a')
    anchor.className = 'anchor-link'
    anchor.href = `#${id}`
    anchor.setAttribute('aria-label', 'Copy link to section')
    anchor.innerHTML = `<svg class="anchor-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>`
    
    // Add click handler to copy link
    anchor.addEventListener('click', (e) => {
      e.preventDefault()
      const url = new URL(window.location.href)
      url.hash = id
      navigator.clipboard.writeText(url.toString())
      
      // Show copied feedback
      anchor.classList.add('copied')
      setTimeout(() => {
        anchor.classList.remove('copied')
      }, 2000)
      
      // Smooth scroll to heading
      heading.scrollIntoView({ behavior: 'smooth' })
    })
    
    // Make heading a flex container and prepend anchor (at the beginning)
    heading.classList.add('heading-with-anchor')
    heading.insertBefore(anchor, heading.firstChild)
  })
}

const scrollToHash = (hash: string) => {
  const id = hash.slice(1) // Remove #
  const element = document.getElementById(id)
  if (element) {
    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }
}

watch([locale, () => props.articleName], loadMarkdown)

// Watch for hash changes
watch(() => route.hash, (newHash) => {
  if (newHash) {
    scrollToHash(newHash)
  }
})

onMounted(loadMarkdown)
</script>

<style lang="css">
.markdown-content {
  color: var(--text-color);
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

@media (max-width: 768px) {
  .markdown-content {
    padding: 15px;
    line-height: 1.5;
  }
}

@media (max-width: 480px) {
  .markdown-content {
    padding: 10px;
    line-height: 1.4;
  }
}

.markdown-content h1 {
  font-size: 2em;
  border-bottom: 2px solid var(--text-color);
  padding-bottom: 0.3em;
  margin-bottom: 0.5em;
}

@media (max-width: 768px) {
  .markdown-content h1 {
    font-size: 1.75em;
  }
}

@media (max-width: 480px) {
  .markdown-content h1 {
    font-size: 1.5em;
    padding-bottom: 0.2em;
  }
}

.markdown-content h2 {
  font-size: 1.5em;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

@media (max-width: 768px) {
  .markdown-content h2 {
    font-size: 1.35em;
    margin-top: 1.25em;
  }
}

@media (max-width: 480px) {
  .markdown-content h2 {
    font-size: 1.2em;
    margin-top: 1em;
  }
}

.markdown-content h3 {
  font-size: 1.25em;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}

@media (max-width: 768px) {
  .markdown-content h3 {
    font-size: 1.15em;
    margin-top: 1em;
  }
}

@media (max-width: 480px) {
  .markdown-content h3 {
    font-size: 1.1em;
    margin-top: 0.8em;
  }
}

.markdown-content p {
  margin-bottom: 1em;
  font-size: 1em;
}

@media (max-width: 768px) {
  .markdown-content p {
    font-size: 0.95em;
  }
}

@media (max-width: 480px) {
  .markdown-content p {
    font-size: 0.9em;
    margin-bottom: 0.8em;
  }
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

@media (max-width: 768px) {
  .markdown-content ul,
  .markdown-content ol {
    padding-left: 1.25em;
  }
}

@media (max-width: 480px) {
  .markdown-content ul,
  .markdown-content ol {
    padding-left: 1em;
    margin-bottom: 0.8em;
  }
}

.markdown-content li {
  margin-bottom: 0.5em;
  font-size: 1em;
}

@media (max-width: 768px) {
  .markdown-content li {
    font-size: 0.95em;
    margin-bottom: 0.4em;
  }
}

@media (max-width: 480px) {
  .markdown-content li {
    font-size: 0.9em;
    margin-bottom: 0.3em;
  }
}

.markdown-content pre {
  background-color: var(--sbg1-color);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1em;
}

@media (max-width: 768px) {
  .markdown-content pre {
    padding: 0.8em;
    border-radius: 6px;
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .markdown-content pre {
    padding: 0.6em;
    border-radius: 4px;
    font-size: 0.85em;
  }
}

.markdown-content code {
  background-color: var(--sbg1-color);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .markdown-content code {
    font-size: 0.85em;
    padding: 0.15em 0.3em;
  }
}

@media (max-width: 480px) {
  .markdown-content code {
    font-size: 0.8em;
    padding: 0.1em 0.2em;
  }
}

.markdown-content pre code {
  background: none;
  padding: 0;
  font-size: inherit;
}

.markdown-content blockquote {
  border-left: 4px solid var(--mauve-color);
  padding-left: 1em;
  margin: 1em 0;
  color: var(--text-color);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .markdown-content blockquote {
    border-left-width: 3px;
    padding-left: 0.8em;
    margin: 0.8em 0;
  }
}

@media (max-width: 480px) {
  .markdown-content blockquote {
    border-left-width: 2px;
    padding-left: 0.6em;
    margin: 0.6em 0;
  }
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .markdown-content img {
    border-radius: 6px;
    margin: 0.8em auto;
  }
}

@media (max-width: 480px) {
  .markdown-content img {
    border-radius: 4px;
    margin: 0.6em auto;
  }
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  overflow-x: auto;
  display: block;
}

.markdown-content th,
.markdown-content td {
  border: 1px solid var(--sbg1-color);
  padding: 0.5em;
  text-align: left;
}

.markdown-content th {
  background-color: var(--sbg1-color);
  font-weight: bold;
}

@media (max-width: 768px) {
  .markdown-content table {
    font-size: 0.9em;
  }
  
  .markdown-content th,
  .markdown-content td {
    padding: 0.4em;
  }
}

@media (max-width: 480px) {
  .markdown-content table {
    font-size: 0.85em;
  }
  
  .markdown-content th,
  .markdown-content td {
    padding: 0.3em;
  }
}

.markdown-content a {
  color: var(--mauve-color);
  text-decoration: none;
  transition: all 0.3s ease;
}

.markdown-content a:hover {
  text-decoration: underline;
  opacity: 0.8;
}

.markdown-content hr {
  border: none;
  border-top: 2px solid var(--sbg1-color);
  margin: 2em 0;
}

@media (max-width: 768px) {
  .markdown-content hr {
    margin: 1.5em 0;
  }
}

@media (max-width: 480px) {
  .markdown-content hr {
    margin: 1em 0;
    border-top-width: 1px;
  }
}

/* Anchor link styles */
.markdown-content .heading-with-anchor {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: -35px;
  padding-left: 35px;
}

.markdown-content .anchor-link {
  display: inline-flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: var(--text-color);
  text-decoration: none;
  padding: 2px;
  border-radius: 4px;
  position: absolute;
  left: 5px;
  margin-right: 5px;
}

.markdown-content .heading-with-anchor:hover .anchor-link {
  opacity: 0.5;
}

.markdown-content .anchor-link:hover {
  opacity: 0.8 !important;
  background-color: var(--sbg1-color);
}

.markdown-content .anchor-link.copied {
  opacity: 1 !important;
}

.markdown-content .anchor-link.copied::after {
  content: "Copied!";
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--green-color);
  color: var(--button-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  animation: fadeInOut 2s ease;
  pointer-events: none;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-5px);
  }
  20% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-5px);
  }
}

.markdown-content .anchor-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .markdown-content .heading-with-anchor {
    margin-left: -33px;
    padding-left: 33px;
  }
  
  .markdown-content .anchor-link {
    opacity: 0.4;
    left: 5px;
  }
  
  .markdown-content .anchor-icon {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .markdown-content .heading-with-anchor {
    margin-left: -30px;
    padding-left: 30px;
  }
  
  .markdown-content .anchor-link {
    opacity: 0.5;
    left: 5px;
  }
  
  .markdown-content .anchor-icon {
    width: 16px;
    height: 16px;
  }
}

/* Smooth scroll for heading targets */
.markdown-content h1[id],
.markdown-content h2[id],
.markdown-content h3[id],
.markdown-content h4[id],
.markdown-content h5[id],
.markdown-content h6[id] {
  scroll-margin-top: 80px;
}

@media (max-width: 768px) {
  .markdown-content h1[id],
  .markdown-content h2[id],
  .markdown-content h3[id],
  .markdown-content h4[id],
  .markdown-content h5[id],
  .markdown-content h6[id] {
    scroll-margin-top: 60px;
  }
}
</style>
