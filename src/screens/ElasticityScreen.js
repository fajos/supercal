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
import { ErrorCard } from '../components/ErrorCard';
import { SolveButton } from '../components/SolveButton';
import { ModeChip } from '../components/ModeChip';
import { solveElasticity } from '../solvers/elasticitySolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function ElasticityScreen() {
  const [mode, setMode] = useState('hookesLaw');
  const [force, setForce] = useState('10');
  const [extension, setExtension] = useState('0.05');
  const [originalLength, setOriginalLength] = useState('2');
  const [area, setArea] = useState('0.0001');

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
          force: parseFloat(force) || 0,
          extension: parseFloat(extension) || 0,
          originalLength: parseFloat(originalLength) || 1,
          area: parseFloat(area) || 1,
        };
        const solverResult = solveElasticity(mode, params);
        const opLabel = mode === 'hookesLaw' ? "Hooke's Law" : mode === 'youngsModulus' ? "Young's Modulus" : 'Elastic Potential Energy';
        const shareText = `Elasticity Result (${opLabel}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'elasticity',
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
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="📏 Elasticity" subtitle="Hooke's Law & Young's Modulus" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'hookesLaw', label: "Hooke's" },
                { id: 'youngsModulus', label: 'Youngs' },
                { id: 'workDone', label: 'Energy' },
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

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Applied Force (F) N:</Text>
            <TextInput style={styles.input} value={force} onChangeText={setForce} keyboardType="decimal-pad" />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Extension (e) meters:</Text>
            <TextInput style={styles.input} value={extension} onChangeText={setExtension} keyboardType="decimal-pad" />

            {mode === 'youngsModulus' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Original Length (L) m:</Text>
                <TextInput style={styles.input} value={originalLength} onChangeText={setOriginalLength} keyboardType="decimal-pad" />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Area (A) m²:</Text>
                <TextInput style={styles.input} value={area} onChangeText={setArea} keyboardType="decimal-pad" />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              label="📏 CALCULATE"
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
              <FinalAnswer
                label="📏 Result"
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
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: { width: '100%', maxWidth: 600 },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
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
    minWidth: '28%',
    flex: 1,
  },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
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
  formulaText: {
    color: '#ffd93d',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
    marginVertical: 4,
  },
  finalText: {
    color: colors.white,
    fontSize: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 32,
  },
});