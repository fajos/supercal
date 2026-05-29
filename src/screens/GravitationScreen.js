// src/screens/GravitationScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { ErrorCard } from '../components/ErrorCard';
import { InputCard } from '../components/InputCard';
import { SolveButton } from '../components/SolveButton';
import { solveGravitation } from '../solvers/gravitationSolver';
import { BackHeader } from '../components/BackHeader';
import { useHistory } from '../utils/history';
import { ModeChip } from '../components/ModeChip';

export default function GravitationScreen() {
  const [mode, setMode] = useState('force');
  const [M, setM] = useState('5.97e24'); // Earth mass
  const [m, setM_small] = useState('7.35e22'); // Moon mass
  const [r, setR] = useState('3.84e8'); // Earth-Moon distance

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
          M: parseFloat(M),
          m: parseFloat(m),
          r: parseFloat(r),
        };
        const solverResult = solveGravitation(mode, params);

        const opLabel = mode === 'force' ? 'Gravitational Force' : 'Field Strength';
        const shareText = `Gravitation Result (${opLabel}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'gravitation',
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
            <BackHeader title="🌍 Gravitation" subtitle="Universal Gravity & Field Strength" />
          </View>

          <InputCard>
            <View style={styles.modeGrid}>
              {[
                { id: 'force', label: 'Force' },
                { id: 'field', label: 'Field' },
              ].map(m_btn => (
                <ModeChip
                  key={m_btn.id}
                  label={m_btn.label}
                  active={mode === m_btn.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setMode(m_btn.id);
                    setResult(null);
                  }}
                  style={styles.modeBtn}
                />
              ))}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Mass (M) [kg]:</Text>
            <TextInput style={styles.input} value={M} onChangeText={setM} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            {mode === 'force' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Mass (m) [kg]:</Text>
                <TextInput style={styles.input} value={m} onChangeText={setM_small} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Distance (r) [m]:</Text>
            <TextInput style={styles.input} value={r} onChangeText={setR} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              label="🌍 CALCULATE"
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
              <FinalAnswer label="🌍 Result" shareText={result.shareText}>
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
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800, marginBottom: 16 },
  modeGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  modeBtn: {
    flex: 1,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});