# simple-CRUD-API

## Prerequisites

- Git
- Node.js v18

## Downloading

```
git clone --branch develop https://github.com/darya-startsava/simple-CRUD-API
```

## Run commands
```
npm install
```
for running application in development mode: 
```
npm run start:dev 
```
for running application in production mode: 
```
npm run start:prod
```
run tests:
```
npm run test
```

## REST service docs
### Endpoint:
/api/users


- `GET /` - get all users\
- `GET /{userId}` - get user by id\
- `POST /` - create new user with required fields:\
username(string), age(number), hobbies([string] or empty array)\
- `PUT /{userId}` - update user with required fields:\
username(string), age(number), hobbies([string] or empty array)\
- `DELETE /{userId}` - delete user
