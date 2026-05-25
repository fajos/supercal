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
import { solveCircuits } from '../solvers/circuitsSolver';
import { BackHeader } from '../components/BackHeader';
import { useHistory } from '../utils/history';
import { ModeChip } from '../components/ModeChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function CircuitsScreen() {
  const [mode, setMode] = useState('ohmsLaw');
  const [voltage, setVoltage] = useState('12');
  const [current, setCurrent] = useState('2');
  const [resistance, setResistance] = useState('6');
  const [resistance2, setResistance2] = useState('4');
  const [power, setPower] = useState('0');
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
          voltage: parseFloat(voltage) || 0,
          current: parseFloat(current) || 0,
          resistance: parseFloat(resistance) || 0,
          resistance2: parseFloat(resistance2) || 0,
          power: parseFloat(power) || 0,
        };
        const solverResult = solveCircuits(mode, params);

        const shareText = `Electric Circuits Result (${mode}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'circuits',
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
      if (item.type === 'result') return (
        <View key={idx} style={styles.resultBox}>
          <Text style={styles.resultText}>{item.text}</Text>
        </View>
      );
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <BackHeader title="⚡ Electric Circuits" subtitle="Ohm's Law & Circuit Analysis" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'ohmsLaw', label: "Ohm's Law" },
                { id: 'series', label: 'Series' },
                { id: 'parallel', label: 'Parallel' },
                { id: 'power', label: 'Power' },
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

            <Text style={styles.inputLabel}>Voltage (V):</Text>
            <TextInput style={styles.input} value={voltage} onChangeText={setVoltage} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Current (A):</Text>
            <TextInput style={styles.input} value={current} onChangeText={setCurrent} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Resistance R₁ (Ω):</Text>
            <TextInput style={styles.input} value={resistance} onChangeText={setResistance} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            {(mode === 'series' || mode === 'parallel') && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Resistance R₂ (Ω):</Text>
                <TextInput style={styles.input} value={resistance2} onChangeText={setResistance2} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="⚡ CALCULATE"
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
              <FinalAnswer label="⚡ Result" shareText={result.shareText}>
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
  flex: { flex: 1 },
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
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center', width: '100%' },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  resultBox: { backgroundColor: '#2a2a40', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginVertical: 2 },
  resultText: { color: '#c4b5fd', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 14, fontWeight: '600' },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});