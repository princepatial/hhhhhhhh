import { InteractionRequest } from '../entities/interaction-request.entity';
import { InteractionRequestStatus } from '../dto/interaction-request-status.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InteractionRequestStatusService {
  public async updateStatus(
    interactionRequest: InteractionRequest,
    newStatus: InteractionRequestStatus,
  ) {
    interactionRequest.status = newStatus;
    await interactionRequest.save();
  }
}
