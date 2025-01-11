export function numberToWords(num: number): string {
    if (num < -100 || num > 100) {
      throw new Error("Number out of range. Only supports -100 to 100.");
    }
  
    const belowTwenty = [
      "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
      "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
    ];
  
    const tens = [
      "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
    ];
  
    if (num === 0) return "zero";
  
    let words = "";
  
    if (num < 0) {
      words += "minus ";
      num = Math.abs(num);
    }
  
    if (num < 20) {
      words += belowTwenty[num];
    } else {
      const tenPlace = Math.floor(num / 10);
      const unitPlace = num % 10;
  
      words += tens[tenPlace];
      if (unitPlace > 0) {
        words += ` ${belowTwenty[unitPlace]}`;
      }
    }
  
    return words.trim();
  }