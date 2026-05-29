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

        const z1Str = `${z1.real}${z1.imag >= 0 ? '+' : '-'}${Math.abs(z1.imag)}i`;
        const z2Str = `${z2.real}${z2.imag >= 0 ? '+' : '-'}${Math.abs(z2.imag)}i`;

        let opLabel = operation.charAt(0).toUpperCase() + operation.slice(1);
        let resStr = typeof solverResult.result === 'object'
          ? `${solverResult.result.real} ${solverResult.result.imag >= 0 ? '+' : '-'} ${Math.abs(solverResult.result.imag)}i`
          : solverResult.result;

        const shareText = `Complex Number Result (${opLabel}):\nZ1: ${z1Str}${showSecondInput ? `\nZ2: ${z2Str}` : ''}\nResult: ${resStr}\n\nSolved with SuperCalc`;

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
      if (item.type === 'highlight') return <Text key={idx} style={styles.highlightText}>{item.text}</Text>;
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  const showSecondInput = ['add', 'subtract', 'multiply', 'divide'].includes(operation);

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
            <View style={styles.modeGrid}>
              {[
                { id: 'add', label: 'Add' },
                { id: 'multiply', label: 'Multiply' },
                { id: 'conjugate', label: 'Conjugate' },
                { id: 'magnitude', label: 'Magnitude' },
              ].map(op => (
                <ModeChip
                  key={op.id}
                  label={op.label}
                  active={operation === op.id}
                  onPress={() => {
                    setOperation(op.id);
                    setResult(null);
                  }}
                  style={styles.modeBtn}
                />
              ))}
            </View>

            <Text style={styles.inputLabel}>Real part (a):</Text>
            <TextInput style={styles.input} value={real1} onChangeText={setReal1} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Imaginary part (b):</Text>
            <TextInput style={styles.input} value={imag1} onChangeText={setImag1} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            {showSecondInput && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12, marginBottom: 4, fontWeight: '600' }]}>Second Number:</Text>
                <Text style={styles.inputLabel}>Real part (c):</Text>
                <TextInput style={styles.input} value={real2} onChangeText={setReal2} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Imaginary part (d):</Text>
                <TextInput style={styles.input} value={imag2} onChangeText={setImag2} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
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
                    ? `${result.result.real} ${result.result.imag >= 0 ? '+' : '-'} ${Math.abs(result.result.imag)}i`
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
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: { maxWidth: 600, width: '100%' },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  modeBtn: {
    minWidth: '22%',
    flex: 1,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});