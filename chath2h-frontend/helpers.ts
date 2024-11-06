import type { TLanguages } from 'countries-list';
import { Conversation, ConversationType, Enum, Recipient, SelectOptions, Thread } from 'globalTypes';
import { TFunction } from 'i18next';
import { MultiValue, SingleValue } from 'react-select';

export const welcomeMessageData = { conversation: ConversationType.WELCOME_MSG };

export const separatorTranslate = '#@!$';

export const languageOptions = [
  { value: 'en', label: 'EN' },
  { value: 'de', label: 'DE' },
  { value: 'pl', label: 'PL' },
  { value: 'fr', label: 'FR' },
  { value: 'es', label: 'ES' }, //Spanish
  { value: 'pt-BR', label: 'PT-BR' }, //Portuguese - Brazilian
  { value: 'it', label: 'IT' }, //Italian
  { value: 'sv', label: 'SV' }, //Swedish
  { value: 'nb', label: 'nb' }, //Norwegian (Bokmål)
  { value: 'fi', label: 'FI' }, //Finnish
  { value: 'nl', label: 'NL' }, //Dutch
  { value: 'tr', label: 'TR' }, //Turkish
  { value: 'el', label: 'EL' }, // Greek
  { value: 'uk', label: 'UK' }, //Ukrainian
  { value: 'ru', label: 'RU' }, //Russian
  { value: 'ja', label: 'JA' }, //Japanese
  { value: 'zh', label: 'ZH' }, //Chinese
  { value: 'ko', label: 'KO' } //Korean
];

export const ageOptions = [
  { label: '0-17', value: '0-17', range: { from: 0, to: 17 } },
  { label: '18-24', value: '18-24', range: { from: 18, to: 24 } },
  { label: '25-34', value: '25-34', range: { from: 25, to: 34 } },
  { label: '35-44', value: '35-44', range: { from: 35, to: 44 } },
  { label: '45-54', value: '45-54', range: { from: 45, to: 54 } },
  { label: '55-64', value: '55-64', range: { from: 55, to: 64 } },
  { label: '65+', value: '65+', range: { from: 65 } }
];

export const FILE_SIZE = 5242880;

export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

type GetOptions = { t?: TFunction<'common', undefined>; reverse?: boolean; keyForValue?: boolean };

export const getLanguageOptions = (languages: TLanguages, allOption?: SelectOptions) => {
  const options: SelectOptions[] = [];
  allOption && options.push(allOption);
  for (const [key, value] of Object.entries(languages)) {
    options.push({ value: key, label: value.native + ' (' + value.name + ')' });
  }
  return options;
};

export const getSelectOptions = (
  selectOptions: { [key: string]: string },
  config?: { t?: TFunction<'common', undefined> },
  addAllFilter = false
) => {
  const options: SelectOptions[] = [];

  if (!config?.t) return options;

  for (const key in selectOptions) {
    const label = config.t(selectOptions[key]);
    options.push({ value: key, label });
  }

  if (addAllFilter) {
    const allOption = { label: config.t('CategoriesFilter_sort_option_all'), value: undefined };
    options.unshift(allOption);
  }

  return options;
};

export const getOptions = (enumData: Enum, config?: GetOptions) => {
  const options: SelectOptions[] = [];

  for (const [key, value] of Object.entries(enumData)) {
    if (config?.t) {
      options.push({ value: key, label: config.t(value) });
    }
  }

  return options;
};

export const handleSelectChange = (
  name: string,
  newValue: SingleValue<SelectOptions> | MultiValue<SelectOptions>,
  setFieldValue: (
    name: string,
    newValue: SingleValue<SelectOptions> | MultiValue<SelectOptions>
  ) => void
) => newValue && setFieldValue(name, newValue);

export const getHourMinutes = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

export const validateMessage = (message: string) => {
  const combinedRegex =
    /(www\..+\..+)|(.*\.(com|net|org|io))|(.*\/.*)|(\d{10}|\d{3}\s\d{3}\s\d{4}|\(\d{3}\)\s\d{3}\s\d{4})|(\d\s*){4,}/;
  return !combinedRegex.test(message);
};

export const requestDownloadFile = (data: Blob, filename: string, isExcel?: boolean) => {
  const href = URL.createObjectURL(data);

  const file = isExcel ? `${filename}.xlsx` : `${filename}.csv`;
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', file);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

export function findOverallLatestConversationWithRecipient(threads: Thread[]) {
  let overallLatestConversation: Conversation | null = null;
  let overallRecipient: Recipient | null = null;

  threads.forEach((thread) => {
    const { recipient, conversations } = thread;

    conversations.forEach((conversation) => {
      const currentConversation = { ...conversation };
      currentConversation.messagesCount = currentConversation.messages.filter(
        (m) => !m.systemMessage
      ).length;

      if (
        !overallLatestConversation ||
        currentConversation.updatedAt > overallLatestConversation.updatedAt
      ) {
        overallLatestConversation = currentConversation;
        overallRecipient = recipient;
      }
    });
  });

  if (overallRecipient && overallLatestConversation) {
    return { recipient: overallRecipient, conversation: overallLatestConversation };
  } else {
    return null;
  }
}
