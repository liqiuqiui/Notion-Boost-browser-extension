import fs from 'node:fs';
import path from 'node:path';

import type { GeneratedPublicFile } from 'wxt';

const LOCALES_DIR = 'locales';

/**
 * Converts the `manifest` section of `locales/<lang>.json` into the native extension
 * locale files `_locales/<lang>/messages.json`, which resolve the `__MSG_extName__` and
 * `__MSG_extDesc__` placeholders used in the manifest.
 *
 * This keeps manifest strings and UI strings in a single source of truth, so there is no
 * separate `public/_locales` to maintain. The generated files are emitted through WXT's
 * `build:publicAssets` hook, so they are available in both dev and build mode.
 */
export function generateExtensionLocales(): GeneratedPublicFile[] {
    if (!fs.existsSync(LOCALES_DIR)) {
        throw new Error(`[i18n] locales directory not found: ${LOCALES_DIR}`);
    }

    return fs
        .readdirSync(LOCALES_DIR)
        .filter((file) => file.endsWith('.json'))
        .map((file) => {
            const lang = path.basename(file, '.json');
            const resource = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf-8'));

            const messages = Object.fromEntries(
                Object.entries<string>(resource.manifest ?? {}).map(([key, message]) => [key, { message }]),
            );

            return {
                relativeDest: `_locales/${lang}/messages.json`,
                contents: `${JSON.stringify(messages, null, 4)}\n`,
            };
        });
}
