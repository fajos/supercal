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
  const [coeffs, setCoeffs] = useState(['1', '-6', '11', '-6', '0', '0']);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const deg = parseInt(degree);
        if (isNaN(deg) || deg < 1 || deg > 5) {
          throw new Error('Please enter a degree between 1 and 5');
        }

        // Collect exactly deg + 1 coefficients
        const coefficients = [];
        for (let i = 0; i <= deg; i++) {
          coefficients.push(parseFloat(coeffs[i]) || 0);
        }

        const result = solvePolynomial(coefficients);
        const shareText = `Polynomial Result:\nDegree: ${deg}\nCoefficients: ${coefficients.join(', ')}\nRoots: ${result.roots.map((r, i) => `x${getSubscript(i+1)}=${typeof r === 'string' ? r : r.toFixed(6)}`).join(', ')}\n\nSolved with SuperCalc`;

        setSolution({ ...result, shareText });

        addToHistory({
          type: 'polynomial',
          input: { degree: deg, coefficients: coefficients },
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

  const updateCoeff = (index, value) => {
    const newCoeffs = [...coeffs];
    newCoeffs[index] = value;
    setCoeffs(newCoeffs);
  };

  // Helper function to convert numbers to superscript
  const getSuperscript = (num) => {
    const superscripts = {
      '0': '⁰',
      '1': '¹',
      '2': '²',
      '3': '³',
      '4': '⁴',
      '5': '⁵',
      '6': '⁶',
      '7': '⁷',
      '8': '⁸',
      '9': '⁹'
    };
    return String(num).split('').map(digit => superscripts[digit] || digit).join('');
  };

  // Helper function to convert numbers to subscript
  const getSubscript = (num) => {
    const subscripts = {
      '0': '₀',
      '1': '₁',
      '2': '₂',
      '3': '₃',
      '4': '₄',
      '5': '₅',
      '6': '₆',
      '7': '₇',
      '8': '₈',
      '9': '₉'
    };
    return String(num).split('').map(digit => subscripts[digit] || digit).join('');
  };

  const getCoeffLabel = (index, deg) => {
    const power = deg - index;
    if (power === 0) return 'constant term';
    if (power === 1) return 'x term';
    return `x${getSuperscript(power)} term`; // Now shows x², x³, etc.
  };

  const renderContent = (content) => {
    return content.map((item, idx) => {
      switch (item.type) {
        case 'formula':
          return (
            <View key={idx} style={styles.formulaBox}>
              <Text style={styles.formulaText}>{item.text}</Text>
            </View>
          );
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

  const degVal = parseInt(degree) || 0;

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
              <Text style={styles.inputLabel}>Degree (1-5):</Text>
            </View>
            <View style={styles.degreeContainer}>
              <TextInput
                style={styles.degreeInput}
                value={degree}
                onChangeText={(val) => {
                  setDegree(val);
                  setSolution(null);
                }}
                keyboardType="number-pad"
                placeholder="3"
                placeholderTextColor={colors.textSecondary}
                maxLength={1}
              />
            </View>

            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>
                Coefficients:
              </Text>
            </View>

            <View style={styles.coeffGrid}>
              {Array.from({ length: degVal + 1 }).map((_, i) => (
                <View key={i} style={styles.coeffItem}>
                  <Text style={styles.coeffLabel}>{getCoeffLabel(i, degVal)}</Text>
                  <TextInput
                    style={styles.coeffInput}
                    value={coeffs[i]}
                    onChangeText={(text) => updateCoeff(i, text)}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              ))}
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

              <FinalAnswer label="🎯 Roots Found" shareText={solution.shareText}>
                {solution.roots.map((root, idx) => (
                  <View key={idx}>
                    <Text style={styles.finalText}>
                      x{getSubscript(idx + 1)} = {typeof root === 'string' ? root : root.toFixed(6)}
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
  degreeContainer: {
    alignItems: 'center',
    marginBottom: 8,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.purpleGlow,
    alignSelf: 'flex-start',
    marginVertical: 6,
    width: '100%',
  },
  resultText: {
    color: colors.purpleGlow,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '700',
  },
  formulaBox: {
    backgroundColor: colors.accentBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    alignSelf: 'flex-start',
    marginVertical: 6,
    width: '100%',
  },
  formulaText: {
    color: colors.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '700',
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