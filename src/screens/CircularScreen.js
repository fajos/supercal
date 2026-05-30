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

  // Operation buttons with symbols and formulas
  const operations = [
    { id: 'centripetal', label: 'Centripetal Force', symbol: 'F_c', formula: 'F_c = mv²/r' },
    { id: 'angular', label: 'Angular Motion', symbol: 'ω', formula: 'ω = 2π/T = 2πf' },
  ];

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

            <Text style={styles.sectionLabel}>Input Parameters</Text>

            <Text style={styles.inputLabel}>Mass, m (kg):</Text>
            <TextInput 
              style={styles.input} 
              value={mass} 
              onChangeText={setMass} 
              keyboardType="decimal-pad" 
              placeholder="Enter mass"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Radius, r (m):</Text>
            <TextInput 
              style={styles.input} 
              value={radius} 
              onChangeText={setRadius} 
              keyboardType="decimal-pad" 
              placeholder="Enter radius"
              placeholderTextColor={colors.textSecondary}
            />

            {mode === 'centripetal' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Linear Velocity, v (m/s):</Text>
                <TextInput 
                  style={styles.input} 
                  value={velocity} 
                  onChangeText={setVelocity} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter velocity"
                  placeholderTextColor={colors.textSecondary}
                />
              </>
            ) : (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Frequency, f (Hz) − optional:</Text>
                <TextInput 
                  style={styles.input} 
                  value={frequency} 
                  onChangeText={setFrequency} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter frequency (if known)"
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Period, T (s) − optional:</Text>
                <TextInput 
                  style={styles.input} 
                  value={period} 
                  onChangeText={setPeriod} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter period (if known)"
                  placeholderTextColor={colors.textSecondary}
                />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🎡 CALCULATE CIRCULAR MOTION"
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
    fontSize: 26,
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