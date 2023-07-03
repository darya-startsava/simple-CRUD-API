import { ServerResponse } from 'http';
import { handle } from './handle';
import CustomRequest from './interfaces/customRequest';
import User from './interfaces/user';
import users from './dataBase';

let request: CustomRequest, response: ServerResponse, body: User;

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
    v4: () => 'some_unique_id',
    validate: () => true,
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
});
