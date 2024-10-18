import 'server-only';
import {
  SignJWT,
  jwtVerify,
  compactDecrypt,
  CompactEncrypt,
  importJWK,
} from 'jose';

const signKey = new TextEncoder().encode(process.env.SIGN_KEY);

export const joseSign = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(signKey);
};

export const joseVefiySignature = async (input: string) => {
  const { payload } = await jwtVerify(input, signKey, {
    algorithms: ['HS256'],
  });
  return payload;
};
