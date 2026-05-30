// src/screens/RadioactivityScreen.js
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
import { ErrorCard } from '../components/ErrorCard';
import { InputCard } from '../components/InputCard';
import { SolveButton } from '../components/SolveButton';
import { solveRadioactivity } from '../solvers/radioactivitySolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;  // <-- ADD THIS LINE

export default function RadioactivityScreen() {
  const [mode, setMode] = useState('halfLife');
  const [initialAmount, setInitialAmount] = useState('100');
  const [time, setTime] = useState('10');
  const [halfLife, setHalfLife] = useState('5');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);

    setTimeout(() => {
      try {
        const params = {
          initialAmount: parseFloat(initialAmount) || 0,
          time: parseFloat(time) || 0,
          halfLife: parseFloat(halfLife) || 1,
        };
        const solverResult = solveRadioactivity(mode, params);
        const opLabel = mode === 'halfLife' ? 'Radioactive Decay' : 'Decay Constant';
        const shareText = `Radioactivity Result (${opLabel}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'radioactivity',
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
    { id: 'halfLife', label: 'Radioactive Decay', symbol: 'N', formula: 'N = N₀(½)^(t/T)' },
    { id: 'decayConstant', label: 'Decay Constant', symbol: 'λ', formula: 'λ = ln(2)/T₁/₂' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="⚛️ Radioactivity" subtitle="Decay & Half-Life" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            {/* Operation Selector */}
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

            <Text style={styles.sectionLabel}>Decay Parameters</Text>

            {mode === 'halfLife' ? (
              <>
                <Text style={styles.inputLabel}>Initial Amount, N₀:</Text>
                <TextInput 
                  style={styles.input} 
                  value={initialAmount} 
                  onChangeText={setInitialAmount} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter initial amount"
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Elapsed Time, t:</Text>
                <TextInput 
                  style={styles.input} 
                  value={time} 
                  onChangeText={setTime} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter elapsed time"
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Half-life, T₁/₂:</Text>
                <TextInput 
                  style={styles.input} 
                  value={halfLife} 
                  onChangeText={setHalfLife} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter half-life"
                  placeholderTextColor={colors.textSecondary}
                />
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Half-life, T₁/₂ (time units):</Text>
                <TextInput 
                  style={styles.input} 
                  value={halfLife} 
                  onChangeText={setHalfLife} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter half-life"
                  placeholderTextColor={colors.textSecondary}
                />
                
                <Text style={styles.hintText}>
                  The decay constant (λ) will be calculated from the half-life.
                </Text>
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              label="⚛️ CALCULATE DECAY"
            />
          </InputCard>

          <ErrorCard error={error} />

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
                          <Text key={i} style={styles.highlightText}>
                            {item.text}
                          </Text>
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
                          <Text key={i} style={styles.stepText}>
                            {item.text}
                          </Text>
                        );
                    }
                  })}
                </StepCard>
              ))}
              <FinalAnswer
                label="⚛️ Result"
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
  container: { 
    flex: 1, 
    backgroundColor: colors.bgPrimary 
  },
  scrollView: { 
    flex: 1 
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 40, 
    alignItems: 'center' 
  },
  headerContainer: { 
    width: '100%', 
    maxWidth: 800, 
    marginBottom: 16 
  },
  tabletInputCard: {
    maxWidth: 600,
    width: '100%',
  },
  
  // Operation Grid Styles
  operationGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  operationBtn: {
    flex: 1,
    maxWidth: 155,
    aspectRatio: 0.9,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  operationBtnActive: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accent,
    borderWidth: 2,
  },
  operationSymbol: {
    color: colors.textSecondary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  operationSymbolActive: {
    color: colors.accent,
  },
  operationLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 6,
  },
  operationLabelActive: {
    color: colors.accentGlow,
    fontWeight: '700',
  },
  operationFormula: {
    color: colors.textSecondary,
    fontSize: 9,
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
    textAlign: 'center' 
  },
  hintText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  
  // Solution Area
  solutionArea: { 
    gap: 0, 
    width: '100%', 
    maxWidth: 800 
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
    fontSize: 20, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontWeight: '700' 
  },
});