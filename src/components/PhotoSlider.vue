<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

interface Props {
  photos: string[];
  interval?: number;
  showFrame?: boolean;
  showIndicators?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  interval: 3000,
  showFrame: true,
  showIndicators: true
});

const currentPhotoIndex = ref(0);
const isChanging = ref(false);
let photoInterval: number | null = null;

const changePhoto = () => {
  isChanging.value = true;
  
  setTimeout(() => {
    currentPhotoIndex.value = (currentPhotoIndex.value + 1) % props.photos.length;
    isChanging.value = false;
  }, 500);
};

const startInterval = () => {
  if (photoInterval) clearInterval(photoInterval);
  photoInterval = setInterval(changePhoto, props.interval);
};

const resetInterval = () => {
  startInterval();
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
  <div class="photo-slider">
    <div class="photo-container" :class="{ 'with-frame': showFrame }">
      <!-- Вариант с SVG рамкой -->
      <svg v-if="showFrame" width="468" height="604" viewBox="0 0 468 604" fill="none">
        <g clip-path="url(#clip0)">
          <image 
            v-for="(photo, index) in photos" 
            :key="index"
            :xlink:href="photo" 
            width="468" 
            height="auto" 
            preserveAspectRatio="none"
            :class="{ 'active': currentPhotoIndex === index, 'prev': (currentPhotoIndex - 1 + photos.length) % photos.length === index }"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <path d="M48.1616 34.1354C50.2902 30.2234 53.953 27.3756 58.2689 26.277L159.558 0.494444C160.847 0.166097 162.173 0 163.504 0H451.193C460.03 0 467.193 7.16344 467.193 16V480.5V587.293C467.193 596.129 460.03 603.293 451.193 603.293H331H16.0804C7.24388 603.293 0.0804443 596.129 0.0804443 587.293V126.571C0.0804443 123.9 0.74939 121.271 2.02625 118.924L48.1616 34.1354Z"/>
          </clipPath>
        </defs>
      </svg>
      
      <div v-else class="simple-photo">
        <img 
          v-for="(photo, index) in photos" 
          :key="index"
          :src="photo" 
          :class="{ 'active': currentPhotoIndex === index, 'prev': (currentPhotoIndex - 1 + photos.length) % photos.length === index }"
        />
      </div>
      
      <div v-if="showIndicators" class="progress-indicators">
        <div 
          v-for="(_, index) in photos" 
          :key="index"
          class="progress-track"
          @click="goToPhoto(index)"
        >
          <div 
            class="progress-bar" 
            :class="{ 'active': currentPhotoIndex === index }"
            :style="{ 'animation-duration': `${interval}ms` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.photo-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-container {
  position: relative;
  width: 468px;
  height: 604px;
  
  &.with-frame {
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
  
  .simple-photo {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 10px;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
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
  from { width: 0; }
  to { width: 100%; }
}
</style>
