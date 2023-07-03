import { ServerResponse } from 'http';
import { handle } from './handle';
import CustomRequest from './interfaces/customRequest';
import User from './interfaces/user';
import users from './dataBase';

let request: CustomRequest, response: ServerResponse, body: User, userId: string;

jest.mock('./getBody', () => {
  return {
    default: function (
      req: CustomRequest,
      res: ServerResponse,
      next: (request: CustomRequest, response: ServerResponse) => void
    ) {
      req.body = body;
      next(req, res);
    },
  };
});

jest.mock('uuid', () => {
  return {
    v4: () => userId,
    validate: (id: string) => id === 'some_unique_id' || id === 'some_unique_id_2',
  };
});

function createMocks(url?: string, method?: string) {
  request = {
    url,
    method,
  } as CustomRequest;
  request.on = jest.fn();

  response = new ServerResponse(request);
  jest.spyOn(response, 'write');
}

describe('handle', () => {
  beforeEach(() => {
    users.splice(0, users.length);
    body = undefined;
    createMocks();
    userId = 'some_unique_id';
  });

  describe('GET request', () => {
    test('returns empty array by default', () => {
      // arrange
      request.url = '/api/users';
      request.method = 'GET';
      // act
      handle(request, response);
      // assert
      expect(response.write).toBeCalledWith('[]');
    });
  });

  describe('POST request', () => {
    test('creates a new user', () => {
      // arrange
      request.url = '/api/users';
      request.method = 'POST';
      body = {
        username: 'foo',
        age: 42,
        hobbies: [],
      } as User;
      // act
      handle(request, response);
      // assert
      expect(response.write).toBeCalledWith(
        JSON.stringify({
          username: 'foo',
          age: 42,
          hobbies: [],
          id: 'some_unique_id',
        })
      );
    });
  });

  // INTEGRATION_SCENARIO_1
  test('integration scenario 1', () => {
    // get all users
    createMocks();
    request.url = '/api/users';
    request.method = 'GET';
    handle(request, response);
    expect(response.write).toBeCalledWith(JSON.stringify([]));

    // create a new user
    createMocks();
    request.url = '/api/users';
    request.method = 'POST';
    body = {
      username: 'foo',
      age: 42,
      hobbies: [],
    } as User;
    handle(request, response);
    expect(response.write).toBeCalledWith(
      JSON.stringify({
        username: 'foo',
        age: 42,
        hobbies: [],
        id: 'some_unique_id',
      })
    );

    // get the new user
    createMocks();
    request.url = '/api/users';
    request.method = 'GET';
    handle(request, response);
    expect(response.write).toBeCalledWith(
      JSON.stringify([
        {
          username: 'foo',
          age: 42,
          hobbies: [],
          id: 'some_unique_id',
        },
      ])
    );

    // update the user
    createMocks();
    request.url = '/api/users/some_unique_id';
    request.method = 'PUT';
    body = {
      username: 'bar',
      age: 24,
      hobbies: ['reading'],
    } as User;
    handle(request, response);
    expect(response.write).toBeCalledWith(
      JSON.stringify({
        username: 'bar',
        age: 24,
        hobbies: ['reading'],
        id: 'some_unique_id',
      })
    );

    // delete the user
    createMocks();
    request.url = '/api/users/some_unique_id';
    request.method = 'DELETE';
    handle(request, response);
    expect(response.statusCode).toBe(204);

    // get the deleted new user
    createMocks();
    request.url = '/api/users/some_unique_id';
    request.method = 'GET';
    handle(request, response);
    expect(response.statusCode).toBe(404);
  });

  // INTEGRATION_SCENARIO_2
  test('integration scenario 2', () => {
    // create a new user
    createMocks();
    request.url = '/api/users';
    request.method = 'POST';
    body = {
      username: 'foo',
      age: 42,
      hobbies: [],
    } as User;
    handle(request, response);
    expect(response.write).toBeCalledWith(
      JSON.stringify({
        username: 'foo',
        age: 42,
        hobbies: [],
        id: 'some_unique_id',
      })
    );

    // get all users
    createMocks();
    request.url = '/api/users';
    request.method = 'GET';
    handle(request, response);
    expect(response.write).toBeCalledWith(
      JSON.stringify([
        {
          username: 'foo',
          age: 42,
          hobbies: [],
          id: 'some_unique_id',
        },
      ])
    );

    // create second user
    createMocks();
    request.url = '/api/users';
    request.method = 'POST';
    body = {
      username: 'bar',
      age: 24,
      hobbies: ['sport', 'music'],
    } as User;
    userId = 'some_unique_id_2';
    handle(request, response);
    expect(response.write).toBeCalledWith(
      JSON.stringify({
        username: 'bar',
        age: 24,
        hobbies: ['sport', 'music'],
        id: 'some_unique_id_2',
      })
    );

    // get all users
    createMocks();
    request.url = '/api/users';
    request.method = 'GET';
    handle(request, response);
    expect(response.write).toBeCalledWith(
      JSON.stringify([
        {
          username: 'foo',
          age: 42,
          hobbies: [],
          id: 'some_unique_id',
        },
        {
          username: 'bar',
          age: 24,
          hobbies: ['sport', 'music'],
          id: 'some_unique_id_2',
        },
      ])
    );

    // delete first user
    createMocks();
    request.url = '/api/users/some_unique_id';
    request.method = 'DELETE';
    handle(request, response);
    expect(response.statusCode).toBe(204);

    // get all users
    createMocks();
    request.url = '/api/users';
    request.method = 'GET';
    handle(request, response);
    expect(response.write).toBeCalledWith(
      JSON.stringify([
        {
          username: 'bar',
          age: 24,
          hobbies: ['sport', 'music'],
          id: 'some_unique_id_2',
        },
      ])
    );

    // delete second user
    createMocks();
    request.url = '/api/users/some_unique_id_2';
    request.method = 'DELETE';
    handle(request, response);
    expect(response.statusCode).toBe(204);

    // get all users
    createMocks();
    request.url = '/api/users';
    request.method = 'GET';
    handle(request, response);
    expect(response.write).toBeCalledWith(JSON.stringify([]));
  });

  // INTEGRATION_SCENARIO_3
  test('integration scenario 3 - edge cases', () => {
    // get user with invalid id
    createMocks();
    request.url = '/api/users/not_uuid';
    request.method = 'GET';
    handle(request, response);
    expect(response.statusCode).toBe(400);
  });

  // create new user without required field age
  createMocks();
  request.url = '/api/users';
  request.method = 'POST';
  body = {
    username: 'foo',
    hobbies: [],
  } as User;
  handle(request, response);
  expect(response.statusCode).toBe(400);
  expect(response.write).toBeCalledWith(
    'age field is required and must be a number; '
  );

  // create new user without required fields age, hobbies
  createMocks();
  request.url = '/api/users';
  request.method = 'POST';
  body = {
    username: 'foo',
  } as User;
  handle(request, response);
  expect(response.statusCode).toBe(400);
  expect(response.write).toBeCalledWith(
    'age field is required and must be a number; hobbies field is required and must be an array of strings or empty array; '
  );

  // update the user with invalid id
  createMocks();
  request.url = '/api/users/invalid_id';
  request.method = 'PUT';
  body = {
    username: 'bar',
    age: 24,
    hobbies: ['reading'],
  } as User;
  handle(request, response);
  expect(response.statusCode).toBe(400);
  expect(response.write).toBeCalledWith('User id is not valid, it should be uuid');

  // delete the user with invalid id
  createMocks();
  request.url = '/api/users/invalid_id';
  request.method = 'DELETE';
  handle(request, response);
  expect(response.statusCode).toBe(400);
  expect(response.write).toBeCalledWith('User id is not valid, it should be uuid');
});
