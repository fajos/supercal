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
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { solveTrig } from '../solvers/trigSolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';
import { ModeChip } from '../components/ModeChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

const TRIG_FUNCTIONS = [
  { label: 'sin(x)', value: 'sin' },
  { label: 'cos(x)', value: 'cos' },
  { label: 'tan(x)', value: 'tan' },
];

export default function TrigonometryScreen() {
  const [selectedFunc, setSelectedFunc] = useState('sin');
  const [value, setValue] = useState('0.5');
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const result = solveTrig(selectedFunc, parseFloat(value));
        const shareText = `Trigonometry Result:\nEquation: ${selectedFunc}(x) = ${value}\nPrincipal Sol: ${result.solutions.principal.toFixed(6)} rad (${result.solutions.principalDeg.toFixed(4)}°)\nGeneral: ${result.solutions.general}\n\nSolved with SuperCalc`;

        setSolution({ ...result, shareText });

        addToHistory({
          type: 'trigonometry',
          input: { function: selectedFunc, value: parseFloat(value) },
          result: result.solutions,
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
    }, 600);
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
            <BackHeader title="🔺 Trigonometry" subtitle="sin, cos, tan Equations" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <Text style={styles.inputLabel}>Select function:</Text>
            <View style={styles.modeGrid}>
              {TRIG_FUNCTIONS.map((func) => (
                <ModeChip
                  key={func.value}
                  label={func.label}
                  active={selectedFunc === func.value}
                  onPress={() => {
                    setSelectedFunc(func.value);
                  }}
                  style={styles.modeBtn}
                />
              ))}
            </View>

            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>
                {selectedFunc}(x) =
              </Text>
            </View>
            <TextInput
              style={styles.valueInput}
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
              placeholder="e.g., 0.5"
              placeholderTextColor={colors.textSecondary}
            />

            <SolveButton
              onPress={handleSolve}
              label="📐 SOLVE EQUATION"
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

              <FinalAnswer
                label="🎯 Solutions"
                shareText={solution.shareText}
              >
                <Text style={styles.finalLabel}>Principal Value:</Text>
                <View>
                  <Text style={styles.finalText}>
                    x = {solution.solutions.principal.toFixed(6)} rad
                  </Text>
                  <Text style={styles.finalDeg}>
                    = {solution.solutions.principalDeg.toFixed(4)}°
                  </Text>
                </View>

                {solution.solutions.secondary !== null && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={styles.finalLabel}>Second Solution (0 to 2π):</Text>
                    <View>
                      <Text style={styles.finalText}>
                        x = {solution.solutions.secondary.toFixed(6)} rad
                      </Text>
                      <Text style={styles.finalDeg}>
                        = {solution.solutions.secondaryDeg.toFixed(4)}°
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.generalBox}>
                  <Text style={styles.generalLabel}>General Solution:</Text>
                  <Text style={styles.generalText}>
                    {solution.solutions.general}
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
  tabletInputCard: {
    maxWidth: 600,
    width: '100%',
  },
  solutionArea: {
    gap: 0,
    width: '100%',
    maxWidth: 800,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  modeBtn: {
    flex: 1,
    minWidth: 80,
  },
  valueInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 14,
    textAlign: 'center',
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
  finalLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0.5,
    marginTop: 8,
  },
  finalText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 28,
  },
  finalDeg: {
    color: '#888',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
  generalBox: {
    backgroundColor: 'rgba(0,212,170,0.08)',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    width: '100%',
  },
  generalLabel: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  generalText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
});