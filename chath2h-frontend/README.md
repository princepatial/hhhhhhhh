## Translations
### Use automatic translations plugin based on DeepL  
#### Configuration
1. Put Deppl API key (DEEPL_API_KEY) into .env

#### Available scripts
- `i18n-sync` - scan code for all new occurences of `t('translation_key')` and add translation key to default language file `public/translations/en/common.json` 
- `i18n-verify` - verify it here are not translated keys in translation files, throws error if so.
- `i18n-translate` - read default language file `public/translations/en/common.json` and translate all literals to all languages defined in configuration file `next-i18next.config.js`

#### Usage
1. Add translation key (keys) into page/component like this: `t('page/componenName_keyName')`
2. Add key manually to defualt translation file `public/translations/en/common.json`  or run synchronisaction `npm run i18n-sync` - it will add all new keys automatically
3. Add en translations into `public/translations/en/common.json` for key `page/componenName_kayName`
4. Run translation script `npm run i18n-translate` - it will translate all new keys added for default language `en` for each languages defined in configuration file `next-i18next.config.js`

==Synchronisaction script `(i18n-sync)` is run every time `npm run dev` is executed==
==Validation script (`i18n-validate`) is run every time `npm run build` is executed==

#### Add new language
To add new language edit configuration file `next-i18next.config.js` and add new language iso symbol to existing ones: `locales: ['en', 'de', 'fr']`