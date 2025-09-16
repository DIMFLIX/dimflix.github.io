// GitHub API Service with caching
const CACHE_PREFIX = 'github_stats_';
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 час в миллисекундах

/**
 * Получить статистику репозитория из кэша или GitHub API
 * @param {string} repoUrl - URL репозитория на GitHub
 * @returns {Promise<{stars: number, forks: number}>}
 */
export async function getRepoStats(repoUrl) {
  if (!repoUrl) {
    return { stars: 0, forks: 0 };
  }

  // Извлекаем owner и repo из URL
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) {
    console.warn(`Invalid GitHub URL: ${repoUrl}`);
    return { stars: 0, forks: 0 };
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, ''); // Удаляем .git если есть
  const cacheKey = `${CACHE_PREFIX}${owner}_${repo}`;

  // Проверяем кэш
  const cached = getCachedStats(cacheKey);
  if (cached) {
    return cached;
  }

  // Запрашиваем данные из GitHub API
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Если есть токен, можно добавить для увеличения лимита
        // 'Authorization': `token ${GITHUB_TOKEN}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Repository not found: ${owner}/${repo}`);
      } else if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded');
      }
      return { stars: 0, forks: 0 };
    }

    const data = await response.json();
    const stats = {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0
    };

    // Сохраняем в кэш
    setCachedStats(cacheKey, stats);
    return stats;
  } catch (error) {
    console.error(`Failed to fetch repo stats for ${owner}/${repo}:`, error);
    return { stars: 0, forks: 0 };
  }
}

/**
 * Получить статистику для нескольких репозиториев
 * @param {string[]} repoUrls - Массив URL репозиториев
 * @returns {Promise<Map<string, {stars: number, forks: number}>>}
 */
export async function getMultipleRepoStats(repoUrls) {
  const statsMap = new Map();
  
  // Запускаем все запросы параллельно
  const promises = repoUrls.map(async (url) => {
    const stats = await getRepoStats(url);
    return { url, stats };
  });

  const results = await Promise.all(promises);
  
  results.forEach(({ url, stats }) => {
    statsMap.set(url, stats);
  });

  return statsMap;
}

/**
 * Получить данные из кэша
 */
function getCachedStats(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    
    // Проверяем не устарел ли кэш
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to read from cache:', error);
    return null;
  }
}

/**
 * Сохранить данные в кэш
 */
function setCachedStats(key, data) {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to write to cache:', error);
  }
}

/**
 * Очистить весь кэш статистики GitHub
 */
export function clearGitHubCache() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

/**
 * Форматировать число для отображения
 * @param {number} num - Число для форматирования
 * @returns {string} Отформатированное число (например, 1.2k)
 */
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}
