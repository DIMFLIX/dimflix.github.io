import { createI18n } from 'vue-i18n'
import { messages } from './localization'

export const i18n = createI18n({
  locale: 'en',
  messages
})

export default i18n

