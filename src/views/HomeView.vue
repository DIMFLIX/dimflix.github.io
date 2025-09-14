<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import RocketIcon from "@/components/icons/RocketIcon.vue";
import StarsIcon from "@/components/icons/StarsIcon.vue";
import AboutMeIcon from "@/components/icons/AboutMeIcon.vue";
import PortfolioIcon from "@/components/icons/PortfolioIcon.vue";
import ArticlesIcon from "@/components/icons/ArticlesIcon.vue";
import YoutubeIcon from "@/components/icons/YoutubeIcon.vue";
import KaggleIcon from "@/components/icons/KaggleIcon.vue";
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
        <StarsIcon class="icon"/>
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
        <SocialMediaBtn :IconComponent="KaggleIcon" url="https://www.kaggle.com/dimflix"
          color="var(--sky-color)" />
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-color);
  color: var(--text-color);
  gap: 150px;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 1315px) {
    flex-direction: column;
    align-items: center;
    gap: 50px;
    height: auto;
    padding: 20px;
  }

  @media (max-width: 768px) {
    gap: 30px;
    padding: 15px;
  }
}

.bm20 {
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
}

.bm30 {
  margin-bottom: 30px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
}

.left-side {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 768px) {
      gap: 15px;
    }

    .icon {
      width: 50px;
      height: 50px;
      stroke: var(--text-color);
      fill: var(--text-color);

      @media (max-width: 768px) {
        width: 40px;
        height: 40px;
      }
    }

    .text {
      font-size: 32px;
      margin: 0;

      @media (max-width: 768px) {
        font-size: 24px;
      }

      @media (max-width: 480px) {
        font-size: 20px;
      }
    }
  }

  .description {
    font-size: 20px;
    margin: 15px 0;

    @media (max-width: 768px) {
      font-size: 16px;
    }

    @media (max-width: 480px) {
      font-size: 14px;
    }
  }

  .highlight {
    display: inline-flex;
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

      @media (max-width: 480px) {
        font-size: 10px;
      }
    }

	.icon {
		width: 41px;
		min-width: 30px;
		color: var(--button-color);
	}
  }

  .social-media {
    width: 100%;
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      gap: 10px;
    }
  }
}

.right-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  width: 100%;
  max-width: 468px;
  box-sizing: border-box;

  .resume-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: 10px;
    background-color: var(--button-color);
    height: 80px;
	min-height: 60px;
    gap: 10px;
    cursor: pointer;
    border: 0;
    text-decoration: none;
    padding: 0 15px;
    box-sizing: border-box;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: scale(0.98);
    }

	@media (max-width: 768px) {
		height: 70px;
	}

	@media (max-width: 468px) {
		height: 60px;
	}

    .icon {
      width: 20px;
      height: 20px;
      fill: var(--bg-color);

      @media (max-width: 480px) {
        width: 16px;
        height: 16px;
      }
    }

    .text {
      font-family: "PressStart2P";
      font-size: 16px;
      color: var(--button-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;

      @media (max-width: 768px) {
        font-size: 14px;
      }

      @media (max-width: 480px) {
        font-size: 12px;
      }
    }
  }
}
</style>
