import CustomRequest from './interfaces/customRequest';
import { ServerResponse } from 'http';

const getBody = (
  request: CustomRequest,
  response: ServerResponse,
  next: (request: CustomRequest, response: ServerResponse) => void
) => {
  const data: Uint8Array[] = [];
  request.on('data', (dataChunk) => {
    data.push(dataChunk);
  });
  request.on('end', () => {
    request.body = Buffer.concat(data).toString();
    if (request.headers['content-type'] === 'application/json') {
      request.body = JSON.parse(request.body);
    }

    next(request, response);
  });
};

export default getBody;
