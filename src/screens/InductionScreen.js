// src/screens/InductionScreen.js
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { InputCard } from '../components/InputCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { solveInduction } from '../solvers/inductionSolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function InductionScreen() {
  const [mode, setMode] = useState('transformer_v');
  const [Vp, setVp] = useState('230');
  const [Np, setNp] = useState('500');
  const [Ns, setNs] = useState('20');
  const [B, setB] = useState('0.8');
  const [A, setA] = useState('0.05');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);
    try {
      const params = {
        Vp: parseFloat(Vp),
        Np: parseFloat(Np),
        Ns: parseFloat(Ns),
        B: parseFloat(B),
        A: parseFloat(A),
      };
      const solverResult = solveInduction(mode, params);
      setResult(solverResult);
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToMemory = async (val) => {
    const numericValue = val.toString().split(' ')[0];
    const success = await storeValue('last_physics_result', numericValue);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRecallMemory = async (setter) => {
    const memory = await getMemory();
    const val = memory.last_physics_result || memory.last_calculus_result;
    if (val) {
      setter(val);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="🔌 Induction" subtitle="Transformers & Magnetic Flux" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeRow}>
              {[
                { id: 'transformer_v', label: 'Transformer' },
                { id: 'flux', label: 'Magnetic Flux' },
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

            {mode === 'transformer_v' ? (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Primary Voltage (Vₚ) [V]:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setVp)}>
                    <Text style={styles.recallBtnMini}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={Vp} onChangeText={setVp} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Primary Turns (Nₚ):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setNp)}>
                    <Text style={styles.recallBtnMini}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={Np} onChangeText={setNp} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Secondary Turns (Nₛ):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setNs)}>
                    <Text style={styles.recallBtnMini}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={Ns} onChangeText={setNs} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Magnetic Field (B) [T]:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setB)}>
                    <Text style={styles.recallBtnMini}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={B} onChangeText={setB} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Area (A) [m²]:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setA)}>
                    <Text style={styles.recallBtnMini}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={A} onChangeText={setA} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🔌 CALCULATE"
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
              <FinalAnswer label="🔌 Result">
                <View style={styles.finalResultRow}>
                  <Text style={styles.finalText}>{result.result}</Text>
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
  solutionArea: {
    gap: 0,
    width: '100%',
    maxWidth: 800,
  },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16, width: '100%' },
  modeBtn: { flex: 1, paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
    marginBottom: 8,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary },
  recallBtnMini: { color: colors.accent, fontSize: 10, fontWeight: '700', textDecorationLine: 'underline' },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center', width: '100%' },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
  finalResultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
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
