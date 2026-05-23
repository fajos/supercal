// src/screens/CircularScreen.js
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
import { FinalAnswer } from '../components/FinalAnswer';
import { solveCircular } from '../solvers/circularSolver';
import { InputCard } from '../components/InputCard';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function CircularScreen() {
  const [mode, setMode] = useState('centripetal');
  const [mass, setMass] = useState('0.5');
  const [radius, setRadius] = useState('2');
  const [velocity, setVelocity] = useState('4');
  const [omega, setOmega] = useState('');
  const [period, setPeriod] = useState('');
  const [frequency, setFrequency] = useState('');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSolve = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);

    // Artificial delay for UI consistency
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const params = {
        mass: parseFloat(mass) || 0,
        radius: parseFloat(radius) || 1,
        velocity: parseFloat(velocity) || 0,
        omega: parseFloat(omega) || 0,
        period: parseFloat(period) || 0,
        frequency: parseFloat(frequency) || 0,
      };
      const solverResult = solveCircular(mode, params);
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
    // Extract numeric value from result string (e.g., "5.00 N" -> "5.00")
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
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="🎡 Circular Motion" subtitle="Rotational Dynamics" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeRow}>
              {[
                { id: 'centripetal', label: 'Force' },
                { id: 'angular', label: 'Angular' },
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

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Mass (m) kg:</Text>
              <TouchableOpacity onPress={() => handleRecallMemory(setMass)}>
                <Text style={styles.recallBtn}>Recall MR</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Radius (r) meters:</Text>
              <TouchableOpacity onPress={() => handleRecallMemory(setRadius)}>
                <Text style={styles.recallBtn}>Recall MR</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} value={radius} onChangeText={setRadius} keyboardType="decimal-pad" />

            {mode === 'centripetal' ? (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Linear Velocity (v) m/s:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setVelocity)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={velocity} onChangeText={setVelocity} keyboardType="decimal-pad" />
              </>
            ) : (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Frequency (f) Hz (optional):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setFrequency)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={frequency} onChangeText={setFrequency} keyboardType="decimal-pad" />

                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Period (T) s (optional):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setPeriod)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={period} onChangeText={setPeriod} keyboardType="decimal-pad" />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🎡 CALCULATE"
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
              <FinalAnswer label="🎡 Result">
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
  inputCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, marginBottom: 16, width: '100%' },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  modeBtn: { flex: 1, paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  recallBtn: { color: colors.accent, fontSize: 10, fontWeight: '600', textDecorationLine: 'underline' },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  solveBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: { backgroundColor: 'rgba(255,71,87,0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 14, padding: 16, marginBottom: 16, width: '100%', maxWidth: 600 },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
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
});
