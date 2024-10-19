export const utcDate = (): Date => {
  return new Date(Date.now());
};

export const utcUnix = () => {
  return Date.now().toString();
};

export const nowDate = () => {
  return new Date(Date.now());
};

// export const hasTwoMinutesPassed = (
//   dbTimestamp: string,
//   currentTimestamp: string
// ) => {
//   // 120000ms = 120s
//   return +currentTimestamp - +dbTimestamp < 120000;
// };

// export const differenceInSecondsToNow = (dbTimestamp: string) => {
//   return Math.round((+utcDate() - +dbTimestamp) / 1000);
// };
