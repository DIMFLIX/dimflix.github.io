<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';
import SunIcon from '@/components/icons/SunIcon.vue';
import MoonIcon from '@/components/icons/MoonIcon.vue';
import HomeIcon from './components/icons/HomeIcon.vue';
import TranslateIcon from '@/components/icons/TranslateIcon.vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const isDarkTheme = ref(false);
const isSettingsMenuOpen = ref(false);
const { t, locale } = useI18n();

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

const openSettingsMenu = () => {
	isSettingsMenuOpen.value = !isSettingsMenuOpen.value;
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
		<div :class="['settings-menu', { 'open-settings-menu': isSettingsMenuOpen }]">
			<ChevronIcon :class="['icon', { 'open': isSettingsMenuOpen }]" @click="openSettingsMenu"/>

			<div class="settings-btns">
				<button class="btn" @click="toggleTheme">
					<MoonIcon class="icon" v-if="isDarkTheme"/>
					<SunIcon class="icon" v-else/>
				</button>
				<button class="btn">
					<TranslateIcon class="icon" @click="changeLanguage"/>
				</button>
				<button class="btn">
					<HomeIcon class="icon" @click="router.push('/')"/>
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
}

body {
	background-color: var(--bg-color);
	margin: 0;
}

.settings-menu {
	position: absolute;
	width: 60px;
	max-height: 40px;
	background-color: var(--sbg1-color);
	border-radius: 0 0 10px 10px;
	margin-left: 20px;
	overflow: hidden;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	z-index: 999;
	
	&.open-settings-menu {
		min-height: none;
		max-height: 500px;
		padding-bottom: 5px;
	}

	.icon {
		min-width: 30px;
		min-height: 30px;
		max-width: 30px;
		max-height: 30px;
		margin: 5px 0;
		stroke: var(--text-color);
		cursor: pointer;

		&.open {
			transform: rotate(360deg);
		}
	}

	.settings-btns {
		display: flex;
		flex-direction: column;
		gap: 5px;

		.btn {
			width: 50px;
			height: 50px;
			background-color: var(--sbg2-color);
			border: none;
			outline: none;
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			.icon {
				fill: var(--text-color);
				stroke: none;
				width: 20px;
				height: 20px;
			}
		}
	}
	
}
</style>
