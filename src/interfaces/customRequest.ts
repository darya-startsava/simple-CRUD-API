import { IncomingMessage } from 'node:http';
import User from './user';

export default interface CustomRequest extends IncomingMessage {
  users: Array<User>;
  data: string;
  body: User;
}
