import { createServer } from 'http';
import 'dotenv/config';

import { ENDPOINT } from './src/constants';
import { get } from './src/get';
import CustomRequest from './src/interfaces/customRequest';

const PORT = process.env.PORT || 4000;
const server = createServer((request: CustomRequest, response) => {
  request.users = [];
  switch (request.url.slice(0, 10)) {
    case ENDPOINT:
      switch (request.method) {
        case 'GET':
          get(request, response);
          break;

        default:
          response.statusCode = 404;
          response.write('There is no such user');
          response.end();

          break;

        case 'POST':
          break;

        case 'PUT':
          break;

        case 'DELETE':
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
