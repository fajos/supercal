import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { useHistory } from '../utils/history';
import { solveDerivative, solveIntegral, evaluateExpression } from '../solvers/calculusSolver';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function CalculusScreen() {
  const [mode, setMode] = useState('derivative');
  const [expression, setExpression] = useState('x^3 + 2x^2 - 5x + 1');
  const [variable, setVariable] = useState('x');
  const [point, setPoint] = useState('2');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleCalculate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        if (mode === 'derivative') {
          const derivResult = solveDerivative(expression, variable);

          // Evaluate at point if provided
          let pointValue = null;
          const evalPoint = parseFloat(point);
          if (!isNaN(evalPoint)) {
            pointValue = evaluateExpression(
              derivResult.derivative,
              variable,
              evalPoint
            );
          }

          const shareText = `Derivative Result:\nFunction: f(${variable}) = ${expression}\nDerivative: f'(${variable}) = ${derivResult.derivative}${pointValue !== null ? `\nf'(${point}) = ${pointValue.toFixed(6)}` : ''}\n\nSolved with SuperCalc`;

          setResult({
            type: 'derivative',
            expression: derivResult.derivative,
            pointValue,
            steps: derivResult.steps,
            shareText,
          });

          addToHistory({
            type: 'calculus',
            mode: 'derivative',
            input: { expression, variable, point },
            result: { derivative: derivResult.derivative, value: pointValue },
            timestamp: new Date().toISOString(),
          });

        } else if (mode === 'integral') {
          const lower = parseFloat(point) || 0;
          // Using 5 as a default upper bound for now
          const upper = 5;

          const intResult = solveIntegral(expression, variable, lower, upper);
          const shareText = `Integral Result:\nIntegrand: f(${variable}) = ${expression}\nBounds: [${lower}, ${upper}]\nValue: ${intResult.value.toFixed(6)}\n\nSolved with SuperCalc`;

          setResult({
            type: 'integral',
            value: intResult.value,
            antiderivative: intResult.antiderivative,
            lower,
            upper,
            steps: intResult.steps,
            shareText,
          });

          addToHistory({
            type: 'calculus',
            mode: 'integral',
            input: { expression, variable, lower, upper },
            result: { value: intResult.value, antiderivative: intResult.antiderivative },
            timestamp: new Date().toISOString(),
          });
        }

        setTimeout(() => {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        }, 300);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 600);
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <BackHeader title="∫ Calculus" subtitle="Derivatives & Integrals" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            {/* Mode Toggle */}
            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[styles.modeBtn, mode === 'derivative' && styles.modeBtnActive]}
                onPress={() => { Haptics.selectionAsync(); setMode('derivative'); setResult(null); }}
              >
                <Text style={[styles.modeText, mode === 'derivative' && styles.modeTextActive]}>
                  d/dx Derivative
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, mode === 'integral' && styles.modeBtnActive]}
                onPress={() => { Haptics.selectionAsync(); setMode('integral'); setResult(null); }}
              >
                <Text style={[styles.modeText, mode === 'integral' && styles.modeTextActive]}>
                  ∫ Integral
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>
              {mode === 'derivative' ? 'Function f(x) =' : 'Integrand f(x) ='}
            </Text>
            <TextInput
              style={styles.exprInput}
              value={expression}
              onChangeText={setExpression}
              placeholder="e.g., x^3 + 2x^2 - 5x + 1"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.varRow}>
              <View style={styles.varItem}>
                <Text style={styles.varLabel}>Variable</Text>
                <TextInput
                  style={styles.varInput}
                  value={variable}
                  onChangeText={setVariable}
                  maxLength={1}
                />
              </View>
              <View style={styles.varItem}>
                <Text style={styles.varLabel}>
                  {mode === 'derivative' ? 'Evaluate at' : 'Lower bound'}
                </Text>
                <TextInput
                  style={styles.varInput}
                  value={point}
                  onChangeText={setPoint}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <SolveButton
              onPress={handleCalculate}
              label={mode === 'derivative' ? '📐 DIFFERENTIATE' : '📐 INTEGRATE'}
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {result && (
            <View style={styles.resultArea}>
              {result.steps.map((step, idx) => (
                <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                  {step.content.map((item, i) => {
                    if (item.type === 'highlight') {
                      return <Text key={i} style={styles.highlightText}>{item.text}</Text>;
                    }
                    return <Text key={i} style={styles.stepText}>{item.text}</Text>;
                  })}
                </StepCard>
              ))}

              <FinalAnswer
                label={result.type === 'derivative' ? '📐 Derivative' : '📐 Definite Integral'}
                shareText={result.shareText}
              >
                {result.type === 'derivative' && (
                  <View style={styles.finalContainer}>
                    <Text style={styles.finalExpr}>
                      f'({variable}) = {result.expression}
                    </Text>
                    {result.pointValue !== null && (
                      <Text style={styles.finalPoint}>
                        f'({point}) = {result.pointValue.toFixed(6)}
                      </Text>
                    )}
                  </View>
                )}
                {result.type === 'integral' && (
                  <View style={styles.finalContainer}>
                    <Text style={styles.finalExpr}>
                      ∫[{result.lower}, {result.upper}] f(x)dx
                    </Text>
                    <Text style={styles.finalPoint}>
                      = {result.value.toFixed(6)}
                    </Text>
                  </View>
                )}
              </FinalAnswer>
            </View>
          )}

          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>💡 Examples</Text>
            <Text style={styles.helpText}>• Polynomials: x^3, 2x^2 - 5x + 1</Text>
            <Text style={styles.helpText}>• Trig: sin(x), cos(2x)</Text>
            <Text style={styles.helpText}>• Exponential: e^x, 2^x</Text>
            <Text style={styles.helpText}>• Log: log(x), ln(x)</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  flex: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: { maxWidth: 600, width: '100%' },
  resultArea: { gap: 0, width: '100%', maxWidth: 800 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', width: '100%' },
  modeBtn: {
    flex: 1,
    minWidth: 140,
    paddingVertical: 12,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, alignSelf: 'flex-start' },
  exprInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 16,
    textAlign: 'center',
    width: '100%',
  },
  varRow: { flexDirection: 'row', gap: 12, marginTop: 12, width: '100%' },
  varItem: { flex: 1 },
  varLabel: { color: colors.textSecondary, fontSize: 11, marginBottom: 4 },
  varInput: {
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
  finalExpr: {
    color: colors.white,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 28,
  },
  finalPoint: {
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 8,
  },
  finalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  helpCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 800,
    marginTop: 16,
  },
  helpTitle: { color: colors.white, fontSize: 16, fontWeight: '600', marginBottom: 10 },
  helpText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 22,
  },
});