<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t, locale } = useI18n();
const screenSize = ref(0);

const projectsList = ref([
	{
        src: require("@/assets/projects/meowrch.png"), 
        title: "portfolio.meowrch.title",
        description: "portfolio.meowrch.description",
        link: "https://github.com/meowrch/meowrch",
    },
	{
        src: require("@/assets/projects/pixelgan.png"), 
        title: "portfolio.pixelGan.title",
        description: "portfolio.pixelGan.description",
        link: "https://github.com/DIMFLIX-Hackathons/PixelGAN",
    },
    {
        src: require("@/assets/projects/defectSenseAI.png"), 
        title: "portfolio.defectSenseAI.title",
        description: "portfolio.defectSenseAI.description",
        link: "https://github.com/DIMFLIX",
    },
    {
        src: require("@/assets/projects/terraWing.png"), 
        title: "portfolio.terraWing.title",
        description: "portfolio.terraWing.description",
        link: "https://github.com/DIMFLIX-Hackathons/TerraWing",
    },
    {
        src: require("@/assets/projects/pyTypingCourse.png"), 
        title: "portfolio.pyTypingCourse.title",
        description: "portfolio.pyTypingCourse.description",
        link: "https://github.com/DIMFLIX/PyTypingCourse",
    },
    {
        src: require("@/assets/projects/spectrum-security.png"), 
        title: 'portfolio.spectrumSecurity.title',
        description: 'portfolio.spectrumSecurity.description',
        link: "https://github.com/DIMFLIX/Spectrum-Security",
    },

])

const openLink = (link) => {
  window.open(link, '_blank')
}

const hoverStates = ref({});
</script>

<template>
	<div class="page">
		<div class="portfolio-container">
            <div class="box" @click="openLink(p.link)" v-for="(p, index) in projectsList":key="index"@mouseenter="hoverStates[index] = true"@mouseleave="hoverStates[index] = false">
                <img :src="p.src" alt="Тест">
                <transition name="fade">
                    <div v-show="hoverStates[index]" class="overlay">
                        <transition-group name="list">
                            <h3 class="title" key="title">
                                {{ t(p.title) }}
                            </h3>
                            <p class="description" key="desc">
                                {{ t(p.description) }}
                            </p>
                        </transition-group>
                    </div>
                </transition>
            </div>
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

    @media (max-width: 768px) {
        gap: 50px;
        padding: 80px 5vw 30px 5vw;
    }
}

.portfolio-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    gap: 2.5rem;
    box-sizing: border-box;

    // Для планшетов (2 колонки)
    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }

    // Для мобильных (1 колонка)
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .box {
        position: relative;
        border-radius: 1.2rem;
        display: flex;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.5s ease; // Добавляем переход для плавности
        
        &:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4); // Усиливаем тень при наведении
        }
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: all 0.5s ease;
            opacity: 1;
        }

        &:hover img {
            transform: scale(1.05);
            opacity: 1;
        }
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
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
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
}

.description {
    color: var(--button-text-color);
    font-size: 1rem;
    line-height: 1.4;
    margin: 0 0 1.5rem;
}
</style>