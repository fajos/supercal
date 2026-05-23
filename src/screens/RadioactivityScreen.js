// src/screens/RadioactivityScreen.js
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
import { solveRadioactivity } from '../solvers/radioactivitySolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

export default function RadioactivityScreen() {
  const [mode, setMode] = useState('halfLife');
  const [initialAmount, setInitialAmount] = useState('100');
  const [time, setTime] = useState('10');
  const [halfLife, setHalfLife] = useState('5');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSaveToMemory = async (val) => {
    const success = await storeValue('last_physics_result', val.toString());
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRecallMemory = async (field) => {
    const memory = await getMemory();
    if (memory.last_physics_result) {
      if (field === 'initial') setInitialAmount(memory.last_physics_result);
      if (field === 'time') setTime(memory.last_physics_result);
      if (field === 'halfLife') setHalfLife(memory.last_physics_result);
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
          initialAmount: parseFloat(initialAmount) || 0,
          time: parseFloat(time) || 0,
          halfLife: parseFloat(halfLife) || 1,
        };
        const solverResult = solveRadioactivity(mode, params);
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
          <BackHeader title="⚛️ Radioactivity" subtitle="Decay & Half-Life" />

          <InputCard>
            <View style={styles.modeRow}>
              {[
                { id: 'halfLife', label: 'Decay' },
                { id: 'decayConstant', label: 'Constant' },
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

            {mode === 'halfLife' ? (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Initial Amount (N₀):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('initial')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={initialAmount} onChangeText={setInitialAmount} keyboardType="decimal-pad" />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Elapsed Time (t):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('time')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="decimal-pad" />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Half-life (T):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('halfLife')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={halfLife} onChangeText={setHalfLife} keyboardType="decimal-pad" />
              </>
            ) : (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Half-life (T) seconds:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('halfLife')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={halfLife} onChangeText={setHalfLife} keyboardType="decimal-pad" />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              title="CALCULATE"
              icon="nuclear-outline"
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
              <FinalAnswer label="⚛️ Result">
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
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  solveBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: { backgroundColor: 'rgba(255,71,87,0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  solutionArea: { gap: 0 },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
  inputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  recallBtn: { color: colors.accent, fontSize: 10, fontWeight: '600', textDecorationLine: 'underline' },
  finalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  memoryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.accent + '40' },
  memoryBtnText: { color: colors.accent, fontSize: 12, fontWeight: '700', marginLeft: 6 },
});
