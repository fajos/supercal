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
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);

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
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (err) {
      setError(err.message);
      setSolution(null);
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
            <Text style={styles.inputLabel}>Equation 1:</Text>
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

            <Text style={styles.inputLabel}>Equation 2:</Text>
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

            <TouchableOpacity
              style={styles.solveBtn}
              onPress={handleSolve}
              activeOpacity={0.8}
            >
              <Text style={styles.solveBtnText}>📏 SOLVE SYSTEM</Text>
            </TouchableOpacity>
          </InputCard>

          {/* Error */}
          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

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
                <Text style={styles.finalText}>
                  x = {solution.x.toFixed(4)}
                </Text>
                <Text style={styles.finalText}>
                  y = {solution.y.toFixed(4)}
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
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.3,
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
  stepText: {
    color: '#c8c8d8',
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