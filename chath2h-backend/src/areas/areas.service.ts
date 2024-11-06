import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Area } from './entities/areas.entity';
import { Model, ObjectId } from 'mongoose';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { TranslationService } from 'src/translation/translation.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name) private readonly areaModel: Model<Area>,
    private readonly i18n: I18nService,
    private readonly translationService: TranslationService,
    private readonly filesService: FilesService,
  ) {}

  async deleteArea(areaId: string) {
    return await this.areaModel.updateOne(
      { _id: areaId },
      { isVisible: false },
    );
  }

  async createArea(area: CreateAreaDto & { areaImage: ObjectId }) {
    const translation = await this.translationService.translate(area.name);
    return await this.areaModel.create({ ...area, translation });
  }

  async updateArea(updateArea: UpdateAreaDto) {
    const translation = await this.translationService.translate(updateArea.name);
    const area = await this.areaModel.findById(updateArea.id ).lean();
    const oldAreaImageId: ObjectId = area.areaImage;

    const result = await this.areaModel.updateOne(
      { _id: updateArea.id },
      { ...updateArea, translation },
    );

    if (updateArea.areaImage && oldAreaImageId) this.filesService.deleteImage(oldAreaImageId);

    return result;
  }

  public async getAreas() {
    const areas = await this.areaModel.aggregate([
      {
        $match: {
          isVisible: true,
        },
      },
      {
        $lookup: {
          from: 'needoffers',
          localField: '_id',
          foreignField: 'area',
          as: 'needOffers',
        },
      },
      {
        $lookup: {
          from: 'coachoffers',
          localField: '_id',
          foreignField: 'area',
          as: 'coachOffers',
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'areaImage',
          foreignField: '_id',
          as: 'areaImage',
        },
      },
      {
        $unwind: {
          path: '$areaImage',
        },
      },
      {
        $addFields: {
          nameSort: {
            $cond: {
              if: { $eq: ['$name', 'other'] },
              then: 999,
              else: 0,
            },
          },
        },
      },
      {
        $sort: {
          nameSort: 1,
          name: 1,
        },
      },
      {
        $project: {
          _id: '$_id',
          name: '$name',
          areaImage: '$areaImage.filename',
          translation: '$translation',
          needOffersCount: {
            $size: '$needOffers',
          },
          helpOffersCount: {
            $size: '$coachOffers',
          },
        },
      },
    ]);

    return areas;
  }
}
