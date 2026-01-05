// Include Telegram UI styles first to allow our code override the package CSS.

import ReactDOM from 'react-dom/client';
import {retrieveLaunchParams} from '@tma.js/sdk-react';

import {Root} from '@/components/Root.tsx';
import {EnvUnsupported} from '@/components/EnvUnsupported.tsx';
import {init} from '@/init.ts';
import {initI18n} from '@/i18n.ts';
import telegramAnalytics from '@telegram-apps/analytics';
import * as Sentry from "@sentry/react";

import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug = (launchParams.tgWebAppStartParam || '').includes('debug')
    || import.meta.env.DEV;

  // Initialize i18n with user's language
  const languageCode = launchParams.tgWebAppData?.user?.language_code;

    Sentry.init({
        dsn: "https://ce9a15c13e1ef65c2f5ee74e055ca39d@o231542.ingest.us.sentry.io/4510641115627520",
        // Setting this option to true will send default PII data to Sentry.
        // For example, automatic IP address collection on events
        sendDefaultPii: true
    });

  initI18n(typeof languageCode === 'string' ? languageCode : undefined);

  // Configure all application dependencies.
  await init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
  })
      .then(() => {
          try {
              telegramAnalytics.init({
                  token: import.meta.env.VITE_TG_ANALYTICS_TOKEN,
                  appName: import.meta.env.VITE_TG_ANALYTICS_NAME
              });
          } catch (error) {
              console.error(error);
          }
      })
    .then(() => {
      root.render(
        // <StrictMode>
          <Root/>
        // </StrictMode>,
      );
    });
} catch (e) {
  root.render(<EnvUnsupported/>);
}
