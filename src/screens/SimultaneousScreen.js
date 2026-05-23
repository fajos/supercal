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
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { storeValue, getMemory } from '../utils/memory';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function SimultaneousScreen() {
  const [a1, setA1] = useState('2'); const [b1, setB1] = useState('1'); const [c1, setC1] = useState('-1'); const [d1, setD1] = useState('8');
  const [a2, setA2] = useState('-3'); const [b2, setB2] = useState('-1'); const [c2, setC2] = useState('2'); const [d2, setD2] = useState('-11');
  const [a3, setA3] = useState('-2'); const [b3, setB3] = useState('1'); const [c3, setC3] = useState('2'); const [d3, setD3] = useState('-3');
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSaveToMemory = async (val) => {
    const success = await storeValue('last_calculus_result', val.toString());
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRecallMemory = async (setter) => {
    const memory = await getMemory();
    if (memory.last_calculus_result) {
      setter(memory.last_calculus_result);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const result = solveSimultaneous3x3(
          parseFloat(a1), parseFloat(b1), parseFloat(c1), parseFloat(d1),
          parseFloat(a2), parseFloat(b2), parseFloat(c2), parseFloat(d2),
          parseFloat(a3), parseFloat(b3), parseFloat(c3), parseFloat(d3)
        );
        setSolution(result);
        setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
      } catch (err) {
        setError(err.message);
        setSolution(null);
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
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>Equation 1: a₁x + b₁y + c₁z = d₁</Text>
            <TouchableOpacity onPress={() => handleRecallMemory(setA1)}>
              <Text style={styles.recallBtn}>Recall MR</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.coeffRow}>
            <TextInput style={styles.input} value={a1} onChangeText={setA1} keyboardType="decimal-pad" placeholder="a₁" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>x +</Text>
            <TextInput style={styles.input} value={b1} onChangeText={setB1} keyboardType="decimal-pad" placeholder="b₁" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>y +</Text>
            <TextInput style={styles.input} value={c1} onChangeText={setC1} keyboardType="decimal-pad" placeholder="c₁" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>z =</Text>
            <TextInput style={styles.input} value={d1} onChangeText={setD1} keyboardType="decimal-pad" placeholder="d₁" placeholderTextColor={colors.textSecondary} />
          </View>

          <View style={[styles.inputHeader, { marginTop: 12 }]}>
            <Text style={styles.inputLabel}>Equation 2: a₂x + b₂y + c₂z = d₂</Text>
            <TouchableOpacity onPress={() => handleRecallMemory(setA2)}>
              <Text style={styles.recallBtn}>Recall MR</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.coeffRow}>
            <TextInput style={styles.input} value={a2} onChangeText={setA2} keyboardType="decimal-pad" placeholder="a₂" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>x +</Text>
            <TextInput style={styles.input} value={b2} onChangeText={setB2} keyboardType="decimal-pad" placeholder="b₂" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>y +</Text>
            <TextInput style={styles.input} value={c2} onChangeText={setC2} keyboardType="decimal-pad" placeholder="c₂" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>z =</Text>
            <TextInput style={styles.input} value={d2} onChangeText={setD2} keyboardType="decimal-pad" placeholder="d₂" placeholderTextColor={colors.textSecondary} />
          </View>

          <View style={[styles.inputHeader, { marginTop: 12 }]}>
            <Text style={styles.inputLabel}>Equation 3: a₃x + b₃y + c₃z = d₃</Text>
            <TouchableOpacity onPress={() => handleRecallMemory(setA3)}>
              <Text style={styles.recallBtn}>Recall MR</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.coeffRow}>
            <TextInput style={styles.input} value={a3} onChangeText={setA3} keyboardType="decimal-pad" placeholder="a₃" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>x +</Text>
            <TextInput style={styles.input} value={b3} onChangeText={setB3} keyboardType="decimal-pad" placeholder="b₃" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>y +</Text>
            <TextInput style={styles.input} value={c3} onChangeText={setC3} keyboardType="decimal-pad" placeholder="c₃" placeholderTextColor={colors.textSecondary} />
            <Text style={styles.sep}>z =</Text>
            <TextInput style={styles.input} value={d3} onChangeText={setD3} keyboardType="decimal-pad" placeholder="d₃" placeholderTextColor={colors.textSecondary} />
          </View>

          <SolveButton
            onPress={handleSolve}
            label="⚡ SOLVE SYSTEM"
            loading={loading}
          />
        </InputCard>

        <ErrorCard message={error} />

        {solution && (
          <View style={styles.solutionArea}>
            {solution.steps.map((step, idx) => (
              <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                {renderContent(step.content)}
              </StepCard>
            ))}
            <FinalAnswer label="🎯 Solution">
              <View style={styles.finalRow}>
                <View>
                  <Text style={styles.finalText}>x = {solution.x.toFixed(6)}</Text>
                  <Text style={styles.finalText}>y = {solution.y.toFixed(6)}</Text>
                  <Text style={styles.finalText}>z = {solution.z.toFixed(6)}</Text>
                </View>
                <View style={styles.memoryActions}>
                  <TouchableOpacity style={styles.memoryBtn} onPress={() => handleSaveToMemory(solution.x)}>
                    <Ionicons name="save-outline" size={16} color={colors.accent} />
                    <Text style={styles.memoryBtnText}>Mx</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.memoryBtn} onPress={() => handleSaveToMemory(solution.y)}>
                    <Ionicons name="save-outline" size={16} color={colors.accent} />
                    <Text style={styles.memoryBtnText}>My</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.memoryBtn} onPress={() => handleSaveToMemory(solution.z)}>
                    <Ionicons name="save-outline" size={16} color={colors.accent} />
                    <Text style={styles.memoryBtnText}>Mz</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  inputLabel: { fontSize: 13, color: colors.textSecondary },
  inputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  recallBtn: { color: colors.accent, fontSize: 10, fontWeight: '600', textDecorationLine: 'underline' },
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
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  finalText: { color: colors.white, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 30 },
  finalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  memoryActions: { gap: 8 },
  memoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  memoryBtnText: { color: colors.accent, fontSize: 11, fontWeight: '700', marginLeft: 4 },
});
