import { ServerResponse } from 'node:http';
import CustomRequest from './interfaces/customRequest';
import requestBodyValidation from './validation/requestBodyValidation';
import users from './dataBase';
import { v4 as uuidv4 } from 'uuid';

export const post = (request: CustomRequest, response: ServerResponse) => {
  const validationIssues = requestBodyValidation(request.body);
  if (!validationIssues) {
    const newUser = { ...request.body, id: uuidv4() };
    users.push(newUser);
    response.statusCode = 201;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(newUser));
    response.end();
  } else {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.write(validationIssues);
    response.end();
  }
};
