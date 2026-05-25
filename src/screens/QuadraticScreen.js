import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { solveQuadratic } from '../solvers/quadraticSolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function QuadraticScreen() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-5');
  const [c, setC] = useState('6');
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setLoading(true);

    try {
      const aNum = parseFloat(a) || 0;
      const bNum = parseFloat(b) || 0;
      const cNum = parseFloat(c) || 0;
      const result = solveQuadratic(aNum, bNum, cNum);

      const shareText = `Quadratic Equation Result:\nEquation: ${a}x² + ${b}x + ${c} = 0\nRoots: x1=${result.roots[0]}, x2=${result.roots[1]}\n\nSolved with SuperCalc`;

      setSolution({ ...result, shareText });

      addToHistory({
        type: 'quadratic',
        input: { a: aNum, b: bNum, c: cNum },
        result: result.rawRoots,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }, 300);
    } catch (err) {
      setError(err.message);
      setSolution(null);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content) => {
    return content.map((item, idx) => {
      switch (item.type) {
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <BackHeader title="📐 Quadratic Solver" subtitle="ax² + bx + c = 0" />
          </View>

          {/* Standardized Input Card */}
          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.coeffRow}>
              <TextInput style={styles.input} value={a} onChangeText={setA}
                keyboardType="decimal-pad" placeholder="a" placeholderTextColor={colors.textSecondary} />
              <Text style={styles.separator}>x² +</Text>
              <TextInput style={styles.input} value={b} onChangeText={setB}
                keyboardType="decimal-pad" placeholder="b" placeholderTextColor={colors.textSecondary} />
              <Text style={styles.separator}>x +</Text>
              <TextInput style={styles.input} value={c} onChangeText={setC}
                keyboardType="decimal-pad" placeholder="c" placeholderTextColor={colors.textSecondary} />
              <Text style={styles.separator}>= 0</Text>
            </View>

            {/* 🆕 Using SolveButton component */}
            <SolveButton
              onPress={handleSolve}
              label="⚡ SOLVE & SHOW STEPS"
              loading={loading}
            />
          </InputCard>

          {/* 🆕 Using ErrorCard component */}
          <ErrorCard message={error} />

          {/* Solution Steps (unchanged) */}
          {solution && (
            <View style={styles.solutionArea}>
              {solution.steps.map((step, index) => (
                <StepCard key={index} step={step.step} badge={step.badge} index={index}>
                  {renderContent(step.content)}
                </StepCard>
              ))}
              <FinalAnswer label="🎯 Solution" shareText={solution.shareText}>
                <View style={styles.finalResultRow}>
                  <Text style={styles.finalRootText}>x₁ = {solution.roots[0]}</Text>
                </View>
                <View style={styles.finalResultRow}>
                  <Text style={styles.finalRootText}>x₂ = {solution.roots[1]}</Text>
                </View>
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
    backgroundColor: colors.bgPrimary,
  },
  flex: {
    flex: 1,
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
  header: {
    marginBottom: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  inputCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 12,
  },
  recallBtnMini: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  coeffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minWidth: 50,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
  separator: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
  solveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  solveBtnDisabled: {
    opacity: 0.6,
  },
  solveBtnText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorCard: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  solutionArea: {
    gap: 0,
  },
  stepText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 22,
  },
  highlightText: {
    color: colors.accentGlow,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
    lineHeight: 22,
  },
  resultBox: {
    backgroundColor: colors.purpleBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 2,
  },
  resultText: {
    color: '#c4b5fd',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '600',
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
  finalRootText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 32,
  },
  finalResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  memoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  memoryBtnText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});