export const utcDate = (): Date => {
  return new Date(Date.now());
};

export const utcUnix = () => {
  return Date.now().toString();
};

export const nowDate = () => {
  return new Date(Date.now());
};
