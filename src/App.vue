<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SunIcon from '@/components/icons/SunIcon.vue';
import MoonIcon from '@/components/icons/MoonIcon.vue';
import HomeIcon from './components/icons/HomeIcon.vue';
import TranslateIcon from '@/components/icons/TranslateIcon.vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const isDarkTheme = ref(false);
const isMenuOpen = ref(false);
const { t, locale } = useI18n();

const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};

const changeLanguage = () => {
	let new_lang = "en"

	if (locale.value === 'en') {
		new_lang = 'ru';		
	} 

	locale.value = new_lang;
	localStorage.setItem('lang', new_lang);
};

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  localStorage.setItem('isDarkTheme', isDarkTheme.value);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('isDarkTheme');
  if (savedTheme !== null) {
    isDarkTheme.value = JSON.parse(savedTheme);
  }

  const savedLang = localStorage.getItem('lang');
  if (savedLang !== null && ['ru','en'].includes(savedLang)) {
    locale.value = savedLang;
  }
});
</script>

<template>
	<div :class="{ 'dark-theme': isDarkTheme }">
		<!-- Капсула для десктопа -->
		<div class="floating-pill desktop-only">
			<button class="pill-btn" @click="router.push('/')" title="Home">
				<HomeIcon class="icon"/>
			</button>
			<button class="pill-btn" @click="changeLanguage" title="Language">
				<TranslateIcon class="icon"/>
				<span class="lang-badge">{{ locale.toUpperCase() }}</span>
			</button>
			<button class="pill-btn" @click="toggleTheme" :title="isDarkTheme ? 'Light Mode' : 'Dark Mode'">
				<MoonIcon class="icon" v-if="isDarkTheme"/>
				<SunIcon class="icon" v-else/>
			</button>
		</div>

		<!-- FAB меню для мобильных -->
		<div class="fab-menu mobile-only">
			<!-- Основная FAB кнопка -->
			<button :class="['fab-button', { 'active': isMenuOpen }]" @click="toggleMenu">
				<svg class="dots-icon" viewBox="0 0 24 24" width="24" height="24">
					<circle cx="12" cy="4" r="2"/>
					<circle cx="12" cy="12" r="2"/>
					<circle cx="12" cy="20" r="2"/>
				</svg>
				<svg class="close-icon" viewBox="0 0 24 24" width="24" height="24">
					<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>

			<!-- Выдвижные кнопки меню -->
			<div :class="['menu-items', { 'open': isMenuOpen }]">
				<button class="menu-btn" @click="router.push('/')" title="Home">
					<HomeIcon class="icon"/>
				</button>
				<button class="menu-btn" @click="changeLanguage" title="Language">
					<TranslateIcon class="icon"/>
					<span class="lang-badge">{{ locale.toUpperCase() }}</span>
				</button>
				<button class="menu-btn" @click="toggleTheme" :title="isDarkTheme ? 'Light Mode' : 'Dark Mode'">
					<MoonIcon class="icon" v-if="isDarkTheme"/>
					<SunIcon class="icon" v-else/>
				</button>
			</div>
		</div>
		
		<router-view />
	</div>
</template>

<style lang="scss">
#app {
	background-color: var(--bg-color);
	margin: 0;
	padding: 0;
	width: 100%;
	min-height: 100vh;
}

body {
	background-color: var(--bg-color);
	margin: 0;
	padding: 0;
	width: 100%;
	overflow-x: hidden;
}

// Показываем/скрываем элементы в зависимости от размера экрана
.desktop-only {
	display: flex;
	@media (max-width: 768px) {
		display: none !important;
	}
}

.mobile-only {
	display: none !important;
	@media (max-width: 768px) {
		display: flex !important;
	}
}

// Стили для капсулы (десктоп)
.floating-pill {
	position: fixed;
	bottom: -30px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 12px 20px;
	background: rgba(255, 255, 255, 0.7);
	backdrop-filter: blur(20px) saturate(180%);
	-webkit-backdrop-filter: blur(20px) saturate(180%);
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 50px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 999;

	.dark-theme & {
		background: rgba(30, 30, 30, 0.6);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	&:hover {
		bottom: 20px;
		box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
		background: rgba(255, 255, 255, 0.85);

		.dark-theme & {
			background: rgba(40, 40, 40, 0.7);
			box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
		}
	}

	.pill-btn {
		position: relative;
		width: 44px;
		height: 44px;
		border: none;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		outline: none;

		.dark-theme & {
			background: rgba(255, 255, 255, 0.05);
		}

		&:hover {
			background: rgba(255, 255, 255, 0.2);
			transform: scale(1.1);

			.dark-theme & {
				background: rgba(255, 255, 255, 0.1);
			}
		}

		&:active {
			transform: scale(0.95);
		}

		.icon {
			width: 20px;
			height: 20px;
			fill: var(--text-color);
			stroke: none;
			opacity: 1;
		}

		.lang-badge {
			position: absolute;
			top: -4px;
			right: -4px;
			font-size: 9px;
			font-weight: bold;
			color: var(--text-color);
			background: rgba(255, 255, 255, 0.2);
			padding: 2px 4px;
			border-radius: 8px;
			backdrop-filter: blur(10px);
			border: 1px solid rgba(255, 255, 255, 0.3);

			.dark-theme & {
				background: rgba(0, 0, 0, 0.3);
				border: 1px solid rgba(255, 255, 255, 0.2);
			}
		}
	}
}

// Стили для FAB меню (мобильные)
.fab-menu {
	position: fixed;
	bottom: 24px;
	right: 24px;
	z-index: 999;
	align-items: center;
	gap: 12px;
	flex-direction: row-reverse;

	.fab-button {
		width: 56px;
		height: 56px;
		min-width: 56px;
		min-height: 56px;
		max-width: 56px;
		max-height: 56px;
		border-radius: 50%;
		border: none;
		padding: 0;
		// Черная кнопка в светлой теме
		background: var(--button-color);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
		position: relative;
		overflow: hidden;
		flex-shrink: 0;

		// sbg для темной темы
		.dark-theme & {
			background: var(--sbg1-color);
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
		}

		&:hover {
			transform: scale(1.05);
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2), 0 3px 10px rgba(0, 0, 0, 0.15);
		}

		&:active {
			transform: scale(0.95);
		}

		&.active {
			transform: rotate(90deg);
			// Сохраняем тот же цвет при активном состоянии
			background: var(--button-color);

			.dark-theme & {
				background: var(--sbg1-color);
			}

			.dots-icon {
				opacity: 0;
				transform: scale(0.5);
			}

			.close-icon {
				opacity: 1;
				transform: scale(1) rotate(-90deg);
			}
		}

		.dots-icon, .close-icon {
			position: absolute;
			transition: all 0.3s ease;
		}

		.dots-icon {
			// Белые точки на черном фоне в светлой теме
			fill: white;
			opacity: 1;

			.dark-theme & {
				fill: var(--text-color);
			}
		}

		.close-icon {
			stroke: white;
			fill: none;
			opacity: 0;
			transform: scale(0.5) rotate(90deg);
			
			.dark-theme & {
				stroke: var(--text-color);
			}
		}
	}

	.menu-items {
		display: flex;
		gap: 8px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
		opacity: 0;

		&.open {
			pointer-events: auto;
			opacity: 1;

			.menu-btn {
				transform: translateX(0) scale(1);
				opacity: 1;

				&:nth-child(1) { transition-delay: 0.05s; }
				&:nth-child(2) { transition-delay: 0.1s; }
				&:nth-child(3) { transition-delay: 0.15s; }
			}
		}

			.menu-btn {
				position: relative;
				width: 48px;
				height: 48px;
				border-radius: 50%;
				border: none;
				// Черные кнопки меню в светлой теме
				background: var(--button-color);
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				outline: none;
				transform: translateX(20px) scale(0.8);
				opacity: 0;

				.dark-theme & {
					background: var(--sbg1-color);
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
				}

			&:hover {
				transform: translateX(0) scale(1.1);
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			}

			&:active {
				transform: translateX(0) scale(0.95);
			}

				.icon {
					width: 20px;
					height: 20px;
					// Белые иконки на черном фоне
					fill: white;
					stroke: none;

					.dark-theme & {
						fill: var(--text-color);
					}
				}

				.lang-badge {
					position: absolute;
					top: -2px;
					right: -2px;
					font-size: 8px;
					font-weight: bold;
					// Темный текст на светлом фоне для светлой темы
					color: var(--button-color);
					background: white;
					border: 1px solid rgba(0, 0, 0, 0.1);
					padding: 2px 4px;
					border-radius: 6px;
					line-height: 1;

					.dark-theme & {
						color: var(--text-color);
						background: var(--sbg2-color);
						border: 1px solid rgba(255, 255, 255, 0.1);
					}
				}
		}
	}

	// Мобильная адаптация
	@media (max-width: 768px) {
		bottom: 16px;
		right: 16px;
		gap: 8px;

		.fab-button {
			// Фиксируем размер для обеих тем
			width: 48px !important;
			height: 48px !important;
			min-width: 48px;
			min-height: 48px;
			max-width: 48px;
			max-height: 48px;
		}

		.menu-items .menu-btn {
			width: 40px;
			height: 40px;

			.icon {
				width: 18px;
				height: 18px;
			}
		}
	}
}

// Убираем отступы для мобильных устройств
@media (max-width: 768px) {
  body {
    padding: 0;
    margin: 0;
  }
  
  #app {
    padding: 0;
    margin: 0;
  }
}
</style>
