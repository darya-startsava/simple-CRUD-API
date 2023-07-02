import { ServerResponse } from 'node:http';
import CustomRequest from './interfaces/customRequest';
import { ENDPOINT } from './constants';
import uuidValidation from './validation/uuidValidation';

export const get = (request: CustomRequest, response: ServerResponse) => {
  if (request.url === ENDPOINT || request.url === `${ENDPOINT}/`) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(request.users));
    response.end();
  } else {
    const id = request.url.split('/')[3];
    if (uuidValidation(id)) {
      const result = request.users.find((user) => user.id === id);
      if (result) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(request.users.find((user) => user.id === id)));
        response.end();
      } else {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'application/json');
        response.write(`User with id=${id} doesn't exist`);
        response.end();
      }
    } else {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'application/json');
      response.write('User id is not valid, it should be uuid');
      response.end();
    }
  }
};
