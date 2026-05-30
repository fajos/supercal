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
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveComplexOperation } from '../solvers/complexSolver';
import { BackHeader } from '../components/BackHeader';
import { useHistory } from '../utils/history';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { ModeChip } from '../components/ModeChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function ComplexScreen() {
  const [operation, setOperation] = useState('add');
  const [real1, setReal1] = useState('3');
  const [imag1, setImag1] = useState('4');
  const [real2, setReal2] = useState('1');
  const [imag2, setImag2] = useState('-2');
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
        const z1 = { real: parseFloat(real1) || 0, imag: parseFloat(imag1) || 0 };
        const z2 = { real: parseFloat(real2) || 0, imag: parseFloat(imag2) || 0 };
        const solverResult = solveComplexOperation(operation, z1, z2);

        const z1Str = `${z1.real}${z1.imag >= 0 ? '+' : '−'}${Math.abs(z1.imag)}i`;
        const z2Str = `${z2.real}${z2.imag >= 0 ? '+' : '−'}${Math.abs(z2.imag)}i`;

        let opLabel = operation.charAt(0).toUpperCase() + operation.slice(1);
        let resStr = typeof solverResult.result === 'object'
          ? `${solverResult.result.real} ${solverResult.result.imag >= 0 ? '+' : '−'} ${Math.abs(solverResult.result.imag)}i`
          : solverResult.result;

        const shareText = `Complex Number Result (${opLabel}):\nZ₁: ${z1Str}${showSecondInput ? `\nZ₂: ${z2Str}` : ''}\nResult: ${resStr}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'complex',
          operation,
          input: { z1, z2 },
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
      if (item.type === 'formula') {
        return (
          <View key={idx} style={styles.formulaBox}>
            <Text style={styles.formulaText}>{item.text}</Text>
          </View>
        );
      }
      if (item.type === 'result') {
        return (
          <View key={idx} style={styles.resultBox}>
            <Text style={styles.resultText}>{item.text}</Text>
          </View>
        );
      }
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  const showSecondInput = ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);

  // Operation buttons with fixed width and no overflow
  const operations = [
    { id: 'add', label: 'Add', symbol: '+' },
    { id: 'subtract', label: 'Subtract', symbol: '−' },
    { id: 'multiply', label: 'Multiply', symbol: '×' },
    { id: 'divide', label: 'Divide', symbol: '÷' },
    { id: 'conjugate', label: 'Conjugate', symbol: 'z*' },
    { id: 'magnitude', label: 'Magnitude', symbol: '|z|' },
    { id: 'argument', label: 'Argument', symbol: 'θ' },
    { id: 'power', label: 'Power', symbol: 'zⁿ' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="🔄 Complex Numbers" subtitle="a + bi Operations" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            {/* Operation Selector Grid */}
            <View style={styles.operationGrid}>
              {operations.map(op => (
                <TouchableOpacity
                  key={op.id}
                  style={[
                    styles.operationBtn,
                    operation === op.id && styles.operationBtnActive,
                  ]}
                  onPress={() => {
                    setOperation(op.id);
                    setResult(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.operationSymbol,
                    operation === op.id && styles.operationSymbolActive,
                  ]}>
                    {op.symbol}
                  </Text>
                  <Text style={[
                    styles.operationLabel,
                    operation === op.id && styles.operationLabelActive,
                  ]} numberOfLines={1} adjustsFontSizeToFit>
                    {op.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>First Complex Number (Z₁)</Text>
            
            <Text style={styles.inputLabel}>Real part (a):</Text>
            <TextInput 
              style={styles.input} 
              value={real1} 
              onChangeText={setReal1} 
              keyboardType="decimal-pad" 
              placeholder="Enter real part"
              placeholderTextColor={colors.textSecondary} 
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Imaginary part (b):</Text>
            <TextInput 
              style={styles.input} 
              value={imag1} 
              onChangeText={setImag1} 
              keyboardType="decimal-pad" 
              placeholder="Enter imaginary part"
              placeholderTextColor={colors.textSecondary} 
            />

            {showSecondInput && (
  <>
    <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
      {operation === 'power' ? 'Power (n)' : 'Second Complex Number (Z₂)'}
    </Text>
    
    {operation === 'power' ? (
      <>
        <Text style={styles.inputLabel}>Exponent (integer):</Text>
        <TextInput 
          style={styles.input} 
          value={real2} 
          onChangeText={setReal2} 
          keyboardType="number-pad" 
          placeholder="Enter exponent"
          placeholderTextColor={colors.textSecondary} 
        />
      </>
    ) : (
      <>
        <Text style={styles.inputLabel}>Real part (c):</Text>
        <TextInput 
          style={styles.input} 
          value={real2} 
          onChangeText={setReal2} 
          keyboardType="decimal-pad" 
          placeholder="Enter real part"
          placeholderTextColor={colors.textSecondary} 
        />

        <Text style={[styles.inputLabel, { marginTop: 12 }]}>Imaginary part (d):</Text>
        <TextInput 
          style={styles.input} 
          value={imag2} 
          onChangeText={setImag2} 
          keyboardType="decimal-pad" 
          placeholder="Enter imaginary part"
          placeholderTextColor={colors.textSecondary} 
        />
      </>
    )}
  </>
)}

            <SolveButton
              onPress={handleSolve}
              label="🔄 CALCULATE"
              loading={loading}
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
              <FinalAnswer label="🎯 Result" shareText={result.shareText}>
                <Text style={styles.finalText}>
                  {typeof result.result === 'object'
                    ? `${result.result.real} ${result.result.imag >= 0 ? '+' : '−'} ${Math.abs(result.result.imag)}i`
                    : result.result}
                </Text>
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
    width: '22%', // Fixed width percentage
    minWidth: 70,
    aspectRatio: 1, // Makes it square
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  operationSymbolActive: {
    color: colors.accent,
  },
  operationLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  operationLabelActive: {
    color: colors.accentGlow,
    fontWeight: '600',
  },
  
  // Section Labels
  sectionLabel: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 4,
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
  resultBox: {
    backgroundColor: colors.accentBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 2,
  },
  resultText: {
    color: colors.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
  formulaBox: {
    backgroundColor: colors.purpleBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 2,
  },
  formulaText: {
    color: colors.purpleGlow,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
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