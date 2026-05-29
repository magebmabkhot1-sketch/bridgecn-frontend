import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

i18n
  .use(LanguageDetector) // Detects user's browser language
  .use(initReactI18next)   // Passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh }
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'] // Remembers choice after refresh
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  })

export default i18n