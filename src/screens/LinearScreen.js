import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveLinearSystem } from '../solvers/linearSolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function LinearScreen() {
  const [a1, setA1] = useState('2');
  const [b1, setB1] = useState('1');
  const [c1, setC1] = useState('10');
  const [a2, setA2] = useState('1');
  const [b2, setB2] = useState('-1');
  const [c2, setC2] = useState('2');
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);

    // Artificial delay for UI consistency
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const result = solveLinearSystem(
        parseFloat(a1) || 0,
        parseFloat(b1) || 0,
        parseFloat(c1) || 0,
        parseFloat(a2) || 0,
        parseFloat(b2) || 0,
        parseFloat(c2) || 0
      );
      setSolution(result);

      addToHistory({
        type: 'linear',
        input: { a1, b1, c1, a2, b2, c2 },
        result: { x: result.x, y: result.y },
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <BackHeader title="📏 Linear System" subtitle="2×2 Cramer's Rule" />
          </View>

          {/* Input Card */}
          <InputCard>
            <View style={styles.inputLabel}>
              <Text style={styles.inputLabel}>Equation 1:</Text>
            </View>
            <View style={styles.eqRow}>
              <TextInput
                style={styles.eqInput}
                value={a1}
                onChangeText={setA1}
                keyboardType="decimal-pad"
                placeholder="a₁"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.eqSep}>x +</Text>
              <TextInput
                style={styles.eqInput}
                value={b1}
                onChangeText={setB1}
                keyboardType="decimal-pad"
                placeholder="b₁"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.eqSep}>y =</Text>
              <TextInput
                style={styles.eqInput}
                value={c1}
                onChangeText={setC1}
                keyboardType="decimal-pad"
                placeholder="c₁"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputLabel}>
              <Text style={styles.inputLabel}>Equation 2:</Text>
            </View>
            <View style={styles.eqRow}>
              <TextInput
                style={styles.eqInput}
                value={a2}
                onChangeText={setA2}
                keyboardType="decimal-pad"
                placeholder="a₂"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.eqSep}>x +</Text>
              <TextInput
                style={styles.eqInput}
                value={b2}
                onChangeText={setB2}
                keyboardType="decimal-pad"
                placeholder="b₂"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.eqSep}>y =</Text>
              <TextInput
                style={styles.eqInput}
                value={c2}
                onChangeText={setC2}
                keyboardType="decimal-pad"
                placeholder="c₂"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <SolveButton
              onPress={handleSolve}
              label="📏 SOLVE SYSTEM"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {/* Solution Steps */}
          {solution && (
            <View style={styles.solutionArea}>
              {solution.steps.map((step, index) => (
                <StepCard
                  key={index}
                  step={step.step}
                  badge={step.badge}
                  index={index}
                >
                  {renderContent(step.content)}
                </StepCard>
              ))}

              <FinalAnswer label="🎯 Solution">
                <View>
                  <Text style={styles.finalText}>
                    x = {solution.x.toFixed(4)}
                  </Text>
                  <Text style={styles.finalText}>
                    y = {solution.y.toFixed(4)}
                  </Text>
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
  solutionArea: {
    gap: 0,
    width: '100%',
    maxWidth: 800,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  eqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  eqInput: {
    flex: 1,
    minWidth: 60,
    maxWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.white,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
  eqSep: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
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
  finalText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 32,
  },
});