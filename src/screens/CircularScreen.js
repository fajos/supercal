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
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveCircular } from '../solvers/circularSolver';
import { useHistory } from '../utils/history';
import { InputCard } from '../components/InputCard';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { BackHeader } from '../components/BackHeader';
import { ModeChip } from '../components/ModeChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

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
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
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
        const opLabel = mode === 'centripetal' ? 'Centripetal Force' : 'Angular Motion';
        const shareText = `Circular Motion Result (${opLabel}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'circular',
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
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="🎡 Circular Motion" subtitle="Rotational Dynamics" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'centripetal', label: 'Centripetal Force' },
                { id: 'angular', label: 'Angular Motion' },
              ].map(m => (
                <ModeChip
                  key={m.id}
                  label={m.label}
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

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Mass (m) kg:</Text>
            <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Radius (r) meters:</Text>
            <TextInput style={styles.input} value={radius} onChangeText={setRadius} keyboardType="decimal-pad" />

            {mode === 'centripetal' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Linear Velocity (v) m/s:</Text>
                <TextInput style={styles.input} value={velocity} onChangeText={setVelocity} keyboardType="decimal-pad" />
              </>
            ) : (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Frequency (f) Hz (optional):</Text>
                <TextInput style={styles.input} value={frequency} onChangeText={setFrequency} keyboardType="decimal-pad" />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Period (T) s (optional):</Text>
                <TextInput style={styles.input} value={period} onChangeText={setPeriod} keyboardType="decimal-pad" />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🎡 CALCULATE"
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
              <FinalAnswer
                label="🎡 Result"
                shareText={result.shareText}
              >
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
  scrollView: { flex: 1 },
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
    minWidth: '45%',
    flex: 1,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});