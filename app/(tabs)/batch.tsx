import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Upload, Download, FileText, Zap } from 'lucide-react-native';
import { romanToInteger, integerToRoman, isValidRoman } from '../utils/romanConverter';

interface BatchResult {
  original: string;
  converted: string;
  status: 'success' | 'error';
  error?: string;
}

export default function BatchScreen() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<BatchResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState<'roman-to-int' | 'int-to-roman'>('roman-to-int');

  const processBatch = () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some data to process');
      return;
    }

    setProcessing(true);
    const lines = inputText.split('\n').filter(line => line.trim());
    const batchResults: BatchResult[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      try {
        if (mode === 'roman-to-int') {
          if (isValidRoman(trimmed.toUpperCase())) {
            const converted = romanToInteger(trimmed.toUpperCase());
            batchResults.push({
              original: trimmed,
              converted: converted.toString(),
              status: 'success',
            });
          } else {
            batchResults.push({
              original: trimmed,
              converted: '',
              status: 'error',
              error: 'Invalid Roman numeral',
            });
          }
        } else {
          const num = parseInt(trimmed);
          if (isNaN(num) || num <= 0 || num > 3999) {
            batchResults.push({
              original: trimmed,
              converted: '',
              status: 'error',
              error: 'Invalid number (must be 1-3999)',
            });
          } else {
            const converted = integerToRoman(num);
            batchResults.push({
              original: trimmed,
              converted,
              status: 'success',
            });
          }
        }
      } catch (error) {
        batchResults.push({
          original: trimmed,
          converted: '',
          status: 'error',
          error: 'Conversion failed',
        });
      }
    });

    setResults(batchResults);
    setProcessing(false);
  };

  const exportResults = () => {
    if (results.length === 0) {
      Alert.alert('No Data', 'No results to export');
      return;
    }

    const csvContent = results
      .map(result => `"${result.original}","${result.converted}","${result.status}"`)
      .join('\n');
    
    const header = `"Original","Converted","Status"\n`;
    const fullCsv = header + csvContent;

    Alert.alert('Export Ready', 'CSV data prepared for download');
  };

  const clearAll = () => {
    setInputText('');
    setResults([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <FileText size={32} color="#8B5A2B" />
          <Text style={styles.title}>Batch Processing</Text>
          <Text style={styles.subtitle}>Process multiple entries at once</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'roman-to-int' && styles.modeButtonActive,
              ]}
              onPress={() => setMode('roman-to-int')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'roman-to-int' && styles.modeButtonTextActive,
                ]}
              >
                Roman → Integer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'int-to-roman' && styles.modeButtonActive,
              ]}
              onPress={() => setMode('int-to-roman')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'int-to-roman' && styles.modeButtonTextActive,
                ]}
              >
                Integer → Roman
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>
            Enter data (one per line)
          </Text>
          <TextInput
            style={styles.textArea}
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              mode === 'roman-to-int'
                ? 'MCMXC\nCDXLIV\nMMLV\n...'
                : '1990\n444\n2055\n...'
            }
            placeholderTextColor="#999"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.processButton, processing && styles.processingButton]}
              onPress={processBatch}
              disabled={processing}
            >
              <Zap size={16} color="#FFFFFF" />
              <Text style={styles.processButtonText}>
                {processing ? 'Processing...' : 'Process Batch'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {results.length > 0 && (
          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Results ({results.filter(r => r.status === 'success').length}/{results.length} successful)
              </Text>
              <TouchableOpacity style={styles.exportButton} onPress={exportResults}>
                <Download size={16} color="#8B5A2B" />
                <Text style={styles.exportButtonText}>Export CSV</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.resultsList} nestedScrollEnabled>
              {results.map((result, index) => (
                <View
                  key={index}
                  style={[
                    styles.resultItem,
                    result.status === 'error' && styles.resultItemError,
                  ]}
                >
                  <View style={styles.resultContent}>
                    <Text style={styles.resultOriginal}>{result.original}</Text>
                    <Text style={styles.resultArrow}>→</Text>
                    <Text
                      style={[
                        styles.resultConverted,
                        result.status === 'error' && styles.resultError,
                      ]}
                    >
                      {result.status === 'success' ? result.converted : result.error}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B5A2B',
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F8F6F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#8B5A2B',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 2,
    borderColor: '#E5E1D8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C1810',
    backgroundColor: '#FAFAF8',
    fontFamily: 'monospace',
    minHeight: 120,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  processButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#8B5A2B',
    gap: 8,
  },
  processingButton: {
    opacity: 0.7,
  },
  processButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F8F6F0',
    borderWidth: 1,
    borderColor: '#E5E1D8',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 6,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5A2B',
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  resultItemError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultOriginal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    fontFamily: 'monospace',
    width: 80,
  },
  resultArrow: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 12,
  },
  resultConverted: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    fontFamily: 'monospace',
    flex: 1,
  },
  resultError: {
    color: '#DC2626',
  },
});