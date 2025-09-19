
<template>
  <div class="leave-review-box">
    <div class="form-content">
      <textarea v-model="draft.text" rows="4" :placeholder="t('reviews.textPlaceholder')"></textarea>
      <div class="form-actions">
        <div class="stars-select">
          <label>{{ t('reviews.yourRating') }}</label>
          <Stars :value="draft.rating" interactive :size="28" @update:value="v => draft.rating = v" />
        </div>
        <a v-if="canSubmit" :href="newDiscussionUrl" target="_blank" rel="noopener noreferrer" class="submit-button">
          {{ t('reviews.submit') }}
        </a>
        <button v-else type="button" class="submit-button" disabled>
          {{ t('reviews.submit') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

// --- New Review Submission ---
const draft = ref({ rating: 0, text: '' })
const canSubmit = computed(() => draft.value.rating > 0 && draft.value.text.trim().length > 0)
const newDiscussionUrl = computed(() => {
  const stars = '⭐'.repeat(draft.value.rating)
  const lines = [stars, '', draft.value.text.trim()]
  const body = encodeURIComponent(lines.join('\n'))
  const titleBase = t('reviews.titleForDiscussion') as string
  const title = encodeURIComponent(`${titleBase} (${draft.value.rating}/5)`)
  const categoryParam = props.category ? `category=${encodeURIComponent(props.category)}&` : ''
  return `https://github.com/${props.owner}/${props.repo}/discussions/new?${categoryParam}title=${title}&body=${body}`
})
</script>

<style scoped lang="scss">
// --- Leave Review Form ---
.leave-review-box {
  border-radius: 14px;
  background: transparent; /* remove inner background */
  padding: 0; /* rely on outer box padding */
  margin-top: 0;

  .form-content {
    display: flex;
    gap: 20px;
    align-items: stretch;
    padding: 10px 0 0 0;
  }

  textarea {
    flex-grow: 1;
    background: transparent; /* cleaner look inside box */
    color: var(--text-color);
    border: 1px solid var(--sbg2-color);
    border-radius: 12px;
    padding: 12px 14px;
    resize: vertical;
  }
  textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--primary-color) 25%, transparent);
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    min-width: 180px;
  }

  .stars-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    label {
      font-size: 0.95rem;
      opacity: 0.9;
    }
  }

.submit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 22px;
    border-radius: 12px;
    text-decoration: none;
    background: var(--button-color);
    color: var(--button-text-color);
    font-family: 'Aldrich', sans-serif;
    border: 1px solid var(--button-color);
    cursor: pointer;
    font-size: 1.05rem;
    width: 100%;
    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
    transition: transform .08s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
  }
  .submit-button:link,
  .submit-button:visited { color: var(--button-text-color); background: var(--button-color); border-color: var(--button-color); }
  .submit-button:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.35); }
  .submit-button:active { transform: translateY(1px); }
  button.submit-button:disabled {
    background: var(--button-color);
    border-color: var(--button-color);
    color: var(--button-text-color);
    cursor: not-allowed;
  }
  /* Force consistent anchor states */
  .submit-button:link,
  .submit-button:visited,
  .submit-button:hover,
  .submit-button:active {
    background: var(--button-color);
    color: var(--button-text-color);
    border-color: var(--button-color);
  }
  button.submit-button:disabled {
    background: var(--button-color);
    color: var(--button-text-color);
    border-color: var(--button-color);
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    .form-content {
      flex-direction: column;
      gap: 12px;
    }
    .form-actions { 
      min-width: 0; 
    }

    .stars-select {
      flex-direction: unset;
      gap: 10px;
    }
  }
}
</style>

