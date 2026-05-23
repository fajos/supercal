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
import { solveProbability } from '../solvers/probabilitySolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

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

  const handleSaveToMemory = async (val) => {
    const success = await storeValue('last_calculus_result', val.toString());
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRecallMemory = async (field) => {
    const memory = await getMemory();
    if (memory.last_calculus_result) {
      const val = memory.last_calculus_result;
      if (field === 'n') setN(val);
      if (field === 'r') setR(val);
      if (field === 'p') setP(val);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
              {['permutation', 'combination', 'binomial'].map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                  onPress={() => { setMode(m); setResult(null); }}
                >
                  <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>
                    {m === 'permutation' ? 'P(n,r)' : m === 'combination' ? 'C(n,r)' : 'Binom'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputHeader}>
              <TouchableOpacity onPress={() => handleRecallMemory('n')}>
                <Text style={styles.recallBtnMini}>MR n</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRecallMemory('r')}>
                <Text style={styles.recallBtnMini}>MR r</Text>
              </TouchableOpacity>
              {mode === 'binomial' && (
                <TouchableOpacity onPress={() => handleRecallMemory('p')}>
                  <Text style={styles.recallBtnMini}>MR p</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.inputLabel}>n (total items/trials):</Text>
            <TextInput style={styles.input} value={n} onChangeText={setN} keyboardType="number-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={styles.inputLabel}>{mode === 'binomial' ? 'k (successes):' : 'r (items chosen):'}</Text>
            <TextInput style={styles.input} value={r} onChangeText={setR} keyboardType="number-pad" placeholderTextColor={colors.textSecondary} />

            {mode === 'binomial' && (
              <>
                <Text style={styles.inputLabel}>p (probability of success):</Text>
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
                <View style={styles.finalResultRow}>
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
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 12,
  },
  recallBtnMini: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  modeGrid: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  modeBtn: { flex: 1, minWidth: '30%', paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center', width: '100%' },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  finalText: { color: colors.white, fontSize: 24, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
  finalResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  memoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  memoryBtnText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});
