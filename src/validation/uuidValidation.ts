import { validate } from 'uuid';

const uuidValidation = (id: string) => validate(id);

export default uuidValidation;
