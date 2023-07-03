import User from '../interfaces/user';

const requestBodyValidation = (body: User) => {
  let validationIssues = '';
  if (!body.username || typeof body.username !== 'string') {
    validationIssues = 'username field is required and must be a string; ';
  }
  if (!body.age || typeof body.age !== 'number') {
    validationIssues += 'age field is required and must be a number; ';
  }
  if (
    !body.hobbies ||
    !Array.isArray(body.hobbies) ||
    body.hobbies.findIndex((i) => typeof i !== 'string') !== -1
  ) {
    validationIssues +=
      'hobbies field is required and must be an array of strings or empty array; ';
  }
  return validationIssues;
};

export default requestBodyValidation;
