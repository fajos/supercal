import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

export function SolveButton({ onPress, label, loading, disabled, style }) {
  const handlePress = () => {
    if (!loading && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (loading || disabled) && styles.buttonDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.black} />
      ) : (
        <Text style={styles.text}>{label || '⚡ SOLVE'}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderBottomWidth: 4,
    borderBottomColor: '#008a6e',
    transform: [{ translateY: 0 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
});