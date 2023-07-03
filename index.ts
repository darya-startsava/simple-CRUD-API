import { createServer } from 'http';
import 'dotenv/config';

import { ENDPOINT } from './src/constants';
import { get } from './src/get';
import CustomRequest from './src/interfaces/customRequest';
import users from './src/dataBase';
import getBody from './src/getBody';
import { post } from './src/post';
import { put } from './src/put';
import { del } from './src/delete';

const PORT = process.env.PORT || 4000;
const server = createServer((request: CustomRequest, response) => {
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
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
