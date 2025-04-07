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
import PhotoSlider from '@/components/PhotoSlider.vue';

const { t, locale } = useI18n();

const photos = [
	require('@/assets/my-photo.jpg'),
	require('@/assets/my-photo2.jpg'),
	require('@/assets/my-photo3.jpg'),
	require('@/assets/my-photo4.jpg')
];
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
			<PhotoSlider 
			:photos="photos" 
			:interval="3000" 
			:show-frame="true"
			:show-indicators="true"
			/>

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
