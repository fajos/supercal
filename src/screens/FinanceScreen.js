import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { InputCard } from '../components/InputCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { ModeChip } from '../components/ModeChip';
import { solveFinance } from '../solvers/financeSolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function FinanceScreen() {
  const [mode, setMode] = useState('compound');
  const [principal, setPrincipal] = useState('1000');
  const [rate, setRate] = useState('5');
  const [time, setTime] = useState('10');
  const [compoundFreq, setCompoundFreq] = useState('12');
  const [payment, setPayment] = useState('100');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = async () => {
    setLoading(true);
    setError(null);

    // Artificial delay for UI consistency
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const params = {
        principal: parseFloat(principal) || 0,
        rate: parseFloat(rate) || 0,
        time: parseFloat(time) || 0,
        compoundFreq: parseInt(compoundFreq) || 1,
        payment: parseFloat(payment) || 0,
      };
      const solverResult = solveFinance(mode, params);
      const opLabel = mode === 'compound' ? 'Compound Interest' : mode === 'simple' ? 'Simple Interest' : mode === 'loan' ? 'Loan Payment' : 'Savings Goal';
      const shareText = `Finance Result (${opLabel}):\nPrincipal: $${params.principal}\nRate: ${params.rate}%\nTime: ${params.time} years\nResult: ${typeof solverResult.result === 'number' ? `$${solverResult.result.toFixed(2)}` : solverResult.result}\n\nSolved with SuperCalc`;

      const resultData = { ...solverResult, shareText };
      setResult(resultData);

      addToHistory({
        type: 'finance',
        mode,
        input: params,
        result: solverResult.result,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content) => {
    return content.map((item, idx) => {
      if (item.type === 'highlight') return <Text key={idx} style={styles.highlightText}>{item.text}</Text>;
      if (item.type === 'result') return (
        <View key={idx} style={styles.resultBox}>
          <Text style={styles.resultText}>{item.text}</Text>
        </View>
      );
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="💰 Financial Math" subtitle="Interest, Loans & Investments" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'compound', label: 'Compound Interest' },
                { id: 'simple', label: 'Simple Interest' },
                { id: 'loan', label: 'Loan Payment' },
                { id: 'savings', label: 'Savings Goal' },
              ].map(m => (
                <ModeChip
                  key={m.id}
                  label={m.label}
                  active={mode === m.id}
                  onPress={() => {
                    setMode(m.id);
                    setResult(null);
                  }}
                  style={styles.modeBtn}
                />
              ))}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Principal/Present Value ($):</Text>
            <TextInput
              style={styles.input}
              value={principal}
              onChangeText={setPrincipal}
              keyboardType="decimal-pad"
              placeholder="1000"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Annual Interest Rate (%):</Text>
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              keyboardType="decimal-pad"
              placeholder="5"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Time Period (years):</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              keyboardType="decimal-pad"
              placeholder="10"
              placeholderTextColor={colors.textSecondary}
            />

            {(mode === 'compound' || mode === 'savings') && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Compounds per Year:</Text>
                <TextInput
                  style={styles.input}
                  value={compoundFreq}
                  onChangeText={setCompoundFreq}
                  keyboardType="number-pad"
                  placeholder="12 (monthly)"
                  placeholderTextColor={colors.textSecondary}
                />
              </>
            )}

            {(mode === 'loan' || mode === 'savings') && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Payment Amount ($):</Text>
                <TextInput
                  style={styles.input}
                  value={payment}
                  onChangeText={setPayment}
                  keyboardType="decimal-pad"
                  placeholder="100"
                  placeholderTextColor={colors.textSecondary}
                />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="💰 CALCULATE"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {result && (
            <View style={styles.solutionArea}>
              {result.steps.map((step, idx) => (
                <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                  {renderContent(step.content)}
                </StepCard>
              ))}
              <FinalAnswer
                label="💰 Result"
                shareText={result.shareText}
              >
                <Text style={styles.finalText}>
                  {typeof result.result === 'number'
                    ? `$${result.result.toFixed(2)}`
                    : result.result}
                </Text>
              </FinalAnswer>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: { width: '100%', maxWidth: 600 },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '45%',
    flex: 1,
  },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 10, fontWeight: '500', textAlign: 'center' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, letterSpacing: 0.3, marginBottom: 8 },
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 14,
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
  finalText: {
    color: colors.white,
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 36,
  },
});