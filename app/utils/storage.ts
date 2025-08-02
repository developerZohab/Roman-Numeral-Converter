// Local storage utilities for conversion history

export interface ConversionRecord {
  input: string;
  output: string;
  mode: 'roman-to-int' | 'int-to-roman';
  timestamp: string;
}

const STORAGE_KEY = 'roman_converter_history';
const MAX_HISTORY_ITEMS = 100;

/**
 * Save a conversion to local storage
 * @param conversion Conversion record to save
 */
export function saveConversion(conversion: ConversionRecord): void {
  try {
    const existing = getConversions();
    const updated = [conversion, ...existing].slice(0, MAX_HISTORY_ITEMS);
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.warn('Failed to save conversion to storage:', error);
  }
}

/**
 * Get all conversions from local storage
 * @returns Array of conversion records
 */
export function getConversions(): ConversionRecord[] {
  try {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load conversions from storage:', error);
    return [];
  }
}

/**
 * Clear all conversion history
 */
export function clearHistory(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to clear history:', error);
  }
}

/**
 * Export conversions as CSV format
 * @param conversions Array of conversion records
 * @returns CSV string
 */
export function exportToCSV(conversions: ConversionRecord[]): string {
  const headers = ['Input', 'Output', 'Mode', 'Timestamp'];
  const csvRows = [
    headers.join(','),
    ...conversions.map(conv => [
      `"${conv.input}"`,
      `"${conv.output}"`,
      `"${conv.mode}"`,
      `"${conv.timestamp}"`
    ].join(','))
  ];
  
  return csvRows.join('\n');
}

/**
 * Get conversion statistics
 * @returns Statistics object
 */
export function getConversionStats(): {
  total: number;
  romanToInt: number;
  intToRoman: number;
  today: number;
  thisWeek: number;
} {
  const conversions = getConversions();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    total: conversions.length,
    romanToInt: conversions.filter(c => c.mode === 'roman-to-int').length,
    intToRoman: conversions.filter(c => c.mode === 'int-to-roman').length,
    today: conversions.filter(c => new Date(c.timestamp) >= today).length,
    thisWeek: conversions.filter(c => new Date(c.timestamp) >= weekAgo).length,
  };
}