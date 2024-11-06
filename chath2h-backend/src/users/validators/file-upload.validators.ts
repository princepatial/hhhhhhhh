import { Injectable } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FileUploadValidators {
  static validateImage(
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ): void {
    if (!file) {
      return callback(null, true);
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = extname(file.originalname);

    if (!allowedExtensions.includes(ext.toLowerCase())) {
      return callback(
        new Error('Invalid file type. Allowed: jpg, jpeg, png'),
        false,
      );
    }

    return callback(null, true);
  }
}
