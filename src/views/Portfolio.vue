<script setup>
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const { t, locale } = useI18n();
const screenSize = ref(0);

const projectsList = ref([
	{
        src: require("@/assets/projects/meowrch.png"), 
        title: "portfolio.meowrch.title",
        description: "portfolio.meowrch.description",
        link: "https://github.com/meowrch/meowrch",
        repo: "meowrch/meowrch"
    },
	{
        src: require("@/assets/projects/pixelgan.png"), 
        title: "portfolio.pixelGan.title",
        description: "portfolio.pixelGan.description",
        link: "https://github.com/DIMFLIX-Hackathons/PixelGAN",
        repo: "DIMFLIX-Hackathons/PixelGAN"
    },
    {
        src: require("@/assets/projects/defectSenseAI.png"), 
        title: "portfolio.defectSenseAI.title",
        description: "portfolio.defectSenseAI.description",
        link: "https://github.com/DIMFLIX",
        repo: null // No specific repo
    },
    {
        src: require("@/assets/projects/terraWing.png"), 
        title: "portfolio.terraWing.title",
        description: "portfolio.terraWing.description",
        link: "https://github.com/DIMFLIX-Hackathons/TerraWing",
        repo: "DIMFLIX-Hackathons/TerraWing"
    },
    {
        src: require("@/assets/projects/pyTypingCourse.png"), 
        title: "portfolio.pyTypingCourse.title",
        description: "portfolio.pyTypingCourse.description",
        link: "https://github.com/DIMFLIX/PyTypingCourse",
        repo: "DIMFLIX/PyTypingCourse"
    },
    {
        src: require("@/assets/projects/spectrum-security.png"), 
        title: 'portfolio.spectrumSecurity.title',
        description: 'portfolio.spectrumSecurity.description',
        link: "https://github.com/DIMFLIX/Spectrum-Security",
        repo: "DIMFLIX/Spectrum-Security"
    },
])

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const selectedProject = ref(null);
const readmeContent = ref('');
const loadingReadme = ref(false);
const readmeError = ref(false);

const renderedReadme = computed(() => {
  if (!readmeContent.value) return '';
  
  // Получаем текущий проект для замены путей к изображениям
  const currentProject = selectedProject.value !== null ? projectsList.value[selectedProject.value] : null;
  
  if (!currentProject || !currentProject.repo) {
    return DOMPurify.sanitize(md.render(readmeContent.value));
  }
  
  // Заменяем относительные пути на абсолютные для изображений из GitHub
  let processedContent = readmeContent.value;
  
  // Получаем текущую ветку для правильных ссылок
  const branch = selectedBranch.value || 'main';
  
  // Заменяем пути к изображениям на raw.githubusercontent.com
  // Markdown синтаксис: ![alt](path)
  processedContent = processedContent.replace(/!\[([^\]]*)\]\((?!\/\/)(?!http)([^)]+)\)/g, (match, alt, path) => {
    if (path && typeof path === 'string') {
      // Убираем ./ из начала пути если есть
      const cleanPath = path.replace(/^\.?\//, '');
      const absoluteUrl = `https://raw.githubusercontent.com/${currentProject.repo}/${branch}/${cleanPath}`;
      return `![${alt}](${absoluteUrl})`;
    }
    return match;
  });
  
  // HTML тег img: <img src="path">
  processedContent = processedContent.replace(/<img([^>]*?)src=["'](?!\/\/)(?!http)([^"']+)["']([^>]*)>/gi, (match, before, path, after) => {
    if (path && typeof path === 'string') {
      const cleanPath = path.replace(/^\.?\//, '');
      const absoluteUrl = `https://raw.githubusercontent.com/${currentProject.repo}/${branch}/${cleanPath}`;
      return `<img${before}src="${absoluteUrl}"${after}>`;
    }
    return match;
  });
  
  // Обработка HTML img в синтаксисе с одинарными кавычками
  processedContent = processedContent.replace(/<img([^>]*?)src='(?!\/\/)(?!http)([^']+)'([^>]*)>/gi, (match, before, path, after) => {
    if (path && typeof path === 'string') {
      const cleanPath = path.replace(/^\.?\//, '');
      const absoluteUrl = `https://raw.githubusercontent.com/${currentProject.repo}/${branch}/${cleanPath}`;
      return `<img${before}src="${absoluteUrl}"${after}>`;
    }
    return match;
  });
  
  // Обработка GitHub callouts/alerts
  const calloutTypes = {
    'NOTE': { class: 'callout-note' },
    'TIP': { class: 'callout-tip' },
    'IMPORTANT': { class: 'callout-important' },
    'WARNING': { class: 'callout-warning' },
    'CAUTION': { class: 'callout-caution' }
  };
  
  // Заменяем GitHub callouts на HTML (поддержка любого регистра)
  Object.keys(calloutTypes).forEach(type => {
    const regex = new RegExp(`> \\[!(${type}|${type.toLowerCase()}|${type.charAt(0) + type.slice(1).toLowerCase()})\\]\\n((?:> .*\\n?)*)?`, 'gm');
    processedContent = processedContent.replace(regex, (match, matchedType, content) => {
      const lines = content ? content.split('\n').map(line => line.replace(/^> ?/, '')).join('\n') : '';
      const { class: className } = calloutTypes[type];
      return `\n\n<div class="github-callout ${className}">\n<div class="callout-title">${matchedType.toUpperCase()}</div>\n${lines ? `<div class="callout-content">${lines}</div>` : ''}\n</div>\n\n`;
    });
  });
  
  const rendered = md.render(processedContent);
  
  return DOMPurify.sanitize(rendered, {
    ADD_TAGS: ['div', 'center', 'span', 'br', 'hr', 'details', 'summary'],
    ADD_ATTR: ['class', 'align', 'style', 'colspan', 'rowspan', 'valign'],
    ALLOW_ARIA_ATTR: true,
    ALLOW_DATA_ATTR: true,
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'align', 'style', 'width', 'height', 'target', 'rel', 'colspan', 'rowspan', 'valign', 'scope'],
    FORBID_TAGS: ['script', 'iframe'],
    KEEP_CONTENT: true
  });
});

const selectedBranch = ref('main'); // Хранение текущей ветки
const branchCache = ref({}); // Кеш веток для каждого репозитория

const selectProject = async (project, index) => {
  selectedProject.value = index;
  
  if (!project.repo) {
    readmeContent.value = '';
    readmeError.value = true;
    return;
  }
  
  loadingReadme.value = true;
  readmeError.value = false;
  
  try {
    let response;
    let branch = 'main';
    
    // Проверяем кеш веток
    if (branchCache.value[project.repo]) {
      branch = branchCache.value[project.repo];
      response = await fetch(`https://raw.githubusercontent.com/${project.repo}/${branch}/README.md`);
    } else {
      // Try to get README from main branch first
      response = await fetch(`https://raw.githubusercontent.com/${project.repo}/main/README.md`);
      
      // If not found in main, try master branch
      if (!response.ok) {
        response = await fetch(`https://raw.githubusercontent.com/${project.repo}/master/README.md`);
        if (response.ok) {
          branch = 'master';
        }
      }
      
      // Сохраняем ветку в кеш
      if (response.ok) {
        branchCache.value[project.repo] = branch;
      }
    }
    
    selectedBranch.value = branch;
    
    if (response.ok) {
      readmeContent.value = await response.text();
    } else {
      readmeError.value = true;
      readmeContent.value = '';
    }
  } catch (error) {
    console.error('Error loading README:', error);
    readmeError.value = true;
    readmeContent.value = '';
  } finally {
    loadingReadme.value = false;
  }
};

const closeReadme = () => {
  selectedProject.value = null;
  readmeContent.value = '';
  selectedBranch.value = 'main'; // Сбрасываем ветку при закрытии
};

const openLink = (link) => {
  window.open(link, '_blank')
}

const hoverStates = ref({});
</script>

<template>
	<div class="page">
		<div class="content-wrapper">
			<div class="portfolio-grid" :class="{ 'with-readme': selectedProject !== null }">
				<div 
					class="box" 
					v-for="(p, index) in projectsList"
					:key="index"
					:class="{ 'selected': selectedProject === index }"
					@click="selectProject(p, index)"
					@mouseenter="hoverStates[index] = true"
					@mouseleave="hoverStates[index] = false"
				>
					<img :src="p.src" :alt="t(p.title)">
					<transition name="fade">
						<div v-show="hoverStates[index] || selectedProject === index" class="overlay">
							<transition-group name="list">
								<h3 class="title" key="title">
									{{ t(p.title) }}
								</h3>
								<p class="description" key="desc">
									{{ t(p.description) }}
								</p>
								<div class="actions" key="actions">
									<button 
										@click.stop="openLink(p.link)" 
										class="github-link"
										title="Open in GitHub"
									>
										<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
										</svg>
									</button>
								</div>
							</transition-group>
						</div>
					</transition>
				</div>
			</div>
			
			<!-- README Panel -->
			<transition name="slide">
				<div v-if="selectedProject !== null" class="readme-panel">
					<div class="readme-header">
						<h2>{{ t(projectsList[selectedProject].title) }}</h2>
						<button @click="closeReadme" class="close-btn">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					</div>
					<div class="readme-content">
						<div v-if="loadingReadme" class="loading">
							<div class="spinner"></div>
							<p>Loading README...</p>
						</div>
						<div v-else-if="readmeError" class="error">
							<p>Could not load README for this project</p>
						</div>
						<div v-else class="markdown-content" v-html="renderedReadme"></div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<style scoped lang="scss">
.page {
	width: 100%;
	height: 100vh;
	max-width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: var(--bg-color);
	color: var(--text-color);
	padding: 80px 2vw 40px 2vw;
	box-sizing: border-box;
	overflow: hidden;

    @media (max-width: 768px) {
        padding: 60px 2vw 20px 2vw;
    }
}

.content-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	gap: 2rem;
	max-width: 1600px;
	margin: 0 auto;
	
	@media (max-width: 1024px) {
		gap: 1.5rem;
	}
	
	@media (max-width: 768px) {
		gap: 0;
	}
}

.portfolio-grid {
	flex: 1;
	display: grid;
	grid-template-columns: repeat(3, minmax(300px, 400px));
	justify-content: center;
	align-content: center;
	gap: 2rem;
	padding: 2rem;
	overflow-y: auto;
	transition: all 0.3s ease;
	
	&.with-readme {
		grid-template-columns: repeat(2, minmax(260px, 320px));
		gap: 1.5rem;
	}

    // Для планшетов
    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, minmax(200px, 280px));
        gap: 1.5rem;
        padding: 1.5rem;
        
        &.with-readme {
			grid-template-columns: repeat(2, minmax(180px, 240px));
		}
    }

    // Для мобильных
    @media (max-width: 768px) {
        grid-template-columns: repeat(2, minmax(140px, 1fr));
        gap: 1rem;
        padding: 1rem;
        
        &.with-readme {
			display: none; // Скрываем плитки когда открыт README на мобильных
		}
    }
    
    // Для очень маленьких экранов
    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 0.75rem;
    }

    .box {
        position: relative;
        border-radius: 1rem;
        display: flex;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        aspect-ratio: 16/10;
        
        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
        }
        
        &.selected {
        	box-shadow: 0 0 0 3px var(--accent-color, #4a9eff);
        	transform: scale(1.05);
        }
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: all 0.3s ease;
        }

        &:hover img {
            transform: scale(1.08);
        }
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem 1.5rem;
    
    @media (max-width: 768px) {
        padding: 1rem;
    }
    
    @media (max-width: 480px) {
        padding: 0.75rem;
    }
}

.actions {
	margin-top: 1rem;
	display: flex;
	gap: 0.5rem;
}

.github-link {
	background: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.3);
	color: white;
	padding: 0.5rem;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}
}

/* README Panel Styles */
.readme-panel {
	width: 55%;
	max-width: 900px;
	height: 90%;
	max-height: 90vh;
	background: var(--bg-color);
	border: 1px solid rgba(128, 128, 128, 0.2);
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
	overflow: hidden;
	margin-right: 50px;
	margin-left: 2rem;
	
	@media (max-width: 1400px) {
		width: 50%;
		margin-right: 30px;
	}
	
	@media (max-width: 1024px) {
		width: 55%;
		margin-right: 20px;
		margin-left: 1.5rem;
	}
	
	@media (max-width: 768px) {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100vh;
		max-height: 100vh;
		max-width: 100%;
		z-index: 1000;
		margin: 0;
		border-radius: 0;
		transform: none;
	}
}

.readme-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem 2rem;
	border-bottom: 1px solid rgba(128, 128, 128, 0.2);
	background: var(--bg-color);
	border-radius: 20px 20px 0 0;
	
	@media (max-width: 768px) {
		padding: 1rem;
		border-radius: 0;
		position: sticky;
		top: 0;
		z-index: 10;
	}
	
	h2 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--text-color);
		max-width: 85%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		
		@media (max-width: 768px) {
			font-size: 1.25rem;
		}
	}
}

.close-btn {
	background: none;
	border: none;
	color: var(--text-color);
	cursor: pointer;
	padding: 0.5rem;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	
	@media (max-width: 768px) {
		padding: 0.75rem;
		background: rgba(128, 128, 128, 0.1);
		border-radius: 50%;
		
		svg {
			width: 28px;
			height: 28px;
		}
	}
	
	&:hover {
		color: var(--accent-color, #4a9eff);
		transform: rotate(90deg);
	}
}

.readme-content {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 2rem;
	
	/* Custom scrollbar */
	&::-webkit-scrollbar {
		width: 8px;
	}
	
	&::-webkit-scrollbar-track {
		background: rgba(128, 128, 128, 0.1);
	}
	
	&::-webkit-scrollbar-thumb {
		background: rgba(128, 128, 128, 0.3);
		border-radius: 4px;
		
		&:hover {
			background: rgba(128, 128, 128, 0.5);
		}
	}
}

.loading, .error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 200px;
	color: var(--text-color);
	
	p {
		margin-top: 1rem;
		opacity: 0.7;
	}
}

.spinner {
	width: 40px;
	height: 40px;
	border: 3px solid rgba(128, 128, 128, 0.2);
	border-top-color: var(--accent-color, #4a9eff);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

/* Markdown content styles */
.markdown-content {
	color: var(--text-color);
	line-height: 1.6;
	
	h1, h2, h3, h4, h5, h6 {
		margin-top: 1.5em;
		margin-bottom: 0.5em;
	}
	
	h1 { font-size: 2em; }
	h2 { font-size: 1.5em; }
	h3 { font-size: 1.25em; }
	
	p {
		margin-bottom: 1em;
	}
	
	code {
		background: rgba(128, 128, 128, 0.1);
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', monospace;
	}
	
	pre {
		background: rgba(128, 128, 128, 0.1);
		padding: 1em;
		border-radius: 5px;
		overflow-x: auto;
		
		code {
			background: none;
			padding: 0;
		}
	}
	
	img {
		max-width: 100%;
		height: auto;
		border-radius: 5px;
		vertical-align: middle;
	}
	
	/* Блочные изображения в параграфах */
	p > img:only-child, 
	> img {
		display: block;
		margin: 1em auto;
	}
	
	/* Shields.io badges */
	img[src*="shields.io"], 
	img[src*="badge"] {
		display: inline-block;
		margin: 0 0.125rem;
		vertical-align: middle;
	}
	
	/* Выравнивание таблиц */
	:deep(table[align="center"]) {
		margin-left: auto !important;
		margin-right: auto !important;
	}
	
	:deep(table[align="right"]) {
		float: right;
		margin-left: 1.5em;
		margin-bottom: 1.5em;
		max-width: 50%;
	}
	
	:deep(table[align="left"]) {
		float: left;
		margin-right: 1.5em;
		margin-bottom: 1.5em;
		max-width: 50%;
	}
	
	/* Ограничение ширины для маленьких таблиц */
	:deep(table:not([align])) {
		width: fit-content;
		max-width: 100%;
	}
	
	/* Поддержка HTML выравнивания */
	:deep(div[align="center"]) {
		text-align: center;
		
		> img, > p > img {
			display: block;
			margin-left: auto;
			margin-right: auto;
		}
		
		> h1, > h2, > h3, > h4, > h5, > h6 {
			text-align: center;
		}
		
		/* Ссылки и badges остаются inline */
		a {
			display: inline-block;
			margin: 0 0.25rem;
			
			img {
				display: inline-block;
				vertical-align: middle;
				margin: 0;
			}
		}
	}
	
	:deep(div[align="right"]) {
		text-align: right;
		
		> img, > p > img {
			display: block;
			margin-left: auto;
		}
		
		a {
			display: inline-block;
			margin: 0 0.25rem;
		}
	}
	
	:deep(div[align="left"]) {
		text-align: left;
		
		> img, > p > img {
			display: block;
			margin-right: auto;
		}
		
		a {
			display: inline-block;
			margin: 0 0.25rem;
		}
	}
	
	center {
		text-align: center;
		display: block;
	}
	
	hr {
		border: none;
		border-top: 1px solid rgba(128, 128, 128, 0.3);
		margin: 2em 0;
	}
	
	details {
		margin: 1em 0;
		
		summary {
			cursor: pointer;
			font-weight: 600;
			padding: 0.5em;
			background: rgba(128, 128, 128, 0.05);
			border-radius: 4px;
			margin-bottom: 0.5em;
			
			&:hover {
				background: rgba(128, 128, 128, 0.1);
			}
		}
	}
	
	a {
		color: var(--accent-color, #4a9eff);
		text-decoration: none;
		
		&:hover {
			text-decoration: underline;
		}
	}
	
	ul, ol {
		margin-bottom: 1em;
		padding-left: 2em;
	}
	
	blockquote {
		border-left: 4px solid var(--accent-color, #4a9eff);
		padding-left: 1em;
		margin: 1em 0;
		opacity: 0.8;
	}
	
	:deep(table) {
		width: auto;
		max-width: 100%;
		border-collapse: collapse;
		margin: 1.5em auto;
		border: 1px solid rgba(128, 128, 128, 0.2);
		border-radius: 8px;
		overflow: hidden;
		display: table;
		
		th, td {
			border: 1px solid rgba(128, 128, 128, 0.2);
			padding: 0.75em 1em;
			text-align: left;
		}
		
		th {
			background: rgba(128, 128, 128, 0.1);
			font-weight: 600;
		}
		
		/* Стили для объединенных ячеек */
		td[colspan], 
		th[colspan],
		td[colspan="2"],
		td[colspan="3"],
		td[colspan="4"] {
			text-align: center !important;
		}
		
		/* Первая строка таблицы (общий заголовок) */
		tr:first-child td[colspan],
		tr:first-child th[colspan],
		tbody:first-child tr:first-child td[colspan],
		tbody:first-child tr:first-child th[colspan] {
			background: rgba(128, 128, 128, 0.2) !important;
			font-weight: 700 !important;
			font-size: 1.1em !important;
			text-align: center !important;
			border-bottom: 2px solid rgba(128, 128, 128, 0.3) !important;
		}
		
		/* Вторая строка с заголовками колонок */
		tr:nth-child(2) th {
			background: rgba(128, 128, 128, 0.12);
			border-top: 1px solid rgba(128, 128, 128, 0.2);
		}
		
		/* Полосатые строки */
		tbody tr:nth-child(even) {
			background: rgba(128, 128, 128, 0.03);
		}
		
		tbody tr:hover {
			background: rgba(128, 128, 128, 0.05);
		}
		
		/* Код в ячейках таблицы */
		code {
			background: rgba(128, 128, 128, 0.15);
			padding: 0.2em 0.4em;
			font-size: 0.9em;
		}
		
		/* Темная тема */
		@media (prefers-color-scheme: dark) {
			background-color: var(--bg-color);
			
			th {
				background: rgba(255, 255, 255, 0.05);
			}
			
			thead tr:first-child td,
			tbody tr:first-child td[colspan],
			tr:first-child td[colspan],
			tr:first-child th[colspan] {
				background: rgba(255, 255, 255, 0.08) !important;
				border-bottom-color: rgba(255, 255, 255, 0.2);
			}
			
			tr:nth-child(2) th {
				background: rgba(255, 255, 255, 0.06);
				border-top-color: rgba(255, 255, 255, 0.15);
			}
			
			tbody tr:nth-child(even) {
				background: rgba(255, 255, 255, 0.02);
			}
			
			tbody tr:hover {
				background: rgba(255, 255, 255, 0.04);
			}
		}
	}
	
	/* GitHub Callouts/Alerts */
	:deep(.github-callout) {
		margin: 1.5em 0;
		padding: 1em 1.2em;
		border-radius: 6px;
		border: 1px solid;
		clear: both; /* Очищаем обтекание */
		
		.callout-title {
			font-weight: 600;
			margin-bottom: 0.5em;
			display: flex;
			align-items: center;
			gap: 0.5em;
			font-size: 0.875em;
		}
		
		.callout-content {
			margin-top: 0.5em;
			opacity: 0.9;
			
			p:last-child {
				margin-bottom: 0;
			}
		}
		
		&.callout-note {
			background-color: #ddf4ff !important;
			border-color: #54aeff !important;
			color: #0550ae !important;
			
			.callout-title {
				color: #0550ae !important;
			}
		}
		
		&.callout-tip {
			background-color: #dafbe1 !important;
			border-color: #4ac26b !important;
			color: #1a7f37 !important;
			
			.callout-title {
				color: #1a7f37 !important;
			}
		}
		
		&.callout-important {
			background-color: #e7c8ff !important;
			border-color: #a475f9 !important;
			color: #6639ba !important;
			
			.callout-title {
				color: #6639ba !important;
			}
		}
		
		&.callout-warning {
			background-color: #fff8c5 !important;
			border-color: #f9d547 !important;
			color: #9a6700 !important;
			
			.callout-title {
				color: #9a6700 !important;
			}
		}
		
		&.callout-caution {
			background-color: #ffebe9 !important;
			border-color: #ff8182 !important;
			color: #cf222e !important;
			
			.callout-title {
				color: #cf222e !important;
			}
		}
		
	}
}

/* Slide animation for README panel */
.slide-enter-active,
.slide-leave-active {
	transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
	transform: translateX(100%);
	opacity: 0;
}

.slide-leave-to {
	transform: translateX(100%);
	opacity: 0;
}

/* Основная анимация оверлея */
.fade-enter-active {
    transition: opacity 0.4s ease;
}
.fade-leave-active {
    transition: opacity 0.4s ease 0.2s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Анимация элементов контента */
.list-enter-active {
    transition: all 0.3s ease;
    transition-delay: 0.2s;
}
.list-leave-active {
    transition: all 0.2s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.title {
    color: var(--button-text-color);
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
    
    @media (max-width: 1024px) {
        font-size: 1.25rem;
    }
    
    @media (max-width: 768px) {
        font-size: 1.1rem;
    }
}

.description {
    color: var(--button-text-color);
    font-size: 1rem;
    line-height: 1.4;
    margin: 0 0 0.75rem;
    opacity: 0.9;
    
    @media (max-width: 1024px) {
        font-size: 0.95rem;
    }
    
    @media (max-width: 768px) {
        font-size: 0.85rem;
        line-height: 1.3;
    }
}
</style>