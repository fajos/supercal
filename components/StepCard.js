import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function StepCard({ step, badge, children, index }) {
  const badgeStyle = {
    primary: { bg: colors.accentBg, color: colors.accent },
    secondary: { bg: colors.purpleBg, color: colors.purpleGlow },
    warning: { bg: 'rgba(255,165,2,0.1)', color: colors.warning },
  };

  const badgeColors = badgeStyle[badge] || badgeStyle.primary;

  return (
    <View style={[styles.card, { marginTop: index === 0 ? 0 : 10 }]}>
      <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
        <Text style={[styles.badgeText, { color: badgeColors.color }]}>
          {step}
        </Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    gap: 4,
  },
});