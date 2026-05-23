import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, KeyboardAvoidingView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { solveExponential } from '../solvers/exponentialSolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function ExponentialScreen() {
  const [mode, setMode] = useState('exponential');
  const [base, setBase] = useState('2');
  const [value, setValue] = useState('8');
  const [principal, setPrincipal] = useState('1000');
  const [rate, setRate] = useState('5');
  const [time, setTime] = useState('10');
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
      const val = memory.last_calculus_result;
      if (field === 'base') setBase(val);
      if (field === 'value') setValue(val);
      if (field === 'principal') setPrincipal(val);
      if (field === 'rate') setRate(val);
      if (field === 'time') setTime(val);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        let params = {};

        if (mode === 'exponential') {
          params = { base: parseFloat(base), value: parseFloat(value) };
        } else if (mode === 'logarithmic') {
          params = { base: parseFloat(base), value: parseFloat(value) };
        } else if (mode === 'natural') {
          params = { value: parseFloat(value), isExp: true };
        } else if (mode === 'growth') {
          params = { principal: parseFloat(principal), rate: parseFloat(rate), time: parseFloat(time), mode: 'growth' };
        }

        const solverResult = solveExponential(mode, params);
        setResult(solverResult);
        setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
      } catch (err) {
        setError(err.message);
        setResult(null);
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
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="📊 Exp & Log" subtitle="Exponential & Logarithmic Equations" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeRow}>
              {[
                { id: 'exponential', label: 'a^x = b' },
                { id: 'logarithmic', label: 'log_a(x) = b' },
                { id: 'natural', label: 'e^x / ln(x)' },
                { id: 'growth', label: 'Growth' },
              ].map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.modeBtn, mode === m.id && styles.modeBtnActive]}
                  onPress={() => { setMode(m.id); setResult(null); }}
                >
                  <Text style={[styles.modeText, mode === m.id && styles.modeTextActive]}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputHeader}>
              {mode !== 'growth' ? (
                <>
                  <TouchableOpacity onPress={() => handleRecallMemory('base')}>
                    <Text style={styles.recallBtnMini}>Recall MR Base</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRecallMemory('value')}>
                    <Text style={styles.recallBtnMini}>Recall MR Value</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => handleRecallMemory('principal')}>
                    <Text style={styles.recallBtnMini}>Recall MR P</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRecallMemory('rate')}>
                    <Text style={styles.recallBtnMini}>Recall MR R</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRecallMemory('time')}>
                    <Text style={styles.recallBtnMini}>Recall MR T</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {mode !== 'growth' ? (
              <>
                <Text style={styles.inputLabel}>{mode === 'natural' ? 'Not applicable' : 'Base a:'}</Text>
                <TextInput
                  style={[styles.input, mode === 'natural' && styles.disabledInput]}
                  value={base}
                  onChangeText={setBase}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textSecondary}
                  editable={mode !== 'natural'}
                />
                <Text style={styles.inputLabel}>Value b:</Text>
                <TextInput style={styles.input} value={value} onChangeText={setValue} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Initial Amount (P):</Text>
                <TextInput style={styles.input} value={principal} onChangeText={setPrincipal} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
                <Text style={styles.inputLabel}>Rate (%):</Text>
                <TextInput style={styles.input} value={rate} onChangeText={setRate} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
                <Text style={styles.inputLabel}>Time periods (t):</Text>
                <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="📊 SOLVE"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {result && (
            <View style={styles.solutionArea}>
              {result.steps.map((step, idx) => (
                <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                  {step.content.map((item, i) => {
                    if (item.type === 'highlight') return <Text key={i} style={styles.highlightText}>{item.text}</Text>;
                    if (item.type === 'formula') return <Text key={i} style={styles.formulaText}>{item.text}</Text>;
                    return <Text key={i} style={styles.stepText}>{item.text}</Text>;
                  })}
                </StepCard>
              ))}
              <FinalAnswer label="📊 Result">
                <View style={styles.finalResultRow}>
                  <Text style={styles.finalText}>{String(result.result)}</Text>
                  <TouchableOpacity
                    style={styles.memoryBtn}
                    onPress={() => handleSaveToMemory(result.result)}
                  >
                    <Ionicons name="save-outline" size={18} color={colors.accent} />
                    <Text style={styles.memoryBtnText}>M+</Text>
                  </TouchableOpacity>
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
  flex: { flex: 1 },
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
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 12,
  },
  recallBtnMini: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modeRow: { flexDirection: 'row', gap: 6, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  modeBtn: { flex: 1, minWidth: '22%', paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 11, fontWeight: '500', textAlign: 'center' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center', width: '100%' },
  disabledInput: { opacity: 0.5, backgroundColor: colors.bgCard },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
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
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
});
