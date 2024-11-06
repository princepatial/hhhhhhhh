import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Files } from './entity/files.entity';
import { unlink } from 'fs';
@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Files.name) private readonly fileModel: Model<Files>,
  ) {}

  async getImage(filename: string) {
    const file = await this.fileModel.findOne({ filename }).lean();
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  public async saveImage(file: Express.Multer.File): Promise<ObjectId> {
    const insertedFile = await this.fileModel.create({ ...file });
    return insertedFile._id;
  }

  public async deleteImage(fileId: ObjectId): Promise<void> {
    const image = await this.fileModel.findById(fileId).lean();

    unlink(image.path, (err) => {
      if (err) {
        console.error(err);
      }
    });

    this.fileModel.deleteOne(fileId);
  }
}
