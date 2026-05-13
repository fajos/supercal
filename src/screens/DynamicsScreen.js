import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveDynamics } from '../solvers/dynamicsSolver';
import { BackHeader } from '../components/BackHeader';

export default function DynamicsScreen() {
  const [mode, setMode] = useState('newton2');
  const [mass, setMass] = useState('10');
  const [force, setForce] = useState('50');
  const [friction, setFriction] = useState('0.3');
  const [angle, setAngle] = useState('30');
  const [velocity, setVelocity] = useState('5');
  const [time, setTime] = useState('2');
  const [distance, setDistance] = useState('10');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    try {
      const params = {
        mass: parseFloat(mass) || 0,
        force: parseFloat(force) || 0,
        friction: parseFloat(friction) || 0,
        angle: parseFloat(angle) || 0,
        gravity: 9.81,
        velocity: parseFloat(velocity) || 0,
        time: parseFloat(time) || 0,
        distance: parseFloat(distance) || 0,
      };
      const solverResult = solveDynamics(mode, params);
      setResult(solverResult);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  const renderContent = (content) => {
    return content.map((item, idx) => {
      if (item.type === 'highlight') return <Text key={idx} style={styles.highlightText}>{item.text}</Text>;
      if (item.type === 'formula') return <Text key={idx} style={styles.formulaText}>{item.text}</Text>;
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
       <BackHeader title="💪 Dynamics" subtitle="Forces, Friction & Newton's Laws" />

        <View style={styles.inputCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeScroll}>
            <View style={styles.modeRow}>
              {[
                { id: 'newton2', label: "Newton's\n2nd Law" },
                { id: 'friction', label: 'Friction\nAnalysis' },
                { id: 'inclinedPlane', label: 'Inclined\nPlane' },
                { id: 'momentum', label: 'Momentum &\nImpulse' },
                { id: 'weight', label: 'Weight &\nGravity' },
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
          </ScrollView>

          <Text style={styles.inputLabel}>Mass (kg):</Text>
          <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

          <Text style={styles.inputLabel}>
            {mode === 'momentum' ? 'Force (N) - for impulse:' : 'Applied Force (N):'}
          </Text>
          <TextInput style={styles.input} value={force} onChangeText={setForce} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

          {mode === 'friction' || mode === 'inclinedPlane' ? (
            <>
              <Text style={styles.inputLabel}>Coefficient of Friction (μ):</Text>
              <TextInput style={styles.input} value={friction} onChangeText={setFriction} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
            </>
          ) : null}

          {mode === 'inclinedPlane' ? (
            <>
              <Text style={styles.inputLabel}>Angle of Incline (degrees):</Text>
              <TextInput style={styles.input} value={angle} onChangeText={setAngle} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
            </>
          ) : null}

          {mode === 'momentum' ? (
            <>
              <Text style={styles.inputLabel}>Initial Velocity (m/s):</Text>
              <TextInput style={styles.input} value={velocity} onChangeText={setVelocity} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              <Text style={styles.inputLabel}>Time of Force Application (s):</Text>
              <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
            </>
          ) : null}

          <TouchableOpacity style={styles.solveBtn} onPress={handleSolve} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>💪 CALCULATE</Text>
          </TouchableOpacity>
        </View>

        {error && <View style={styles.errorCard}><Text style={styles.errorText}>⚠️ {error}</Text></View>}

        {result && (
          <View style={styles.solutionArea}>
            {result.steps.map((step, idx) => (
              <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                {renderContent(step.content)}
              </StepCard>
            ))}
            <FinalAnswer label="💪 Result">
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
  header: { marginBottom: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.white },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  inputCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, marginBottom: 16 },
  modeScroll: { marginBottom: 16 },
  modeRow: { flexDirection: 'row', gap: 6 },
  modeBtn: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center', minWidth: 80 },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 10, fontWeight: '500', textAlign: 'center' },
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