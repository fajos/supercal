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
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveComplexOperation } from '../solvers/complexSolver';
import { BackHeader } from '../components/BackHeader';

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
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    try {
      const z1 = { real: parseFloat(real1) || 0, imag: parseFloat(imag1) || 0 };
      const z2 = { real: parseFloat(real2) || 0, imag: parseFloat(imag2) || 0 };
      const solverResult = solveComplexOperation(operation, z1, z2);
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

  const showSecondInput = ['add', 'subtract', 'multiply', 'divide'].includes(operation);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <BackHeader title="🔄 Complex Numbers" subtitle="a + bi Operations" />
        </View>

        <InputCard style={isTablet && styles.tabletInputCard}>
          <View style={styles.modeRow}>
            {[
              { id: 'add', label: 'Add' },
              { id: 'multiply', label: 'Multiply' },
              { id: 'conjugate', label: 'Conjugate' },
              { id: 'magnitude', label: 'Magnitude' },
            ].map(op => (
              <TouchableOpacity
                key={op.id}
                style={[styles.modeBtn, operation === op.id && styles.modeBtnActive]}
                onPress={() => { setOperation(op.id); setResult(null); }}
              >
                <Text style={[styles.modeText, operation === op.id && styles.modeTextActive]}>{op.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Real part (a):</Text>
          <TextInput style={styles.input} value={real1} onChangeText={setReal1} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
          
          <Text style={styles.inputLabel}>Imaginary part (b):</Text>
          <TextInput style={styles.input} value={imag1} onChangeText={setImag1} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

          {showSecondInput && (
            <>
              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Second Number:</Text>
              <Text style={styles.inputLabel}>Real part (c):</Text>
              <TextInput style={styles.input} value={real2} onChangeText={setReal2} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              <Text style={styles.inputLabel}>Imaginary part (d):</Text>
              <TextInput style={styles.input} value={imag2} onChangeText={setImag2} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
            </>
          )}

          <TouchableOpacity style={styles.solveBtn} onPress={handleSolve} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>🔄 CALCULATE</Text>
          </TouchableOpacity>
        </InputCard>

        {error && <View style={styles.errorCard}><Text style={styles.errorText}>{error}</Text></View>}

        {result && (
          <View style={styles.solutionArea}>
            {result.steps.map((step, idx) => (
              <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                {renderContent(step.content)}
              </StepCard>
            ))}
            <FinalAnswer label="🎯 Result">
              <Text style={styles.finalText}>
                {typeof result.result === 'object' 
                  ? `${result.result.real} ${result.result.imag >= 0 ? '+' : '-'} ${Math.abs(result.result.imag)}i`
                  : result.result}
              </Text>
            </FinalAnswer>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ... styles (similar pattern to other screens)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: { maxWidth: 600, width: '100%' },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  header: { marginBottom: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.white },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  inputCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, marginBottom: 16 },
  modeRow: { flexDirection: 'row', gap: 6, marginBottom: 16, flexWrap: 'wrap' },
  modeBtn: { flex: 1, minWidth: 80, paddingVertical: 8, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 11, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  solveBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: { backgroundColor: 'rgba(255,71,87,0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});