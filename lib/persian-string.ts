const regExpArabicNumber = new RegExp(/[\u0660-\u0669]/, 'g');
const regExpPersianNumber = new RegExp(/[\u06f0-\u06f9]/, 'g');
const regExpEnglishNumber = new RegExp(/[\u0030-\u0039]/, 'g');
export const regexOnlyDigits = '^[0-9۰-۹٠-٩]+$';

export const toPersianNumberStr = (value: string): string => {
  if (!value) return '';

  return value
    .replace(regExpArabicNumber, (c) => {
      return String.fromCharCode(
        parseInt((c.charCodeAt(0) - 0x0660) as any, 10) + 0x06f0,
      );
    })
    .replace(regExpEnglishNumber, (c) => {
      return String.fromCharCode(parseInt(c, 10) + 0x06f0);
    });
};

export const toEnglishNumberStr = (value: string): string => {
  if (!value) return '';

  return value
    .replace(regExpArabicNumber, (c) => {
      return (c.charCodeAt(0) - 0x0660) as any;
    })
    .replace(regExpPersianNumber, (c) => {
      return (c.charCodeAt(0) - 0x06f0) as any;
    });
};

export const removeComma = (value: string) => {
  if (!value) return '';

  return value.replace(/,/g, '');
};

export const addCommaAndRetuenPersianStringNumber = (value: string) => {
  if (!value) return '';

  const enString = toEnglishNumberStr(value);
  const enStringWithComma = enString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return toPersianNumberStr(enStringWithComma);
};

export const addCommaAndRetuenPersianStringNumberOnChange = (value: string) => {
  const valueWithoutComma = value.replace(/,/g, '');
  const turnToEnNumber = toEnglishNumberStr(valueWithoutComma);
  const addCommaToEnNumberValue = turnToEnNumber.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ',',
  );
  return toPersianNumberStr(addCommaToEnNumberValue);
};

export const calculateDiscountPercentageFromSpecialPriceDif = (
  price: number,
  specialPriceDif: number,
) => {
  const dis = Math.abs(Math.ceil((specialPriceDif / price) * 100));
  return `٪ ${toPersianNumberStr(String(dis))}`;
};

export const calculateDiscountPercentageFromFullSpecialPrice = (
  price: number,
  specialPrice: number,
) => {
  const dis = Math.abs(Math.ceil(((price - specialPrice) / price) * 100));

  return `٪ ${toPersianNumberStr(String(dis))}`;
};

export const calculateFinalSpecialPriceFromPercentageDiscount = (
  price: number,
  percentage: number,
) => {
  const calculateRate = percentage / 100;
  return price - price * calculateRate;
};

export const calculateSpecialPriceDiscountFromPercentage = (
  price: number,
  percentage: number,
) => {
  const calculateRate = percentage / 100;
  return price * calculateRate;
};

export const phoneNumberWithSpaces = (value: string): string => {
  const p = '#### ### ####';
  let i = 0;
  return p.replace(/#/g, () => value[i++]);
};

export const millisecondsToSecondsDifference = (
  timestamp1: number,
  timestamp2: number,
): number => {
  const differenceInMilliseconds = Math.abs(timestamp1 - timestamp2);
  const differenceInSeconds = differenceInMilliseconds / 1000;

  return Math.round(differenceInSeconds);
};

export const generateRandomUniqueStringFromDate = () => {
  return Date.now().toString();
};

export const addDash = (str: string) => {
  return str.trim().split(' ').join('-');
};

export const removeDash = (str: string) => {
  return str.split('-').join(' ');
};
