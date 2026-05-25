import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function InputCard({ children, label, style }) {
  return (
    <View style={[styles.card, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 800,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
});