module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',
      'de',
      'fr',
      'pl',
      'nl',
      'es',
      'sv',
      'fi',
      'nb',
      'it',
      'pt-BR',
      'uk',
      'ru',
      'zh',
      'ko',
      'ja',
      'tr',
      'el'
    ]
  },
  localePath:
    typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',

  reloadOnPrerender: process.env.NODE_ENV === 'development'
};
