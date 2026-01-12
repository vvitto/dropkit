import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './translations/en.json';

const resources = {
  en: { translation: en },
};

export function initI18n(_languageCode?: string) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
}

export default i18n;
