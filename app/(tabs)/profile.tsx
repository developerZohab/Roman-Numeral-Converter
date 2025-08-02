import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  Settings, 
  BookOpen, 
  Download, 
  Info, 
  Mail,
  Shield,
  Palette
} from 'lucide-react-native';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [historicalMode, setHistoricalMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const showAbout = () => {
    Alert.alert(
      'About Roman Numeral Converter',
      'Professional tool for historians, archivists, and researchers working with historical documents.\n\nVersion 1.0.0\nBuilt for accuracy and efficiency in historical document analysis.',
      [{ text: 'OK' }]
    );
  };

  const showHelp = () => {
    Alert.alert(
      'How to Use',
      '• Single Conversion: Use the main converter for individual numbers\n• Batch Processing: Convert multiple entries at once\n• Historical Mode: Supports old-style Roman numerals (IIII, VIIII)\n• Export: Download results in CSV format',
      [{ text: 'OK' }]
    );
  };

  const contactSupport = () => {
    Alert.alert(
      'Contact Support',
      'For technical support or feature requests, please contact our team.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <BookOpen size={40} color="#8B5A2B" />
          </View>
          <Text style={styles.name}>Professional Tools</Text>
          <Text style={styles.email}>Historical Document Analysis</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Settings size={20} color="#8B5A2B" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get notified about conversion updates
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E1D8', true: '#8B5A2B' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <BookOpen size={20} color="#8B5A2B" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Historical Mode Default</Text>
                <Text style={styles.settingDescription}>
                  Enable old-style Roman numerals by default
                </Text>
              </View>
            </View>
            <Switch
              value={historicalMode}
              onValueChange={setHistoricalMode}
              trackColor={{ false: '#E5E1D8', true: '#8B5A2B' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Palette size={20} color="#8B5A2B" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Switch to dark theme
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E5E1D8', true: '#8B5A2B' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={showHelp}>
            <Info size={20} color="#8B5A2B" />
            <Text style={styles.menuText}>Help & Tutorial</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={contactSupport}>
            <Mail size={20} color="#8B5A2B" />
            <Text style={styles.menuText}>Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={showAbout}>
            <Shield size={20} color="#8B5A2B" />
            <Text style={styles.menuText}>About</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Options</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Download size={20} color="#8B5A2B" />
            <Text style={styles.menuText}>Export All History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Roman Numeral Converter v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Built for historical document professionals
          </Text>
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
    marginBottom: 40,
    paddingTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#8B5A2B',
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E1D8',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5A2B',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});