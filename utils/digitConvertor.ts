// utils/digitConverter.ts
export const persianToLatinDigits = (input: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const latinDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let result = input;
  persianDigits.forEach((digit, index) => {
    result = result.replace(new RegExp(digit, "g"), latinDigits[index]);
  });
  return result;
};

export const isValidNumber = (input: string): boolean => {
  const numberRegex = /^[۰۱۲۳۴۵۶۷۸۹0-9]*$/;
  return numberRegex.test(input);
};

export const isValidPhoneNumber = (input: string): boolean => {
  const latinInput = persianToLatinDigits(input);
  // شماره باید 11 رقم باشد و با 09 شروع شود
  const phoneRegex = /^09[0-9]{9}$/;
  return phoneRegex.test(latinInput);
};
