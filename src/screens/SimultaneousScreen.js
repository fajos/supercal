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
import { solveSimultaneous3x3 } from '../solvers/simultaneousSolver';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function SimultaneousScreen() {
  const [a1, setA1] = useState('2'); const [b1, setB1] = useState('1'); const [c1, setC1] = useState('-1'); const [d1, setD1] = useState('8');
  const [a2, setA2] = useState('-3'); const [b2, setB2] = useState('-1'); const [c2, setC2] = useState('2'); const [d2, setD2] = useState('-11');
  const [a3, setA3] = useState('-2'); const [b3, setB3] = useState('1'); const [c3, setC3] = useState('2'); const [d3, setD3] = useState('-3');
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    try {
      const result = solveSimultaneous3x3(
        parseFloat(a1), parseFloat(b1), parseFloat(c1), parseFloat(d1),
        parseFloat(a2), parseFloat(b2), parseFloat(c2), parseFloat(d2),
        parseFloat(a3), parseFloat(b3), parseFloat(c3), parseFloat(d3)
      );
      setSolution(result);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    } catch (err) {
      setError(err.message);
      setSolution(null);
    }
  };

  const renderContent = (content) => {
    return content.map((item, idx) => {
      if (item.type === 'highlight') return <Text key={idx} style={styles.highlightText}>{item.text}</Text>;
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <BackHeader title="⚡ Simultaneous Equations" subtitle="3×3 System Solver" />
        </View>

        <InputCard style={isTablet && styles.tabletInputCard}>
          <Text style={styles.inputLabel}>Equation 1: a₁x + b₁y + c₁z = d₁</Text>
          <View style={styles.coeffRow}>
            <TextInput style={styles.input} value={a1} onChangeText={setA1} keyboardType="decimal-pad" placeholder="a₁" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>x +</Text>
            <TextInput style={styles.input} value={b1} onChangeText={setB1} keyboardType="decimal-pad" placeholder="b₁" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>y +</Text>
            <TextInput style={styles.input} value={c1} onChangeText={setC1} keyboardType="decimal-pad" placeholder="c₁" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>z =</Text>
            <TextInput style={styles.input} value={d1} onChangeText={setD1} keyboardType="decimal-pad" placeholder="d₁" placeholderTextColor={colors.textSecondary} />
          </View>

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Equation 2: a₂x + b₂y + c₂z = d₂</Text>
          <View style={styles.coeffRow}>
            <TextInput style={styles.input} value={a2} onChangeText={setA2} keyboardType="decimal-pad" placeholder="a₂" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>x +</Text>
            <TextInput style={styles.input} value={b2} onChangeText={setB2} keyboardType="decimal-pad" placeholder="b₂" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>y +</Text>
            <TextInput style={styles.input} value={c2} onChangeText={setC2} keyboardType="decimal-pad" placeholder="c₂" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>z =</Text>
            <TextInput style={styles.input} value={d2} onChangeText={setD2} keyboardType="decimal-pad" placeholder="d₂" placeholderTextColor={colors.textSecondary} />
          </View>

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Equation 3: a₃x + b₃y + c₃z = d₃</Text>
          <View style={styles.coeffRow}>
            <TextInput style={styles.input} value={a3} onChangeText={setA3} keyboardType="decimal-pad" placeholder="a₃" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>x +</Text>
            <TextInput style={styles.input} value={b3} onChangeText={setB3} keyboardType="decimal-pad" placeholder="b₃" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>y +</Text>
            <TextInput style={styles.input} value={c3} onChangeText={setC3} keyboardType="decimal-pad" placeholder="c₃" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>z =</Text>
            <TextInput style={styles.input} value={d3} onChangeText={setD3} keyboardType="decimal-pad" placeholder="d₃" placeholderTextColor={colors.textSecondary} />
          </View>

          <TouchableOpacity style={styles.solveBtn} onPress={handleSolve} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>⚡ SOLVE SYSTEM</Text>
          </TouchableOpacity>
        </InputCard>

        {error && <View style={styles.errorCard}><Text style={styles.errorText}>⚠️ {error}</Text></View>}

        {solution && (
          <View style={styles.solutionArea}>
            {solution.steps.map((step, idx) => (
              <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                {renderContent(step.content)}
              </StepCard>
            ))}
            <FinalAnswer label="🎯 Solution">
              <Text style={styles.finalText}>x = {solution.x.toFixed(6)}</Text>
              <Text style={styles.finalText}>y = {solution.y.toFixed(6)}</Text>
              <Text style={styles.finalText}>z = {solution.z.toFixed(6)}</Text>
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
  header: { marginBottom: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.white },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  inputCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, marginBottom: 16 },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  coeffRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  input: {
    flex: 1,
    minWidth: 50,
    maxWidth: 80,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.white,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center'
  },
  sep: { color: colors.textSecondary, fontSize: 12 },
  solveBtn: { backgroundColor: colors.accent, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700' },
  errorCard: { backgroundColor: 'rgba(255,71,87,0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  stepText: { color: '#c8c8d8', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  finalText: { color: colors.white, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 30 },
});