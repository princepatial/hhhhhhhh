import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, PaginateResult } from 'mongoose';
import { Area } from 'src/areas/entities/areas.entity';
import { Files } from 'src/files/entity/files.entity';
import { User } from 'src/users/entities/user.entity';
import { Paginate } from 'src/utils/needOfferaggregation';
import { PaginationDto } from './dto/coach-offer-paginate.dto';
import { OfferDto } from './dto/coach-offer.dto';
import { CoachOffer } from './entity/coach-offer.entity';
import { NeedOffer } from 'src/needs/entities/need.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class CoachOfferService {
  constructor(
    @InjectModel(CoachOffer.name)
    private readonly coachOfferModel: Model<CoachOffer>,
    @InjectModel(NeedOffer.name)
    private readonly needOfferModel: Model<NeedOffer>,
    private readonly filesService: FilesService,
  ) {}

  postponeOffer(offerId: string, newOfferDate: Date) {
    return this.coachOfferModel.findOneAndUpdate(
      { _id: offerId },
      { availableFrom: newOfferDate },
    );
  }
  public async createOffer(offer: OfferDto) {
    return this.coachOfferModel.create(offer);
  }

  public async getOffers(
    query: PaginationDto,
    country?: string,
  ): Promise<Partial<PaginateResult<CoachOffer>>> {
    const paginatedCoachOffers = Paginate({
      ...query,
      country,
      model: this.coachOfferModel,
    });

    return paginatedCoachOffers;
  }

  public async getOfferById(id: string) {
    const populatedCoachOffer = await this.coachOfferModel
      .findById(id)
      .populate<{
        user: User;
        area: Area;
        representativePhoto: Files;
      }>('user area representativePhoto')
      .populate({
        path: 'user',
        populate: {
          path: 'avatar coachProfile.coachPhoto',
        },
      });
    return populatedCoachOffer;
  }

  public async updateOfferById(
    userId: string,
    offerId: string,
    updateData: Partial<OfferDto>,
  ) {
    const offer = await this.coachOfferModel.findById(offerId).lean();
    const oldRepresentativePhotoId: ObjectId = offer.representativePhoto;

    const result = await this.coachOfferModel.findOneAndUpdate(
      {
        _id: offerId,
        user: userId,
      },
      updateData,
      { new: true },
    );

    if (!result) throw new ForbiddenException('User cannot update this offer');

    if (updateData.representativePhoto && oldRepresentativePhotoId)
      this.filesService.deleteImage(oldRepresentativePhotoId);

    return result;
  }

  public async deleteOffer(offerId: string, userId: string) {
    const offer = await this.coachOfferModel.findById(offerId).lean();
    const oldRepresentativePhotoId: ObjectId = offer.representativePhoto;

    const result = await this.coachOfferModel.findOneAndDelete({
      _id: offerId,
      user: userId,
    });

    if (!result) throw new ForbiddenException('User cannot delete this offer');

    this.filesService.deleteImage(oldRepresentativePhotoId);
  }

  public async userSuggestedOffers(userId: string, userLang: string[]) {
    const userNeeds = await this.needOfferModel.find({ user: userId });
    const involvedAreas = userNeeds.map((need) => need.area);

    const coachOffersWithInvolvedAreas = await this.coachOfferModel
      .find({ user: { $ne: userId }, area: { $in: involvedAreas } })
      .populate<{ user: User; area: Area; representativePhoto: Files }>({
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
      .populate('area representativePhoto')

      .lean();

    const result = coachOffersWithInvolvedAreas
      .filter((offers) => {
        const lang = Array.isArray(offers.user.language)
          ? offers.user.language
          : [offers.user.language];
        return lang.some((lang) => userLang.includes(lang));
      })
      .slice(0, 3);

    return result;
  }
}
