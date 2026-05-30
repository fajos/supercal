// src/screens/ThermalScreen.js
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
import { solveThermal } from '../solvers/thermalSolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function ThermalScreen() {
  const [mode, setMode] = useState('specificHeat');
  const [mass, setMass] = useState('2');
  const [specificHeat, setSpecificHeat] = useState('4200');
  const [deltaTemp, setDeltaTemp] = useState('10');
  const [latentHeat, setLatentHeat] = useState('334000');

  // Gas Laws
  const [p1, setP1] = useState('101325');
  const [v1, setV1] = useState('1');
  const [t1, setT1] = useState('273');
  const [p2, setP2] = useState('202650');
  const [t2, setT2] = useState('300');

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
          mass: parseFloat(mass) || 0,
          specificHeat: parseFloat(specificHeat) || 0,
          deltaTemp: parseFloat(deltaTemp) || 0,
          latentHeat: parseFloat(latentHeat) || 0,
          initialPressure: parseFloat(p1) || 0,
          initialVolume: parseFloat(v1) || 0,
          initialTemp: parseFloat(t1) || 1,
          finalPressure: parseFloat(p2) || 0,
          finalTemp: parseFloat(t2) || 1,
        };
        const solverResult = solveThermal(mode, params);
        const opLabel = mode === 'specificHeat' ? 'Specific Heat' : mode === 'latentHeat' ? 'Latent Heat' : 'Ideal Gas Law';
        const shareText = `Thermal Physics Result (${opLabel}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'thermal',
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
    { id: 'specificHeat', label: 'Specific Heat', symbol: 'Q', formula: 'Q = m·c·ΔT' },
    { id: 'latentHeat', label: 'Latent Heat', symbol: 'Q', formula: 'Q = m·L' },
    { id: 'gasLaws', label: 'Gas Laws', symbol: 'PV', formula: 'P₁V₁/T₁ = P₂V₂/T₂' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="🌡️ Thermal Physics" subtitle="Heat & Thermodynamics" />
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

            <Text style={styles.sectionLabel}>Input Parameters</Text>

            {mode === 'specificHeat' && (
              <>
                <Text style={styles.inputLabel}>Mass, m (kg):</Text>
                <TextInput 
                  style={styles.input} 
                  value={mass} 
                  onChangeText={setMass} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter mass"
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Specific Heat, c (J/kg·K):</Text>
                <TextInput 
                  style={styles.input} 
                  value={specificHeat} 
                  onChangeText={setSpecificHeat} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter specific heat capacity"
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Temperature Change, ΔT (K):</Text>
                <TextInput 
                  style={styles.input} 
                  value={deltaTemp} 
                  onChangeText={setDeltaTemp} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter temperature change"
                  placeholderTextColor={colors.textSecondary}
                />
              </>
            )}

            {mode === 'latentHeat' && (
              <>
                <Text style={styles.inputLabel}>Mass, m (kg):</Text>
                <TextInput 
                  style={styles.input} 
                  value={mass} 
                  onChangeText={setMass} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter mass"
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Specific Latent Heat, L (J/kg):</Text>
                <TextInput 
                  style={styles.input} 
                  value={latentHeat} 
                  onChangeText={setLatentHeat} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter latent heat"
                  placeholderTextColor={colors.textSecondary}
                />
              </>
            )}

            {mode === 'gasLaws' && (
              <>
                <Text style={styles.subsectionLabel}>Initial State (1)</Text>
                
                <View style={styles.gasRow}>
                  <View style={styles.gasInputGroup}>
                    <Text style={styles.gasLabel}>P₁ (Pa)</Text>
                    <TextInput 
                      style={styles.gasInput} 
                      value={p1} 
                      onChangeText={setP1} 
                      keyboardType="decimal-pad" 
                      placeholder="Pressure"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.gasInputGroup}>
                    <Text style={styles.gasLabel}>V₁ (m³)</Text>
                    <TextInput 
                      style={styles.gasInput} 
                      value={v1} 
                      onChangeText={setV1} 
                      keyboardType="decimal-pad" 
                      placeholder="Volume"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.gasInputGroup}>
                    <Text style={styles.gasLabel}>T₁ (K)</Text>
                    <TextInput 
                      style={styles.gasInput} 
                      value={t1} 
                      onChangeText={setT1} 
                      keyboardType="decimal-pad" 
                      placeholder="Temp"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>

                <Text style={[styles.subsectionLabel, { marginTop: 16 }]}>Final State (2)</Text>
                
                <View style={styles.gasRow}>
                  <View style={styles.gasInputGroup}>
                    <Text style={styles.gasLabel}>P₂ (Pa)</Text>
                    <TextInput 
                      style={styles.gasInput} 
                      value={p2} 
                      onChangeText={setP2} 
                      keyboardType="decimal-pad" 
                      placeholder="Pressure"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.gasInputGroup}>
                    <Text style={styles.gasLabel}>T₂ (K)</Text>
                    <TextInput 
                      style={styles.gasInput} 
                      value={t2} 
                      onChangeText={setT2} 
                      keyboardType="decimal-pad" 
                      placeholder="Temp"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
                
                <Text style={styles.hintText}>Leave one value empty to solve for it</Text>
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🌡️ CALCULATE THERMAL"
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
                label="🌡️ Result"
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
  
  // Section Labels
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
  subsectionLabel: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
    marginBottom: 8,
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
  
  // Gas Laws Input Styles
  gasRow: { 
    flexDirection: 'row', 
    gap: 8, 
    width: '100%' 
  },
  gasInputGroup: {
    flex: 1,
  },
  gasLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  gasInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.white,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 12,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.7,
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