<template>
  <div class="reviews-section">
    <!-- Stat Chip -->
    <div class="top-chip">
      <svg class="stat-star" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.1 6.46L12 17.9 6.2 20.4l1.1-6.46-4.7-4.58 6.5-.95L12 2.5z" fill="#f5b301" stroke="#f2c94c" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
      </svg>
      <span class="avg-number">{{ averageRating.toFixed(1) }}</span>
      <span class="count">· {{ reviews.length }}</span>
    </div>

    <!-- Reviews Carousel -->
    <div v-if="!loading && reviews.length" class="carousel-container">
      <Carousel v-bind="carouselConfig">
        <Slide v-for="r in reviews" :key="r.id">
          <div class="review-card" @click="openReviewModal(r)">
            <div class="card-header">
              <div class="author">
                <img v-if="r.author?.avatar" class="avatar" :src="r.author.avatar" alt="avatar" />
                <div class="meta">
                  <a v-if="r.author?.url" :href="r.author.url" target="_blank" rel="noopener noreferrer" class="username">{{ r.author?.username || r.author?.name || 'User' }}</a>
                  <span v-else class="username">{{ r.author?.username || r.author?.name || 'User' }}</span>
                </div>
              </div>
            </div>
            <div class="card-body">
              <blockquote class="text">
                {{ r.text }}
              </blockquote>
            </div>
            <div class="card-footer">
              <div class="rating"><Stars :value="r.rating" :size="24" /></div>
              <span class="date">{{ formatDate(r.createdAt) }}</span>
            </div>
          </div>
        </Slide>
        <template #addons>
          <Navigation />
        </template>
      </Carousel>
    </div>
    <div v-if="!loading && !reviews.length" class="empty">{{ t('reviews.noReviews') }}</div>
    <div v-if="loading" class="loading">{{ t('reviews.loading') }}</div>
    <div v-if="error" class="error">{{ error }}</div>



    <!-- Full Review Modal -->
    <div v-if="showReviewModal" class="modal-mask" @click.self="closeReviewModal">
      <div class="modal">
        <div class="modal-header">
          <div class="author">
            <img v-if="selectedReview.author?.avatar" class="avatar" :src="selectedReview.author.avatar" alt="avatar" />
            <div class="meta">
              <a v-if="selectedReview.author?.url" :href="selectedReview.author.url" target="_blank" rel="noopener noreferrer">{{ selectedReview.author?.name || selectedReview.author?.username || 'User' }}</a>
              <span v-else>{{ selectedReview.author?.name || selectedReview.author?.username || 'User' }}</span>
            </div>
          </div>
          <button type="button" class="modal-close" @click="closeReviewModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-review-header">
            <Stars :value="selectedReview.rating" />
            <span class="date">{{ formatDate(selectedReview.createdAt) }}</span>
          </div>
          <blockquote class="text">
            {{ selectedReview.text }}
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getReviews, calculateAverageRating } from '@/services/reviewsService.js'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import Stars from '@/components/StarRating.vue'

const props = withDefaults(defineProps<{
  owner?: string
  repo?: string
  category?: string
}>(), {
  owner: 'DIMFLIX',
  repo: 'dimflix.github.io',
  category: 'Reviews'
})

const { t, locale } = useI18n()

const loading = ref(true)
const error = ref('')
const reviews = ref<Array<any>>([])

const averageRating = computed(() => calculateAverageRating(reviews.value))

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(locale.value, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await getReviews(props.owner, props.repo, props.category)
    reviews.value = data
  } catch (e: any) {
    error.value = t('reviews.loadError')
  } finally {
    loading.value = false
  }
}

onMounted(load)




// --- Full Review Modal ---
const showReviewModal = ref(false)
const selectedReview = ref<any>(null)

function openReviewModal(review: any) {
  selectedReview.value = review
  showReviewModal.value = true
}
function closeReviewModal() {
  showReviewModal.value = false
  selectedReview.value = null
}

// --- Carousel Config ---
const carouselConfig = ref({
  itemsToShow: 1.15,
  wrapAround: true,
  transition: 500,
  snapAlign: 'center',
  breakpoints: {
    700: {
      itemsToShow: 1.3,
      snapAlign: 'center',
    },
    1100: {
      itemsToShow: 1.6,
      snapAlign: 'center',
    },
  }
})

</script>

<style scoped lang="scss">
.reviews-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: static; /* anchor .top-chip to parent .box like .box-title */
}

/* Align chip with .box-title */
.top-chip {
    position: absolute;
    top: -1.5vw;
    left: calc(var(--box-title-left, 2vw) + var(--box-title-width, 8vw) + 20px);
    right: auto;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 3vw;
    padding: 1vw 1vw;
    border-radius: .6vw;
    background-color: var(--sbg2-color);
    z-index: 3;
}

@media (max-width: 768px) {
  .review-card { height: 300px; }
  .username { font-size: 1.2rem; }
  .top-chip {
    position: absolute;
    top: -20px;
    left: calc(var(--box-title-left, 20px) + var(--box-title-width, 140px) + 20px);
    right: auto;
    width: auto;
    height: auto;
    min-height: 40px;
    padding: 8px 20px;
    border-radius: 8px;
    gap: 8px;
  }
}


.top-chip .stat-star {
  width: clamp(16px, 1.8vw, 28px);
  height: clamp(16px, 1.8vw, 28px);
}
.avg-number { font-weight: 800; margin-left: 0; font-size: clamp(12px, 1.1vw, 18px); }
.count { opacity: 0.9; margin-left: 0; font-size: clamp(11px, 1vw, 16px); }

// --- Carousel ---
.carousel-container {
  width: 100%;
}
:global(.carousel__viewport) {
  overflow: hidden; /* hide overflow to prevent visual stacking */
}
/* Use slide padding for spacing, with border-box to keep width consistent */
:global(.carousel__slide) {
  padding: 0 20px;
  box-sizing: border-box;
  display: block;
  z-index: auto !important; /* normalize z-index across slides */
}
/* Override default center alignment from carousel for this section */
.reviews-section :global(.carousel__slide) {
  text-align: left;
}
:global(.carousel__slide--visible),
:global(.carousel__slide--active),
:global(.carousel__slide--prev),
:global(.carousel__slide--next) {
  z-index: auto !important;
}
:global(.carousel__prev),
:global(.carousel__next) {
  background-color: var(--sbg2-color) !important;
  color: var(--text-color) !important;
  border-radius: 50%;
  width: 40px !important;
  height: 40px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  &:hover {
    background-color: var(--primary-color) !important;
  }
}

// --- Review Card ---
.review-card {
  position: relative;
  border-radius: 16px;
  background-color: var(--sbg2-color);
  padding: 20px;
  width: 100%;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  /* ensure card doesn't overlap neighbors visually */
  margin: 0; /* spacing is via slide padding */

  &:hover {
    box-shadow: none;
  }

.card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }
.author { display: flex; align-items: center; gap: 6px; width: 100%; }
  .meta { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.username { color: var(--text-color); text-decoration: none; font-weight: 700; font-size: 1.4rem; line-height: 1.2; padding-left: 15px; }
  .username:hover { text-decoration: underline; }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--primary-color);
  }


  .card-body {
    flex-grow: 1;
    overflow: hidden;
    min-width: 0; /* prevent overflow causing overlap */
  }

  .text {
    margin: 15px 0;
    white-space: pre-wrap;
    color: var(--text-color-secondary);
    font-size: 1.1rem;
    line-height: 1.7;
    text-align: left;

    // Clamp text
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 0.95rem;
    color: var(--text-color-muted);
    opacity: 0.95;
    margin-top: 8px;
  }
  .card-footer .rating { display: flex; align-items: center; }
  .card-footer .date { white-space: nowrap; }
}

/* Mobile-friendly header layout for very small screens */
@media (max-width: 480px) {
  .review-card { height: 300px; }
  .card-header { justify-content: center; }
  .author { flex-direction: column; align-items: center; gap: 8px; }
  .avatar { width: 64px; height: 64px; }
  .meta { align-items: center; text-align: center; }
  .username { padding-left: 0; text-align: center; font-size: 1.1rem; word-break: break-word; }

  .card-footer { flex-direction: column; align-items: center; gap: 6px; }
  .card-footer .date { white-space: normal; font-size: 0.9rem; text-align: center; }
}

// --- Leave Review Form ---
.leave-review-box {
  border-radius: 14px;
  background-color: var(--sbg2-color);
  padding: 20px;
  margin-top: 20px;

  h4 {
    margin: 0 0 15px 0;
    font-size: 1.2rem;
  }
  .form-content {
    display: flex;
    gap: 20px;
  }

  textarea {
    flex-grow: 1;
    background: var(--bg-color);
    color: var(--text-color);
    border: 1px solid var(--sbg1-color);
    border-radius: 10px;
    padding: 10px 12px;
    resize: vertical;
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .stars-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    label {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }

  .submit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    background: var(--primary-color);
    color: white;
    font-family: 'Aldrich', sans-serif;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    
    &:disabled {
      background: var(--sbg1-color);
      color: var(--text-color-muted);
      cursor: not-allowed;
    }
  }

  .hint {
    display: block;
    margin-top: 10px;
    font-size: 0.85rem;
    opacity: 0.8;
    text-align: center;
  }

  @media (max-width: 600px) {
    .form-content {
      flex-direction: column;
    }
  }
}

// --- Full Review Modal ---
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}
.modal {
  width: min(600px, 90vw);
  background: var(--sbg1-color);
  border: 1px solid var(--sbg2-color);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--sbg2-color);

  .author {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
  .meta a {
    color: var(--text-color);
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}
.modal-close {
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 1.3rem;
  cursor: pointer;
  opacity: 0.8;
  &:hover { opacity: 1; }
}
.modal-body {
  padding: 24px;
  .modal-review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  .date {
    font-size: 0.9rem;
    opacity: 0.7;
  }
  .text {
    white-space: pre-wrap;
    line-height: 1.7;
    font-size: 1.05rem;
    max-height: 60vh;
    overflow-y: auto;
  }
}

.empty, .loading, .error { opacity: 0.9; padding: 20px; text-align: center; }
</style>

