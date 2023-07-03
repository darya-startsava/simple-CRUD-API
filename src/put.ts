import { ServerResponse } from 'node:http';
import CustomRequest from './interfaces/customRequest';
import requestBodyValidation from './validation/requestBodyValidation';
import uuidValidation from './validation/uuidValidation';
import users from './dataBase';

export const put = (request: CustomRequest, response: ServerResponse) => {
  const id = request.url.split('/')[3];
  if (uuidValidation(id)) {
    const result = request.users.find((user) => user.id === id);
    if (result) {
      const validationIssues = requestBodyValidation(request.body);
      if (!validationIssues) {
        const editedUser = { ...request.body, ...{ id } };
        const index = request.users.findIndex((user) => user.id === id);
        users[index] = editedUser;
        response.statusCode = 201;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(editedUser));
        response.end();
      } else {
        response.statusCode = 400;
        response.setHeader('Content-Type', 'application/json');
        response.write(validationIssues);
        response.end();
      }
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
