import i18next from 'i18next';
import { browser } from 'wxt/browser';

import en from '@/locales/en.json';
import zhCN from '@/locales/zh_CN.json';

export const fallbackLng = 'en';

/**
 * Use the browser UI language, the same source the manifest's `_locales` resolution relies on.
 * The browser returns BCP-47 tags (zh-CN); normalize them to the file naming used in `locales/` (zh_CN).
 */
function detectLanguage(): string {
    try {
        const uiLang = browser.i18n.getUILanguage();
        if (uiLang) return uiLang.replace('-', '_');
    } catch {
        // Not available at build time (Node + fake-browser), fall back to navigator below
    }
    return (navigator.language || fallbackLng).replace('-', '_');
}

void i18next.init({
    lng: detectLanguage(),
    fallbackLng: {
        // Traditional Chinese locales reuse the simplified Chinese translations
        zh_TW: ['zh_CN'],
        zh_HK: ['zh_CN'],
        default: [fallbackLng],
    },
    resources: {
        en: { translation: en },
        zh_CN: { translation: zhCN },
    },
    // Translations may contain quotes; React and the DOM APIs handle escaping safely
    interpolation: { escapeValue: false },
    returnNull: false,
});

/**
 * Translation helper for non-React contexts (content scripts).
 * React components should use `useTranslation()` instead.
 */
export function t(key: string, options?: Record<string, unknown>): string {
    return i18next.t(key, options);
}

export default i18next;
