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
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { InputCard } from '../components/InputCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveKinematics } from '../solvers/kinematicsSolver';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { useHistory } from '../utils/history';
import { ModeChip } from '../components/ModeChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function KinematicsScreen() {
  const [mode, setMode] = useState('velocity');
  const [initialVelocity, setInitialVelocity] = useState('0');
  const [finalVelocity, setFinalVelocity] = useState('20');
  const [acceleration, setAcceleration] = useState('2');
  const [time, setTime] = useState('10');
  const [displacement, setDisplacement] = useState('100');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const params = {
          initialVelocity: parseFloat(initialVelocity) || 0,
          finalVelocity: parseFloat(finalVelocity) || 0,
          acceleration: parseFloat(acceleration) || 0,
          time: parseFloat(time) || 0,
          displacement: parseFloat(displacement) || 0,
        };
        const solverResult = solveKinematics(mode, params);

        let opLabel = mode.charAt(0).toUpperCase() + mode.slice(1);
        const shareText = `Kinematics Result (Find ${opLabel}):\nInitial Vel: ${initialVelocity}m/s\nFinal Vel: ${finalVelocity}m/s\nAccel: ${acceleration}m/s²\nTime: ${time}s\nDisplacement: ${displacement}m\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'kinematics',
          mode,
          input: params,
          result: solverResult.result,
          timestamp: new Date().toISOString(),
        });

        setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
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
            <BackHeader title="🏃 Kinematics" subtitle="Motion in One Dimension" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'velocity', label: 'Velocity' },
                { id: 'displacement', label: 'Displacement' },
                { id: 'time', label: 'Time' },
              ].map(m => (
                <ModeChip
                  key={m.id}
                  label={`Find ${m.label}`}
                  active={mode === m.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setMode(m.id);
                    setResult(null);
                  }}
                  style={styles.modeBtn}
                />
              ))}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Initial Velocity (v₀) m/s:</Text>
            <TextInput style={styles.input} value={initialVelocity} onChangeText={setInitialVelocity} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Final Velocity (v) m/s:</Text>
            <TextInput style={styles.input} value={finalVelocity} onChangeText={setFinalVelocity} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Acceleration (a) m/s²:</Text>
            <TextInput style={styles.input} value={acceleration} onChangeText={setAcceleration} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Time (t) seconds:</Text>
            <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Displacement (Δx) meters:</Text>
            <TextInput style={styles.input} value={displacement} onChangeText={setDisplacement} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <SolveButton
              onPress={handleSolve}
              label="🏃 CALCULATE"
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
              <FinalAnswer label="🏃 Result" shareText={result.shareText}>
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
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modeBtn: {
    minWidth: '28%',
    flex: 1,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});