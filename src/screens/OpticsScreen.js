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
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { solveOptics } from '../solvers/opticsSolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

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
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);
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
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
                  onPress={() => {
                    Haptics.selectionAsync();
                    setMode(m.id);
                    setResult(null);
                  }}
                >
                  <Text style={[styles.modeText, mode === m.id && styles.modeTextActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {mode === 'lens' ? (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Focal Length (f):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setFocalLength)}>
                    <Text style={styles.recallBtn}>MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={focalLength} onChangeText={setFocalLength} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Object Distance (u):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setObjectDistance)}>
                    <Text style={styles.recallBtn}>MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={objectDistance} onChangeText={setObjectDistance} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Image Distance (v):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setImageDistance)}>
                    <Text style={styles.recallBtn}>MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={imageDistance} onChangeText={setImageDistance} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Index n₁ (Initial):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setN1)}>
                    <Text style={styles.recallBtn}>MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={n1} onChangeText={setN1} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Index n₂ (Final):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setN2)}>
                    <Text style={styles.recallBtn}>MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={n2} onChangeText={setN2} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Incident Angle θ₁ (°):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setTheta1)}>
                    <Text style={styles.recallBtn}>MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={theta1} onChangeText={setTheta1} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🔭 CALCULATE"
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
              <FinalAnswer label="🔭 Result">
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
  flex: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: { maxWidth: 600, width: '100%' },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', width: '100%' },
  modeBtn: { flex: 1, minWidth: 120, paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary },
  inputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  recallBtn: { color: colors.accent, fontSize: 10, fontWeight: '700', textDecorationLine: 'underline' },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center', width: '100%' },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
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
});
