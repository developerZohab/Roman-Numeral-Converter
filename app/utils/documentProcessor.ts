// Document processing utilities for batch operations

export interface ProcessingResult {
  originalText: string;
  processedText: string;
  conversions: number;
  errors: string[];
}

/**
 * Process text document and convert Roman numerals to integers
 * @param text Input text content
 * @param mode Conversion mode
 * @returns Processing result
 */
export function processDocument(
  text: string,
  mode: 'roman-to-int' | 'int-to-roman'
): ProcessingResult {
  const errors: string[] = [];
  let conversions = 0;
  let processedText = text;

  if (mode === 'roman-to-int') {
    // Pattern to match Roman numerals (basic pattern)
    const romanPattern = /\b(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\b/g;
    
    processedText = text.replace(romanPattern, (match) => {
      try {
        // Import the converter function
        const { romanToInteger, isValidRoman } = require('./romanConverter');
        
        if (isValidRoman(match)) {
          const converted = romanToInteger(match);
          conversions++;
          return converted.toString();
        }
        return match;
      } catch (error) {
        errors.push(`Failed to convert "${match}": ${error}`);
        return match;
      }
    });
  } else {
    // Pattern to match integers (1-3999)
    const intPattern = /\b([1-9]\d{0,3}|3999)\b/g;
    
    processedText = text.replace(intPattern, (match) => {
      try {
        const num = parseInt(match);
        if (num >= 1 && num <= 3999) {
          const { integerToRoman } = require('./romanConverter');
          const converted = integerToRoman(num);
          conversions++;
          return converted;
        }
        return match;
      } catch (error) {
        errors.push(`Failed to convert "${match}": ${error}`);
        return match;
      }
    });
  }

  return {
    originalText: text,
    processedText,
    conversions,
    errors,
  };
}

/**
 * Extract Roman numerals from text
 * @param text Input text
 * @returns Array of found Roman numerals
 */
export function extractRomanNumerals(text: string): string[] {
  const romanPattern = /\b(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\b/g;
  const matches = text.match(romanPattern) || [];
  
  // Filter out false positives and validate
  return matches.filter(match => {
    const { isValidRoman } = require('./romanConverter');
    return isValidRoman(match);
  });
}

/**
 * Extract integers from text (1-3999 range)
 * @param text Input text
 * @returns Array of found integers
 */
export function extractIntegers(text: string): number[] {
  const intPattern = /\b([1-9]\d{0,3}|3999)\b/g;
  const matches = text.match(intPattern) || [];
  
  return matches
    .map(match => parseInt(match))
    .filter(num => num >= 1 && num <= 3999);
}

/**
 * Generate processing report
 * @param result Processing result
 * @returns Formatted report string
 */
export function generateReport(result: ProcessingResult): string {
  const report = [
    '=== Document Processing Report ===',
    `Date: ${new Date().toLocaleString()}`,
    `Conversions made: ${result.conversions}`,
    `Errors encountered: ${result.errors.length}`,
    '',
  ];

  if (result.errors.length > 0) {
    report.push('Errors:');
    result.errors.forEach((error, index) => {
      report.push(`${index + 1}. ${error}`);
    });
    report.push('');
  }

  report.push('Processing completed successfully.');
  
  return report.join('\n');
}

/**
 * Validate document format
 * @param content Document content
 * @param format Expected format (txt, csv, etc.)
 * @returns Validation result
 */
export function validateDocumentFormat(
  content: string,
  format: 'txt' | 'csv' | 'json'
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push('Document is empty');
    return { valid: false, errors };
  }

  switch (format) {
    case 'csv':
      // Basic CSV validation
      const lines = content.split('\n');
      if (lines.length < 2) {
        errors.push('CSV must have at least a header and one data row');
      }
      break;
      
    case 'json':
      try {
        JSON.parse(content);
      } catch {
        errors.push('Invalid JSON format');
      }
      break;
      
    case 'txt':
      // Text files are generally always valid
      break;
      
    default:
      errors.push(`Unsupported format: ${format}`);
  }

  return { valid: errors.length === 0, errors };
}