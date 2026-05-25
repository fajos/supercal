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
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { useHistory } from '../utils/history';
import { solveDeterminant, solveInverse, solveEigenvalues, solveTranspose } from '../solvers/matrixSolver';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { ModeChip } from '../components/ModeChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function MatrixScreen() {
  const [matrixSize, setMatrixSize] = useState('3');
  const [matrixValues, setMatrixValues] = useState({
    '0-0': '2', '0-1': '1', '0-2': '1',
    '1-0': '1', '1-1': '3', '1-2': '2',
    '2-0': '1', '2-1': '0', '2-2': '0',
  });
  const [operation, setOperation] = useState('determinant');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const size = parseInt(matrixSize) || 3;

  const getMatrix = () => {
    const matrix = [];
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        matrix[i][j] = parseFloat(matrixValues[`${i}-${j}`]) || 0;
      }
    }
    return matrix;
  };

  const handleOperation = () => {
    setError(null);
    setResult(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const matrix = getMatrix();
        let solverResult;
        let resData = {};

        switch (operation) {
          case 'determinant':
            solverResult = solveDeterminant(matrix);
            resData = {
              type: 'determinant',
              value: solverResult.value,
              displayValue: solverResult.value.toFixed(6),
              steps: solverResult.steps,
              resStr: solverResult.value.toFixed(6)
            };
            break;

          case 'inverse':
            solverResult = solveInverse(matrix);
            resData = {
              type: 'inverse',
              matrix: solverResult.matrix,
              steps: solverResult.steps,
              resStr: 'Matrix Inverse calculated'
            };
            break;

          case 'eigenvalues':
            solverResult = solveEigenvalues(matrix);
            resData = {
              type: 'eigenvalues',
              eigenvalues: solverResult.eigenvalues,
              steps: solverResult.steps,
              resStr: solverResult.eigenvalues.join(', ')
            };
            break;

          case 'transpose':
            solverResult = solveTranspose(matrix);
            resData = {
              type: 'transpose',
              matrix: solverResult.matrix,
              steps: solverResult.steps,
              resStr: 'Matrix Transpose calculated'
            };
            break;
        }

        const shareText = `Matrix Operation (${operation}):\nInput: ${matrixSize}x${matrixSize} Matrix\nResult: ${resData.resStr}\n\nSolved with SuperCalc`;

        setResult({ ...resData, shareText });

        addToHistory({
          type: 'matrix',
          input: { size, matrix, operation },
          result: solverResult,
          timestamp: new Date().toISOString(),
        });

        setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const updateMatrixValue = (row, col, value) => {
    setMatrixValues(prev => ({ ...prev, [`${row}-${col}`]: value }));
  };

  const renderMatrixDisplay = (matrix, highlight = false) => {
    return (
      <View style={styles.matrixDisplay}>
        {matrix.map((row, i) => (
          <View key={i} style={styles.matrixRow}>
            {row.map((val, j) => (
              <View key={j} style={[styles.matrixCell, highlight && styles.matrixCellHighlight]}>
                <Text style={[styles.matrixCellText, highlight && styles.matrixCellTextHighlight]}>
                  {typeof val === 'number' ? val.toFixed(4) : val}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const OPS = [
    { label: 'det(A)', value: 'determinant', icon: '🔢' },
    { label: 'A⁻¹', value: 'inverse', icon: '🔄' },
    { label: 'Eigenvalues λ', value: 'eigenvalues', icon: '📊' },
    { label: 'Aᵀ', value: 'transpose', icon: '↔️' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.headerContainer}>
          <BackHeader title="🧮 Matrix Operations" subtitle="Determinant, Inverse, Eigenvalues" />
        </View>

        {/* Matrix Size */}
        <InputCard style={isTablet && styles.tabletInputCard}>
          <Text style={styles.inputLabel}>Matrix Size (n × n):</Text>
          <TextInput
            style={styles.sizeInput}
            value={matrixSize}
            onChangeText={setMatrixSize}
            keyboardType="number-pad"
            placeholder="3"
            placeholderTextColor={colors.textSecondary}
          />

          {/* Matrix Grid */}
          <Text style={[styles.inputLabel, { marginTop: 16, marginBottom: 8 }]}>Enter values:</Text>
          <View style={styles.matrixInputGrid}>
            {Array.from({ length: size }, (_, i) => (
              <View key={i} style={styles.inputRow}>
                {Array.from({ length: size }, (_, j) => (
                  <TextInput
                    key={`${i}-${j}`}
                    style={styles.matrixInput}
                    value={matrixValues[`${i}-${j}`] || ''}
                    onChangeText={(text) => updateMatrixValue(i, j, text)}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                  />
                ))}
              </View>
            ))}
          </View>

          {/* Operation Selector */}
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Operation:</Text>
          <View style={styles.opGrid}>
            {OPS.map((op) => (
              <ModeChip
                key={op.value}
                label={op.label}
                icon={op.icon}
                active={operation === op.value}
                onPress={() => {
                  Haptics.selectionAsync();
                  setOperation(op.value);
                  setResult(null);
                }}
                style={styles.opBtn}
              />
            ))}
          </View>

          <SolveButton
            onPress={handleOperation}
            label="🧮 CALCULATE"
            loading={loading}
          />
        </InputCard>

        <ErrorCard message={error} />

        {/* Results */}
        {result && (
          <View style={styles.resultArea}>
            {result.steps.map((step, idx) => (
              <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                {step.content.map((item, i) => {
                  if (item.type === 'highlight') {
                    return <Text key={i} style={styles.highlightText}>{item.text}</Text>;
                  }
                  return <Text key={i} style={styles.stepText}>{item.text}</Text>;
                })}
              </StepCard>
            ))}

            <FinalAnswer
              shareText={result.shareText}
              label={
                result.type === 'determinant' ? '🔢 Determinant' :
                result.type === 'inverse' ? '🔄 Inverse Matrix' :
                result.type === 'eigenvalues' ? '📊 Eigenvalues' :
                '↔️ Transpose'
              }
            >
              {result.type === 'determinant' && (
                <Text style={styles.finalValue}>{result.displayValue}</Text>
              )}
              {(result.type === 'inverse' || result.type === 'transpose') && (
                renderMatrixDisplay(result.matrix, true)
              )}
              {result.type === 'eigenvalues' && (
                <View>
                  {result.eigenvalues.map((val, idx) => (
                    <Text key={idx} style={styles.finalValue}>
                      λ{idx + 1} = {typeof val === 'string' ? val : val.toFixed(6)}
                    </Text>
                  ))}
                </View>
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
  resultArea: {
    gap: 0,
    width: '100%',
    maxWidth: 800,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, letterSpacing: 0.3 },
  sizeInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 14,
    textAlign: 'center',
    width: 80,
  },
  matrixInputGrid: { gap: 8, marginTop: 8 },
  inputRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', flexWrap: 'wrap' },
  matrixInput: {
    width: 65,
    height: 44,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    color: colors.white,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
  opGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  opBtn: {
    minWidth: '45%',
    flex: 1,
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
  finalValue: {
    color: colors.white,
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 36,
  },
  matrixDisplay: { gap: 4 },
  matrixRow: { flexDirection: 'row', gap: 4, justifyContent: 'center' },
  matrixCell: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.bgInput,
    borderRadius: 8,
    minWidth: 55,
    alignItems: 'center',
  },
  matrixCellHighlight: { backgroundColor: colors.accentBg },
  matrixCellText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  matrixCellTextHighlight: { color: colors.accent, fontWeight: '600' },
});