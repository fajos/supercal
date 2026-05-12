import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function ErrorCard({ message, style }) {
  if (!message) return null;
  
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.text}>⚠️ {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  text: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
});