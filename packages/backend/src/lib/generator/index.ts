import { v4 as uuidv4 } from 'uuid';

export function generateNumericTicketId(length = 12) {
  const uuid = uuidv4().replace(/-/g, '');
  const numericId = BigInt('0x' + uuid)
    .toString()
    .slice(0, length);
  return numericId;
}
