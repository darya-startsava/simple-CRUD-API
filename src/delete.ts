import { ServerResponse } from 'node:http';
import CustomRequest from './interfaces/customRequest';
import uuidValidation from './validation/uuidValidation';

export const del = (request: CustomRequest, response: ServerResponse) => {
  const id = request.url.split('/')[3];
  if (uuidValidation(id)) {
    const index = request.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      request.users.splice(index, 1);
      response.statusCode = 204;
      response.setHeader('Content-Type', 'application/json');
      response.write(`User with id=${id} was found and deleted`);
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
};
