// GitHub Discussions API Service for Reviews
const CACHE_PREFIX = 'reviews_'
const CACHE_DURATION = 10 * 60 * 1000 // 10 минут

function isCacheDisabled() {
  try {
    // URL flag ?noReviewsCache=1 or localStorage flag
    const params = new URLSearchParams(window.location.search)
    if (params.get('noReviewsCache') === '1') return true
    if (localStorage.getItem('reviews_disable_cache') === '1') return true
  } catch (_) {}
  return false
}

export function setReviewsCacheDisabled(disabled) {
  try { localStorage.setItem('reviews_disable_cache', disabled ? '1' : '0') } catch (_) {}
}

/**
 * Парсит текст отзыва для извлечения структурированных данных
 * @param {string} body - Текст дискуссии
 * @returns {Object} - Объект с rating, text, author_info
 */
function parseReviewBody(body) {
  const review = {
    rating: 0,
    text: '',
    author_info: ''
  }

  // Парсим рейтинг только из первой строки и только по звёздам/числу, поддерживаем ⭐, ⭐️ и ★
  const firstLine = (body || '').split('\n')[0] || ''
  const starMatches = firstLine.match(/(?:⭐️|⭐|★)/g)
  if (starMatches && starMatches.length) {
    review.rating = starMatches.length
  } else {
    const ratingMatch = body.match(/Rating:\s*(\d+)/)
    if (ratingMatch) {
      review.rating = parseInt(ratingMatch[1])
    }
  }
  // Ограничиваем рейтинг диапазоном 0..5
  review.rating = Math.max(0, Math.min(5, review.rating || 0))

  // Парсим текст отзыва (всё что идёт после звёзд/рейтинга до author_info)
  let textContent = body
  
  // Убираем рейтинг из текста: звёзды (⭐, ⭐️, ★) в начале и строку Rating: N
  textContent = textContent
    .replace(/^(?:\s*)(?:⭐️|⭐|★)+\s*/m, '')
    .replace(/Rating:\s*\d+/, '')
  
  // Парсим информацию об авторе (если есть)
  const authorMatch = textContent.match(/Author:\s*(.+?)(?:\n|$)/m)
  if (authorMatch) {
    review.author_info = authorMatch[1].trim()
    textContent = textContent.replace(/Author:\s*.+?(?:\n|$)/m, '')
  }

  // Очищаем и сохраняем основной текст
  review.text = textContent.trim()

  return review
}

/**
 * Получить отзывы из GitHub Discussions
 * @param {string} owner - Владелец репозитория (например, 'DIMFLIX')
 * @param {string} repo - Название репозитория (например, 'dimflix.github.io')
 * @param {string} category - Категория дискуссий (например, 'Reviews' или 'Q&A')
 * @returns {Promise<Array>} - Массив отзывов
 */
export async function getReviews(owner, repo, category = 'Reviews') {
  const cacheKey = `${CACHE_PREFIX}${owner}_${repo}_${category}`
  
  const cached = isCacheDisabled() ? null : getCachedData(cacheKey)
  if (cached) return cached

  try {
    const [fromDiscussions, fromIssues] = await Promise.all([
      getReviewsFromDiscussions(owner, repo),
      getReviewsFromIssues(owner, repo)
    ])
    const all = [...fromDiscussions, ...fromIssues]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (!isCacheDisabled()) setCachedData(cacheKey, all)
    return all
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return []
  }
}

/**
 * Fallback метод через REST API (без GraphQL)
 */
async function getReviewsFromDiscussions(owner, repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/discussions?per_page=20`, {
      headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
    })
    if (!response.ok) return []
    const discussions = await response.json()
    return discussions.map(d => {
      const parsedReview = parseReviewBody(d.body || '')
      const user = d.user || d.author || {}
      return {
        id: `d_${String(d.id)}`,
        title: d.title,
        rating: parsedReview.rating,
        text: parsedReview.text,
        author: {
          name: parsedReview.author_info || user.login || 'Anonymous',
          username: user.login,
          avatar: user.avatar_url || user.avatarUrl,
          url: user.html_url || user.url
        },
        createdAt: d.created_at || d.createdAt,
        updatedAt: d.updated_at || d.updatedAt,
        upvotes: (d.reactions && d.reactions['+1']) || d.upvoteCount || 0,
        commentsCount: d.comments || (d.comments_count ?? 0)
      }
    }).filter(r => r.rating > 0)
  } catch (error) {
    console.error('Discussions fetch failed:', error)
    return []
  }
}

/**
 * Fallback: parse issues labeled as "review"
 */
async function getReviewsFromIssues(owner, repo) {
  try {
    const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?labels=review&state=all&per_page=20`, {
      headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
    })
    if (!resp.ok) return []
    const issues = await resp.json()
    return issues.map(issue => {
      const parsed = parseReviewBody(issue.body || '')
      return {
        id: String(issue.id),
        title: issue.title,
        rating: parsed.rating,
        text: parsed.text,
        author: {
          name: parsed.author_info || issue.user?.login || 'Anonymous',
          username: issue.user?.login,
          avatar: issue.user?.avatar_url,
          url: issue.user?.html_url
        },
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        upvotes: issue.reactions?.['+1'] || 0,
        commentsCount: issue.comments || 0
      }
    }).filter(r => r.rating > 0)
  } catch (e) {
    console.error('Issues fallback failed:', e)
    return []
  }
}

/**
 * Получить средний рейтинг
 * @param {Array} reviews - Массив отзывов
 * @returns {number} - Средний рейтинг (округлённый до 1 знака)
 */
export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0
  
  const sum = reviews.reduce((acc, review) => acc + Math.max(0, Math.min(5, review.rating || 0)), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

/**
 * Получить распределение рейтингов
 * @param {Array} reviews - Массив отзывов
 * @returns {Object} - Объект с количеством отзывов для каждого рейтинга
 */
export function getRatingDistribution(reviews) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++
    }
  })
  
  return distribution
}

/**
 * Кэширование
 */
function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to read from cache:', error)
    return null
  }
}

function setCachedData(key, data) {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Failed to write to cache:', error)
  }
}

/**
 * Очистить кэш отзывов
 */
export function clearReviewsCache() {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Failed to clear cache:', error)
  }
}
