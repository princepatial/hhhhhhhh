import { ObjectId } from 'mongodb';
import { Model, PipelineStage } from 'mongoose';
import { PaginationDto } from 'src/coach-offer/dto/coach-offer-paginate.dto';

export const Paginate = async ({
  filterBy,
  sortBy,
  limit,
  page,
  model,
  country,
}: PaginationDto & { model: Model<any> } & { country?: string }) => {
  const modelName = model.modelName.toLocaleLowerCase();
  const imageField =
    modelName === 'coachoffer' ? 'representativePhoto' : 'image';
  const skip = (page - 1) * limit;

  const pipelineAggregation: PipelineStage[] = [
    {
      $match: {
        isActive: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
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
        localField: 'area',
        foreignField: '_id',
        as: 'area',
      },
    },
    {
      $lookup: {
        from: 'files',
        localField: imageField,
        foreignField: '_id',
        as: imageField,
      },
    },
    { $unwind: '$user' },
    { $unwind: '$area' },
    { $unwind: `$${imageField}` },
    {
      $lookup: {
        from: 'files',
        localField: 'user.avatar',
        foreignField: '_id',
        as: 'user.avatar',
      },
    },
    { $unwind: '$user.avatar' },
    {
      $addFields: {
        'user.userCountry': {
          $eq: ['$user.country', country],
        },
      },
    },
  ];

  const array = ['user._id', 'area_id', '_id'];
  if (filterBy) {
    const includeId = array.some((item) =>
      Object.keys(filterBy).includes(item),
    );

    const newFilters: { [key: string]: string | ObjectId | number } = {};

    if (includeId) {
      for (const filter of Object.keys(filterBy)) {
        if (
          filter === 'user._id' ||
          filter === 'area._id' ||
          filter === '_id'
        ) {
          newFilters[filter] = new ObjectId(filterBy[filter]);
        } else {
          newFilters[filter] = filterBy[filter];
        }
      }
    }

    pipelineAggregation.push({ $match: includeId ? newFilters : filterBy });
  }

  if (modelName === 'coachoffer') {
    pipelineAggregation.push(
      {
        $match: {
          availableFrom: { $lte: new Date() },
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
        $unwind: '$user.coachProfile.coachPhoto',
      },
      {
        $group: {
          _id: '$user._id',
          user: { $first: '$user' },
          offer: {
            $push: {
              _id: '$_id',
              problemTitle: '$problemTitle',
              description: '$description',
              availableFrom: '$availableFrom',
              hashtags: '$hashtags',
              isActive: '$isActive',
              area: '$area',
              representativePhoto: `$${imageField}`,
              createdAt: '$createdAt',
            },
          },
          allAreas: {
            $addToSet: '$area.name',
          },
        },
      },
      {
        $addFields: {
          'user.areas': '$allAreas',
        },
      },
      { $unwind: '$offer' },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ['$offer', { user: '$user' }] },
        },
      },
    );
  }

  const countPipeline = [
    ...pipelineAggregation,
    {
      $count: 'totalDocs',
    },
  ];

  const countResult = await model.aggregate(countPipeline); //Count the amount of found docs first
  const totalDocs = countResult[0]?.totalDocs || 0;

  if (sortBy) {
    pipelineAggregation.push(
      {
        $sort: {
          'user.userCountry': -1,
          ...sortBy,
          problemTitle: 1,
        },
      },
      {
        $project: {
          'user.userCountry': 0,
        },
      },
    );
  }

  if (skip) {
    pipelineAggregation.push({ $skip: skip });
  }

  if (limit) {
    pipelineAggregation.push({ $limit: limit });
  }

  const result = await model.aggregate(pipelineAggregation);

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
};
