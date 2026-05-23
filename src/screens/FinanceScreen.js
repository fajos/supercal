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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { InputCard } from '../components/InputCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { solveFinance } from '../solvers/financeSolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native';

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

  const handleSaveToMemory = async (val) => {
    const success = await storeValue('last_calculus_result', val.toString());
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRecallMemory = async (field) => {
    const memory = await getMemory();
    if (memory.last_calculus_result) {
      if (field === 'principal') setPrincipal(memory.last_calculus_result);
      if (field === 'rate') setRate(memory.last_calculus_result);
      if (field === 'time') setTime(memory.last_calculus_result);
      if (field === 'payment') setPayment(memory.last_calculus_result);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSolve = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      setResult(solverResult);
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

          <InputCard>
            <View style={styles.modeGrid}>
              {[
                { id: 'compound', label: 'Compound\nInterest' },
                { id: 'simple', label: 'Simple\nInterest' },
                { id: 'loan', label: 'Loan\nPayment' },
                { id: 'savings', label: 'Savings\nGoal' },
              ].map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.modeBtn, mode === m.id && styles.modeBtnActive]}
                  onPress={() => { setMode(m.id); setResult(null); }}
                >
                  <Text style={[styles.modeText, mode === m.id && styles.modeTextActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Principal/Present Value ($):</Text>
              <TouchableOpacity onPress={() => handleRecallMemory('principal')}>
                <Text style={styles.recallBtn}>Recall MR</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={principal}
              onChangeText={setPrincipal}
              keyboardType="decimal-pad"
              placeholder="1000"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Annual Interest Rate (%):</Text>
              <TouchableOpacity onPress={() => handleRecallMemory('rate')}>
                <Text style={styles.recallBtn}>Recall MR</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              keyboardType="decimal-pad"
              placeholder="5"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>Time Period (years):</Text>
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
                <Text style={styles.inputLabel}>Compounds per Year:</Text>
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
                <Text style={styles.inputLabel}>Payment Amount ($):</Text>
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
              <FinalAnswer label="💰 Result">
                <View style={styles.finalResultRow}>
                  <Text style={styles.finalText}>
                    {typeof result.result === 'number'
                      ? `$${result.result.toFixed(2)}`
                      : result.result}
                  </Text>
                  {typeof result.result === 'number' && (
                    <TouchableOpacity
                      style={styles.memoryBtn}
                      onPress={() => handleSaveToMemory(result.result.toFixed(2))}
                    >
                      <Ionicons name="save-outline" size={18} color={colors.accent} />
                      <Text style={styles.memoryBtnText}>M+</Text>
                    </TouchableOpacity>
                  )}
                </View>
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
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  header: { marginBottom: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.white },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  modeGrid: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  modeBtn: {
    flex: 1,
    minWidth: '22%',
    paddingVertical: 10,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 10, fontWeight: '500', textAlign: 'center' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, letterSpacing: 0.3 },
  recallBtn: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
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
  solveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
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
  finalResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  memoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  memoryBtnText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});