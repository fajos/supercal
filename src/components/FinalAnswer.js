import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export function FinalAnswer({ label, children }) {
  return (
    <LinearGradient
      colors={[colors.accentBg, colors.purpleBg]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.inner}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>{children}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.accent,
    marginTop: 16,
    padding: 2,
  },
  inner: {
    padding: 22,
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  valueContainer: {
    alignItems: 'center',
  },
});