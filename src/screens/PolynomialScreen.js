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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solvePolynomial } from '../solvers/polynomialSolver';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { useHistory } from '../utils/history';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function PolynomialScreen() {
  const [degree, setDegree] = useState('3');
  const [a, setA] = useState('1');
  const [b, setB] = useState('-6');
  const [c, setC] = useState('11');
  const [d, setD] = useState('-6');
  const [e, setE] = useState('0');
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const deg = parseInt(degree) || 3;
        const coeffs = [];

        // Collect coefficients based on degree
        coeffs.push(parseFloat(a) || 0);
        if (deg >= 2) coeffs.push(parseFloat(b) || 0);
        if (deg >= 3) coeffs.push(parseFloat(c) || 0);
        if (deg >= 4) coeffs.push(parseFloat(d) || 0);
        if (deg >= 5) coeffs.push(parseFloat(e) || 0);

        const result = solvePolynomial(coeffs);
        setSolution(result);

        addToHistory({
          type: 'polynomial',
          input: { degree: deg, coefficients: coeffs },
          result: result.roots,
          timestamp: new Date().toISOString(),
        });

        setTimeout(() => {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        }, 300);
      } catch (err) {
        setError(err.message);
        setSolution(null);
      } finally {
        setLoading(false);
      }
    }, 600);
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
          <View style={styles.headerContainer}>
            <BackHeader title="📈 Polynomial" subtitle="Cubic & Higher Degree Solver" />
          </View>

          {/* Input Card */}
          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Degree:</Text>
            </View>
            <TextInput
              style={styles.degreeInput}
              value={degree}
              onChangeText={setDegree}
              keyboardType="number-pad"
              placeholder="3"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>
                Coefficients (highest to lowest degree):
              </Text>
            </View>

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

            <SolveButton
              onPress={handleSolve}
              label="📈 FIND ROOTS"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

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
                  <View key={idx}>
                    <Text style={styles.finalText}>
                      x{idx + 1} = {typeof root === 'string' ? root : root.toFixed(6)}
                    </Text>
                  </View>
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
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    maxWidth: 800,
  },
  tabletInputCard: {
    maxWidth: 600,
    width: '100%',
  },
  solutionArea: {
    gap: 0,
    width: '100%',
    maxWidth: 800,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
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
    justifyContent: 'center',
  },
  coeffItem: {
    flex: 1,
    minWidth: 100,
    maxWidth: 150,
  },
  coeffLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'center',
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
    width: '100%',
    maxWidth: 600,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  stepText: {
    color: colors.textPrimary,
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
    color: colors.accent,
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