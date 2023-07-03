import { ServerResponse } from 'http';
import CustomRequest from './interfaces/customRequest';
import users from './dataBase';
import getBody from './getBody';
import { ENDPOINT } from './constants';
import { get } from './get';
import { post } from './post';
import { put } from './put';
import { del } from './delete';

export function handle(request: CustomRequest, response: ServerResponse) {
  request.users = users;
  switch (request.url.slice(0, 10)) {
    case ENDPOINT:
      switch (request.method) {
        case 'GET':
          getBody(request, response, get);
          break;

        case 'POST':
          if (request.url === ENDPOINT || request.url === `${ENDPOINT}/`) {
            getBody(request, response, post);
            break;
          } else {
            response.statusCode = 404;
            response.write(`Wrong url, it should be ${ENDPOINT}`);
            response.end();
            break;
          }

        case 'PUT':
          getBody(request, response, put);
          break;

        case 'DELETE':
          getBody(request, response, del);
          break;

        default:
          response.statusCode = 404;
          response.write('This request is not implemented');
          response.end();
          break;
      }
      break;
    default:
      response.statusCode = 404;
      response.write(
        `Wrong endpoint was used. Correct is ${ENDPOINT} or ${ENDPOINT}/userId`
      );
      response.end();
      break;
  }
}
