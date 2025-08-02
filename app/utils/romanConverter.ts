// Roman numeral conversion utilities for historical document processing

const ROMAN_TO_INT_MAP: { [key: string]: number } = {
  'I': 1,
  'V': 5,
  'X': 10,
  'L': 50,
  'C': 100,
  'D': 500,
  'M': 1000,
};

const INT_TO_ROMAN_MAP: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

// Historical variations (additive notation)
const HISTORICAL_PATTERNS: { [key: string]: number } = {
  'IIII': 4,
  'VIIII': 9,
  'XXXX': 40,
  'LXXXX': 90,
  'CCCC': 400,
  'DCCCC': 900,
};

/**
 * Converts Roman numeral to integer
 * @param roman Roman numeral string
 * @param historicalMode Support historical variations like IIII
 * @returns Integer value
 */
export function romanToInteger(roman: string, historicalMode: boolean = false): number {
  if (!roman || typeof roman !== 'string') {
    throw new Error('Invalid input: Roman numeral must be a non-empty string');
  }

  const cleanRoman = roman.toUpperCase().trim();
  
  // Check for historical patterns first if in historical mode
  if (historicalMode) {
    for (const [pattern, value] of Object.entries(HISTORICAL_PATTERNS)) {
      if (cleanRoman.includes(pattern)) {
        // Replace historical pattern with standard equivalent
        const standardRoman = cleanRoman.replace(pattern, integerToRoman(value));
        return romanToInteger(standardRoman, false);
      }
    }
  }

  let result = 0;
  let prevValue = 0;

  // Process from right to left
  for (let i = cleanRoman.length - 1; i >= 0; i--) {
    const currentChar = cleanRoman[i];
    const currentValue = ROMAN_TO_INT_MAP[currentChar];

    if (!currentValue) {
      throw new Error(`Invalid Roman numeral character: ${currentChar}`);
    }

    // If current value is less than previous, subtract it (subtractive notation)
    if (currentValue < prevValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }

    prevValue = currentValue;
  }

  return result;
}

/**
 * Converts integer to Roman numeral
 * @param num Integer to convert (1-3999)
 * @returns Roman numeral string
 */
export function integerToRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) {
    throw new Error('Number must be an integer between 1 and 3999');
  }

  let result = '';
  let remaining = num;

  for (const [value, numeral] of INT_TO_ROMAN_MAP) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

/**
 * Validates if a string is a valid Roman numeral
 * @param roman String to validate
 * @param historicalMode Allow historical variations
 * @returns Boolean indicating validity
 */
export function isValidRoman(roman: string, historicalMode: boolean = false): boolean {
  if (!roman || typeof roman !== 'string') {
    return false;
  }

  const cleanRoman = roman.toUpperCase().trim();
  
  // Basic character validation
  const validChars = /^[IVXLCDM]+$/;
  if (!validChars.test(cleanRoman)) {
    return false;
  }

  // Check for historical patterns if in historical mode
  if (historicalMode) {
    for (const pattern of Object.keys(HISTORICAL_PATTERNS)) {
      if (cleanRoman.includes(pattern)) {
        return true; // Accept historical patterns
      }
    }
  }

  // Standard validation rules
  const rules = [
    // No more than 3 consecutive identical characters (except in historical mode)
    !historicalMode && /([IVXLCDM])\1{3,}/.test(cleanRoman),
    // Invalid subtractive combinations
    /IL|IC|ID|IM/.test(cleanRoman), // I can only subtract from V and X
    /VL|VC|VD|VM/.test(cleanRoman), // V cannot be subtracted
    /XD|XM/.test(cleanRoman), // X can only subtract from L and C
    /LC|LD|LM/.test(cleanRoman), // L cannot be subtracted
    /DM/.test(cleanRoman), // D cannot be subtracted
  ];

  if (rules.some(rule => rule)) {
    return false;
  }

  try {
    // Try to convert and verify it's within valid range
    const converted = romanToInteger(cleanRoman, historicalMode);
    return converted >= 1 && converted <= 3999;
  } catch {
    return false;
  }
}

/**
 * Analyzes Roman numeral for historical context
 * @param roman Roman numeral to analyze
 * @returns Analysis object with historical information
 */
export function analyzeRomanNumeral(roman: string): {
  isHistorical: boolean;
  period: string;
  variations: string[];
  modernEquivalent: string;
} {
  const cleanRoman = roman.toUpperCase().trim();
  const hasHistoricalPatterns = Object.keys(HISTORICAL_PATTERNS).some(pattern =>
    cleanRoman.includes(pattern)
  );

  let period = 'Classical Period';
  const variations: string[] = [];

  if (hasHistoricalPatterns) {
    period = 'Medieval Period';
    if (cleanRoman.includes('IIII')) variations.push('Additive notation for 4');
    if (cleanRoman.includes('VIIII')) variations.push('Additive notation for 9');
    if (cleanRoman.includes('XXXX')) variations.push('Additive notation for 40');
  }

  try {
    const value = romanToInteger(cleanRoman, true);
    const modernEquivalent = integerToRoman(value);
    
    return {
      isHistorical: hasHistoricalPatterns,
      period,
      variations,
      modernEquivalent,
    };
  } catch {
    return {
      isHistorical: false,
      period: 'Unknown',
      variations: [],
      modernEquivalent: 'Invalid',
    };
  }
}

/**
 * Batch converts an array of Roman numerals or integers
 * @param inputs Array of strings to convert
 * @param mode Conversion mode
 * @param historicalMode Support historical variations
 * @returns Array of conversion results
 */
export function batchConvert(
  inputs: string[],
  mode: 'roman-to-int' | 'int-to-roman',
  historicalMode: boolean = false
): Array<{ input: string; output: string; success: boolean; error?: string }> {
  return inputs.map(input => {
    try {
      const trimmed = input.trim();
      if (!trimmed) {
        return { input, output: '', success: false, error: 'Empty input' };
      }

      if (mode === 'roman-to-int') {
        if (isValidRoman(trimmed, historicalMode)) {
          const result = romanToInteger(trimmed, historicalMode);
          return { input, output: result.toString(), success: true };
        } else {
          return { input, output: '', success: false, error: 'Invalid Roman numeral' };
        }
      } else {
        const num = parseInt(trimmed);
        if (isNaN(num) || num < 1 || num > 3999) {
          return { input, output: '', success: false, error: 'Invalid number (1-3999)' };
        }
        const result = integerToRoman(num);
        return { input, output: result, success: true };
      }
    } catch (error) {
      return { 
        input, 
        output: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Conversion failed' 
      };
    }
  });
}