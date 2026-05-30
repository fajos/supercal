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
import { ModeChip } from '../components/ModeChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function CalculusScreen() {
  const [mode, setMode] = useState('derivative');
  const [expression, setExpression] = useState('x³ + 2x² − 5x + 1');
  const [variable, setVariable] = useState('x');
  const [point, setPoint] = useState('0');
  const [upperBound, setUpperBound] = useState('5');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleCalculate = () => {
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        if (mode === 'derivative') {
          const derivResult = solveDerivative(expression, variable);

          // Evaluate at point if provided - use evalDerivative for calculation
          let pointValue = null;
          const evalPoint = parseFloat(point);
          if (!isNaN(evalPoint)) {
            pointValue = evaluateExpression(
              derivResult.evalDerivative, // Use the evaluable version
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
          const upper = parseFloat(upperBound) || 0;

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
              <ModeChip
                label="d/dx Derivative"
                active={mode === 'derivative'}
                onPress={() => { setMode('derivative'); setResult(null); }}
                style={styles.modeBtn}
              />
              <ModeChip
                label="∫ Integral"
                active={mode === 'integral'}
                onPress={() => { setMode('integral'); setResult(null); }}
                style={styles.modeBtn}
              />
            </View>

            <Text style={styles.inputLabel}>
              {mode === 'derivative' ? 'Function f(x) =' : 'Integrand f(x) ='}
            </Text>
            <TextInput
              style={styles.exprInput}
              value={expression}
              onChangeText={setExpression}
              placeholder="e.g., x³ + 2x² − 5x + 1"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.varRow}>
              <View style={[styles.varItem, { flex: 0.8 }]}>
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
                  {mode === 'derivative' ? 'Evaluate at' : 'Lower bound (a)'}
                </Text>
                <TextInput
                  style={styles.varInput}
                  value={point}
                  onChangeText={setPoint}
                  keyboardType="decimal-pad"
                />
              </View>
              {mode === 'integral' && (
                <View style={styles.varItem}>
                  <Text style={styles.varLabel}>Upper bound (b)</Text>
                  <TextInput
                    style={styles.varInput}
                    value={upperBound}
                    onChangeText={setUpperBound}
                    keyboardType="decimal-pad"
                  />
                </View>
              )}
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
                    if (item.type === 'formula') {
                      return (
                        <View key={i} style={styles.formulaRow}>
                          <Text style={styles.formulaText}>{item.text}</Text>
                        </View>
                      );
                    }
                    if (item.type === 'result') {
                      return (
                        <View key={i} style={styles.resultBox}>
                          <Text style={styles.resultText}>{item.text}</Text>
                        </View>
                      );
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
                      f′({variable}) = {result.expression}
                    </Text>
                    {result.pointValue !== null && !isNaN(result.pointValue) && (
                      <Text style={styles.finalPoint}>
                        f′({point}) = {result.pointValue.toFixed(6)}
                      </Text>
                    )}
                    {result.pointValue !== null && isNaN(result.pointValue) && (
                      <Text style={[styles.finalPoint, { color: colors.error }]}>
                        f′({point}) = Calculation Error
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
            <Text style={styles.helpText}>• Polynomials: x³, 2x² − 5x + 1</Text>
            <Text style={styles.helpText}>• Trig: sin(x), cos(2x)</Text>
            <Text style={styles.helpText}>• Exponential: eˣ, 2ˣ</Text>
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
  },
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
  formulaRow: {
    backgroundColor: colors.purpleBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.purpleGlow,
  },
  formulaText: {
    color: colors.purpleGlow,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
  },
  resultBox: {
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  resultText: {
    color: colors.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '700',
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