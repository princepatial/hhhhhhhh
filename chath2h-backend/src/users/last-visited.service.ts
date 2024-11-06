import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, lastViewedUrl } from './entities/user.entity';
import { saveLastVisitedDto } from './dto/lastVisited.dto';
import { CoachOfferService } from 'src/coach-offer/coach-offer.service';
import { NeedsService } from 'src/needs/needs.service';
import { VisitedSection } from 'src/types/user-enums';
import { CoachService } from 'src/coaches/coaches.service';

@Injectable()
export class LastVisited {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly coachOfferService: CoachOfferService,
    private readonly needService: NeedsService,
    private readonly coachService: CoachService,
    private readonly logger: Logger,
  ) {}
  async saveVisited({
    offerId,
    coachId,
    needId,
    userId,
  }: saveLastVisitedDto & { userId: string }) {
    if (offerId) {
      try {
        const {
          user: { firstName: userName },
          representativePhoto: { filename: avatar },
          area: { name: areas },
          problemTitle: title,
        } = await this.coachOfferService.getOfferById(offerId);

        await this.updateUserLastVisited(userId, {
          id: offerId,
          userName,
          areas,
          avatar,
          title,
          type: VisitedSection.OFFER,
        });
      } catch (err) {
        this.logger.error(
          'Error occurred while saving last visited coach offer page: ' + err,
        );
      }
    }

    if (needId) {
      try {
        const {
          problemTitle: title,
          area: { name: areas },
          image: { filename: avatar },
          user: { firstName: userName },
        } = await this.needService.getNeedById(needId);

        await this.updateUserLastVisited(userId, {
          id: needId,
          userName,
          areas,
          avatar,
          title,
          type: VisitedSection.NEED,
        });
      } catch (err) {
        this.logger.error(
          'Error occurred while saving last visited need offer  page: ' + err,
        );
      }
    }

    if (coachId) {
      try {
        const {
          user: {
            firstName: userName,
            coachProfile: {
              coachPhoto: { filename: avatar },
            },
          },
          coachAreas: areas,
        } = await this.coachService.coachAreasAggregation(coachId);
        await this.updateUserLastVisited(userId, {
          id: coachId,
          userName,
          areas,
          avatar,
          type: VisitedSection.COACH,
        });
      } catch (err) {
        this.logger.error(
          'Error occurred while saving last visited coach: ' + err,
        );
      }
    }
  }
  private async updateUserLastVisited(
    userId: string,
    lastViewedUrl: lastViewedUrl,
  ) {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user.lastViewedUrls) {
      user.lastViewedUrls = [];
    }

    user.lastViewedUrls = user.lastViewedUrls.filter(
      (url) => JSON.stringify(lastViewedUrl) !== JSON.stringify(url),
    );

    user.lastViewedUrls.unshift(lastViewedUrl);
    user.lastViewedUrls = user.lastViewedUrls.slice(0, 5);

    user.markModified('lastViewedUrls');
    await user.save();
  }
}
