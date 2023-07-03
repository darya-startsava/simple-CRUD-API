import { createServer } from 'http';
import 'dotenv/config';

import CustomRequest from './src/interfaces/customRequest';
import { handle } from './src/handle';

const PORT = process.env.PORT || 4000;
const server = createServer((request: CustomRequest, response) => {
  try {
    handle(request, response);
  } catch {
    response.statusCode = 500;
    response.write('Server error');
    response.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
