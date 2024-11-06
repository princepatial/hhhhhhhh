import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as deepl from 'deepl-node';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) { }

  async translate(text: string) {
    try {
      const languages: deepl.TargetLanguageCode[] = [
        'de',
        'fr',
        'pl',
        'en-GB',
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
      ];
      const apiKey = this.configService.get<string>('DEEPL_API_KEY');

      const translations: { [x: string]: string }[] = [];
      for (const lang of languages) {
        const langPath = lang.includes('-') ? lang.split('-')[0] : lang;

        const translation = await this.translateText(text, lang, apiKey);

        translations.push({ [langPath]: translation.text });
      }
      return translations;
    } catch (err) {
      console.log(err);
    }
  }

  private async translateText(
    text: string,
    targetLanguage: deepl.TargetLanguageCode,
    apiKey: string,
  ): Promise<deepl.TextResult> {
    const translator = new deepl.Translator(apiKey);
    const sourceLanguage =
      (I18nContext.current().lang as deepl.SourceLanguageCode) || null;

    return translator.translateText(text, sourceLanguage, targetLanguage);
  }
}
