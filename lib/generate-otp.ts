import 'server-only';

export const generateOtp = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};
