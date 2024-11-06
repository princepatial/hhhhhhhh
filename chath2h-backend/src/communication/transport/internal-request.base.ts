import { RequestMessage } from './message.interfaces';

export default abstract class InternalRequestBase implements RequestMessage {
  channelPrefix = 'internal';
  channelPostfix = 'response';
}
