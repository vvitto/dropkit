import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './translations/en.json';
import ru from './translations/ru.json';

const LANGUAGE_KEY = 'app_language';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

function getLanguage(telegramLanguageCode?: string): string {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ru')) {
    return savedLanguage;
  }
  return telegramLanguageCode?.startsWith('ru') ? 'ru' : 'en';
}

export function saveLanguage(language: string) {
  localStorage.setItem(LANGUAGE_KEY, language);
}

export function initI18n(languageCode?: string) {
  const language = getLanguage(languageCode);

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
}

export default i18n;
