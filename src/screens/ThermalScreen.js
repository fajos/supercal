// src/screens/ThermalScreen.js
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
import { solveThermal } from '../solvers/thermalSolver';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function ThermalScreen() {
  const [mode, setMode] = useState('specificHeat');
  const [mass, setMass] = useState('2');
  const [specificHeat, setSpecificHeat] = useState('4200');
  const [deltaTemp, setDeltaTemp] = useState('10');
  const [latentHeat, setLatentHeat] = useState('334000');

  // Gas Laws
  const [p1, setP1] = useState('101325');
  const [v1, setV1] = useState('1');
  const [t1, setT1] = useState('273');
  const [p2, setP2] = useState('202650');
  const [t2, setT2] = useState('300');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);
    setTimeout(() => {
      try {
        const params = {
          mass: parseFloat(mass) || 0,
          specificHeat: parseFloat(specificHeat) || 0,
          deltaTemp: parseFloat(deltaTemp) || 0,
          latentHeat: parseFloat(latentHeat) || 0,
          initialPressure: parseFloat(p1) || 0,
          initialVolume: parseFloat(v1) || 0,
          initialTemp: parseFloat(t1) || 1,
          finalPressure: parseFloat(p2) || 0,
          finalTemp: parseFloat(t2) || 1,
        };
        const solverResult = solveThermal(mode, params);
        setResult(solverResult);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
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
            <BackHeader title="🌡️ Thermal Physics" subtitle="Heat & Thermodynamics" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'specificHeat', label: 'Heat' },
                { id: 'latentHeat', label: 'Latent' },
                { id: 'gasLaws', label: 'Gas Laws' },
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

            {mode === 'specificHeat' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Mass (m) kg:</Text>
                <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Spec. Heat (c) J/kg·K:</Text>
                <TextInput style={styles.input} value={specificHeat} onChangeText={setSpecificHeat} keyboardType="decimal-pad" />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Temp Change (Δθ) K:</Text>
                <TextInput style={styles.input} value={deltaTemp} onChangeText={setDeltaTemp} keyboardType="decimal-pad" />
              </>
            )}

            {mode === 'latentHeat' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Mass (m) kg:</Text>
                <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Latent Heat (L) J/kg:</Text>
                <TextInput style={styles.input} value={latentHeat} onChangeText={setLatentHeat} keyboardType="decimal-pad" />
              </>
            )}

            {mode === 'gasLaws' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>P1 (Pa), V1, T1 (K):</Text>
                <View style={styles.row}>
                  <TextInput style={[styles.input, { flex: 1 }]} value={p1} onChangeText={setP1} keyboardType="decimal-pad" placeholder="P1" placeholderTextColor={colors.textSecondary} />
                  <TextInput style={[styles.input, { flex: 1 }]} value={v1} onChangeText={setV1} keyboardType="decimal-pad" placeholder="V1" placeholderTextColor={colors.textSecondary} />
                  <TextInput style={[styles.input, { flex: 1 }]} value={t1} onChangeText={setT1} keyboardType="decimal-pad" placeholder="T1" placeholderTextColor={colors.textSecondary} />
                </View>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>P2 (Pa), T2 (K) [Find V2]:</Text>
                <View style={styles.row}>
                  <TextInput style={[styles.input, { flex: 1 }]} value={p2} onChangeText={setP2} keyboardType="decimal-pad" placeholder="P2" placeholderTextColor={colors.textSecondary} />
                  <TextInput style={[styles.input, { flex: 1 }]} value={t2} onChangeText={setT2} keyboardType="decimal-pad" placeholder="T2" placeholderTextColor={colors.textSecondary} />
                </View>
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🔥 CALCULATE"
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
              <FinalAnswer label="🌡️ Result">
                <Text style={styles.finalText}>{result.result}</Text>
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
  modeGrid: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  modeBtn: {
    flex: 1,
    minWidth: '28%',
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
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center', width: '100%' },
  row: { flexDirection: 'row', gap: 8, width: '100%' },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 20, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});