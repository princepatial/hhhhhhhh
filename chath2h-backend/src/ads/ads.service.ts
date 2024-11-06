import { Injectable } from '@nestjs/common';
import { Ad } from './entities/ad.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AdIdDto } from './dto/ad-id.dto';
import { CreateAdDto } from './dto/create-ad.dto';
import { SwitchPositionsDto } from './dto/switch-positions.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { FilesService } from 'src/files/files.service';
import { AdsLocation } from './types/ads-enums';

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(Ad.name) private readonly adModel: Model<Ad>,
    private readonly filesService: FilesService,
  ) {}

  async deleteAd(adId: AdIdDto) {
    const ad = await this.adModel.findById(adId).lean();
    const oldImageId: ObjectId = ad.image;

    await this.adModel.findOneAndDelete({ _id: adId });

    this.filesService.deleteImage(oldImageId);
  }

  async updateAd(updateData: UpdateAdDto) {
    const ad = await this.adModel.findById(updateData.id).lean();
    const oldImageId: ObjectId = ad.image;

    await this.adModel.findOneAndUpdate({ _id: updateData.id }, updateData);

    if (updateData.image && oldImageId)
      this.filesService.deleteImage(oldImageId);
  }

  async replacePosition(ad: SwitchPositionsDto) {
    const { position: oldPosition, location } = await this.adModel
      .findOne({ _id: ad.id })
      .lean();

    const updateQuery = {
      location: location,
      position: {},
    };

    if (oldPosition > ad.position) {
      updateQuery.position = { $gte: ad.position, $lt: oldPosition };
    } else {
      updateQuery.position = { $lte: ad.position, $gt: oldPosition };
    }

    const update = {
      $inc: { position: oldPosition > ad.position ? 1 : -1 },
    };

    await this.adModel.updateMany(updateQuery, update);

    await this.adModel.findOneAndUpdate(
      { _id: ad.id },
      { position: ad.position },
    );
  }

  async createAd(createAd: Partial<CreateAdDto> & { image: ObjectId }) {
    await this.adModel.updateMany(
      { location: createAd.location },
      { $inc: { position: 1 } },
    );

    return this.adModel.create({ ...createAd, position: 0 });
  }

  async createViews(createView: AdIdDto) {
    return await this.adModel.findByIdAndUpdate(
      { _id: createView.id },
      {
        $inc: { views: 1 },
      },
    );
  }

  async createVisits(createVisit: AdIdDto) {
    return await this.adModel.findByIdAndUpdate(
      { _id: createVisit.id },
      {
        $inc: { visits: 1 },
      },
    );
  }

  async getAds({
    isSortByName,
    type,
  }: {
    isSortByName?: boolean;
    type?: AdsLocation;
  }) {
    return await this.adModel
      .find(type ? { location: type } : undefined)
      .populate({ path: 'image', select: 'filename' })
      .sort(isSortByName ? { name: 1 } : { position: 1 });
  }
}
