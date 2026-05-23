import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { solveRadicalWithValues } from '../solvers/radicalSolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function RadicalScreen() {
  const [mode, setMode] = useState('simple');
  const [coeffA, setCoeffA] = useState('1');
  const [coeffB, setCoeffB] = useState('3');
  const [coeffC, setCoeffC] = useState('3');
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
      if (field === 'a') setCoeffA(memory.last_calculus_result);
      if (field === 'b') setCoeffB(memory.last_calculus_result);
      if (field === 'c') setCoeffC(memory.last_calculus_result);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const solverResult = solveRadicalWithValues(
          mode,
          parseFloat(coeffA) || 0,
          parseFloat(coeffB) || 0,
          parseFloat(coeffC) || 0
        );
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
            <BackHeader title="√ Radical Equations" subtitle="Square Roots & Domain Analysis" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeRow}>
              {[
                { id: 'simple', label: '√(ax+b) = c' },
                { id: 'quadratic', label: '√(ax+b) = cx+d' },
                { id: 'domain', label: 'Find Domain' },
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
              <TouchableOpacity onPress={() => handleRecallMemory('a')}>
                <Text style={styles.recallBtnMini}>Recall MR a</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRecallMemory('b')}>
                <Text style={styles.recallBtnMini}>Recall MR b</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRecallMemory('c')}>
                <Text style={styles.recallBtnMini}>Recall MR c</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Coefficient a:</Text>
            <TextInput style={styles.input} value={coeffA} onChangeText={setCoeffA} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={styles.inputLabel}>Constant b:</Text>
            <TextInput style={styles.input} value={coeffB} onChangeText={setCoeffB} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={styles.inputLabel}>{mode === 'quadratic' ? 'Coefficient c:' : 'Right side c:'}</Text>
            <TextInput style={styles.input} value={coeffC} onChangeText={setCoeffC} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <SolveButton
              onPress={handleSolve}
              label="√ SOLVE"
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
                    return <Text key={i} style={styles.stepText}>{item.text}</Text>;
                  })}
                </StepCard>
              ))}
              <FinalAnswer label="√ Result">
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

          {/* Tips */}
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>⚠️ Remember:</Text>
            <Text style={styles.tipText}>• Always check for extraneous solutions</Text>
            <Text style={styles.tipText}>• √x is always non-negative (≥ 0)</Text>
            <Text style={styles.tipText}>• Radicand must be ≥ 0 for real solutions</Text>
          </View>
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
  solutionArea: {
    gap: 0,
    width: '100%',
    maxWidth: 800,
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
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  modeBtn: { flex: 1, paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.white, fontSize: 12, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
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
  stepText: {
    color: colors.white,
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
  tipCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, marginTop: 12, width: '100%', maxWidth: 600 },
  tipTitle: { color: colors.accent, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  tipText: { color: colors.white, fontSize: 12, lineHeight: 20 },
});