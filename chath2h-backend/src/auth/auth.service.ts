import {ForbiddenException, Injectable} from '@nestjs/common';
import {Settings} from 'src/settings';
import {TokenTransactionCreateDto} from 'src/tokenTransaction/dto/token-transaction-create.dto';
import {TokenTransactionFee} from 'src/tokenTransaction/entities/token-transaction-fee';
import {TokenTransactionStatus} from 'src/tokenTransaction/entities/token-transaction-status';
import {TokenTransactionType} from 'src/tokenTransaction/entities/token-transaction-type';
import {TokenTransactionService} from 'src/tokenTransaction/token-transaction.service';
import {User} from 'src/users/entities/user.entity';
import {UsersService} from 'src/users/users.service';
import {RegistrationDto} from './dto/registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenTransactionService: TokenTransactionService,
  ) {}

  async registerUser(
    registrationData: RegistrationDto,
    isReferenceRegister = false,
  ): Promise<User> {
    const user = await this.usersService.createUser(registrationData);

    const transactionOptions = {
      fee: TokenTransactionFee.DISABLED,
      status: TokenTransactionStatus.SUCCEDED,
    };

    const transactions = [
      this.tokenTransactionService.createTransaction(
        new TokenTransactionCreateDto({
          amount: Settings.INITIAL_TOKEN_AMOUNT,
          recipient: user._id,
          type: TokenTransactionType.NEW_USER,
          ...transactionOptions,
        }),
      ),
    ];

    if (isReferenceRegister) {
      transactions.push(
        this.tokenTransactionService.createTransaction(
          new TokenTransactionCreateDto({
            amount: Settings.REF_TOKEN_REWARD_AMOUNT,
            recipient: String(user.referrer),
            type: TokenTransactionType.REF_LINK,
            ...transactionOptions,
          }),
        ),
      );
    }

    await Promise.all([transactions]);
    return user;
  }

  async validateUser(email: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (user?.isDisabled) {
      throw new ForbiddenException('This user is disabled');
    }
    return user;
  }

  async getUserById(id: string): Promise<User> {
      return this.usersService.getById(id);
  }
}
