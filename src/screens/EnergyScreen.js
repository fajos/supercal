import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveEnergy } from '../solvers/energySolver';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function EnergyScreen() {
  const [mode, setMode] = useState('kinetic');
  const [mass, setMass] = useState('10');
  const [velocity, setVelocity] = useState('5');
  const [height, setHeight] = useState('20');
  const [springConstant, setSpringConstant] = useState('100');
  const [springCompression, setSpringCompression] = useState('0.5');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSolve = () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);

    setTimeout(() => {
      try {
        const params = {
          mass: parseFloat(mass) || 0,
          velocity: parseFloat(velocity) || 0,
          height: parseFloat(height) || 0,
          springConstant: parseFloat(springConstant) || 0,
          springCompression: parseFloat(springCompression) || 0,
          gravity: 9.81,
        };
        const solverResult = solveEnergy(mode, params);
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

  const handleSaveToMemory = async (val) => {
    const numericValue = val.toString().split(' ')[0];
    const success = await storeValue('last_physics_result', numericValue);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRecallMemory = async (setter) => {
    const memory = await getMemory();
    if (memory.last_physics_result) {
      setter(memory.last_physics_result);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const renderContent = (content) => {
    return content.map((item, idx) => {
      if (item.type === 'highlight') return <Text key={idx} style={styles.highlightText}>{item.text}</Text>;
      if (item.type === 'formula') return <Text key={idx} style={styles.formulaText}>{item.text}</Text>;
      if (item.type === 'result') return (
        <View key={idx} style={styles.resultBox}>
          <Text style={styles.resultText}>{item.text}</Text>
        </View>
      );
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="⚡ Energy & Work" subtitle="Kinetic, Potential & Conservation" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeRow}>
              {[
                { id: 'kinetic', label: 'Kinetic\nEnergy' },
                { id: 'potential', label: 'Potential\nEnergy' },
                { id: 'spring', label: 'Spring\nEnergy' },
                { id: 'conservation', label: 'Conservation\nof Energy' },
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
              <Text style={styles.inputLabel}>Mass (kg):</Text>
              <TouchableOpacity onPress={() => handleRecallMemory(setMass)}>
                <Text style={styles.recallBtn}>Recall MR</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            {mode === 'kinetic' || mode === 'conservation' ? (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Velocity (m/s):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setVelocity)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={velocity} onChangeText={setVelocity} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : null}

            {mode === 'potential' || mode === 'conservation' ? (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Height (m):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setHeight)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : null}

            {mode === 'spring' ? (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Spring Constant k (N/m):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setSpringConstant)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={springConstant} onChangeText={setSpringConstant} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Compression/Extension x (m):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setSpringCompression)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={springCompression} onChangeText={setSpringCompression} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : null}

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              title="CALCULATE"
              icon="flash-outline"
            />
          </InputCard>

          <ErrorCard error={error} />

          {result && (
            <View style={styles.solutionArea}>
              {result.steps.map((step, idx) => (
                <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                  {renderContent(step.content)}
                </StepCard>
              ))}
              <FinalAnswer label="⚡ Result">
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
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: { maxWidth: 600, width: '100%' },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  inputCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, marginBottom: 16 },
  modeRow: { flexDirection: 'row', gap: 6, marginBottom: 16, flexWrap: 'wrap' },
  modeBtn: { flex: 1, minWidth: 100, paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 10, fontWeight: '500', textAlign: 'center' },
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
  resultBox: { backgroundColor: '#2a2a40', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginVertical: 2 },
  resultText: { color: '#c4b5fd', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 14, fontWeight: '600' },
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
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
});
