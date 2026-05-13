import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { useHistory } from '../utils/history';
import { solveDeterminant, solveInverse, solveEigenvalues, solveTranspose } from '../solvers/matrixSolver';
import { BackHeader } from '../components/BackHeader';

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

  // Calculate determinant with steps
  const calculateDeterminant = (matrix) => {
    const n = matrix.length;
    const steps = [];

    if (n === 1) {
      return { value: matrix[0][0], steps: [{ type: 'text', text: `det = ${matrix[0][0]}` }] };
    }

    if (n === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      steps.push({
        type: 'text',
        text: `For 2×2 matrix: det = a₁₁×a₂₂ − a₁₂×a₂₁`,
      });
      steps.push({
        type: 'text',
        text: `det = (${matrix[0][0]})×(${matrix[1][1]}) − (${matrix[0][1]})×(${matrix[1][0]})`,
      });
      steps.push({
        type: 'highlight',
        text: `det = ${matrix[0][0] * matrix[1][1]} − ${matrix[0][1] * matrix[1][0]} = ${det}`,
      });
      return { value: det, steps };
    }

    // For n≥3, use cofactor expansion along first row
    steps.push({
      type: 'text',
      text: `Using cofactor expansion along first row for ${n}×${n} matrix:`,
    });

    let det = 0;
    for (let j = 0; j < n; j++) {
      const sign = j % 2 === 0 ? '+' : '−';
      const cofactor = matrix[0][j];
      const subMatrix = [];
      for (let i = 1; i < n; i++) {
        subMatrix.push(matrix[i].filter((_, idx) => idx !== j));
      }
      const subDet = calculateDeterminant(subMatrix);
      const contribution = sign === '+' ? cofactor * subDet.value : -cofactor * subDet.value;
      det += contribution;

      steps.push({
        type: 'text',
        text: `${sign} ${cofactor} × det(minor₁${j + 1}) = ${sign} ${cofactor} × ${subDet.value.toFixed(4)}`,
      });
    }

    steps.push({
      type: 'highlight',
      text: `det = ${det.toFixed(6)}`,
    });

    return { value: det, steps };
  };

  // Calculate inverse with steps
  const calculateInverse = (matrix) => {
    const n = matrix.length;
    const steps = [];
    const detResult = calculateDeterminant(matrix);
    
    if (Math.abs(detResult.value) < 1e-10) {
      throw new Error('Matrix is singular (determinant = 0). Inverse does not exist.');
    }

    steps.push({
      type: 'text',
      text: 'Step 1: Calculate determinant',
    });
    steps.push(...detResult.steps);
    steps.push({
      type: 'text',
      text: `\nStep 2: Find matrix of cofactors`,
    });

    const cofactors = [];
    for (let i = 0; i < n; i++) {
      cofactors[i] = [];
      for (let j = 0; j < n; j++) {
        const subMatrix = [];
        for (let r = 0; r < n; r++) {
          if (r !== i) {
            subMatrix.push(matrix[r].filter((_, c) => c !== j));
          }
        }
        const subDet = calculateDeterminant(subMatrix);
        cofactors[i][j] = ((i + j) % 2 === 0 ? 1 : -1) * subDet.value;
      }
    }

    steps.push({
      type: 'text',
      text: 'Step 3: Transpose cofactor matrix (adjugate)',
    });
    steps.push({
      type: 'text',
      text: `Step 4: Divide adjugate by determinant (${detResult.value.toFixed(4)})`,
    });

    const inverse = [];
    for (let i = 0; i < n; i++) {
      inverse[i] = [];
      for (let j = 0; j < n; j++) {
        inverse[i][j] = cofactors[j][i] / detResult.value;
      }
    }

    return { matrix: inverse, steps, det: detResult.value };
  };

    // Calculate eigenvalues (for 2×2 and 3×3 using characteristic polynomial)
  const calculateEigenvalues = (matrix) => {
    const n = matrix.length;
    const steps = [];

    if (n === 2) {
      const a = matrix[0][0];
      const b = matrix[0][1];
      const c = matrix[1][0];
      const d = matrix[1][1];
      const trace = a + d;
      const det = a * d - b * c;
      const discriminant = trace * trace - 4 * det;

      steps.push({
        type: 'text',
        text: 'Characteristic equation: λ² − trace·λ + det = 0',
      });
      steps.push({
        type: 'text',
        text: `λ² − (${trace})λ + (${det}) = 0`,
      });
      steps.push({
        type: 'text',
        text: `Discriminant = ${trace}² − 4(${det}) = ${discriminant.toFixed(4)}`,
      });

      let eigenvalues;
      if (discriminant >= 0) {
        const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
        const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
        eigenvalues = [lambda1, lambda2];
        steps.push({
          type: 'highlight',
          text: `λ₁ = ${lambda1.toFixed(4)}, λ₂ = ${lambda2.toFixed(4)}`,
        });
      } else {
        const realPart = trace / 2;
        const imagPart = Math.sqrt(-discriminant) / 2;
        eigenvalues = [
          `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`,
          `${realPart.toFixed(4)} − ${imagPart.toFixed(4)}i`,
        ];
        steps.push({
          type: 'highlight',
          text: `λ₁ = ${eigenvalues[0]}, λ₂ = ${eigenvalues[1]} (complex)`,
        });
      }

      return { eigenvalues, steps };
    }

    // For 3×3, use numerical method (power iteration approximation)
    steps.push({
      type: 'text',
      text: 'For 3×3 matrices, computing eigenvalues numerically...',
    });

    // Characteristic polynomial coefficients
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[0][2];
    const d = matrix[1][0];
    const e = matrix[1][1];
    const f = matrix[1][2];
    const g = matrix[2][0];
    const h = matrix[2][1];
    const i = matrix[2][2];

    const trace = a + e + i;
    const det2 = a*e - b*d + a*i - c*g + e*i - f*h;
    const det3 = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);

    steps.push({
      type: 'text',
      text: `Characteristic: λ³ − ${trace}λ² + ${det2.toFixed(2)}λ − ${det3.toFixed(2)} = 0`,
    });

    // Solve cubic using Newton's method
    const f_cubic = (x) => {
      return -(x ** 3) + trace * (x ** 2) - det2 * x + det3;
    };
    
    const f_prime = (x) => {
      return -3 * (x ** 2) + 2 * trace * x - det2;
    };

    const eigenvalues = [];
    const starters = [0, trace / 2, trace];

    for (const start of starters) {
      let x = start;
      let converged = false;
      
      for (let iter = 0; iter < 100; iter++) {
        const fx = f_cubic(x);
        const fpx = f_prime(x);
        
        if (Math.abs(fpx) < 1e-12) break;
        
        const x1 = x - fx / fpx;
        
        if (Math.abs(x1 - x) < 1e-10 && Math.abs(f_cubic(x1)) < 1e-8) {
          const rounded = Math.round(x1 * 10000) / 10000;
          // Check if this eigenvalue is already found (within tolerance)
          if (!eigenvalues.some(ev => Math.abs(ev - rounded) < 0.001)) {
            eigenvalues.push(rounded);
          }
          converged = true;
          break;
        }
        x = x1;
      }
      
      // If Newton didn't converge from this starting point, try next one
      if (!converged) continue;
    }

    // If we didn't find all 3 eigenvalues, note it
    if (eigenvalues.length < 3) {
      steps.push({
        type: 'text',
        text: `Note: Found ${eigenvalues.length} real eigenvalue(s). Complex eigenvalues may exist.`,
      });
    }

    if (eigenvalues.length > 0) {
      steps.push({
        type: 'highlight',
        text: `Eigenvalues: ${eigenvalues.map((v, idx) => `λ${idx + 1} = ${v.toFixed(4)}`).join(', ')}`,
      });
    } else {
      steps.push({
        type: 'text',
        text: 'Could not find real eigenvalues. Matrix may have only complex eigenvalues.',
      });
    }

    return { eigenvalues, steps };
  };

  const handleOperation = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  setError(null);
  setResult(null);

  try {
    const matrix = getMatrix();
    let solverResult;

    switch (operation) {
      case 'determinant':
        solverResult = solveDeterminant(matrix);
        setResult({
          type: 'determinant',
          value: solverResult.value,
          displayValue: solverResult.value.toFixed(6),
          steps: solverResult.steps,
        });
        break;

      case 'inverse':
        solverResult = solveInverse(matrix);
        setResult({
          type: 'inverse',
          matrix: solverResult.matrix,
          steps: solverResult.steps,
        });
        break;

      case 'eigenvalues':
        solverResult = solveEigenvalues(matrix);
        setResult({
          type: 'eigenvalues',
          eigenvalues: solverResult.eigenvalues,
          steps: solverResult.steps,
        });
        break;

      case 'transpose':
        solverResult = solveTranspose(matrix);
        setResult({
          type: 'transpose',
          matrix: solverResult.matrix,
          steps: solverResult.steps,
        });
        break;
    }

    addToHistory({
      type: 'matrix',
      input: { size, matrix, operation },
      result: solverResult,
      timestamp: new Date().toISOString(),
    });

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  } catch (err) {
    setError(err.message);
  }
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
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackHeader title="🧮 Matrix Operations" subtitle="Determinant, Inverse, Eigenvalues" />

        {/* Matrix Size */}
        <View style={styles.inputCard}>
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
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Enter values:</Text>
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
          <View style={styles.opRow}>
            {OPS.map((op) => (
              <TouchableOpacity
                key={op.value}
                style={[styles.opBtn, operation === op.value && styles.opBtnActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setOperation(op.value);
                }}
              >
                <Text style={styles.opIcon}>{op.icon}</Text>
                <Text style={[styles.opText, operation === op.value && styles.opTextActive]}>
                  {op.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.solveBtn} onPress={handleOperation} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>🧮 CALCULATE</Text>
          </TouchableOpacity>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.white, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4, letterSpacing: 0.3 },
  inputCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, letterSpacing: 0.3 },
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
  inputRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  matrixInput: {
    width: 55,
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
  opRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opBtn: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 14,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
  },
  opBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  opIcon: { fontSize: 18 },
  opText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  opTextActive: { color: colors.accentGlow, fontWeight: '600' },
  solveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  solveBtnText: { color: colors.black, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  errorCard: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  resultArea: { gap: 0 },
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