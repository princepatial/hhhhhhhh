const gulp = require('gulp');
const fs = require('fs-extra');
const path = require('path');
const deepl = require('deepl-node');
const REGEX_PATTERN = /\bt\(\s*'([^']+)'\s*\)/g;
const NOT_TRASLATED_LITERAL = '__TRANSLATION_MISSING__';
require('dotenv').config();

const mainLanguage = 'en';
const languages = [
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
  'el',
];

gulp.task('i18n-translate', async function () {
  const chalkModule = await import('chalk');
  const chalk = chalkModule.default;
  const mainLang = getMainLanguage();
  const langs = getLanguages(mainLang);
  console.log(
    chalk.green(
      `Start translating resources for languages ${langs.join(', ')}`,
    ),
  );

  await translate(mainLang, langs, chalk);
  console.log(chalk.green(`Finished translating resources`));
});

async function translate(mainLang, langs, chalk) {
  const key = process.env.DEEPL_API_KEY;
  const translator = new deepl.Translator(key);

  const mainLangPath = `./src/i18n/${mainLang}/common.json`;
  const mainLangContent = fs.readFileSync(mainLangPath, 'utf8');
  const mainLangObject = JSON.parse(mainLangContent);

  const mainLangPrevPath = `./src/i18n/${mainLang}/common_prev.json`;
  const mainLangPrevContent = fs.readFileSync(mainLangPrevPath, 'utf8');
  const mainLangPrevObject = JSON.parse(mainLangPrevContent);

  const mainLangKeys = Object.keys(mainLangObject);

  await (async function () {
    for (const mKey of mainLangKeys) {
      for (const lKey of langs) {
        const langPath = `./src/i18n/${lKey}/common.json`;
        const langContent = fs.readFileSync(langPath, 'utf8');

        const langObject = JSON.parse(langContent);

        if (mainLangObject[mKey] == NOT_TRASLATED_LITERAL) {
          console.log(
            chalk.red(
              `Missing translation for key ${mKey} for language ${mainLang}. Translation skipped for this key`,
            ),
          );
        } else {
          if (
            !langObject.hasOwnProperty(mKey) ||
            langObject[mKey] == NOT_TRASLATED_LITERAL ||
            checkIfEdited(mKey, mainLangObject, mainLangPrevObject)
          ) {
            console.log(
              chalk.blue(`Translating key ${mKey} for language ${lKey}.`),
            );
            const translation = await translator.translateText(
              mainLangObject[mKey],
              mainLang,
              lKey,
            );
            langObject[mKey] = translation.text;
            fs.writeFileSync(langPath, JSON.stringify(langObject, null, 2));
            mainLangPrevObject[mKey] = mainLangObject[mKey];
            fs.writeFileSync(
              mainLangPrevPath,
              JSON.stringify(mainLangPrevObject, null, 2),
            );
          }
        }
      }
    }
  })();
}

function checkIfEdited(mKey, mainLangObject, mainLangPrevObject) {
  if (!mainLangPrevObject.hasOwnProperty(mKey)) {
    return true;
  } else {
    const match =
      mainLangPrevObject[mKey].trim() == mainLangObject[mKey].trim();
    if (!match) {
      return true;
    }
  }
  return false;
}

function getLanguages(mainLang) {
  return languages;
}

function getMainLanguage() {
  return mainLanguage;
}

gulp.task('i18n-sync', async function () {
  const chalkModule = await import('chalk');
  const chalk = chalkModule.default;
  console.log(chalk.green('Start analyzing translations'));

  const pagesDir = './src/mailbox';
  const result = [];
  getLanguages().forEach((lang) => verifyStructure(lang, chalk));
  findTranslationKeys(pagesDir, result);

  await sync(result, getLanguages(), chalk);
  console.log(chalk.green('Finished analyzing translations'));
});

function verifyStructure(lang, chalk) {
  if (!fs.existsSync(`./src/i18n/${lang}/common.json`)) {
    fs.mkdirSync(`./src/i18n/${lang}`, { recursive: true });
    fs.writeFileSync(
      `./src/i18n/${lang}/common.json`,
      JSON.stringify({}, null, 2),
      'utf8',
      function (err) {
        if (err) throw err;
        console.log(
          chalk.green(
            `Translation structure './src/i18n/${lang}/common.json' created for new language ${lang}`,
          ),
        );
      },
    );
  }
}

function findTranslationKeys(dirPath, result) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findTranslationKeys(filePath, result);
    } else if (path.extname(file) === '.tsx') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let match;

      while ((match = REGEX_PATTERN.exec(fileContent)) !== null) {
        const text = match[1] || match[2];
        if (text) {
          result.push(text);
        }
      }
    }
  });
}

async function sync(keys, languages, chalk) {
  languages.forEach((lang) => {
    const jsonFilePath = `./src/i18n/${lang}/common.json`;
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonObject = JSON.parse(jsonContent);
    console.log(chalk.yellow(`Starting analyzing for language ${lang}`));
    let missing = 0;
    let hasChanges = false;
    keys.forEach((key) => {
      if (!jsonObject.hasOwnProperty(key)) {
        console.log(
          chalk.red(
            `Translation key ${key} not found for language ${lang}. Adding key with default value`,
          ),
        );
        jsonObject[key] = NOT_TRASLATED_LITERAL;
        hasChanges = true;
        missing++;
      }
    });
    if (hasChanges) {
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObject, null, 2));
    }
    if (missing > 0) {
      console.log(
        chalk.yellow(
          `Finished analyzing for language ${lang}. ${missing} missing translation keys added`,
        ),
      );
    } else {
      console.log(
        chalk.green(
          `Finished analyzing for language ${lang}. No missing translation keys found`,
        ),
      );
    }
  });
}
