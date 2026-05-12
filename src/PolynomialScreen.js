import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveCubic } from '../solvers/polynomialSolver';
import { useHistory } from '../utils/history';

export default function PolynomialScreen() {
  const [degree, setDegree] = useState('3');
  const [a, setA] = useState('1');
  const [b, setB] = useState('-6');
  const [c, setC] = useState('11');
  const [d, setD] = useState('-6');
  const [e, setE] = useState('0');
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);

    try {
      const deg = parseInt(degree) || 3;
      const coeffs = [parseFloat(a) || 0];
      if (deg >= 2) coeffs.push(parseFloat(b) || 0);
      if (deg >= 3) coeffs.push(parseFloat(c) || 0);
      if (deg >= 4) coeffs.push(parseFloat(d) || 0);
      if (deg >= 5) coeffs.push(parseFloat(e) || 0);

      const result = solveCubic(coeffs);
      setSolution(result);

      addToHistory({
        type: 'polynomial',
        input: { degree: deg, coefficients: coeffs },
        result: result.roots,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (err) {
      setError(err.message);
      setSolution(null);
    }
  };

  const renderContent = (content) => {
    return content.map((item, idx) => {
      switch (item.type) {
        case 'highlight':
          return (
            <Text key={idx} style={styles.highlightText}>
              {item.text}
            </Text>
          );
        case 'result':
          return (
            <View key={idx} style={styles.resultBox}>
              <Text style={styles.resultText}>{item.text}</Text>
            </View>
          );
        case 'badge':
          return (
            <View key={idx} style={styles.inlineBadge}>
              <Text style={styles.inlineBadgeText}>{item.text}</Text>
            </View>
          );
        default:
          return (
            <Text key={idx} style={styles.stepText}>
              {item.text}
            </Text>
          );
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>📈 Polynomial</Text>
            <Text style={styles.subtitle}>Cubic & Higher Degree Solver</Text>
          </View>

          {/* Input Card */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Degree:</Text>
            <TextInput
              style={styles.degreeInput}
              value={degree}
              onChangeText={setDegree}
              keyboardType="number-pad"
              placeholder="3"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>
              Coefficients (highest to lowest degree):
            </Text>

            <View style={styles.coeffGrid}>
              <View style={styles.coeffItem}>
                <Text style={styles.coeffLabel}>a (x{degree})</Text>
                <TextInput
                  style={styles.coeffInput}
                  value={a}
                  onChangeText={setA}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.coeffItem}>
                <Text style={styles.coeffLabel}>b (x{parseInt(degree) - 1})</Text>
                <TextInput
                  style={styles.coeffInput}
                  value={b}
                  onChangeText={setB}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.coeffItem}>
                <Text style={styles.coeffLabel}>c (x{parseInt(degree) - 2})</Text>
                <TextInput
                  style={styles.coeffInput}
                  value={c}
                  onChangeText={setC}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.coeffItem}>
                <Text style={styles.coeffLabel}>d (x{parseInt(degree) - 3})</Text>
                <TextInput
                  style={styles.coeffInput}
                  value={d}
                  onChangeText={setD}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.solveBtn}
              onPress={handleSolve}
              activeOpacity={0.8}
            >
              <Text style={styles.solveBtnText}>📈 FIND ROOTS</Text>
            </TouchableOpacity>
          </View>

          {/* Error */}
          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Solution Steps */}
          {solution && (
            <View style={styles.solutionArea}>
              {solution.steps.map((step, index) => (
                <StepCard
                  key={index}
                  step={step.step}
                  badge={step.badge}
                  index={index}
                >
                  {renderContent(step.content)}
                </StepCard>
              ))}

              <FinalAnswer label="🎯 Roots Found">
                {solution.roots.map((root, idx) => (
                  <Text key={idx} style={styles.finalText}>
                    x{idx + 1} = {typeof root === 'string' ? root : root.toFixed(6)}
                  </Text>
                ))}
              </FinalAnswer>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  inputCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  degreeInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 14,
    textAlign: 'center',
    width: 80,
  },
  coeffGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  coeffItem: {
    flex: 1,
    minWidth: '45%',
  },
  coeffLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 4,
  },
  coeffInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.white,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 12,
    textAlign: 'center',
  },
  solveBtn: {
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
  },
  solveBtnText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorCard: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  solutionArea: {
    gap: 0,
  },
  stepText: {
    color: '#c8c8d8',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 22,
  },
  highlightText: {
    color: colors.accentGlow,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
    lineHeight: 22,
  },
  resultBox: {
    backgroundColor: colors.purpleBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 2,
  },
  resultText: {
    color: '#c4b5fd',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
  inlineBadge: {
    backgroundColor: colors.accentBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  inlineBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  finalText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 30,
  },
});