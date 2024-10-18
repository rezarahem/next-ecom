import 'server-only';

import { compactDecrypt, CompactEncrypt } from 'jose';

const encryptionKey = new TextEncoder().encode(process.env.ENCRYPTION_KEY);

export const joseEncrypt = async (payload: any) => {
  const jwe = await new CompactEncrypt(new TextEncoder().encode(payload))
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(encryptionKey);
  return jwe.split('..')[1];
};

export const joseDecrypt = async (encryptedData: string) => {
  const jwe = `${process.env.ENCRYPTION_SULT}..${encryptedData}`;
  const { plaintext } = await compactDecrypt(jwe, encryptionKey);
  const data = new TextDecoder().decode(plaintext);
  return data;
  // return JSON.parse(data);
};
