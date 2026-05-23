// src/screens/QuantumScreen.js
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
import { solveQuantum } from '../solvers/quantumSolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function QuantumScreen() {
  const [mode, setMode] = useState('photon_e');
  const [f, setF] = useState('5e14'); // Visible light approx
  const [mass, setMass] = useState('9.11e-31'); // Electron mass
  const [v, setV] = useState('2.2e6'); // Electron speed in Bohr atom

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

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

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);
    try {
      const params = {
        f: parseFloat(f),
        mass: parseFloat(mass),
        v: parseFloat(v),
      };
      const solverResult = solveQuantum(mode, params);
      setResult(solverResult);
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
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
            <BackHeader title="🔮 Quantum Physics" subtitle="Photons & Wave-Particle Duality" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'photon_e', label: 'Photon Energy' },
                { id: 'de_broglie', label: 'de Broglie λ' },
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

            {mode === 'photon_e' ? (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Frequency (f) [Hz]:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setF)}>
                    <Text style={styles.recallBtnMini}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={f} onChangeText={setF} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Particle Mass (m) [kg]:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setMass)}>
                    <Text style={styles.recallBtnMini}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Velocity (v) [m/s]:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setV)}>
                    <Text style={styles.recallBtnMini}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={v} onChangeText={setV} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🔮 CALCULATE"
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
              <FinalAnswer label="🔮 Result">
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
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: {
    maxWidth: 600,
    width: '100%',
  },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  modeGrid: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  modeBtn: {
    flex: 1,
    minWidth: '40%',
    paddingVertical: 10,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
  },
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
  recallBtnMini: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center', width: '100%' },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
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
});
