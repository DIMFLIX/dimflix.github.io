<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, onMounted, onUnmounted } from 'vue';

import RocketIcon from "@/components/icons/RocketIcon.vue";
import StarsIcon from "@/components/icons/StarsIcon.vue";
import AboutMeIcon from "@/components/icons/AboutMeIcon.vue";
import PortfolioIcon from "@/components/icons/PortfolioIcon.vue";
import ArticlesIcon from "@/components/icons/ArticlesIcon.vue";
import YoutubeIcon from "@/components/icons/YoutubeIcon.vue";
import VkIcon from "@/components/icons/VkIcon.vue";
import TelegramIcon from "@/components/icons/TelegramIcon.vue";
import GithubIcon from "@/components/icons/GithubIcon.vue";
import ResumeIcon from "@/components/icons/ResumeIcon.vue";

import DiamondLine from "@/components/DiamondLine.vue";
import NavBtn from "@/components/NavBtn.vue";
import SocialMediaBtn from "@/components/SocialMediaBtn.vue";

const { t, locale } = useI18n();

const photos = [
	require('@/assets/my-photo.jpg'),
	require('@/assets/my-photo2.jpg'),
	require('@/assets/my-photo3.jpg'),
	require('@/assets/my-photo4.jpg')
];

const currentPhotoIndex = ref(0);
const isChanging = ref(false);
let photoInterval: number | null = null;

const changePhoto = () => {
	isChanging.value = true;

	setTimeout(() => {
		currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.length;
		isChanging.value = false;
	}, 500);
};

const startInterval = () => {
	photoInterval = setInterval(changePhoto, 3000);
};

const resetInterval = () => {
	if (photoInterval) {
		clearInterval(photoInterval);
		startInterval();
	}
};

const goToPhoto = (index: number) => {
	currentPhotoIndex.value = index;
	resetInterval();
};

onMounted(() => {
	startInterval();
});

onUnmounted(() => {
	if (photoInterval) {
		clearInterval(photoInterval);
	}
});
</script>

<template>
	<div class="home-page">
		<div class="left-side">
			<div class="title">
				<RocketIcon class="icon" />
				<h1 class="text" v-html="$t('home.title')"></h1>
			</div>
			<p class="description" v-html="$t('home.description')"></p>
			<div class="highlight bm20">
				<StarsIcon />
				<p class="text" v-html="$t('home.highlighted_text')"></p>
			</div>
			<DiamondLine class="bm30" />
			<NavBtn :title="t('home.nav.about_me.title')" :IconComponent="AboutMeIcon"
				:description="t('home.nav.about_me.description')" url="/about" class="bm20" />
			<NavBtn :title="t('home.nav.portfolio.title')" :IconComponent="PortfolioIcon"
				:description="t('home.nav.portfolio.description')" url="/portfolio" class="bm20" />
			<NavBtn :title="t('home.nav.articles.title')" :IconComponent="ArticlesIcon"
				:description="t('home.nav.articles.description')" url="/articles" class="bm30" />
			<DiamondLine class="bm30" />
			<div class="social-media">
				<SocialMediaBtn :IconComponent="YoutubeIcon" url="https://www.youtube.com/dimflix"
					color="var(--maroon-color)" />
				<SocialMediaBtn :IconComponent="VkIcon" url="https://vk.ru/dimflix_official"
					color="var(--blue-color)" />
				<SocialMediaBtn :IconComponent="TelegramIcon" url="https://t.me/dimflix_official"
					color="var(--lavender-color)" />
				<SocialMediaBtn :IconComponent="GithubIcon" url="https://github.com/DIMFLIX"
					color="var(--button-color)" />
			</div>
		</div>

		<div class="right-side">
			<div class="photo-container">
				<svg width="468" height="604" viewBox="0 0 468 604" fill="none">
					<g clip-path="url(#clip0)">
						<image v-for="(photo, index) in photos" :key="index" :xlink:href="photo" width="468"
							height="auto" preserveAspectRatio="none"
							:class="{ 'active': currentPhotoIndex === index, 'prev': (currentPhotoIndex - 1 + photos.length) % photos.length === index }" />
					</g>
					<defs>
						<clipPath id="clip0">
							<path
								d="M48.1616 34.1354C50.2902 30.2234 53.953 27.3756 58.2689 26.277L159.558 0.494444C160.847 0.166097 162.173 0 163.504 0H451.193C460.03 0 467.193 7.16344 467.193 16V480.5V587.293C467.193 596.129 460.03 603.293 451.193 603.293H331H16.0804C7.24388 603.293 0.0804443 596.129 0.0804443 587.293V126.571C0.0804443 123.9 0.74939 121.271 2.02625 118.924L48.1616 34.1354Z" />
						</clipPath>
					</defs>
				</svg>

				<div class="progress-indicators">
					<div v-for="(_, index) in photos" :key="index" class="progress-track" @click="goToPhoto(index)">
						<div class="progress-bar" :class="{ 'active': currentPhotoIndex === index }"
							:style="{ 'animation-duration': '3s' }"></div>
					</div>
				</div>
			</div>

			<a href="https://nn.hh.ru/resume/08915fc3ff0cef7b610039ed1f6c6a514a6956" target="_blank" class="resume-btn">
				<ResumeIcon />
				<p class="text">{{ t('home.resume_btn') }}</p>
			</a>
		</div>
	</div>
</template>

<style scoped lang="scss">
.home-page {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--bg-color);
	color: var(--text-color);
	gap: 150px;

	@media (max-width: 1315px) {
		flex-direction: column;
		gap: 50px;
		height: auto; // Allow height to adjust based on content
		padding: 20px; // Add padding for better spacing on mobile
	}
}

.bm20 {
	margin-bottom: 20px;
}

.bm30 {
	margin-bottom: 30px;
}

.left-side {
	width: 700px;

	.title {
		display: flex;
		align-items: center;
		gap: 30px;

		.icon {
			width: 74;
			height: 71;
			stroke: var(--text-color);
			fill: var(--text-color);
		}

		.text {
			font-size: 32px;
		}
	}

	.description {
		font-size: 20px;
	}

	.highlight {
		display: inline-flex;
		height: 30px;
		border-radius: 10px;
		align-items: center;
		padding-left: 5px;
		padding-right: 10px;
		gap: 5px;

		background-image: linear-gradient(to right,
				var(--rosewater-color),
				var(--flamingo-color),
				var(--pink-color),
				var(--mauve-color),
				var(--red-color),
				var(--maroon-color),
				var(--peach-color),
				var(--yellow-color),
				var(--green-color),
				var(--teal-color),
				var(--sky-color),
				var(--sapphire-color),
				var(--blue-color),
				var(--lavender-color));

		.text {
			font-family: "PressStart2P";
			font-size: 12px;
			color: var(--button-color);
		}
	}

	.social-media {
		width: 100%;
		display: flex;
		gap: 20px;
		justify-content: center;
		align-items: center;
	}
}

.right-side {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	position: relative;

	.photo-container {
		position: relative;
		width: 468px;
		height: 604px;

		svg {
			position: relative;
			z-index: 1;

			image {
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
				transition: opacity 0.5s ease-in-out;

				&.active {
					opacity: 1;
					z-index: 2;
				}

				&.prev {
					opacity: 0;
					z-index: 1;
				}
			}
		}
	}

	.progress-indicators {
		position: absolute;
		bottom: 10px;
		left: 20px;
		right: 20px;
		z-index: 3;
		display: flex;
		gap: 5px;
	}

	.progress-track {
		flex: 1;
		height: 3px;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		cursor: pointer;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		width: 0;
		background-color: white;
		border-radius: 2px;

		&.active {
			animation: progress linear;
		}
	}

	@keyframes progress {
		from {
			width: 0;
		}

		to {
			width: 100%;
		}
	}

	.resume-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		border-radius: 10px;
		background-color: var(--button-color);
		height: 90px;
		gap: 15px;
		cursor: pointer;
		border: 0;
		text-decoration: none;

		.icon {
			width: 24px;
			height: 24px;
			fill: var(--bg-color);
		}

		.text {
			font-family: "PressStart2P";
			font-size: 24px;
			color: var(--button-text-color);
		}
	}
}
</style>
