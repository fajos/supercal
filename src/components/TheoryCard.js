import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { MathRenderer } from './MathRenderer';

export const TheoryCard = ({ theory }) => {
  const { title, icon, color, description, formula, keyPoints } = theory;

  return (
    <View style={styles.theoryCard}>
      <View style={styles.theoryHeader}>
        <Text style={styles.theoryIcon}>{icon}</Text>
        <View style={styles.theoryTitleContainer}>
          <Text style={[styles.theoryTitle, { color: color }]}>{title}</Text>
          {formula && (
            <View style={styles.formulaContainer}>
              <MathRenderer latex={formula} fontSize={18} />
            </View>
          )}
        </View>
      </View>
      <Text style={styles.theoryDescription}>{description}</Text>
      <View style={styles.keyPointsContainer}>
        {keyPoints.map((point, kidx) => (
          <View key={kidx} style={styles.keyPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.keyPointText}>{point}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  theoryCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    width: '100%',
    maxWidth: 800,
  },
  theoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  theoryIcon: { fontSize: 32 },
  theoryTitleContainer: { flex: 1, gap: 6 },
  theoryTitle: { fontSize: 18, fontWeight: '700' },
  formulaContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  theoryDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12
  },
  keyPointsContainer: { gap: 8 },
  keyPoint: { flexDirection: 'row', gap: 8 },
  bullet: { color: colors.accent, fontSize: 16, lineHeight: 20 },
  keyPointText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20
  },
});
