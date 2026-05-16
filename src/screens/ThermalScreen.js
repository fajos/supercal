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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveThermal } from '../solvers/thermalSolver';
import { BackHeader } from '../components/BackHeader';

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
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
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
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
       <BackHeader title="🌡️ Thermal Physics" subtitle="Heat & Thermodynamics" />

        <View style={styles.inputCard}>
          <View style={styles.modeRow}>
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
              <Text style={styles.inputLabel}>Mass (m) kg:</Text>
              <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" />
              <Text style={styles.inputLabel}>Spec. Heat (c) J/kg·K:</Text>
              <TextInput style={styles.input} value={specificHeat} onChangeText={setSpecificHeat} keyboardType="decimal-pad" />
              <Text style={styles.inputLabel}>Temp Change (Δθ) K:</Text>
              <TextInput style={styles.input} value={deltaTemp} onChangeText={setDeltaTemp} keyboardType="decimal-pad" />
            </>
          )}

          {mode === 'latentHeat' && (
            <>
              <Text style={styles.inputLabel}>Mass (m) kg:</Text>
              <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" />
              <Text style={styles.inputLabel}>Latent Heat (L) J/kg:</Text>
              <TextInput style={styles.input} value={latentHeat} onChangeText={setLatentHeat} keyboardType="decimal-pad" />
            </>
          )}

          {mode === 'gasLaws' && (
            <>
              <Text style={styles.inputLabel}>P1 (Pa), V1, T1 (K):</Text>
              <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1 }]} value={p1} onChangeText={setP1} keyboardType="decimal-pad" placeholder="P1" />
                <TextInput style={[styles.input, { flex: 1 }]} value={v1} onChangeText={setV1} keyboardType="decimal-pad" placeholder="V1" />
                <TextInput style={[styles.input, { flex: 1 }]} value={t1} onChangeText={setT1} keyboardType="decimal-pad" placeholder="T1" />
              </View>
              <Text style={styles.inputLabel}>P2 (Pa), T2 (K) [Find V2]:</Text>
              <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1 }]} value={p2} onChangeText={setP2} keyboardType="decimal-pad" placeholder="P2" />
                <TextInput style={[styles.input, { flex: 1 }]} value={t2} onChangeText={setT2} keyboardType="decimal-pad" placeholder="T2" />
              </View>
            </>
          )}

          <TouchableOpacity style={styles.solveBtn} onPress={handleSolve} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>🔥 CALCULATE</Text>
          </TouchableOpacity>
        </View>

        {error && <View style={styles.errorCard}><Text style={styles.errorText}>⚠️ {error}</Text></View>}

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
  row: { flexDirection: 'row', gap: 8 },
  solveBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: { backgroundColor: 'rgba(255,71,87,0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  solutionArea: { gap: 0 },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 20, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});
