import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { NeedsService } from 'src/needs/needs.service';
import { CoachOfferService } from 'src/coach-offer/coach-offer.service';
import { CoachService } from 'src/coaches/coaches.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userService: UsersService,
    private readonly needsService: NeedsService,
    private readonly coachOfferService: CoachOfferService,
    private readonly coachService: CoachService,
  ) {}

  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  async findDashboardUser(_id: string) {
    const rawUser: User = await this.userService.findOneById(_id).lean();

    const [
      userWithSuggestedNeeds,
      userWithSuggestedOffers,
      userWithFavoriteCoaches,
      userWithNeedsAndOffers,
    ] = await Promise.all([
      this.needsService.userSuggestedNeeds(_id, rawUser.language),
      this.coachOfferService.userSuggestedOffers(_id, rawUser.language),
      this.coachService.getFavoriteCoaches(_id),
      this.userService.getMyNeedsAndOffers(_id),
    ]);

    const user = {
      ...rawUser,
      suggestedNeeds: userWithSuggestedNeeds,
      suggestedOffers: userWithSuggestedOffers,
      favoriteCoaches: userWithFavoriteCoaches,
      myNeedsAndOffers: userWithNeedsAndOffers,
    };

    return user;
  }
}
