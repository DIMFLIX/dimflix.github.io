<script setup>
import { useI18n } from 'vue-i18n';
import DiamondLine from "@/components/DiamondLine.vue";
import { ref, onMounted, onBeforeUnmount } from 'vue';

import { VueMarqueeSlider } from 'vue3-marquee-slider';
import Image from 'primevue/image';
import MultiPageImage from '@/components/primevue/MultiPageImage.vue';
import '@/../node_modules/vue3-marquee-slider/dist/style.css'

import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination } from 'vue3-carousel';

import Capacitor from '@/components/icons/tech-stack/Capacitor.vue';
import Css from '@/components/icons/tech-stack/Css.vue';
import Django from '@/components/icons/tech-stack/Django.vue';
import Docker from '@/components/icons/tech-stack/Docker.vue';
import FastAPI from '@/components/icons/tech-stack/FastAPI.vue';
import Html from '@/components/icons/tech-stack/Html.vue';
import Ionic from '@/components/icons/tech-stack/Ionic.vue';
import Java from '@/components/icons/tech-stack/Java.vue';
import Js from '@/components/icons/tech-stack/Js.vue';
import MongoDB from '@/components/icons/tech-stack/MongoDB.vue';
import MySQL from '@/components/icons/tech-stack/MySQL.vue';
import Nginx from '@/components/icons/tech-stack/Nginx.vue';
import Postgresql from '@/components/icons/tech-stack/Postgresql.vue';
import Python from '@/components/icons/tech-stack/Python.vue';
import Qt from '@/components/icons/tech-stack/Qt.vue';
import Rust from '@/components/icons/tech-stack/Rust.vue';
import Ts from '@/components/icons/tech-stack/Ts.vue';
import Vue from '@/components/icons/tech-stack/Vue.vue';
import Aiogram from '@/components/icons/tech-stack/Aiogram.vue';
import Pyrogram from '@/components/icons/tech-stack/Pyrogram.vue';
import Tauri from '@/components/icons/tech-stack/Tauri.vue';
import Selenium from '@/components/icons/tech-stack/Selenium.vue';
import Aiohttp from '@/components/icons/tech-stack/Aiohttp.vue';
import Ngrok from '@/components/icons/tech-stack/Ngrok.vue';
import Flask from '@/components/icons/tech-stack/Flask.vue';

const { t, locale } = useI18n();
const screenSize = ref(0);


const config = ref({
  itemsToShow: 3.95,
  wrapAround: true,
  transition: 500,
  gap: 100,
});

const awardsList = ref([
	{src: require("@/assets/awards/it-planet-ai-спорттех-финал.png"), alt: ""},
	{src: require("@/assets/awards/Международный-ВШЭ-Дроны.jpg"), alt: ""},
	{src: require("@/assets/awards/Международный-ВШЭ.png"), alt: ""},
	{src: require("@/assets/awards/Диплом-Минина.png"), alt: ""},
	{src: require("@/assets/awards/IT-Чкалов.png"), alt: ""}
])

// Для патентов создаем специальную структуру с обеими страницами
const patentImages = ref([
	require("@/assets/patents/patent-prevm-page1.png"),
	require("@/assets/patents/patent-prevm-page2.png")
]);

const certificatesList = ref([
	{src: require("@/assets/significant-certificates/it-planet ai-спорттех.png"), title: ""},
	{src: require("@/assets/significant-certificates/it-planet postgresql.png"), title: ""},
	{src: require("@/assets/significant-certificates/SberGarage.png"), title: ""},
	{src: require("@/assets/significant-certificates/Атомик-Хак.png"), title: ""},
	{src: require("@/assets/significant-certificates/всероссийский.png"), title: ""},
	{src: require("@/assets/significant-certificates/москва.png"), title: ""},
	{src: require("@/assets/significant-certificates/окружной.png"), title: ""},
	{src: require("@/assets/significant-certificates/пфо-цп.png"), title: ""},
	{src: require("@/assets/significant-certificates/Сертификат-Минина.png"), title: ""},
	{src: require("@/assets/significant-certificates/хабаровск.png"), title: ""},
	{src: require("@/assets/significant-certificates/цп-омск.png"), title: ""},
	//////
	{src: require("@/assets/certificates/Comparison-ResumeVacancy.png"), title: ""},
	{src: require("@/assets/certificates/HR-T1.png"), title: ""},
	{src: require("@/assets/certificates/ProjectSystemINNOHack.png"), title: ""},
	{src: require("@/assets/certificates/траектория-будущего-devops.png"), title: ""},
	{src: require("@/assets/certificates/траектория-будущего-python.png"), title: ""},
	{src: require("@/assets/certificates/траектория-будущего-графический-дизайн.png"), title: ""},
	{src: require("@/assets/certificates/траектория-будущего-кибербезопасность.png"), title: ""},
	{src: require("@/assets/certificates/траектория-будущего-мобильная-разработка.png"), title: ""},
	{src: require("@/assets/certificates/траектория-будущего-нейросетевое-искусство.png"), title: ""},
	{src: require("@/assets/certificates/траектория-будущего-финансовая-грамотность.png"), title: ""},
	{src: require("@/assets/certificates/цифровизация-во-благо.png"), title: ""},
])

const vwToPx = (vw) => {
    const viewportWidth = window.innerWidth; // Получаем ширину окна
    return (vw / 100) * viewportWidth; // Рассчитываем значение в пикселях
};

const calculatePx = (vwValue) => {
	let result = vwToPx(vwValue).toFixed(2)
	console.log(result)
    return result;
};

const updateScreenSize = () => {
	screenSize.value = window.innerWidth

	if (screenSize.value <= 600) {
		config.value.itemsToShow = 1;
		config.value.gap = 30;
	} else if (screenSize.value <= 900) {
		config.value.itemsToShow = 2;
		config.value.gap = 30;
	} else if (screenSize.value <= 1100) {
		config.value.itemsToShow = 3;
        config.value.gap = 50;
	} else {
		config.value.itemsToShow = 4;
		config.value.gap = 100;
	}
};

onMounted(() => {
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScreenSize);
});
</script>

<template>
	<div class="page">
		<div class="box">
			<div class="box-title"><p v-html="t('about.aboutme.title')"></p></div>
			<div class="img-and-text">
				<img class="photo" src="@/assets/my-photo.jpg">
				<div class="text">
					<h4 v-html="t('about.aboutme.hello')"></h4>
					<h2 v-html="t('about.aboutme.name')"></h2>
					<p v-html="t('about.aboutme.description')"></p>
				</div>
			</div>
			<DiamondLine />
			<div class="stats">
				<div class="stat">
					<p class="count">03</p>
					<p class="label" v-html="t('about.aboutme.stats.experiance')"></p>
				</div>
				<div class="stat">
					<p class="count">50+</p>
					<p class="label" v-html="t('about.aboutme.stats.projects')"></p>
				</div>
				<div class="stat">
					<p class="count">05</p>
					<p class="label" v-html="t('about.aboutme.stats.hackathons')"></p>
				</div>
			</div>
		</div>
		<div class="box">
			<div class="box-title"><p v-html="t('about.techStack.title')"></p></div>
			<vue-marquee-slider id="carousel1" :speed="15000" :space="80">
				<Python/>
				<Java/>
				<Rust/>
				<Html/>
				<Css/>
				<Js/>
				<Ts/>
				<Vue/>
				<Postgresql/>
				<Qt/>
				<Tauri/>
				<Aiogram/>
				<Pyrogram/>
			</vue-marquee-slider>
			<vue-marquee-slider id="carousel2" :speed="15000":space="80" reverse>
				<FastAPI/>
				<Django/>
				<Flask/>
				<Aiohttp/>
				<Selenium/>
				<Ionic/>
				<Capacitor/>
				<MongoDB/>
				<MySQL/>
				<Docker/>
				<Nginx/>
				<Ngrok/>
			</vue-marquee-slider>
		</div>
		<div class="box box-imgs" v-if="patentImages.length > 0">
			<div class="box-title">
				<p v-html="t('about.patents.title')"></p>
			</div>
			<div class="patent-container">
				<MultiPageImage 
					:pages="patentImages" 
					:title="'Свидетельство о государственной регистрации программы для ЭВМ'" 
					preview
					class="image"
				/>
			</div>
		</div>
		<div class="box box-imgs">
			<div class="box-title"><p v-html="t('about.awards.title')"></p></div>
			<Carousel v-bind="config">
				<Slide v-for="award in awardsList">
					<Image class="image" :src="award.src" :alt="award.title" preview />
				</Slide>
				<template #addons>
					<Pagination />
				</template>
			</Carousel>
		</div>
		<div class="box box-imgs">
			<div class="box-title">
				<p v-html="t('about.certificates.title')"></p>
			</div>
			<Carousel v-bind="config">
				<Slide v-for="certificate in certificatesList">
					<Image class="image" :src="certificate.src" :alt="certificate.title" preview />
				</Slide>

				<template #addons>
					<Pagination />
				</template>
			</Carousel>
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
	gap: 100px;
	padding: 100px 5vw 50px 5vw;
	box-sizing: border-box;
	overflow: scroll;
}

.box {
	width: 100%;
	max-width: 1050px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	background-color: var(--sbg1-color);
	border-radius: 15px;
	position: relative;
	padding: 40px 20px 20px 20px;
	gap: 30px;

	.box-title {
		position: absolute;
		top: -1.5vw;
		left: 2vw;
		text-align: center;
		padding: 1vw 1vw;
		border-radius: .6vw;
		background-color: var(--sbg2-color);
		height: 3vw;
		display: flex;
		align-items: center;
		justify-content: center;

		p {
			font-family: "Rubik Doodle Shadow", sans-serif;
			font-size: 1.4vw;
			margin: 0;
			padding: 0;
			color: var(--text-color);
		}
	}
}

.box-imgs {
	gap: 3vw !important;
}

.img-and-text {
	max-width: 100%;
	max-height: 100%;
	display: flex;
	gap: 30px;
	box-sizing: border-box;
	align-items: center;

	.photo {
		max-height: 30vw;
		height: auto;
		border-radius: 15px;
		object-fit: cover;
	}

	h4 {
		margin-bottom: 0;
	}

	h2 {
		margin-top: 15px;
	}

	.text {
		color: var(--text-color);
		font-family: 'Aldrich', sans-serif;
		font-size: 1.1vw;
	}
}

.stats {
	display: flex;
	align-items: center;
	justify-content: space-around;
	box-sizing: border-box;
	gap: .3vw;

	.stat {
		display: flex;
		align-items: center;
		gap: 10px;

		.count {
			font-family: "Rubik Doodle Shadow", sans-serif;
			font-size: 5.3vw;
			margin: 0;
		}

		.label {
			font-family: 'Aldrich', sans-serif;
			font-size: 1vw;
			margin: 0;
		}
	}
}

// Стили для блока патентов
.patent-container {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	
	.patent-image {
		width: auto;
		max-width: 100%;
		height: auto;
	}
}


/* Подстройка цветов preview под тему сайта */
:global(.p-image-preview-container) {
  background: rgba(0,0,0,0.9) !important;
}
:global(.p-image-toolbar) {
  background: var(--sbg1-color) !important;
}
:global(.p-image-toolbar button) {
  color: var(--text-color) !important;
}


</style>
