<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  photos: string[];
  interval?: number;
  showFrame?: boolean;
  showIndicators?: boolean;
  altTexts?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  interval: 3000,
  showFrame: true,
  showIndicators: true,
  altTexts: () => []
});

const currentPhotoIndex = ref(0);
let photoInterval: number | null = null;

const changePhoto = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value + 1) % props.photos.length;
};

const startInterval = () => {
  if (photoInterval) clearInterval(photoInterval);
  photoInterval = setInterval(changePhoto, props.interval);
};

const goToPhoto = (index: number) => {
  currentPhotoIndex.value = index;
  startInterval();
};

const handlePrev = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value - 1 + props.photos.length) % props.photos.length;
  startInterval();
};

const handleNext = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value + 1) % props.photos.length;
  startInterval();
};

onMounted(() => {
  startInterval();
});

onUnmounted(() => {
  if (photoInterval) clearInterval(photoInterval);
});
</script>

<template>
  <div class="photo-slider" :style="{'--slider-aspect-ratio': showFrame ? '468/604' : '3/4'}">
    <div class="slider-container" :class="{ 'with-frame': showFrame }">
      <!-- SVG frame version -->
      <svg v-if="showFrame" viewBox="0 0 468 604" preserveAspectRatio="xMidYMid meet" role="img" :aria-label="altTexts && altTexts.length ? altTexts[currentPhotoIndex] : undefined">
        <defs>
          <clipPath id="photo-frame-clip">
            <path d="M48.1616 34.1354C50.2902 30.2234 53.953 27.3756 58.2689 26.277L159.558 0.494444C160.847 0.166097 162.173 0 163.504 0H451.193C460.03 0 467.193 7.16344 467.193 16V480.5V587.293C467.193 596.129 460.03 603.293 451.193 603.293H331H16.0804C7.24388 603.293 0.0804443 596.129 0.0804443 587.293V126.571C0.0804443 123.9 0.74939 121.271 2.02625 118.924L48.1616 34.1354Z"/>
          </clipPath>
        </defs>
        <g clip-path="url(#photo-frame-clip)">
          <image 
            v-for="(photo, index) in photos" 
            :key="index"
            :xlink:href="photo" 
            width="100%" 
            height="100%" 
            preserveAspectRatio="xMidYMid slice"
            :class="{ active: currentPhotoIndex === index }"
          />
        </g>
      </svg>
      
      <!-- Simple version without frame -->
      <div v-else class="simple-photo">
        <img 
          v-for="(photo, index) in photos" 
          :key="index"
          :src="photo" 
          :alt="altTexts && altTexts[index] ? altTexts[index] : `Photo ${index+1}`"
          :class="{ active: currentPhotoIndex === index }"
        />
      </div>

      <!-- Navigation arrows -->
      <button v-if="photos.length > 1" class="nav-arrow prev" @click="handlePrev">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
        </svg>
      </button>
      <button v-if="photos.length > 1" class="nav-arrow next" @click="handleNext">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
      </button>
      
      <!-- Progress indicators -->
      <div v-if="showIndicators && photos.length > 1" class="progress-indicators">
        <div 
          v-for="(_, index) in photos" 
          :key="index"
          class="progress-track"
          @click="goToPhoto(index)"
        >
          <div 
            class="progress-bar" 
            :class="{ active: currentPhotoIndex === index }"
            :style="{ 'animation-duration': `${interval}ms` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.photo-slider {
  --slider-width: 100%;
  --slider-max-width: 468px;
  --slider-aspect-ratio: 468/604;
  
  width: var(--slider-width);
  max-width: var(--slider-max-width);
  margin: 0 auto;
  position: relative;

  /* Основной контейнер сохраняет пропорции */
  &::before {
    content: "";
    display: block;
    padding-top: calc(100% / (var(--slider-aspect-ratio)));
  }
}

.slider-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
    height: 100%;
    display: block;
    
    image {
      opacity: 0;
      transition: opacity 0.5s ease;
      
      &.active {
        opacity: 1;
      }
    }
  }

  .simple-photo {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.5s ease;
      
      &.active {
        opacity: 1;
      }
    }
  }

  .nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    svg {
      width: 24px;
      height: 24px;
      fill: white;
    }

    &.prev {
      left: 10px;
    }

    &.next {
      right: 10px;
    }
  }

  &:hover .nav-arrow {
    opacity: 1;
  }
}

.progress-indicators {
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
  z-index: 5;
  display: flex;
  gap: 5px;

  .progress-track {
    flex: 1;
    height: 3px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    cursor: pointer;
    overflow: hidden;
    
    .progress-bar {
      height: 100%;
      width: 0;
      background-color: white;
      border-radius: 2px;
      
      &.active {
        animation: progress linear;
      }
    }
  }
}

@keyframes progress {
  from { width: 0; }
  to { width: 100%; }
}


/* Оптимизация для мобильных устройств */
@media (max-width: 1000px) {
  .slider-container .nav-arrow {
    width: 28px;
    height: 28px;
    opacity: 1;
  }
}
</style>
