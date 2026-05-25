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
import { ModeChip } from '../components/ModeChip';

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

        const shareText = `Energy & Work Result (${mode}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

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
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="⚡ Energy & Work" subtitle="Kinetic, Potential & Conservation" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'kinetic', label: 'Kinetic' },
                { id: 'potential', label: 'Potential' },
                { id: 'spring', label: 'Spring' },
                { id: 'conservation', label: 'Conservation' },
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

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Mass (kg):</Text>
            <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            {mode === 'kinetic' || mode === 'conservation' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Velocity (m/s):</Text>
                <TextInput style={styles.input} value={velocity} onChangeText={setVelocity} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : null}

            {mode === 'potential' || mode === 'conservation' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Height (m):</Text>
                <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : null}

            {mode === 'spring' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Spring Constant k (N/m):</Text>
                <TextInput style={styles.input} value={springConstant} onChangeText={setSpringConstant} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Compression/Extension x (m):</Text>
                <TextInput style={styles.input} value={springCompression} onChangeText={setSpringCompression} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            ) : null}

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              label="⚡ CALCULATE"
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
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '22%',
    flex: 1,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  resultBox: { backgroundColor: '#2a2a40', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginVertical: 2 },
  resultText: { color: '#c4b5fd', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 14, fontWeight: '600' },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});