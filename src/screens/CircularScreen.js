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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveCircular } from '../solvers/circularSolver';
import { BackHeader } from '../components/BackHeader';

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
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
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
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
       <BackHeader title="🎡 Circular Motion" subtitle="Rotational Dynamics" />

        <View style={styles.inputCard}>
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

          <Text style={styles.inputLabel}>Mass (m) kg:</Text>
          <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" />

          <Text style={styles.inputLabel}>Radius (r) meters:</Text>
          <TextInput style={styles.input} value={radius} onChangeText={setRadius} keyboardType="decimal-pad" />

          {mode === 'centripetal' ? (
            <>
              <Text style={styles.inputLabel}>Linear Velocity (v) m/s:</Text>
              <TextInput style={styles.input} value={velocity} onChangeText={setVelocity} keyboardType="decimal-pad" />
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Frequency (f) Hz (optional):</Text>
              <TextInput style={styles.input} value={frequency} onChangeText={setFrequency} keyboardType="decimal-pad" />
              <Text style={styles.inputLabel}>Period (T) s (optional):</Text>
              <TextInput style={styles.input} value={period} onChangeText={setPeriod} keyboardType="decimal-pad" />
            </>
          )}

          <TouchableOpacity style={styles.solveBtn} onPress={handleSolve} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>🎡 CALCULATE</Text>
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
            <FinalAnswer label="🎡 Result">
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
  solveBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: { backgroundColor: 'rgba(255,71,87,0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  solutionArea: { gap: 0 },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});
