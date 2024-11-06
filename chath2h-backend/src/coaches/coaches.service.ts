import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { ObjectId as ObjectIdMongoose } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Files } from 'src/files/entity/files.entity';
import { PaginationDto } from 'src/coach-offer/dto/coach-offer-paginate.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class CoachService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  public saveCoachProfile(_id: string, coachProfile: any) {
    return this.userModel.findOneAndUpdate(
      { _id },
      { coachProfile },
      { new: true },
    );
  }

  public getCoachById(_id: string) {
    return this.userModel.findById({ _id });
  }

  public async updateFavoriteCoaches(
    favoriteUserId: string,
    currentUserId: string,
  ) {
    const isValidUser = await this.userModel.findOne({
      _id: favoriteUserId,
      coachProfile: { $exists: true },
    });
    if (!isValidUser)
      throw new BadRequestException(
        "Provided user isn't a coach or doesn't exist",
      );

    const user = await this.userModel.findById(currentUserId);
    const coaches: string[] = user.favoriteCoaches.map((coachId) =>
      coachId.toString(),
    );

    const coachIndex = coaches.findIndex(
      (id) => id.toString() === favoriteUserId,
    );

    if (coachIndex !== -1) {
      coaches.splice(coachIndex, 1);
    } else {
      coaches.push(favoriteUserId);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        currentUserId,
        {
          favoriteCoaches: coaches,
        },
        { new: true },
      )
      .populate<{ favoriteCoaches: User['favoriteCoaches'] }>(
        'favoriteCoaches',
      );

    return updatedUser;
  }

  public async getFavoriteCoaches(userId: string) {
    const favoriteCoaches = await this.favoriteCoachesAggregation(userId);
    return favoriteCoaches;
  }

  public async coachAreasAggregation(userId: string): Promise<
    {
      coachAreas: Array<string>;
      user: User & { coachProfile: { coachPhoto: Files } };
    } & Document
  > {
    const [coachAreas] = await this.userModel.aggregate([
      {
        $match: {
          _id: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'coachoffers',
          localField: '_id',
          foreignField: 'user',
          as: 'coachOffers',
        },
      },
      {
        $lookup: {
          from: 'areas',
          localField: 'coachOffers.area',
          foreignField: '_id',
          as: 'coachAreas',
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'coachProfile.coachPhoto',
          foreignField: '_id',
          as: 'coachProfile.coachPhoto',
        },
      },
      {
        $unwind: {
          path: '$coachProfile.coachPhoto',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          coachAreas: {
            $addToSet: '$coachAreas.name',
          },
          user: {
            $first: '$$ROOT',
          },
        },
      },
      {
        $unwind: {
          path: '$coachAreas',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return coachAreas;
  }

  public async getCoach(id: string) {
    const coach = await this.coachAggregation(id);
    return coach[0];
  }

  public async getAllCoaches(
    { filterBy, sortBy, limit, page }: PaginationDto,
    userId: string,
  ) {
    const pipelineAggregation: PipelineStage[] = [
      { $match: { coachProfile: { $exists: true } } },
      {
        $lookup: {
          from: 'coachoffers',
          localField: '_id',
          foreignField: 'user',
          as: 'coachOffer',
        },
      },
      {
        $unwind: {
          path: '$coachOffer',
        },
      },
      {
        $match: {
          'coachOffer.availableFrom': { $lte: new Date() },
          'coachOffer.isActive': { $eq: true },
        },
      },
      {
        $lookup: {
          from: 'areas',
          localField: 'coachOffer.area',
          foreignField: '_id',
          as: 'area',
        },
      },
      {
        $unwind: {
          path: '$area',
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'coachProfile.coachPhoto',
          foreignField: '_id',
          as: 'coachProfile.coachPhoto',
        },
      },
      {
        $unwind: {
          path: '$coachProfile.coachPhoto',
        },
      },
    ];

    if (filterBy) {
      const searchByFirstName = Object.keys(filterBy).includes('firstName');

      if (searchByFirstName) {
        const newFilters = Object.assign({}, filterBy);

        newFilters['firstName'] = {
          $regex: filterBy['firstName'],
          $options: 'i',
        };

        pipelineAggregation.push({ $match: newFilters });
      } else if (Object.keys(filterBy).includes('_id')) {
        pipelineAggregation.push({
          $match: { _id: new ObjectId(filterBy._id) },
        });
      } else {
        pipelineAggregation.push({ $match: filterBy });
      }
    }

    const userFollowed = (await this.userModel.findById(new ObjectId(userId)))
      ?.favoriteCoaches;

    const groupPipeline = [
      ...pipelineAggregation,
      {
        $group: {
          _id: '$_id',
          coachProfile: {
            $first: '$coachProfile',
          },
          firstName: {
            $first: '$firstName',
          },
          lastName: {
            $first: '$lastName',
          },
          categories: {
            $addToSet: '$area',
          },
          offersCount: { $sum: 1 },
        },
      },
      {
        $addFields: {
          isFollowed: {
            $in: ['$_id', { $ifNull: [userFollowed, []] }],
          },
        },
      },
    ];

    const countPipeline = [
      ...groupPipeline,
      {
        $count: 'totalDocs',
      },
    ];

    const countResult = await this.userModel.aggregate(countPipeline);

    const totalDocs = countResult[0]?.totalDocs || 0;

    const skip = (page - 1) * limit;

    if (sortBy) {
      groupPipeline.push({ $sort: { ...sortBy, firstName: 1 } });
    }

    if (skip) {
      groupPipeline.push({ $skip: skip });
    }

    if (limit) {
      groupPipeline.push({ $limit: limit });
    }

    const result = await this.userModel.aggregate(groupPipeline);

    const totalPages = Math.ceil(totalDocs / limit);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    const formattedResults = {
      docs: result,
      hasNextPage,
      hasPrevPage,
      limit,
      nextPage,
      page,
      pagingCounter: page,
      prevPage,
      totalDocs,
      totalPages,
    };

    return formattedResults;
  }

  public async getRandomCoaches(userIds: string[], userId: string) {
    const objectUserIds = userIds.map((id) => new ObjectId(id));
    objectUserIds.push(new ObjectId(userId));
    const randomCoaches = await this.randomCoachesAggregation(
      objectUserIds,
      5,
      userId,
    );

    if (randomCoaches.length < 5) {
      const refetchAmount = 5 - randomCoaches.length;

      const excludedObjectIds = randomCoaches.map(
        (user) => new ObjectId(user._id),
      );
      excludedObjectIds.push(new ObjectId(userId));

      const addedCoaches = await this.randomCoachesAggregation(
        excludedObjectIds,
        refetchAmount,
        userId,
      );

      return randomCoaches.concat(addedCoaches);
    }
    return randomCoaches;
  }

  public async checkCoachProp(userId: string) {
    const user = await this.userModel.findById(userId);
    return user?.coachProfile;
  }

  favoriteCoachesAggregation(userId: string) {
    return this.userModel.aggregate([
      {
        $match: {
          _id: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'coachoffers',
          localField: 'favoriteCoaches',
          foreignField: 'user',
          as: 'userOffers',
        },
      },

      {
        $unwind: {
          path: '$userOffers',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userOffers.user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          'user.email': 0,
          'user.admin': 0,
          'user.isDisabled': 0,
          'user.maritalStatus': 0,
          'user.occupation': 0,
          'user.professionalActivity': 0,
          'user.tokens': 0,
        },
      },
      {
        $lookup: {
          from: 'areas',
          localField: 'userOffers.area',
          foreignField: '_id',
          as: 'areas',
        },
      },
      { $unwind: '$areas' },
      {
        $group: {
          _id: '$userOffers.user',
          areas: {
            $addToSet: '$areas',
          },
          user: {
            $first: { $arrayElemAt: ['$user', 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'user.avatar',
          foreignField: '_id',
          as: 'user.avatar',
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'user.coachProfile.coachPhoto',
          foreignField: '_id',
          as: 'user.coachProfile.coachPhoto',
        },
      },
      {
        $unwind: '$user.avatar',
      },
      {
        $unwind: '$user.coachProfile.coachPhoto',
      },
    ]);
  }

  coachAggregation(userId: string) {
    return this.userModel.aggregate([
      {
        $match: {
          _id: new ObjectId(userId),
          coachProfile: { $exists: true },
        },
      },
      {
        $lookup: {
          from: 'coachoffers',
          localField: '_id',
          foreignField: 'user',
          as: 'userOffers',
        },
      },
      {
        $lookup: {
          from: 'areas',
          localField: 'userOffers.area',
          foreignField: '_id',
          as: 'areas',
        },
      },
      {
        $unwind: {
          path: '$areas',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: '$_id',
          areas: {
            $addToSet: '$areas',
          },
          user: {
            $first: '$$ROOT',
          },
        },
      },
      { $unset: ['user.areas', 'user.userOffers'] },
    ]);
  }

  async randomCoachesAggregation(
    userObjectIds: ObjectId[],
    limit: number,
    userId: string,
  ) {
    const userFollowed = (await this.userModel.findById(userId))
      ?.favoriteCoaches;

    return this.userModel.aggregate([
      { $match: { coachProfile: { $exists: true } } },
      {
        $project: {
          email: 0,
          admin: 0,
          isDisabled: 0,
          maritalStatus: 0,
          occupation: 0,
          professionalActivity: 0,
          tokens: 0,
        },
      },
      {
        $lookup: {
          from: 'coachoffers',
          let: { userId: '$_id', date: '$date' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user', '$$userId'] },
                    { $lte: ['$availableFrom', new Date()] },
                  ],
                },
              },
            },
          ],
          as: 'userOffers',
        },
      },
      {
        $lookup: {
          from: 'areas',
          localField: 'userOffers.area',
          foreignField: '_id',
          as: 'areas',
        },
      },
      {
        $unwind: {
          path: '$areas',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'avatar',
          foreignField: '_id',
          as: 'avatar',
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'coachProfile.coachPhoto',
          foreignField: '_id',
          as: 'coachProfile.coachPhoto',
        },
      },
      { $unwind: '$coachProfile.coachPhoto' },
      {
        $unwind: '$avatar',
      },
      {
        $group: {
          _id: '$_id',
          areas: {
            $addToSet: '$areas',
          },
          user: { $first: '$$ROOT' },
        },
      },
      { $unset: ['user.areas', 'user.userOffers'] },
      {
        $match: {
          _id: { $nin: userObjectIds },
        },
      },
      { $sample: { size: limit } },
      { $unwind: '$user' },
      {
        $addFields: {
          isFollowed: {
            $in: ['$_id', { $ifNull: [userFollowed, []] }],
          },
        },
      },
    ]);
  }

  public getTopCoaches = (limit = 10) => {
    return this.userModel.aggregate([
      {
        $match: {
          coachProfile: {
            $exists: true,
          },
        },
      },
      {
        $lookup: {
          from: 'interactions',
          localField: '_id',
          foreignField: 'coach',
          as: 'interactions',
        },
      },
      {
        $unwind: {
          path: '$interactions',
        },
      },
      {
        $match: {
          'interactions.rate': {
            $exists: true,
          },
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'coachProfile.coachPhoto',
          foreignField: '_id',
          as: 'coachProfile.coachPhoto',
        },
      },
      {
        $unwind: {
          path: '$coachProfile.coachPhoto',
        },
      },
      {
        $group: {
          _id: '$_id',
          firstName: {
            $first: '$firstName',
          },
          lastName: {
            $first: '$lastName',
          },
          coachProfile: {
            $first: '$coachProfile',
          },
          rate: {
            $avg: '$interactions.rate',
          },
          ratingsCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          rate: -1,
        },
      },
      {
        $limit: limit,
      },
    ]);
  };
}
