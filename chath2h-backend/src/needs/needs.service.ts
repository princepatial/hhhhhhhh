import { ForbiddenException, Injectable } from '@nestjs/common';
import { NeedDto } from './dto/need.dto';
import { NeedOffer } from './entities/need.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, PaginateResult } from 'mongoose';
import { Paginate } from 'src/utils/needOfferaggregation';
import { PaginationDto } from 'src/coach-offer/dto/coach-offer-paginate.dto';
import { Area } from 'src/areas/entities/areas.entity';
import { User } from 'src/users/entities/user.entity';
import { Files } from 'src/files/entity/files.entity';
import { CoachOffer } from 'src/coach-offer/entity/coach-offer.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class NeedsService {
  constructor(
    @InjectModel(NeedOffer.name)
    private readonly needOfferModel: Model<NeedOffer>,
    @InjectModel(CoachOffer.name)
    private readonly coachOfferModel: Model<CoachOffer>,
    private readonly filesService: FilesService,
  ) {}

  public createNeed(needData: NeedDto) {
    return this.needOfferModel.create(needData);
  }

  public async getNeeds(
    query: PaginationDto,
    country?: string,
  ): Promise<Partial<PaginateResult<NeedOffer>>> {
    const paginatedNeedOffers = await Paginate({
      ...query,
      country,
      model: this.needOfferModel,
    });

    return paginatedNeedOffers;
  }

  public getNeedById(id: string) {
    return this.needOfferModel
      .findById(id)
      .populate<{ user: User }>({
        path: 'user',
        populate: {
          path: 'avatar coachProfile.coachPhoto',
          select: 'filename',
        },
      })
      .populate<{ area: Area }>('area')
      .populate<{ image: Files }>('image');
  }

  public async updateNeedById(
    userId: string,
    needId: string,
    updateData: Partial<NeedDto>,
  ) {
    const need = await this.needOfferModel.findById(needId).lean();
    const oldImageId: ObjectId = need.image;

    const result = await this.needOfferModel.findOneAndUpdate(
      {
        _id: needId,
        user: userId,
      },
      updateData,
      { new: true },
    );

    if (!result) throw new ForbiddenException('User cannot update this need');

    if (updateData.image && oldImageId)
      this.filesService.deleteImage(oldImageId);

    return result;
  }

  public async deleteNeed(needId: string, userId: string) {
    const need = await this.needOfferModel.findById(needId).lean();
    const oldImageId: ObjectId = need.image;

    const result = await this.needOfferModel.findOneAndDelete({
      _id: needId,
      user: userId,
    });

    if (!result) throw new ForbiddenException('User cannot delete this need');

    this.filesService.deleteImage(oldImageId);
  }

  public async userSuggestedNeeds(userId: string, userLang: string[]) {
    const userNeeds = await this.coachOfferModel.find({ user: userId });
    const involvedAreas = userNeeds.map((need) => need.area);

    const needsWithInvolvedAreas = await this.needOfferModel
      .find({ user: { $ne: userId }, area: { $in: involvedAreas } })
      .populate<{ user: User; area: Area; image: Files }>({
        path: 'user',
        select: [
          '-email',
          '-admin',
          '-isDisabled',
          '-maritalStatus',
          '-occupation',
          '-professionalActivity',
          '-tokens',
        ],
      })
      .populate('area image')
      .lean();

    const result = needsWithInvolvedAreas
      .filter((needs) => {
        const lang = Array.isArray(needs.user.language)
          ? needs.user.language
          : [needs.user.language];
        return lang.some((lang) => userLang.includes(lang));
      })
      .slice(0, 3);

    return result;
  }
}
