// src/screens/OpticsScreen.js
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
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveOptics } from '../solvers/opticsSolver';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function OpticsScreen() {
  const [mode, setMode] = useState('lens');
  const [focalLength, setFocalLength] = useState('10');
  const [objectDistance, setObjectDistance] = useState('30');
  const [imageDistance, setImageDistance] = useState('');

  const [n1, setN1] = useState('1.0');
  const [n2, setN2] = useState('1.5');
  const [theta1, setTheta1] = useState('30');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    try {
      const params = {
        focalLength: parseFloat(focalLength),
        objectDistance: parseFloat(objectDistance),
        imageDistance: parseFloat(imageDistance),
        n1: parseFloat(n1),
        n2: parseFloat(n2),
        theta1: parseFloat(theta1),
      };
      const solverResult = solveOptics(mode, params);
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
        <View style={styles.headerContainer}>
          <BackHeader title="🔭 Optics & Light" subtitle="Lenses, Reflection & Refraction" />
        </View>

        <InputCard style={isTablet && styles.tabletInputCard}>
          <View style={styles.modeRow}>
            {[
              { id: 'lens', label: 'Lens Formula' },
              { id: 'refraction', label: 'Refraction' },
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

          {mode === 'lens' ? (
            <>
              <Text style={styles.inputLabel}>Focal Length (f):</Text>
              <TextInput style={styles.input} value={focalLength} onChangeText={setFocalLength} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

              <Text style={styles.inputLabel}>Object Distance (u):</Text>
              <TextInput style={styles.input} value={objectDistance} onChangeText={setObjectDistance} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

              <Text style={styles.inputLabel}>Image Distance (v) (Leave blank if solving for it):</Text>
              <TextInput style={styles.input} value={imageDistance} onChangeText={setImageDistance} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Index n₁ (Initial):</Text>
              <TextInput style={styles.input} value={n1} onChangeText={setN1} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

              <Text style={styles.inputLabel}>Index n₂ (Final):</Text>
              <TextInput style={styles.input} value={n2} onChangeText={setN2} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

              <Text style={styles.inputLabel}>Incident Angle θ₁ (°):</Text>
              <TextInput style={styles.input} value={theta1} onChangeText={setTheta1} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
            </>
          )}

          <TouchableOpacity style={styles.solveBtn} onPress={handleSolve} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>🔭 CALCULATE</Text>
          </TouchableOpacity>
        </InputCard>

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
            <FinalAnswer label="🔭 Result">
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
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: { maxWidth: 600, width: '100%' },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  modeBtn: { flex: 1, minWidth: 120, paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
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
