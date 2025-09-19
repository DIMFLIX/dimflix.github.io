<script setup>
import { useI18n } from 'vue-i18n';
import DiamondLine from "@/components/DiamondLine.vue";
import { ref, onMounted, onBeforeUnmount } from 'vue';

import { VueMarqueeSlider } from 'vue3-marquee-slider';
import Image from 'primevue/image';
import MultiPageImage from '@/components/primevue/MultiPageImage.vue';
import '@/../node_modules/vue3-marquee-slider/dist/style.css'

import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

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
import ReviewsSection from '@/components/ReviewsSection.vue'
import LeaveReviewForm from '@/components/LeaveReviewForm.vue'

const { t, locale } = useI18n();
const screenSize = ref(0);
const reviewsBoxRef = ref(null);

const updateReviewsTitleMetrics = () => {
    const box = reviewsBoxRef.value;
    if (!box) return;
    const titleEl = box.querySelector('.box-title');
    if (titleEl) {
        const width = titleEl.offsetWidth;
        const left = titleEl.offsetLeft;
        box.style.setProperty('--box-title-width', width + 'px');
        box.style.setProperty('--box-title-left', left + 'px');
    }
};

// Вычисление лет опыта от 13 мая 2021 года
const calculateExperience = () => {
	const startDate = new Date(2021, 4, 13); // 13 мая 2021 (месяц начинается с 0)
	const currentDate = new Date();
	const diffTime = Math.abs(currentDate - startDate);
	const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
	return diffYears;
};

const experienceYears = ref(calculateExperience());

// Функция для правильного склонения в русском языке
const getExperienceLabel = () => {
	if (locale.value === 'ru') {
		const years = experienceYears.value;
		const lastDigit = years % 10;
		const lastTwoDigits = years % 100;
		
		if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
			return `Лет<br>Опыта`;
		} else if (lastDigit === 1) {
			return `Год<br>Опыта`;
		} else if (lastDigit >= 2 && lastDigit <= 4) {
			return `Года<br>Опыта`;
		} else {
			return `Лет<br>Опыта`;
		}
	} else {
		return t('about.aboutme.stats.experiance');
	}
};


const config = ref({
  itemsToShow: 3.95,
  wrapAround: true,
  transition: 500,
  gap: 100,
});

// Отдельная конфигурация для патентов - всегда показывает 1 элемент
const patentsConfig = ref({
  itemsToShow: 1,
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

const patentsList = ref([
	{
		title: "Свидетельство о государственной регистрации программы для ЭВМ",
		pages: [
			require("@/assets/patents/patent-prevm-page1.png"),
			require("@/assets/patents/patent-prevm-page2.png")
		]
	},
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
    updateReviewsTitleMetrics();
    window.addEventListener('resize', updateScreenSize);
    window.addEventListener('resize', updateReviewsTitleMetrics);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScreenSize);
    window.removeEventListener('resize', updateReviewsTitleMetrics);
});
</script>

<template>
	<div class="page">
		<div class="box">
			<div class="box-title"><p v-html="t('about.aboutme.title')"></p></div>
			<div class="img-and-text">
				<img class="photo" src="@/assets/my-photo1.jpg">
				<div class="text">
					<h4 v-html="t('about.aboutme.hello')"></h4>
					<h2 v-html="t('about.aboutme.name')"></h2>
					<p v-html="t('about.aboutme.description')"></p>
				</div>
			</div>
			<DiamondLine />
			<div class="stats">
				<div class="stat">
					<p class="count">{{ experienceYears.toString().padStart(2, '0') }}</p>
					<p class="label" v-html="getExperienceLabel()"></p>
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
		<!-- Reviews box inserted here -->
		<div class="box" ref="reviewsBoxRef">
			<div class="box-title"><p v-html="t('reviews.title')"></p></div>
			<ReviewsSection />
		</div>
		<div class="box reviews-form-box">
			<LeaveReviewForm />
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
		<div class="box box-imgs" v-if="patentsList.length > 0">
			<div class="box-title">
				<p v-html="t('about.patents.title')"></p>
			</div>
			<Carousel v-bind="patentsConfig">
				<Slide v-for="patent in patentsList" :key="patent.title">
					<MultiPageImage 
						:pages="patent.pages" 
						:title="patent.title" 
						preview
						class="image"
					/>
				</Slide>
				<template #addons>
					<Navigation />
					<Pagination />
				</template>
			</Carousel>
		</div>
		<div class="box box-imgs">
			<div class="box-title"><p v-html="t('about.awards.title')"></p></div>
			<Carousel v-bind="config">
				<Slide v-for="award in awardsList">
					<Image class="image" :src="award.src" :alt="award.title" preview />
				</Slide>
				<template #addons>
					<Navigation />
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
					<Navigation />
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
	gap: 2vw;

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5vw;

		.count {
			font-family: "Rubik Doodle Shadow", sans-serif;
			font-size: 4.5vw;
			margin: 0;
			line-height: 1;
		}

		.label {
			font-family: 'Aldrich', sans-serif;
			font-size: 1.1vw;
			margin: 0;
			text-align: center;
			line-height: 1.3;
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

/* Стили для навигации каруселей */
:global(.carousel__prev),
:global(.carousel__next) {
  background-color: var(--sbg2-color) !important;
  color: var(--text-color) !important;
  border-radius: 50%;
  width: 35px !important;
  height: 35px !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  opacity: 0.8;
  transition: all 0.3s ease;
}

:global(.carousel__prev:hover),
:global(.carousel__next:hover) {
  opacity: 1;
  background-color: var(--primary-color) !important;
}

:global(.carousel__icon) {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* Навигация на мобильных устройствах */
@media screen and (max-width: 768px) {
  :global(.carousel__prev),
  :global(.carousel__next) {
    width: 30px !important;
    height: 30px !important;
  }
  
  :global(.carousel__icon) {
    width: 16px;
    height: 16px;
  }
}


/* Медиа-запросы для мобильных устройств */
@media screen and (max-width: 768px) {
	.page {
		gap: 50px;
		padding: 80px 3vw 30px 3vw;
	}

	.box {
		padding: 50px 15px 15px 15px;
		gap: 20px;

		.box-title {
			top: -20px;
			left: 20px;
			padding: 8px 20px;
			border-radius: 8px;
			height: auto;
			min-height: 40px;

			p {
				font-size: 18px;
			}
		}
	}

	.box-imgs {
		gap: 20px !important;
	}

	/* Адаптация блока About Me */
	.img-and-text {
		flex-direction: column;
		gap: 20px;
		align-items: center;

		.photo {
			width: 100%;
			max-width: 300px;
			height: auto;
			max-height: 350px;
			object-fit: cover;
			border-radius: 15px;
		}

		.text {
			width: 100%;
			color: var(--text-color);
			font-size: 15px;
			line-height: 1.6;

			h4 {
				font-size: 18px;
				margin-bottom: 5px;
			}

			h2 {
				font-size: 26px;
				margin-top: 10px;
				margin-bottom: 15px;
			}

			p {
				font-size: 15px;
				margin: 10px 0;
				line-height: 1.7;
			}
		}
	}

	/* Адаптация блока статистики */
	.stats {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		gap: 15px;

		.stat {
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 5px;
			min-width: 90px;

			.count {
				font-size: 42px;
			}

			.label {
				font-size: 12px;
				text-align: center;
				max-width: 100px;
			}
		}
	}

	/* Адаптация иконок тех. стека */
	#carousel1, #carousel2 {
		svg {
			width: 60px !important;
			height: 60px !important;
		}
	}
}

/* Дополнительные стили для очень маленьких экранов */
@media screen and (max-width: 480px) {
	.page {
		gap: 30px;
		padding: 70px 2vw 20px 2vw;
	}

	.box {
		padding: 45px 10px 10px 10px;

		.box-title {
			left: 15px;
			
			p {
				font-size: 16px;
			}
		}
	}

	.img-and-text {
		.photo {
			max-width: 250px;
			max-height: 300px;
		}

		.text {
			h4 {
				font-size: 16px;
			}

			h2 {
				font-size: 22px;
			}

			p {
				font-size: 14px;
			}
		}
	}

	.stats {
		.stat {
			.count {
				font-size: 36px;
			}

			.label {
				font-size: 11px;
				max-width: 80px;
			}
		}
	}

	/* Адаптация иконок тех. стека для маленьких экранов */
	#carousel1, #carousel2 {
		svg {
			width: 50px !important;
			height: 50px !important;
		}
	}
}

/* Медиа-запросы для планшетов */
@media screen and (min-width: 769px) and (max-width: 1024px) {
	.page {
		gap: 70px;
		padding: 90px 4vw 40px 4vw;
	}

	.box {
		.box-title {
			top: -15px;
			left: 30px;
			padding: 10px 15px;
			height: auto;
			min-height: 35px;

			p {
				font-size: 20px;
			}
		}
	}

	.img-and-text {
		.photo {
			max-height: 350px;
		}

		h4 {
			font-size: 18px;
		}

		h2 {
			font-size: 28px;
		}

		.text {
			font-size: 16px;

			p {
				font-size: 16px;
			}
		}
	}

	.stats {
		.stat {
			.count {
				font-size: 60px;
			}

			.label {
				font-size: 14px;
			}
		}
	}

	/* Адаптация иконок тех. стека для планшетов */
	#carousel1, #carousel2 {
		svg {
			width: 70px !important;
			height: 70px !important;
		}
	}
}

.reviews-form-box {
	margin-top: -80px; /* pull form closer to reviews */
	padding: 20px;
}

@media screen and (max-width: 1024px) {
	.reviews-form-box { margin-top: -40px; }
}

@media screen and (max-width: 768px) {
	.reviews-form-box { margin-top: -30px; }
}

@media screen and (max-width: 489px) {
	.reviews-form-box { margin-top: -10px; }
}

</style>
