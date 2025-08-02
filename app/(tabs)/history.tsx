import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Clock, Trash2, ArrowRight } from 'lucide-react-native';
import { getConversions, clearHistory, ConversionRecord } from '../utils/storage';

export default function HistoryScreen() {
  const [conversions, setConversions] = useState<ConversionRecord[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = getConversions();
    setConversions(history);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all conversion history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearHistory();
            setConversions([]);
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Clock size={32} color="#8B5A2B" />
          <Text style={styles.title}>Conversion History</Text>
          <Text style={styles.subtitle}>Your recent conversions</Text>
        </View>

        {conversions.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearHistory}
            >
              <Trash2 size={16} color="#DC2626" />
              <Text style={styles.clearButtonText}>Clear History</Text>
            </TouchableOpacity>
          </View>
        )}

        {conversions.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>No conversions yet</Text>
            <Text style={styles.emptyText}>
              Start converting Roman numerals to see your history here
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
            {conversions.map((conversion, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.conversionContent}>
                  <View style={styles.conversionRow}>
                    <Text style={styles.inputText}>{conversion.input}</Text>
                    <ArrowRight size={16} color="#8B5A2B" />
                    <Text style={styles.outputText}>{conversion.output}</Text>
                  </View>
                  <View style={styles.conversionMeta}>
                    <Text style={styles.modeText}>
                      {conversion.mode === 'roman-to-int' ? 'Roman → Integer' : 'Integer → Roman'}
                    </Text>
                    <Text style={styles.timestampText}>
                      {formatDate(conversion.timestamp)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  content: {
    flex: 1,
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
  headerActions: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  conversionContent: {
    gap: 8,
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5A2B',
    fontFamily: 'monospace',
    flex: 1,
  },
  outputText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
  },
  conversionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5A2B',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timestampText: {
    fontSize: 12,
    color: '#999',
  },
});