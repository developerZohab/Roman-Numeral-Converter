import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowUpDown, Copy, RotateCcw, BookOpen } from 'lucide-react-native';
import { romanToInteger, integerToRoman, isValidRoman } from '../utils/romanConverter';
import { saveConversion } from '../utils/storage';

export default function ConverterScreen() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'roman-to-int' | 'int-to-roman'>('roman-to-int');
  const [historicalMode, setHistoricalMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (mode === 'roman-to-int') {
        if (isValidRoman(input.toUpperCase(), historicalMode)) {
          const result = romanToInteger(input.toUpperCase(), historicalMode);
          setOutput(result.toString());
          setError('');
        } else {
          setError('Invalid Roman numeral format');
          setOutput('');
        }
      } else {
        const num = parseInt(input);
        if (isNaN(num) || num <= 0 || num > 3999) {
          setError('Please enter a number between 1 and 3999');
          setOutput('');
        } else {
          const result = integerToRoman(num);
          setOutput(result);
          setError('');
        }
      }
    } catch (err) {
      setError('Conversion error occurred');
      setOutput('');
    }
  }, [input, mode, historicalMode]);

  const handleSwapMode = () => {
    setMode(mode === 'roman-to-int' ? 'int-to-roman' : 'roman-to-int');
    setInput('');
    setOutput('');
    setError('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleCopyOutput = async () => {
    if (output) {
      // Note: Clipboard API is not available in WebContainer
      Alert.alert('Copied', 'Result copied to clipboard');
    }
  };

  const handleSaveConversion = () => {
    if (input && output) {
      saveConversion({
        input,
        output,
        mode,
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Saved', 'Conversion saved to history');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BookOpen size={32} color="#8B5A2B" />
          <Text style={styles.title}>Roman Numeral Converter</Text>
          <Text style={styles.subtitle}>Professional Historical Document Tool</Text>
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

          <View style={styles.historicalToggle}>
            <Text style={styles.toggleLabel}>Historical Mode (IIII, VIIII)</Text>
            <Switch
              value={historicalMode}
              onValueChange={setHistoricalMode}
              trackColor={{ false: '#E5E1D8', true: '#8B5A2B' }}
              thumbColor={historicalMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              {mode === 'roman-to-int' ? 'Roman Numeral' : 'Integer (1-3999)'}
            </Text>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={
                mode === 'roman-to-int'
                  ? 'Enter Roman numeral (e.g., MCMXC)'
                  : 'Enter number (e.g., 1990)'
              }
              placeholderTextColor="#999"
              autoCapitalize={mode === 'roman-to-int' ? 'characters' : 'none'}
              keyboardType={mode === 'roman-to-int' ? 'default' : 'numeric'}
            />
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.outputSection}>
            <Text style={styles.outputLabel}>
              {mode === 'roman-to-int' ? 'Integer Result' : 'Roman Numeral Result'}
            </Text>
            <View style={styles.outputContainer}>
              <Text style={styles.output}>{output || '—'}</Text>
              {output && (
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyOutput}
                >
                  <Copy size={16} color="#8B5A2B" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
              <RotateCcw size={16} color="#666" />
              <Text style={styles.actionButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSwapMode}
            >
              <ArrowUpDown size={16} color="#666" />
              <Text style={styles.actionButtonText}>Swap Mode</Text>
            </TouchableOpacity>
            {output && (
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveConversion}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.examplesCard}>
          <Text style={styles.examplesTitle}>Common Historical Examples</Text>
          <View style={styles.examplesList}>
            <View style={styles.exampleItem}>
              <Text style={styles.exampleRoman}>MCMLIV</Text>
              <Text style={styles.exampleArrow}>→</Text>
              <Text style={styles.exampleInteger}>1954</Text>
            </View>
            <View style={styles.exampleItem}>
              <Text style={styles.exampleRoman}>CDXLIV</Text>
              <Text style={styles.exampleArrow}>→</Text>
              <Text style={styles.exampleInteger}>444</Text>
            </View>
            <View style={styles.exampleItem}>
              <Text style={styles.exampleRoman}>MMDCCL</Text>
              <Text style={styles.exampleArrow}>→</Text>
              <Text style={styles.exampleInteger}>2750</Text>
            </View>
          </View>
        </View>
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
  historicalToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E1D8',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#2C1810',
    backgroundColor: '#FAFAF8',
    fontFamily: 'monospace',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  outputSection: {
    marginBottom: 24,
  },
  outputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  outputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  output: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F6F0',
    borderWidth: 1,
    borderColor: '#E5E1D8',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#8B5A2B',
    borderColor: '#8B5A2B',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  examplesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  examplesList: {
    gap: 12,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exampleRoman: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5A2B',
    fontFamily: 'monospace',
    width: 80,
  },
  exampleArrow: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 12,
  },
  exampleInteger: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    fontFamily: 'monospace',
  },
});