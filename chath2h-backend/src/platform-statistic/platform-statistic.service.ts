import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PlatformStatisticService {
  //   constructor(
  //     @InjectModel(User.name) private readonly userModel: Model<User>,
  //   ) {}
}
