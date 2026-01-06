import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './translations/en.json';
import ru from './translations/ru.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

export function initI18n(languageCode?: string) {
  const language = languageCode?.startsWith('ru') ? 'ru' : 'en';

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
