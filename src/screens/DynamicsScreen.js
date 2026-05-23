import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { InputCard } from '../components/InputCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveDynamics } from '../solvers/dynamicsSolver';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

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
    const numericValue = val.split(' ')[0];
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
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="💪 Dynamics" subtitle="Forces, Friction & Newton's Laws" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
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

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Mass (kg):</Text>
              <TouchableOpacity onPress={() => handleRecallMemory(setMass)}>
                <Text style={styles.recallBtn}>Recall MR</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>
                {mode === 'momentum' ? 'Force (N) - for impulse:' : 'Applied Force (N):'}
              </Text>
              <TouchableOpacity onPress={() => handleRecallMemory(setForce)}>
                <Text style={styles.recallBtn}>Recall MR</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} value={force} onChangeText={setForce} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            {mode === 'friction' || mode === 'inclinedPlane' ? (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Coefficient of Friction (μ):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setFriction)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={friction} onChangeText={setFriction} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : null}

            {mode === 'inclinedPlane' ? (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Angle of Incline (degrees):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setAngle)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={angle} onChangeText={setAngle} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : null}

            {mode === 'momentum' ? (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Initial Velocity (m/s):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setVelocity)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={velocity} onChangeText={setVelocity} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Time of Force Application (s):</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory(setTime)}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : null}

            <SolveButton
              onPress={handleSolve}
              label="💪 CALCULATE"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {result && (
            <View style={styles.solutionArea}>
              {result.steps.map((step, idx) => (
                <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                  {renderContent(step.content)}
                </StepCard>
              ))}
              <FinalAnswer label="💪 Result">
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
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
  },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 10, fontWeight: '500', textAlign: 'center' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  recallBtn: { color: colors.accent, fontSize: 10, fontWeight: '600', textDecorationLine: 'underline' },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
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
