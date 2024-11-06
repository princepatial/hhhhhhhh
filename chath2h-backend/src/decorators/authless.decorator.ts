import { SetMetadata } from '@nestjs/common';

export const Authless = () => SetMetadata('excludedResource', true);
