// src/auth/dto/passwordless-authorization.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordlessAuthorization {
  @IsEmail()
  @IsNotEmpty()
  destination: string;
}