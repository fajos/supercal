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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { InputCard } from '../components/InputCard';
import { FinalAnswer } from '../components/FinalAnswer';
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
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
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
    }
  };

  const renderContent = (content) => {
    return content.map((item, idx) => {
      if (item.type === 'highlight') return <Text key={idx} style={styles.highlightText}>{item.text}</Text>;
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

          <Text style={styles.inputLabel}>First term (a₁):</Text>
          <TextInput
            style={styles.input}
            value={a1}
            onChangeText={setA1}
            keyboardType="decimal-pad"
            placeholder="2"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.inputLabel}>
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

          <Text style={styles.inputLabel}>Number of terms (n):</Text>
          <TextInput
            style={styles.input}
            value={n}
            onChangeText={setN}
            keyboardType="number-pad"
            placeholder="10"
            placeholderTextColor={colors.textSecondary}
          />

          <TouchableOpacity style={styles.solveBtn} onPress={handleSolve} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>🔢 CALCULATE</Text>
          </TouchableOpacity>
        </InputCard>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  header: { marginBottom: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.white },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
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
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, marginTop: 12 },
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
  solveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  stepText: {
    color: '#c8c8d8',
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