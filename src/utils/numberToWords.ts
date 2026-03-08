const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function convertHundreds(num: number): string {
  let result = "";
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + " Hundred";
    num %= 100;
    if (num > 0) result += " ";
  }
  if (num >= 20) {
    result += tens[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) result += " " + ones[num];
  } else if (num > 0) {
    result += ones[num];
  }
  return result;
}

export function numberToWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";

  const isNegative = num < 0;
  num = Math.abs(Math.round(num));

  // Indian numbering: Crore, Lakh, Thousand, Hundred
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = num;

  let result = "";
  if (crore > 0) result += convertHundreds(crore) + " Crore ";
  if (lakh > 0) result += convertHundreds(lakh) + " Lakh ";
  if (thousand > 0) result += convertHundreds(thousand) + " Thousand ";
  if (remainder > 0) result += convertHundreds(remainder);

  result = result.trim();
  if (isNegative) result = "Minus " + result;

  return result + " Rupees Only";
}
