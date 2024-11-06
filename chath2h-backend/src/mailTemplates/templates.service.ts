// templates.service.ts
import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class TemplatesService {
  private readonly templatesDir = __dirname + '/templates';

  constructor(private readonly i18n: I18nService) {
    Handlebars.registerHelper('t', (key) => {
      return this.i18n.t(key, {
        lang: I18nContext.current().lang,
      });
    });
  }

  public renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string {
    const templateFile = fs.readFileSync(
      `${this.templatesDir}/${templateName}.hbs`,
      'utf-8',
    );
    const template = Handlebars.compile(templateFile);
    return template(context);
  }
}
