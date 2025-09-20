import { type ArticleMeta } from "@/types/articles";
import MarkdownIt from "markdown-it";
import matter from "gray-matter";

const md = new MarkdownIt();

const parseMarkdownContent = (content: string) => {
  const { data, content: mdContent } = matter(content);
  const tokens = md.parse(mdContent, {});

  let title = data.title || "";
  const excerpt = data.excerpt || "";
  const parsedDate = new Date(data.date || new Date())
  const updatedAt = data.updatedAt ? new Date(data.updatedAt) : null
  const keywords: string[] | undefined = Array.isArray(data.tags)
    ? data.tags
    : Array.isArray(data.keywords)
      ? data.keywords
      : (typeof data.tags === 'string' ? data.tags.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (typeof data.keywords === 'string' ? data.keywords.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined))

  // Автоматическое извлечение заголовка из первого h1
  if (!title) {
    for (const token of tokens) {
      if (token.type === "heading_open" && token.tag === "h1") {
        const inlineToken = tokens[tokens.indexOf(token) + 1];
        if (inlineToken?.type === "inline") {
          title = inlineToken.content;
          break;
        }
      }
    }
  }

  return {
    title: title || "Untitled",
    excerpt: excerpt || "",
    date: parsedDate.toISOString(),
    updatedAt: updatedAt?.toISOString() || null,
    keywords,
  };
};

export const getArticlesMeta = async (lang: string): Promise<ArticleMeta[]> => {
  const context = require.context("@/assets/articles", true, /\.md$/, "lazy");

  const articles: ArticleMeta[] = [];

  for (const path of context.keys()) {
    const match = path.match(/\.\/(.+?)\/(.+)\.md$/);
    if (match && match[1] === lang) {
      const slug = match[2];
      try {
        const content = await context(path);
        const { title, excerpt, date, updatedAt, keywords } = parseMarkdownContent(content.default);

        articles.push({
          slug,
          title,
          excerpt,
          date: new Date(date).toISOString(),
          updatedAt: updatedAt || undefined,
          keywords,
          lang,
        });
      } catch (error) {
        console.error(`Error loading article ${path}:`, error);
      }
    }
  }

  // Сортировка по дате (новые сначала)
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getArticleMeta = async (lang: string, slug: string): Promise<ArticleMeta | null> => {
  try {
    const key = `./${lang}/${slug}.md`
    const context = require.context("@/assets/articles", true, /\.md$/, "lazy");
    const content = await context(key)
    const { title, excerpt, date, updatedAt, keywords } = parseMarkdownContent(content.default)
    return {
      slug,
      title,
      excerpt,
      date: new Date(date).toISOString(),
      updatedAt: updatedAt || undefined,
      keywords,
      lang
    }
  } catch (e) {
    console.error('getArticleMeta failed', lang, slug, e)
    return null
  }
}
