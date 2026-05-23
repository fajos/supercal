import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveExponential } from '../solvers/exponentialSolver';
import { BackHeader } from '../components/BackHeader';

export default function ExponentialScreen() {
  const [mode, setMode] = useState('exponential');
  const [base, setBase] = useState('2');
  const [value, setValue] = useState('8');
  const [principal, setPrincipal] = useState('1000');
  const [rate, setRate] = useState('5');
  const [time, setTime] = useState('10');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    try {
      let params = {};
      
      if (mode === 'exponential') {
        params = { base: parseFloat(base), value: parseFloat(value) };
      } else if (mode === 'logarithmic') {
        params = { base: parseFloat(base), value: parseFloat(value) };
      } else if (mode === 'natural') {
        params = { value: parseFloat(value), isExp: true };
      } else if (mode === 'growth') {
        params = { principal: parseFloat(principal), rate: parseFloat(rate), time: parseFloat(time), mode: 'growth' };
      }
      
      const solverResult = solveExponential(mode, params);
      setResult(solverResult);
      setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <BackHeader title="📊 Exp & Log" subtitle="Exponential & Logarithmic Equations" />

        <View style={styles.inputCard}>
          <View style={styles.modeRow}>
            {[
              { id: 'exponential', label: 'a^x = b' },
              { id: 'logarithmic', label: 'log_a(x) = b' },
              { id: 'natural', label: 'e^x / ln(x)' },
              { id: 'growth', label: 'Growth' },
            ].map(m => (
              <TouchableOpacity
                key={m.id}
                style={[styles.modeBtn, mode === m.id && styles.modeBtnActive]}
                onPress={() => { setMode(m.id); setResult(null); }}
              >
                <Text style={[styles.modeText, mode === m.id && styles.modeTextActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {mode !== 'growth' ? (
            <>
              <Text style={styles.inputLabel}>Base a:</Text>
              <TextInput style={styles.input} value={base} onChangeText={setBase} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              <Text style={styles.inputLabel}>Value b:</Text>
              <TextInput style={styles.input} value={value} onChangeText={setValue} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Initial Amount (P):</Text>
              <TextInput style={styles.input} value={principal} onChangeText={setPrincipal} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              <Text style={styles.inputLabel}>Rate (%):</Text>
              <TextInput style={styles.input} value={rate} onChangeText={setRate} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              <Text style={styles.inputLabel}>Time periods (t):</Text>
              <TextInput style={styles.input} value={time} onChangeText={setTime} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
            </>
          )}

          <TouchableOpacity style={styles.solveBtn} onPress={handleSolve} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>📊 SOLVE</Text>
          </TouchableOpacity>
        </View>

        {error && <View style={styles.errorCard}><Text style={styles.errorText}>⚠️ {error}</Text></View>}

        {result && (
          <View style={styles.solutionArea}>
            {result.steps.map((step, idx) => (
              <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                {step.content.map((item, i) => {
                  if (item.type === 'highlight') return <Text key={i} style={styles.highlightText}>{item.text}</Text>;
                  if (item.type === 'formula') return <Text key={i} style={styles.formulaText}>{item.text}</Text>;
                  return <Text key={i} style={styles.stepText}>{item.text}</Text>;
                })}
              </StepCard>
            ))}
            <FinalAnswer label="📊 Result">
              <Text style={styles.finalText}>{String(result.result)}</Text>
            </FinalAnswer>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.white },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  inputCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, marginBottom: 16 },
  modeRow: { flexDirection: 'row', gap: 6, marginBottom: 16, flexWrap: 'wrap' },
  modeBtn: { flex: 1, minWidth: '22%', paddingVertical: 10, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 11, fontWeight: '500', textAlign: 'center' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  solveBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: { backgroundColor: 'rgba(255,71,87,0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  solutionArea: { gap: 0 },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});