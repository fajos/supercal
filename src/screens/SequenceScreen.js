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
import { ErrorCard } from '../components/ErrorCard';
import { SolveButton } from '../components/SolveButton';
import { solveSequence } from '../solvers/sequenceSolver';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function SequenceScreen() {
  const [type, setType] = useState('arithmetic');
  const [a1, setA1] = useState('2');
  const [difference, setDifference] = useState('3');
  const [n, setN] = useState('10');
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
        const solverResult = solveSequence(
          type,
          parseFloat(a1) || 0,
          parseFloat(difference) || 0,
          parseInt(n) || 1
        );
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

  const renderContent = (content) => {
    return content.map((item, idx) => {
      if (item.type === 'highlight') return <Text key={idx} style={styles.highlightText}>{item.text}</Text>;
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
            <BackHeader title="🔢 Sequences & Series" subtitle="Arithmetic & Geometric" />
          </View>

          <InputCard>
            <View style={styles.modeGrid}>
              <TouchableOpacity
                style={[styles.modeBtn, type === 'arithmetic' && styles.modeBtnActive]}
                onPress={() => { setType('arithmetic'); setResult(null); }}
              >
                <Text style={[styles.modeText, type === 'arithmetic' && styles.modeTextActive]}>Arithmetic</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, type === 'geometric' && styles.modeBtnActive]}
                onPress={() => { setType('geometric'); setResult(null); }}
              >
                <Text style={[styles.modeText, type === 'geometric' && styles.modeTextActive]}>Geometric</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>First term (a₁):</Text>
            <TextInput
              style={styles.input}
              value={a1}
              onChangeText={setA1}
              keyboardType="decimal-pad"
              placeholder="2"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>
              {type === 'arithmetic' ? 'Common difference (d):' : 'Common ratio (r):'}
            </Text>
            <TextInput
              style={styles.input}
              value={difference}
              onChangeText={setDifference}
              keyboardType="decimal-pad"
              placeholder="3"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Number of terms (n):</Text>
            <TextInput
              style={styles.input}
              value={n}
              onChangeText={setN}
              keyboardType="number-pad"
              placeholder="10"
              placeholderTextColor={colors.textSecondary}
            />

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              label="🔢 CALCULATE"
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
            <FinalAnswer label="🎯 Results">
              <Text style={styles.finalLabel}>Nth Term (a{n}):</Text>
              <Text style={styles.finalText}>{result.nthTerm}</Text>

              <Text style={styles.finalLabel}>Sum of first {n} terms (S{n}):</Text>
              <Text style={styles.finalText}>{result.sum}</Text>
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
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  modeGrid: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  modeBtn: {
    flex: 1,
    minWidth: '40%',
    paddingVertical: 12,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, letterSpacing: 0.3, marginBottom: 8 },
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 14,
    textAlign: 'center',
  },
  stepText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 22,
  },
  highlightText: {
    color: colors.accentGlow,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
    lineHeight: 22,
  },
  finalLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 8,
  },
  finalText: {
    color: colors.white,
    fontSize: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 32,
  },
});