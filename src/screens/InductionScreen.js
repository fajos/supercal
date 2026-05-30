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
  const [phi, setPhi] = useState('0.04');
  const [t, setT] = useState('0.1');

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
          Vp: parseFloat(Vp),
          Np: parseFloat(Np),
          Ns: parseFloat(Ns),
          B: parseFloat(B),
          A: parseFloat(A),
          phi: parseFloat(phi),
          t: parseFloat(t),
        };
        const solverResult = solveInduction(mode, params);

        const modeLabels = {
          transformer_v: 'Transformer Voltage',
          flux: 'Magnetic Flux',
          faraday: "Faraday's Law"
        };
        const shareText = `Induction Result (${modeLabels[mode]}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'induction',
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

  // Operation buttons with symbols and formulas
  const operations = [
    { id: 'transformer_v', label: 'Transformer', symbol: 'Vs', formula: 'Vs/Vp = Ns/Np' },
    { id: 'flux', label: 'Magnetic Flux', symbol: 'Φ', formula: 'Φ = B·A' },
    { id: 'faraday', label: "Faraday's Law", symbol: 'ε', formula: 'ε = −ΔΦ/Δt' },
  ];

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
            {/* Operation Selector Grid */}
            <View style={styles.operationGrid}>
              {operations.map(op => (
                <TouchableOpacity
                  key={op.id}
                  style={[
                    styles.operationBtn,
                    mode === op.id && styles.operationBtnActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setMode(op.id);
                    setResult(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.operationSymbol,
                    mode === op.id && styles.operationSymbolActive,
                  ]}>
                    {op.symbol}
                  </Text>
                  <Text style={[
                    styles.operationLabel,
                    mode === op.id && styles.operationLabelActive,
                  ]} numberOfLines={2} adjustsFontSizeToFit>
                    {op.label}
                  </Text>
                  <Text style={[
                    styles.operationFormula,
                    mode === op.id && styles.operationFormulaActive,
                  ]} numberOfLines={1} adjustsFontSizeToFit>
                    {op.formula}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>
              {mode === 'transformer_v' ? 'Transformer Parameters' : 
               mode === 'flux' ? 'Flux Parameters' : 'Induction Parameters'}
            </Text>

            {mode === 'transformer_v' ? (
              <>
                <Text style={styles.inputLabel}>Primary Voltage, Vp (V):</Text>
                <TextInput 
                  style={styles.input} 
                  value={Vp} 
                  onChangeText={setVp} 
                  keyboardType="decimal-pad" 
                  placeholder="e.g., 230"
                  placeholderTextColor={colors.textSecondary} 
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Primary Turns, Np:</Text>
                <TextInput 
                  style={styles.input} 
                  value={Np} 
                  onChangeText={setNp} 
                  keyboardType="decimal-pad" 
                  placeholder="e.g., 500"
                  placeholderTextColor={colors.textSecondary} 
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Secondary Turns, Ns:</Text>
                <TextInput 
                  style={styles.input} 
                  value={Ns} 
                  onChangeText={setNs} 
                  keyboardType="decimal-pad" 
                  placeholder="e.g., 20"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            ) : mode === 'flux' ? (
              <>
                <Text style={styles.inputLabel}>Magnetic Field, B (T):</Text>
                <TextInput 
                  style={styles.input} 
                  value={B} 
                  onChangeText={setB} 
                  keyboardType="decimal-pad" 
                  placeholder="e.g., 0.8"
                  placeholderTextColor={colors.textSecondary} 
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Area, A (m²):</Text>
                <TextInput 
                  style={styles.input} 
                  value={A} 
                  onChangeText={setA} 
                  keyboardType="decimal-pad" 
                  placeholder="e.g., 0.05"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Change in Flux, ΔΦ (Wb):</Text>
                <TextInput 
                  style={styles.input} 
                  value={phi} 
                  onChangeText={setPhi} 
                  keyboardType="decimal-pad" 
                  placeholder="e.g., 0.04"
                  placeholderTextColor={colors.textSecondary} 
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Time Interval, Δt (s):</Text>
                <TextInput 
                  style={styles.input} 
                  value={t} 
                  onChangeText={setT} 
                  keyboardType="decimal-pad" 
                  placeholder="e.g., 0.1"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🔌 CALCULATE INDUCTION"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {result && (
            <View style={styles.solutionArea}>
              {result.steps.map((step, idx) => (
                <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                  {step.content.map((item, i) => {
                    switch (item.type) {
                      case 'formula':
                        return (
                          <View key={i} style={styles.formulaBox}>
                            <Text style={styles.formulaText}>{item.text}</Text>
                          </View>
                        );
                      case 'highlight':
                        return (
                          <Text key={i} style={styles.highlightText}>{item.text}</Text>
                        );
                      case 'result':
                        return (
                          <View key={i} style={styles.resultBox}>
                            <Text style={styles.resultText}>{item.text}</Text>
                          </View>
                        );
                      case 'badge':
                        return (
                          <View key={i} style={styles.inlineBadge}>
                            <Text style={styles.inlineBadgeText}>{item.text}</Text>
                          </View>
                        );
                      default:
                        return (
                          <Text key={i} style={styles.stepText}>{item.text}</Text>
                        );
                    }
                  })}
                </StepCard>
              ))}
              <FinalAnswer label="🔌 Induction Result" shareText={result.shareText}>
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
  container: { 
    flex: 1, 
    backgroundColor: colors.bgPrimary 
  },
  flex: { 
    flex: 1 
  },
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
  
  // Operation Grid Styles
  operationGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 4,
  },
  operationBtn: {
    flex: 1,
    maxWidth: 120,
    aspectRatio: 0.85,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  operationBtnActive: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accent,
    borderWidth: 2,
  },
  operationSymbol: {
    color: colors.textSecondary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  operationSymbolActive: {
    color: colors.accent,
  },
  operationLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 4,
  },
  operationLabelActive: {
    color: colors.accentGlow,
    fontWeight: '700',
  },
  operationFormula: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.6,
  },
  operationFormulaActive: {
    color: colors.accent,
    opacity: 0.9,
  },
  
  // Section Label
  sectionLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Input Styles
  inputLabel: { 
    fontSize: 13, 
    color: colors.textSecondary, 
    marginBottom: 8 
  },
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
    width: '100%' 
  },
  
  // Step Content Styles
  stepText: { 
    color: colors.textPrimary, 
    fontSize: 14, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    lineHeight: 22 
  },
  highlightText: { 
    color: colors.accentGlow, 
    fontSize: 14, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontWeight: '600', 
    lineHeight: 22 
  },
  formulaBox: {
    backgroundColor: colors.accentBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    alignSelf: 'flex-start',
    marginVertical: 6,
    width: '100%',
  },
  formulaText: {
    color: colors.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '700',
  },
  resultBox: {
    backgroundColor: colors.purpleBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.purpleGlow,
    alignSelf: 'flex-start',
    marginVertical: 6,
    width: '100%',
  },
  resultText: {
    color: colors.purpleGlow,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '700',
  },
  inlineBadge: {
    backgroundColor: colors.accentBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  inlineBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Final Answer
  finalText: { 
    color: colors.white, 
    fontSize: 22, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontWeight: '700' 
  },
});