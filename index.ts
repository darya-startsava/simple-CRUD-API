import { createServer } from 'http';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;
const server = createServer();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
