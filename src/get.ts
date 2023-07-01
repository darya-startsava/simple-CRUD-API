import { IncomingMessage, ServerResponse } from 'node:http';
import CustomRequest from './interfaces/customRequest';
import { ENDPOINT } from './constants';

export const get = (
  request: CustomRequest,
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
  if (request.url === ENDPOINT) {
    response.statusCode = 200;
    response.write(`${JSON.stringify(request.users)}`);
    response.end();
  } else {
    response.statusCode = 404;
    response.write('There is no such user');
    response.end();
  }
};
