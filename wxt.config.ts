import { defineConfig } from 'wxt';

import { generateExtensionLocales } from './scripts/generateExtensionLocales';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-react'],
    manifestVersion: 3,
    outDir: 'build',
    hooks: {
        // The manifest's __MSG_*__ placeholders need _locales/, generated from locales/*.json
        'build:publicAssets': (_wxt, files) => {
            files.push(...generateExtensionLocales());
        },
    },
    zip: {
        name: 'notion_boost',
        artifactTemplate: '{{name}}_{{browser}}.zip',
        sourcesTemplate: '{{name}}_sourcecode.zip',
    },
    manifest: ({ browser }) => {
        // case: browser is firefox, add browser_specific_settings to avoid storage access error
        if (browser === 'firefox') {
            return {
                ...baseManifest,
                browser_specific_settings: {
                    gecko: {
                        id: '{0d49b33c-467a-4897-bea4-c82d6756e5c4}',
                    },
                },
            };
        }

        return baseManifest;
    },
});

// base manifest file
const baseManifest = {
    // i18n: placeholders are resolved from _locales/<lang>/messages.json based on the browser UI language
    name: '__MSG_extName__',
    short_name: '__MSG_extName__',
    default_locale: 'en',
    version: '3.3.7',
    description: '__MSG_extDesc__',
    author: 'Gourav Goyal',
    permissions: ['storage'],
    host_permissions: ['*://*.notion.so/*', '*://*.notion.site/*', '*://*.notion.com/*'],
    homepage_url: 'https://gourav.io/notion-boost',
    icons: {
        '16': '/icon/icon16.png',
        '48': '/icon/icon48.png',
        '128': '/icon/icon128.png',
    },
    action: {
        default_icon: {
            '16': '/icon/icon16.png',
            '24': '/icon/icon24.png',
            '32': '/icon/icon32.png',
        },
    },
};
