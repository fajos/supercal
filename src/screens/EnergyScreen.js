import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveEnergy } from '../solvers/energySolver';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { useHistory } from '../utils/history';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function EnergyScreen() {
  const [mode, setMode] = useState('kinetic');
  const [mass, setMass] = useState('10');
  const [velocity, setVelocity] = useState('5');
  const [height, setHeight] = useState('20');
  const [springConstant, setSpringConstant] = useState('100');
  const [springCompression, setSpringCompression] = useState('0.5');
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
          velocity: parseFloat(velocity) || 0,
          height: parseFloat(height) || 0,
          springConstant: parseFloat(springConstant) || 0,
          springCompression: parseFloat(springCompression) || 0,
          gravity: 9.81,
        };
        const solverResult = solveEnergy(mode, params);

        const modeLabels = {
          kinetic: 'Kinetic Energy',
          potential: 'Potential Energy',
          spring: 'Spring Energy',
          conservation: 'Conservation of Energy'
        };

        const shareText = `Energy & Work Result (${modeLabels[mode]}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'energy',
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
      switch (item.type) {
        case 'formula':
          return (
            <View key={idx} style={styles.formulaBox}>
              <Text style={styles.formulaText}>{item.text}</Text>
            </View>
          );
        case 'highlight':
          return (
            <Text key={idx} style={styles.highlightText}>
              {item.text}
            </Text>
          );
        case 'result':
          return (
            <View key={idx} style={styles.resultBox}>
              <Text style={styles.resultText}>{item.text}</Text>
            </View>
          );
        case 'badge':
          return (
            <View key={idx} style={styles.inlineBadge}>
              <Text style={styles.inlineBadgeText}>{item.text}</Text>
            </View>
          );
        default:
          return (
            <Text key={idx} style={styles.stepText}>
              {item.text}
            </Text>
          );
      }
    });
  };

  // Operation buttons with symbols for better visual appeal
  const operations = [
    { id: 'kinetic', label: 'Kinetic', symbol: 'KE', description: '½mv²' },
    { id: 'potential', label: 'Potential', symbol: 'PE', description: 'mgh' },
    { id: 'spring', label: 'Spring', symbol: 'U', description: '½kx²' },
    { id: 'conservation', label: 'Conservation', symbol: 'ΣE', description: 'KE+PE' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="⚡ Energy & Work" subtitle="Kinetic, Potential & Conservation" />
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
                  ]} numberOfLines={1} adjustsFontSizeToFit>
                    {op.label}
                  </Text>
                  <Text style={[
                    styles.operationDescription,
                    mode === op.id && styles.operationDescriptionActive,
                  ]} numberOfLines={1} adjustsFontSizeToFit>
                    {op.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Input Parameters</Text>

            <Text style={styles.inputLabel}>Mass (kg):</Text>
            <TextInput 
              style={styles.input} 
              value={mass} 
              onChangeText={setMass} 
              keyboardType="decimal-pad" 
              placeholder="Enter mass"
              placeholderTextColor={colors.textSecondary} 
            />

            {mode === 'kinetic' || mode === 'conservation' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Velocity (m/s):</Text>
                <TextInput 
                  style={styles.input} 
                  value={velocity} 
                  onChangeText={setVelocity} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter velocity"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            ) : null}

            {mode === 'potential' || mode === 'conservation' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Height (m):</Text>
                <TextInput 
                  style={styles.input} 
                  value={height} 
                  onChangeText={setHeight} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter height"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            ) : null}

            {mode === 'spring' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Spring Constant, k (N/m):</Text>
                <TextInput 
                  style={styles.input} 
                  value={springConstant} 
                  onChangeText={setSpringConstant} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter spring constant"
                  placeholderTextColor={colors.textSecondary} 
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Compression/Extension, x (m):</Text>
                <TextInput 
                  style={styles.input} 
                  value={springCompression} 
                  onChangeText={setSpringCompression} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter displacement"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            ) : null}

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              label="⚡ CALCULATE ENERGY"
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
              <FinalAnswer label="⚡ Energy Result" shareText={result.shareText}>
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
    maxWidth: 800 
  },
  tabletInputCard: { 
    maxWidth: 600, 
    width: '100%' 
  },
  solutionArea: { 
    gap: 0, 
    width: '100%', 
    maxWidth: 800 
  },
  
  // Operation Grid Styles
  operationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    width: '100%',
  },
  operationBtn: {
    width: '22%', // 4 buttons per row
    minWidth: 75,
    aspectRatio: 0.85, // Slightly taller than square
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  operationBtnActive: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accent,
  },
  operationSymbol: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  operationSymbolActive: {
    color: colors.accent,
  },
  operationLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  operationLabelActive: {
    color: colors.accentGlow,
    fontWeight: '700',
  },
  operationDescription: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.7,
  },
  operationDescriptionActive: {
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
    fontSize: 22, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontWeight: '700' 
  },
});