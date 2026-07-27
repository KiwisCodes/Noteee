import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import { DesignTokens } from '@noteee/ui';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Noteee Mobile</Text>
        <Text style={styles.subtitle}>Capture-First, Local-First Notebook</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Architecture Ready</Text>
          <Text style={styles.cardText}>- Local JSI SQLite (op-sqlite + Drizzle)</Text>
          <Text style={styles.cardText}>- PowerSync Local-First Relay</Text>
          <Text style={styles.cardText}>- Skia GPU Drawing Canvas</Text>
          <Text style={styles.cardText}>- FSRS v5.0.x Spaced Repetition</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.backgroundDark,
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: DesignTokens.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: DesignTokens.colors.textSecondary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: DesignTokens.colors.surfaceDark,
    padding: 20,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DesignTokens.colors.textPrimary,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: DesignTokens.colors.textSecondary,
    marginBottom: 6,
  },
});
