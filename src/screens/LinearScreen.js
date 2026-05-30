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
import { solveSimultaneous3x3 } from '../solvers/simultaneousSolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function LinearScreen() {
  const [mode, setMode] = useState('2x2'); // '2x2' or '3x3'

  // 2x2 State
  const [a1, setA1] = useState('2');
  const [b1, setB1] = useState('1');
  const [c1, setC1] = useState('10');
  const [a2, setA2] = useState('1');
  const [b2, setB2] = useState('-1');
  const [c2, setC2] = useState('2');

  // 3x3 State
  const [a1_3, setA1_3] = useState('2'); const [b1_3, setB1_3] = useState('1'); const [c1_3, setC1_3] = useState('-1'); const [d1_3, setD1_3] = useState('8');
  const [a2_3, setA2_3] = useState('-3'); const [b2_3, setB2_3] = useState('-1'); const [c2_3, setC2_3] = useState('2'); const [d2_3, setD2_3] = useState('-11');
  const [a3_3, setA3_3] = useState('-2'); const [b3_3, setB3_3] = useState('1'); const [c3_3, setC3_3] = useState('2'); const [d3_3, setD3_3] = useState('-3');

  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = async () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        let result;
        let shareText;
        let historyData;

        if (mode === '2x2') {
          result = solveLinearSystem(
            parseFloat(a1) || 0,
            parseFloat(b1) || 0,
            parseFloat(c1) || 0,
            parseFloat(a2) || 0,
            parseFloat(b2) || 0,
            parseFloat(c2) || 0
          );

          const solX = result.x !== null ? result.x.toFixed(4) : 'N/A';
          const solY = result.y !== null ? result.y.toFixed(4) : 'N/A';
          const resStr = result.result || `x=${solX}, y=${solY}`;

          shareText = `Linear System (2x2) Result:\nEq1: ${a1}x + ${b1}y = ${c1}\nEq2: ${a2}x + ${b2}y = ${c2}\nSolution: ${resStr}\n\nSolved with SuperCalc`;

          historyData = {
            type: 'linear_2x2',
            input: { a1, b1, c1, a2, b2, c2 },
            result: { x: result.x, y: result.y, resStr },
            timestamp: new Date().toISOString(),
          };
        } else {
          result = solveSimultaneous3x3(
            parseFloat(a1_3) || 0, parseFloat(b1_3) || 0, parseFloat(c1_3) || 0, parseFloat(d1_3) || 0,
            parseFloat(a2_3) || 0, parseFloat(b2_3) || 0, parseFloat(c2_3) || 0, parseFloat(d2_3) || 0,
            parseFloat(a3_3) || 0, parseFloat(b3_3) || 0, parseFloat(c3_3) || 0, parseFloat(d3_3) || 0
          );

          const solX = result.x !== null ? result.x.toFixed(4) : 'N/A';
          const solY = result.y !== null ? result.y.toFixed(4) : 'N/A';
          const solZ = result.z !== null ? result.z.toFixed(4) : 'N/A';
          const resStr = result.error ? result.error : `x=${solX}, y=${solY}, z=${solZ}`;

          shareText = `Linear System (3x3) Result:\nEq1: ${a1_3}x + ${b1_3}y + ${c1_3}z = ${d1_3}\nEq2: ${a2_3}x + ${b2_3}y + ${c2_3}z = ${d2_3}\nEq3: ${a3_3}x + ${b3_3}y + ${c3_3}z = ${d3_3}\nSolution: ${resStr}\n\nSolved with SuperCalc`;

          historyData = {
            type: 'linear_3x3',
            input: {
              eq1: [a1_3, b1_3, c1_3, d1_3],
              eq2: [a2_3, b2_3, c2_3, d2_3],
              eq3: [a3_3, b3_3, c3_3, d3_3]
            },
            result: { x: result.x, y: result.y, z: result.z, error: result.error },
            timestamp: new Date().toISOString(),
          };
        }

        setSolution({ ...result, shareText });
        addToHistory(historyData);

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
        case 'formula':
          return (
            <View key={idx} style={styles.formulaBox}>
              <Text style={styles.formulaText}>{item.text}</Text>
            </View>
          );
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <BackHeader title="📏 Linear System" subtitle={mode === '2x2' ? "2×2 Cramer's Rule" : "3×3 Cramer's Rule"} />
          </View>

          {/* Mode Selector */}
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeButton, mode === '2x2' && styles.modeButtonActive]}
              onPress={() => {
                setMode('2x2');
                setSolution(null);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[styles.modeText, mode === '2x2' && styles.modeTextActive]}>2 × 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === '3x3' && styles.modeButtonActive]}
              onPress={() => {
                setMode('3x3');
                setSolution(null);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[styles.modeText, mode === '3x3' && styles.modeTextActive]}>3 × 3</Text>
            </TouchableOpacity>
          </View>

          {/* Input Card */}
          <InputCard>
            {mode === '2x2' ? (
              <>
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
              </>
            ) : (
              <>
                <View style={styles.inputLabel}>
                  <Text style={styles.inputLabel}>Equation 1: a₁x + b₁y + c₁z = d₁</Text>
                </View>
                <View style={styles.eqRow}>
                  <TextInput style={styles.eqInput} value={a1_3} onChangeText={setA1_3} keyboardType="decimal-pad" placeholder="a₁" placeholderTextColor={colors.textSecondary} />
                  <Text style={styles.eqSep}>x +</Text>
                  <TextInput style={styles.eqInput} value={b1_3} onChangeText={setB1_3} keyboardType="decimal-pad" placeholder="b₁" placeholderTextColor={colors.textSecondary} />
                  <Text style={styles.eqSep}>y +</Text>
                  <TextInput style={styles.eqInput} value={c1_3} onChangeText={setC1_3} keyboardType="decimal-pad" placeholder="c₁" placeholderTextColor={colors.textSecondary} />
                  <Text style={styles.eqSep}>z =</Text>
                  <TextInput style={styles.eqInput} value={d1_3} onChangeText={setD1_3} keyboardType="decimal-pad" placeholder="d₁" placeholderTextColor={colors.textSecondary} />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputLabel}>
                  <Text style={styles.inputLabel}>Equation 2: a₂x + b₂y + c₂z = d₂</Text>
                </View>
                <View style={styles.eqRow}>
                  <TextInput style={styles.eqInput} value={a2_3} onChangeText={setA2_3} keyboardType="decimal-pad" placeholder="a₂" placeholderTextColor={colors.textSecondary} />
                  <Text style={styles.eqSep}>x +</Text>
                  <TextInput style={styles.eqInput} value={b2_3} onChangeText={setB2_3} keyboardType="decimal-pad" placeholder="b₂" placeholderTextColor={colors.textSecondary} />
                  <Text style={styles.eqSep}>y +</Text>
                  <TextInput style={styles.eqInput} value={c2_3} onChangeText={setC2_3} keyboardType="decimal-pad" placeholder="c₂" placeholderTextColor={colors.textSecondary} />
                  <Text style={styles.eqSep}>z =</Text>
                  <TextInput style={styles.eqInput} value={d2_3} onChangeText={setD2_3} keyboardType="decimal-pad" placeholder="d₂" placeholderTextColor={colors.textSecondary} />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputLabel}>
                  <Text style={styles.inputLabel}>Equation 3: a₃x + b₃y + c₃z = d₃</Text>
                </View>
                <View style={styles.eqRow}>
                  <TextInput style={styles.eqInput} value={a3_3} onChangeText={setA3_3} keyboardType="decimal-pad" placeholder="a₃" placeholderTextColor={colors.textSecondary} />
                  <Text style={styles.eqSep}>x +</Text>
                  <TextInput style={styles.eqInput} value={b3_3} onChangeText={setB3_3} keyboardType="decimal-pad" placeholder="b₃" placeholderTextColor={colors.textSecondary} />
                  <Text style={styles.eqSep}>y +</Text>
                  <TextInput style={styles.eqInput} value={c3_3} onChangeText={setC3_3} keyboardType="decimal-pad" placeholder="c₃" placeholderTextColor={colors.textSecondary} />
                  <Text style={styles.eqSep}>z =</Text>
                  <TextInput style={styles.eqInput} value={d3_3} onChangeText={setD3_3} keyboardType="decimal-pad" placeholder="d₃" placeholderTextColor={colors.textSecondary} />
                </View>
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label={mode === '2x2' ? "📏 SOLVE 2×2 SYSTEM" : "⚡ SOLVE 3×3 SYSTEM"}
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

              <FinalAnswer label="🎯 Solution" shareText={solution.shareText}>
                {solution.x !== null && solution.x !== undefined ? (
                  <View>
                    <Text style={styles.finalText}>
                      x = {solution.x.toFixed(mode === '3x3' ? 6 : 4)}
                    </Text>
                    <Text style={styles.finalText}>
                      y = {solution.y.toFixed(mode === '3x3' ? 6 : 4)}
                    </Text>
                    {mode === '3x3' && (
                      <Text style={styles.finalText}>
                        z = {solution.z.toFixed(6)}
                      </Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.finalText}>
                    {solution.error || solution.result || 'No solution found'}
                  </Text>
                )}
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
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  modeTextActive: {
    color: colors.accent,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.purpleGlow,
    alignSelf: 'flex-start',
    marginVertical: 6,
    width: '100%',
  },
  resultText: {
    color: colors.purpleGlow,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '700',
  },
  formulaBox: {
    backgroundColor: colors.accentBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    alignSelf: 'flex-start',
    marginVertical: 6,
    width: '100%',
  },
  formulaText: {
    color: colors.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    fontWeight: '700',
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
  finalText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 32,
  },
});