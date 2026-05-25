// src/screens/InductionScreen.js
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
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { solveInduction } from '../solvers/inductionSolver';
import { BackHeader } from '../components/BackHeader';
import { useHistory } from '../utils/history';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function InductionScreen() {
  const [mode, setMode] = useState('transformer_v');
  const [Vp, setVp] = useState('230');
  const [Np, setNp] = useState('500');
  const [Ns, setNs] = useState('20');
  const [B, setB] = useState('0.8');
  const [A, setA] = useState('0.05');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const params = {
          Vp: parseFloat(Vp),
          Np: parseFloat(Np),
          Ns: parseFloat(Ns),
          B: parseFloat(B),
          A: parseFloat(A),
        };
        const solverResult = solveInduction(mode, params);

        let shareText = '';
        if (mode === 'transformer_v') {
          shareText = `Transformer Calculation Result:\nPrimary Voltage: ${Vp}V\nPrimary Turns: ${Np}\nSecondary Turns: ${Ns}\nSecondary Voltage: ${solverResult.result}\n\nSolved with SuperCalc`;
        } else if (mode === 'flux') {
          shareText = `Magnetic Flux Result:\nMagnetic Field: ${B}T\nArea: ${A}m²\nFlux: ${solverResult.result}\n\nSolved with SuperCalc`;
        }

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'induction',
          mode,
          input: params,
          result: solverResult.result,
          timestamp: new Date().toISOString(),
        });

        scrollRef.current?.scrollTo({ y: 0, animated: true });
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
            <BackHeader title="🔌 Induction" subtitle="Transformers & Magnetic Flux" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeRow}>
              {[
                { id: 'transformer_v', label: 'Transformer' },
                { id: 'flux', label: 'Magnetic Flux' },
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

            {mode === 'transformer_v' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Primary Voltage (Vₚ) [V]:</Text>
                <TextInput style={styles.input} value={Vp} onChangeText={setVp} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Primary Turns (Nₚ):</Text>
                <TextInput style={styles.input} value={Np} onChangeText={setNp} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Secondary Turns (Nₛ):</Text>
                <TextInput style={styles.input} value={Ns} onChangeText={setNs} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Magnetic Field (B) [T]:</Text>
                <TextInput style={styles.input} value={B} onChangeText={setB} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Area (A) [m²]:</Text>
                <TextInput style={styles.input} value={A} onChangeText={setA} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🔌 CALCULATE"
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
              <FinalAnswer label="🔌 Result" shareText={result.shareText}>
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
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16, width: '100%' },
  modeBtn: { flex: 1, paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center', width: '100%' },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});