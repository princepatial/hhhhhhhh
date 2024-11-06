import { SelectOptions } from 'globalTypes';

export type RegisterFormType = {
  firstName: string;
  lastName?: string;
  gender?: SelectOptions;
  country?: SelectOptions;
  age?: number;
  language?: SelectOptions[];
  city: string;
  avatar?: File;
  education?: SelectOptions;
  maritalStatus?: SelectOptions;
  occupation?: string;
  professionalActivity?: string;
  email?: string;
  walletAddress?: string;
  privacyPolicy?: boolean;
};
