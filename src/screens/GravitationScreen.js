// src/screens/GravitationScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { ErrorCard } from '../components/ErrorCard';
import { InputCard } from '../components/InputCard';
import { SolveButton } from '../components/SolveButton';
import { solveGravitation } from '../solvers/gravitationSolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

export default function GravitationScreen() {
  const [mode, setMode] = useState('force');
  const [M, setM] = useState('5.97e24'); // Earth mass
  const [m, setM_small] = useState('7.35e22'); // Moon mass
  const [r, setR] = useState('3.84e8'); // Earth-Moon distance

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSaveToMemory = async (val) => {
    // Extract numeric value from result string (e.g., "9.81 m/s²" -> "9.81")
    const numericValue = val.toString().split(' ')[0];
    const success = await storeValue('last_physics_result', numericValue);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRecallMemory = async (setter) => {
    const memory = await getMemory();
    const val = memory.last_physics_result;
    if (val) {
      setter(val);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSolve = () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);

    setTimeout(() => {
      try {
        const params = {
          M: parseFloat(M),
          m: parseFloat(m),
          r: parseFloat(r),
        };
        const solverResult = solveGravitation(mode, params);
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
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <BackHeader title="🌍 Gravitation" subtitle="Universal Gravity & Field Strength" />

          <InputCard>
            <View style={styles.modeRow}>
              {[
                { id: 'force', label: 'Gravity Force' },
                { id: 'field', label: 'Field Strength' },
              ].map(m_btn => (
                <TouchableOpacity
                  key={m_btn.id}
                  style={[styles.modeBtn, mode === m_btn.id && styles.modeBtnActive]}
                  onPress={() => { setMode(m_btn.id); setResult(null); }}
                >
                  <Text style={[styles.modeText, mode === m_btn.id && styles.modeTextActive]}>
                    {m_btn.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Mass (M) [kg]:</Text>
              <TouchableOpacity onPress={() => handleRecallMemory(setM)}>
                <Text style={styles.recallBtn}>Recall MR</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} value={M} onChangeText={setM} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            {mode === 'force' && (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Mass (m) [kg]:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setM_small)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={m} onChangeText={setM_small} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Distance (r) [m]:</Text>
              <TouchableOpacity onPress={() => handleRecallMemory(setR)}>
                <Text style={styles.recallBtn}>Recall MR</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} value={r} onChangeText={setR} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              title="CALCULATE"
              icon="earth-outline"
            />
          </InputCard>

          <ErrorCard error={error} />

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
              <FinalAnswer label="🌍 Result">
                <View style={styles.finalRow}>
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
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  inputCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, marginBottom: 16 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  modeBtn: { flex: 1, paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  inputLabel: { fontSize: 13, color: colors.textSecondary },
  recallBtn: { color: colors.accent, fontSize: 10, fontWeight: '600', textDecorationLine: 'underline' },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  solveBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: { backgroundColor: 'rgba(255,71,87,0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  solutionArea: { gap: 0 },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
  finalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  memoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  memoryBtnText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
});
