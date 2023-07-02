import { ServerResponse } from 'node:http';
import CustomRequest from './interfaces/customRequest';

export const post = (request: CustomRequest, response: ServerResponse) => {
  request.users.push(request.body);
  response.statusCode = 201;
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify(request.users));
  response.end();
};
