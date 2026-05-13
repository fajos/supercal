// src/screens/KinematicsScreen.js
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
import { solveKinematics } from '../solvers/kinematicsSolver';

export default function KinematicsScreen() {
  const [mode, setMode] = useState('velocity');
  const [initialVelocity, setInitialVelocity] = useState('0');
  const [finalVelocity, setFinalVelocity] = useState('20');
  const [acceleration, setAcceleration] = useState('2');
  const [time, setTime] = useState('10');
  const [displacement, setDisplacement] = useState('100');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    try {
      const params = {
        initialVelocity: parseFloat(initialVelocity) || 0,
        finalVelocity: parseFloat(finalVelocity) || 0,
        acceleration: parseFloat(acceleration) || 0,
        time: parseFloat(time) || 0,
        displacement: parseFloat(displacement) || 0,
      };
      const solverResult = solveKinematics(mode, params);
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
        <View style={styles.header}>
          <Text style={styles.title}>🏃 Kinematics</Text>
          <Text style={styles.subtitle}>Motion in One Dimension</Text>
        </View>

        <View style={styles.inputCard}>
          <View style={styles.modeRow}>
            {[
              { id: 'velocity', label: 'Velocity' },
              { id: 'displacement', label: 'Displacement' },
              { id: 'time', label: 'Time' },
            ].map(m => (
              <TouchableOpacity
                key={m.id}
                style={[styles.modeBtn, mode === m.id && styles.modeBtnActive]}
                onPress={() => { setMode(m.id); setResult(null); }}
              >
                <Text style={[styles.modeText, mode === m.id && styles.modeTextActive]}>
                  Find {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Initial Velocity (v₀) m/s:</Text>
          <TextInput style={styles.input} value={initialVelocity} onChangeText={setInitialVelocity} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

          <Text style={styles.inputLabel}>Final Velocity (v) m/s:</Text>
          <TextInput style={styles.input} value={finalVelocity} onChangeText={setFinalVelocity} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

          <Text style={styles.inputLabel}>Acceleration (a) m/s²:</Text>
          <TextInput style={styles.input} value={acceleration} onChangeText={setAcceleration} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

          <Text style={styles.inputLabel}>Time (t) seconds:</Text>
          <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

          <Text style={styles.inputLabel}>Displacement (Δx) meters:</Text>
          <TextInput style={styles.input} value={displacement} onChangeText={setDisplacement} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

          <TouchableOpacity style={styles.solveBtn} onPress={handleSolve} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>🏃 CALCULATE</Text>
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
            <FinalAnswer label="🏃 Result">
              <Text style={styles.finalText}>{result.result}</Text>
            </FinalAnswer>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ... styles (similar pattern - see previous screens for reference)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.white },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
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
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});