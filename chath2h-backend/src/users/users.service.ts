import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId as mongoObject } from 'mongodb';
import { Model, ObjectId, PaginateResult, PipelineStage } from 'mongoose';
import { Area } from 'src/areas/entities/areas.entity';
import { RegistrationDto } from 'src/auth/dto/registration.dto';
import { Files } from 'src/files/entity/files.entity';
import { RefLinkService } from 'src/magic-link-creator/ref-magic-link';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PaginationUserDto } from './dto/users-paginate.dto';
import { User } from './entities/user.entity';
import { Workbook } from 'exceljs';
import { exportWordCsvService } from 'src/utils/exportWordCsv';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Area.name) private readonly areaModel: Model<Area>,
    @InjectModel(User.name) private readonly userModel: Model<User>, // @InjectModel(Files.name) private readonly filesModel: Model<Files>,
    private readonly refLinkService: RefLinkService,
    private readonly filesService: FilesService,
  ) {}

  public async getAllQuery(
    query: PaginationUserDto,
  ): Promise<Partial<PaginateResult<User>>> {
    const { filterBy, sortBy, limit, page } = query;

    const matchFilters: PipelineStage = {
      $match: {},
    };

    const buildMatchFilter = (fieldName: string, value: string | boolean) => {
      if (typeof value === 'boolean') {
        matchFilters.$match[fieldName] = { $eq: value };
      } else {
        matchFilters.$match[fieldName] = {
          $regex: value,
          $options: 'i',
        };
      }
    };

    if (filterBy.length) {
      filterBy.map((singleFilter) =>
        buildMatchFilter(singleFilter.id, singleFilter.value),
      );
    }

    const pipeline: PipelineStage[] = [matchFilters];

    const countPipeline = [
      ...pipeline,
      {
        $count: 'totalDocs',
      },
    ];

    if (sortBy) {
      pipeline.push({ $sort: { ...sortBy, firstName: 1 } });
    }

    const skip = (page - 1) * limit;

    if (skip) {
      pipeline.push({ $skip: skip });
    }

    if (limit) {
      pipeline.push({ $limit: limit });
    }

    const [result, countResult] = await Promise.all([
      this.userModel.aggregate(pipeline),
      this.userModel.aggregate(countPipeline),
    ]);

    const totalDocs = countResult[0]?.totalDocs || 0;

    const totalPages = Math.ceil(totalDocs / limit);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    const formattedResults = {
      users: result,
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

  public async getUsersListFile(isExcel: boolean) {
    const users: User[] = await this.userModel
      .find()
      .select('email firstName lastName city isDisabled')
      .lean();

    const headers = [
      'Id',
      'Email',
      'FirstName',
      'LastName',
      'City',
      'IsDisabled',
    ];

    return exportWordCsvService(users, headers, 'user-list', isExcel);
  }

  public findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  public getById(id: string) {
    return this.userModel.findById(id).lean();
  }

  public findOneById(id: string) {
    return this.userModel
      .findById(id)
      .populate<{
        favoriteCoaches: User['favoriteCoaches'];
        avatar: Files;
        coachProfile: { coachPhoto: Files };
      }>({
        path: 'favoriteCoaches',
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
      .populate('avatar coachProfile.coachPhoto');
  }

  public updateIsInChat(ids: string[], isInChat = false) {
    return this.userModel.updateMany(
      { _id: { $in: ids } },
      { $set: { isInChat } },
    );
  }

  public async checkIsInChat(ids: string[]) {
    const usersInChat = await this.userModel.find({
      _id: { $in: ids },
      isInChat: true,
    });

    return usersInChat.length > 0;
  }

  public createUser(registrationData: RegistrationDto & { email: string }) {
    return this.userModel.create(registrationData);
  }

  public updateUser(email: string, attrs: Partial<User>) {
    return this.userModel.findOneAndUpdate({ email }, attrs);
  }

  public async updateUserById(
    id: string,
    attrs: UpdateUserDto,
    avatar?: ObjectId,
    coachPhoto?: ObjectId,
  ) {
    const existingDocument = await this.userModel.findById(id).lean();

    if (!existingDocument) {
      return null;
    }

    const oldAvatarId: ObjectId = existingDocument.avatar;
    const oldCoachPhotoId: ObjectId = existingDocument.coachProfile?.coachPhoto;

    const userAttrs = this.getUserAttributes(
      attrs,
      existingDocument,
      avatar,
      coachPhoto,
    );

    const updatedDocument = Object.assign(existingDocument, userAttrs);

    const savedDocument = await this.userModel.findByIdAndUpdate(
      id,
      updatedDocument,
      { new: true },
    );

    if (avatar && oldAvatarId) this.filesService.deleteImage(oldAvatarId);
    if (coachPhoto && oldCoachPhotoId)
      this.filesService.deleteImage(oldCoachPhotoId);

    return savedDocument;
  }

  public async getUsersStatistics() {
    const userStatistic = await this.userModel.aggregate([
      {
        $match: {
          admin: { $ne: true },
        },
      },
      {
        $facet: {
          genderCounts: [
            {
              $group: {
                _id: '$gender',
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          maritalStatusCounts: [
            {
              $group: {
                _id: '$maritalStatus',
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          countryCounts: [
            {
              $group: {
                _id: '$country',
                count: { $sum: 1 },
              },
            },
          ],
          professionalActivityCounts: [
            {
              $group: {
                _id: '$professionalActivity',
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          languageCounts: [
            {
              $unwind: '$language',
            },
            {
              $group: {
                _id: '$language',
                count: { $sum: 1 },
              },
            },
          ],
          ageCounts: [
            {
              $project: {
                age: 1,
                ageRange: {
                  $switch: {
                    branches: [
                      {
                        case: {
                          $and: [{ $gte: ['$age', 0] }, { $lte: ['$age', 17] }],
                        },
                        then: '0-17',
                      },
                      {
                        case: {
                          $and: [
                            { $gte: ['$age', 18] },
                            { $lte: ['$age', 24] },
                          ],
                        },
                        then: '18-24',
                      },
                      {
                        case: {
                          $and: [
                            { $gte: ['$age', 25] },
                            { $lte: ['$age', 34] },
                          ],
                        },
                        then: '25-34',
                      },
                      {
                        case: {
                          $and: [
                            { $gte: ['$age', 35] },
                            { $lte: ['$age', 44] },
                          ],
                        },
                        then: '35-44',
                      },
                      {
                        case: {
                          $and: [
                            { $gte: ['$age', 45] },
                            { $lte: ['$age', 54] },
                          ],
                        },
                        then: '45-54',
                      },
                      {
                        case: {
                          $and: [
                            { $gte: ['$age', 55] },
                            { $lte: ['$age', 64] },
                          ],
                        },
                        then: '55-64',
                      },
                      { case: { $gte: ['$age', 65] }, then: '65+' },
                    ],
                    default: 'Unknown',
                  },
                },
              },
            },
            {
              $group: {
                _id: '$ageRange',
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
      {
        $project: {
          statistics: {
            $objectToArray: {
              Gender: '$genderCounts',
              Marital_Status: '$maritalStatusCounts',
              Country: '$countryCounts',
              Professional_Activity: '$professionalActivityCounts',
              Language: '$languageCounts',
              Age: '$ageCounts',
            },
          },
        },
      },
    ]);

    return userStatistic[0].statistics;
  }

  public async getMyNeedsAndOffers(userId: string) {
    const [myOffers, myNeeds] = await Promise.all([
      this.myOffersAggregation(userId),
      this.myNeedsAggregation(userId),
    ]);
    const result = { needs: myNeeds[0]?.needs, offers: myOffers[0]?.offers };
    const areaResult = await this.areaModel.populate(result, {
      path: 'offers.area needs.area',
    });
    return areaResult;
  }

  myNeedsAggregation(userId: string) {
    const userIdObj = new mongoObject(userId);
    return this.userModel.aggregate([
      {
        $match: {
          _id: userIdObj,
        },
      },
      {
        $lookup: {
          from: 'needoffers',
          localField: '_id',
          foreignField: 'user',
          as: 'needs',
        },
      },
      {
        $unwind: '$needs',
      },
      {
        $sort: {
          'needs.updatedAt': -1,
        },
      },
      {
        $lookup: {
          from: 'interactions',
          localField: 'needs._id',
          foreignField: 'need',
          as: 'needs.chats',
        },
      },
      {
        $unwind: {
          path: '$needs.chats',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'conversations',
          let: {
            need_id: '$needs._id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$need', '$$need_id'],
                },
              },
            },
            {
              $unwind: '$messages',
            },
            {
              $lookup: {
                from: 'messages',
                localField: 'messages',
                foreignField: '_id',
                as: 'message',
              },
            },
            {
              $unwind: '$message',
            },
            {
              $match: {
                'message.viewed': false,
                'message.to': userIdObj,
              },
            },
            {
              $count: 'unreadMessagesCount',
            },
          ],
          as: 'unreadMessages',
        },
      },
      {
        $unwind: {
          path: '$unreadMessages',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'needs.image',
          foreignField: '_id',
          as: 'needs.image',
        },
      },
      {
        $unwind: '$needs.image',
      },
      {
        $group: {
          _id: '$needs._id',
          user: {
            $first: '$$ROOT',
          },
          need: {
            $first: '$needs',
          },
          chats: {
            $push: '$needs.chats',
          },
          unreadMessages: {
            $push: '$unreadMessages',
          },
        },
      },
      {
        $addFields: {
          totalUnreadMessages: {
            $reduce: {
              input: '$unreadMessages',
              initialValue: 0,
              in: {
                $add: ['$$value', '$$this.unreadMessagesCount'],
              },
            },
          },
        },
      },
      {
        $sort: { 'need.isActive': -1, 'need.createdAt': -1 },
      },
      {
        $group: {
          _id: '$user._id',
          needs: {
            $push: {
              _id: '$need._id',
              problemTitle: '$need.problemTitle',
              image: '$need.image',
              description: '$need.description',
              availableFrom: '$need.availableFrom',
              hashtags: '$need.hashtags',
              area: '$need.area',
              user: '$need.user',
              isActive: '$need.isActive',
              chats: '$chats',
              totalUnreadMessages: '$totalUnreadMessages',
              createdAt: '$need.createdAt',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          needs: '$needs',
        },
      },
    ]);
  }

  myOffersAggregation(userId: string) {
    const userIdObj = new mongoObject(userId);
    return this.userModel.aggregate([
      {
        $match: {
          _id: userIdObj,
        },
      },
      {
        $lookup: {
          from: 'coachoffers',
          localField: '_id',
          foreignField: 'user',
          as: 'offers',
        },
      },
      {
        $unwind: '$offers',
      },
      {
        $sort: {
          'offers.updatedAt': -1,
        },
      },
      {
        $lookup: {
          from: 'interactions',
          localField: 'offers._id',
          foreignField: 'coachOffer',
          as: 'offers.chats',
        },
      },
      {
        $unwind: {
          path: '$offers.chats',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'conversations',
          let: {
            offer_id: '$offers._id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$coachOffer', '$$offer_id'],
                },
              },
            },
            {
              $unwind: '$messages',
            },
            {
              $lookup: {
                from: 'messages',
                localField: 'messages',
                foreignField: '_id',
                as: 'message',
              },
            },
            {
              $unwind: '$message',
            },
            {
              $match: {
                'message.viewed': false,
                'message.to': userIdObj,
              },
            },
            {
              $count: 'unreadMessagesCount',
            },
          ],
          as: 'unreadMessages',
        },
      },
      {
        $unwind: {
          path: '$unreadMessages',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'offers.representativePhoto',
          foreignField: '_id',
          as: 'offers.representativePhoto',
        },
      },
      {
        $unwind: '$offers.representativePhoto',
      },
      {
        $group: {
          _id: '$offers._id',
          user: {
            $first: '$$ROOT',
          },
          offer: {
            $first: '$offers',
          },
          chats: {
            $push: '$offers.chats',
          },
          unreadMessages: {
            $push: '$unreadMessages',
          },
        },
      },
      {
        $addFields: {
          totalUnreadMessages: {
            $reduce: {
              input: '$unreadMessages',
              initialValue: 0,
              in: {
                $add: ['$$value', '$$this.unreadMessagesCount'],
              },
            },
          },
        },
      },
      {
        $sort: { 'offer.isActive': -1, 'offer.createdAt': -1 },
      },
      {
        $group: {
          _id: '$user._id',
          offers: {
            $push: {
              _id: '$offer._id',
              problemTitle: '$offer.problemTitle',
              representativePhoto: '$offer.representativePhoto',
              description: '$offer.description',
              availableFrom: '$offer.availableFrom',
              hashtags: '$offer.hashtags',
              area: '$offer.area',
              user: '$offer.user',
              isActive: '$offer.isActive',
              chats: '$chats',
              totalUnreadMessages: '$totalUnreadMessages',
              createdAt: '$offer.createdAt',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          offers: '$offers',
        },
      },
    ]);
  }

  private getUserAttributes(
    attrs: UpdateUserDto,
    existingDocument: any,
    avatar?: ObjectId,
    coachPhoto?: ObjectId,
  ) {
    if (avatar !== undefined) {
      return { ...attrs, avatar };
    } else if (attrs?.coachProfile) {
      return {
        ...attrs,
        coachProfile: {
          coachCompetence:
            attrs?.coachProfile?.coachCompetence ||
            existingDocument.coachProfile.coachCompetence,
          about:
            attrs?.coachProfile?.about || existingDocument.coachProfile.about,
          coachPhoto: coachPhoto || existingDocument.coachProfile.coachPhoto,
        },
      };
    } else {
      return attrs;
    }
  }

  public markAsReadWelcomeMessage(_id: string) {
    return this.userModel.findOneAndUpdate(
      { _id },
      { isWelcomeMessageRead: true },
    );
  }

  public disableOrEnableUser(_id: string, isDisabled = true) {
    return this.userModel.findOneAndUpdate({ _id }, { isDisabled });
  }

  public async generateRefLink(_id: string) {
    const user = await this.userModel.findById(_id);

    if (user?.refLink) return user.refLink;

    const refLink = this.refLinkService.createRefMagicLink(_id);
    user.refLink = refLink;
    await user.save();

    return refLink;
  }
}
