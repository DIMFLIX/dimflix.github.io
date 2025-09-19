<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import wallets from '@/services/sponsor'

const { t } = useI18n()

const copied = ref<Record<string, boolean>>({})

async function copy(addr: string, key: string) {
  try {
    await navigator.clipboard.writeText(addr)
    copied.value = { ...copied.value, [key]: true }
    setTimeout(() => {
      copied.value = { ...copied.value, [key]: false }
    }, 1500)
  } catch (e) {
    // no-op
  }
}
</script>

<template>
  <div class="sponsor">
    <p class="intro" v-html="t('sponsor.intro')"></p>

    <div class="wallets">
      <div v-for="w in wallets" :key="w.key" class="wallet">
        <div class="hdr">
          <span class="name">{{ w.label }}</span>
          <button type="button" class="copy" @click="copy(w.address, w.key)">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
            </svg>
            <span class="copy-text">{{ copied[w.key] ? t('sponsor.copied') : t('sponsor.copy') }}</span>
          </button>
        </div>
        <code class="addr" :title="w.address">{{ w.address }}</code>
      </div>
    </div>

    <div class="note" v-if="t('sponsor.notice')">
      <p class="muted">{{ t('sponsor.notice') }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sponsor {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.intro {
  margin: 0;
  color: var(--text-color);
}

.wallets {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
}

.wallet {
  background: var(--sbg2-color);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.name {
  font-family: 'PressStart2P', sans-serif;
  font-size: 12px;
}

.copy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--button-color);
  color: var(--button-text-color);
  background: var(--button-color);
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .2s ease, background .2s ease;
}
.copy:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.25); }
.copy:active { transform: translateY(1px); }
.copy-text { font-family: 'Aldrich', sans-serif; font-size: 12px; }

.addr {
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  color: var(--text-color);
  background: color-mix(in oklab, var(--sbg2-color) 60%, var(--bg-color));
  padding: 10px;
  border-radius: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note .muted { opacity: .8; font-size: 12px; margin: 0; }
</style>

