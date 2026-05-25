import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { ModeChip } from '../components/ModeChip';
import { solveProbability } from '../solvers/probabilitySolver';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function ProbabilityScreen() {
  const [mode, setMode] = useState('permutation');
  const [n, setN] = useState('10');
  const [r, setR] = useState('3');
  const [p, setP] = useState('0.5');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSolve = () => {
    setError(null);
    setLoading(true);
    try {
      const params = mode === 'binomial' 
        ? { n: parseInt(n), k: parseInt(r), p: parseFloat(p) }
        : { n: parseInt(n), r: parseInt(r) };
      const solverResult = solveProbability(mode, params);
      setResult(solverResult);
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
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
            <BackHeader title="🎲 Probability" subtitle="Permutations, Combinations & More" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'permutation', label: 'P(n,r)' },
                { id: 'combination', label: 'C(n,r)' },
                { id: 'binomial', label: 'Binom' },
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

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>n (total items/trials):</Text>
            <TextInput style={styles.input} value={n} onChangeText={setN} keyboardType="number-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>{mode === 'binomial' ? 'k (successes):' : 'r (items chosen):'}</Text>
            <TextInput style={styles.input} value={r} onChangeText={setR} keyboardType="number-pad" placeholderTextColor={colors.textSecondary} />

            {mode === 'binomial' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>p (probability of success):</Text>
                <TextInput style={styles.input} value={p} onChangeText={setP} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🎲 CALCULATE"
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
                    return <Text key={i} style={styles.stepText}>{item.text}</Text>;
                  })}
                </StepCard>
              ))}
              <FinalAnswer label="🎯 Result">
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
  modeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center', width: '100%' },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  finalText: { color: colors.white, fontSize: 24, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});