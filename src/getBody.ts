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
    request.data = Buffer.concat(data).toString();
    if (request.headers['content-type'] === 'application/json') {
      try {
        request.body = JSON.parse(request.data);
      } catch {
        response.statusCode = 400;
        response.write('Wrong body, it should be in JSON format');
        response.end();
        return;
      }
    }

    next(request, response);
  });
};

export default getBody;
