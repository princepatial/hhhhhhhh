import {
  createParamDecorator,
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

export const CustomUploadedFile = createParamDecorator(
  (options: { fileType: RegExp; maxSize: number }, req: Express.Request) => {
    const file: Express.Multer.File = req.file;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileTypeValidator = new FileTypeValidator({
      fileType: options.fileType,
    });
    const maxSizeValidator = new MaxFileSizeValidator({
      maxSize: options.maxSize,
    });

    const fileTypeValid = fileTypeValidator.isValid(file);
    const maxSizeValid = maxSizeValidator.isValid(file);

    if (!fileTypeValid) {
      throw new BadRequestException('Invalid file type');
    }

    if (!maxSizeValid) {
      throw new BadRequestException('File size exceeds the maximum allowed');
    }

    return file;
  },
);
