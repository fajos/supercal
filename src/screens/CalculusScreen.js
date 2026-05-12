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

export default function CalculusScreen() {
  const [mode, setMode] = useState('derivative');
  const [expression, setExpression] = useState('x^3 + 2x^2 - 5x + 1');
  const [variable, setVariable] = useState('x');
  const [point, setPoint] = useState('2');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  // Symbolic derivative calculator with steps
  const symbolicDerivative = (expr, varName = 'x') => {
    const steps = [];
    let processed = expr.replace(/\s/g, '');

    steps.push({
      type: 'text',
      text: `Computing derivative d/d${varName}[${expr}]`,
    });

    // Parse terms
    const terms = [];
    let currentTerm = '';
    let depth = 0;

    for (let i = 0; i < processed.length; i++) {
      const ch = processed[i];
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if ((ch === '+' || ch === '-') && depth === 0 && currentTerm.length > 0) {
        terms.push(currentTerm);
        currentTerm = ch;
      } else {
        currentTerm += ch;
      }
    }
    if (currentTerm) terms.push(currentTerm);

    steps.push({
      type: 'text',
      text: `Breaking into terms: ${terms.join('  +  ')}`,
    });

    // Differentiate each term
    const powerRule = (term) => {
      // Match ax^n
      const match = term.match(/^(-?\d*\.?\d*)\*?x\^?(\d*\.?\d*)?$/);
      if (match) {
        const coef = match[1] === '' || match[1] === '-' ? (match[1] === '-' ? -1 : 1) : parseFloat(match[1]);
        const exp = match[2] === '' ? 1 : parseFloat(match[2] || '1');
        const newCoef = coef * exp;
        const newExp = exp - 1;
        if (newExp === 0) return `${newCoef}`;
        if (newExp === 1) return `${newCoef}x`;
        return `${newCoef}x^${newExp}`;
      }
      // Constant
      if (!term.includes(varName)) return '0';
      return term; // Keep as is for unsupported
    };

    const derivatives = terms.map(term => {
      const result = powerRule(term);
      steps.push({
        type: 'text',
        text: `  d/dx[${term}] = ${result}`,
      });
      return result;
    });

    // Combine
    let combined = derivatives.filter(d => d !== '0').join(' + ');
    if (!combined) combined = '0';
    combined = combined.replace(/\+\s*-/g, '- ').replace(/1x/g, 'x');

    steps.push({
      type: 'highlight',
      text: `Result: f'(x) = ${combined}`,
    });

    return { derivative: combined, steps };
  };

  // Numerical integration using Simpson's rule
  const numericalIntegral = (expr, varName = 'x', lower = 0, upper = 1, n = 1000) => {
    const steps = [];
    
    const evalExpr = (expr, x) => {
      let processed = expr
        .replace(/\^/g, '**')
        .replace(new RegExp(varName, 'g'), `(${x})`)
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/pi/g, 'Math.PI')
        .replace(/e(?![xp])/g, 'Math.E');
      try {
        return eval(processed);
      } catch {
        return NaN;
      }
    };

    steps.push({
      type: 'text',
      text: `Numerically integrating ∫[${lower} to ${upper}] (${expr}) d${varName}`,
    });
    steps.push({
      type: 'text',
      text: `Using Simpson's Rule with n = ${n} subintervals`,
    });

    const h = (upper - lower) / n;
    let sum = evalExpr(expr, lower) + evalExpr(expr, upper);

    for (let i = 1; i < n; i++) {
      const x = lower + i * h;
      const weight = i % 2 === 0 ? 2 : 4;
      sum += weight * evalExpr(expr, x);
    }

    const integral = (h / 3) * sum;

    steps.push({
      type: 'text',
      text: `Step size h = (${upper} − ${lower}) / ${n} = ${h.toFixed(6)}`,
    });
    steps.push({
      type: 'highlight',
      text: `∫[${lower}, ${upper}] f(x)dx ≈ ${integral.toFixed(6)}`,
    });

    return { value: integral, steps };
  };

  const handleCalculate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);
    setResult(null);

    try {
      if (mode === 'derivative') {
        const derivResult = symbolicDerivative(expression, variable);
        const evalPoint = parseFloat(point);
        let pointValue = null;

        if (!isNaN(evalPoint)) {
          const evalExpr = (expr, x) => {
            let processed = expr
              .replace(/\^/g, '**')
              .replace(new RegExp(variable, 'g'), `(${x})`)
              .replace(/sin/g, 'Math.sin')
              .replace(/cos/g, 'Math.cos')
              .replace(/tan/g, 'Math.tan');
            try { return eval(processed); } catch { return NaN; }
          };
          pointValue = evalExpr(derivResult.derivative.replace(/\s/g, ''), evalPoint);
          derivResult.steps.push({
            type: 'highlight',
            text: `\nAt ${variable} = ${evalPoint}: f'(${evalPoint}) = ${pointValue.toFixed(6)}`,
          });
        }

        setResult({
          type: 'derivative',
          expression: derivResult.derivative,
          pointValue,
          steps: [{ step: 'DIFFERENTIATION', badge: 'primary', content: derivResult.steps }],
        });

        addToHistory({
          type: 'calculus',
          input: { mode: 'derivative', expression, variable, point },
          result: { derivative: derivResult.derivative, pointValue },
          timestamp: new Date().toISOString(),
        });

      } else if (mode === 'integral') {
        const lower = parseFloat(point) || 0;
        const upper = 5; // Default upper bound
        const intResult = numericalIntegral(expression, variable, lower, upper);

        setResult({
          type: 'integral',
          value: intResult.value,
          lower,
          upper,
          steps: [{ step: 'INTEGRATION', badge: 'primary', content: intResult.steps }],
        });

        addToHistory({
          type: 'calculus',
          input: { mode: 'integral', expression, variable, lower, upper },
          result: { value: intResult.value },
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>📐 Calculus</Text>
          <Text style={styles.subtitle}>Derivatives & Definite Integrals</Text>
        </View>

        <View style={styles.inputCard}>
          {/* Mode Toggle */}
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'derivative' && styles.modeBtnActive]}
              onPress={() => { Haptics.selectionAsync(); setMode('derivative'); setResult(null); }}
            >
              <Text style={[styles.modeText, mode === 'derivative' && styles.modeTextActive]}>
                d/dx Derivative
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'integral' && styles.modeBtnActive]}
              onPress={() => { Haptics.selectionAsync(); setMode('integral'); setResult(null); }}
            >
              <Text style={[styles.modeText, mode === 'integral' && styles.modeTextActive]}>
                ∫ Integral
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>
            {mode === 'derivative' ? 'Function f(x) =' : 'Integrand f(x) ='}
          </Text>
          <TextInput
            style={styles.exprInput}
            value={expression}
            onChangeText={setExpression}
            placeholder="e.g., x^3 + 2x^2 - 5x + 1"
            placeholderTextColor={colors.textSecondary}
          />

          <View style={styles.varRow}>
            <View style={styles.varItem}>
              <Text style={styles.varLabel}>Variable</Text>
              <TextInput
                style={styles.varInput}
                value={variable}
                onChangeText={setVariable}
                maxLength={1}
              />
            </View>
            <View style={styles.varItem}>
              <Text style={styles.varLabel}>
                {mode === 'derivative' ? 'Evaluate at' : 'Lower bound'}
              </Text>
              <TextInput
                style={styles.varInput}
                value={point}
                onChangeText={setPoint}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.solveBtn} onPress={handleCalculate} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>
              {mode === 'derivative' ? '📐 DIFFERENTIATE' : '📐 INTEGRATE'}
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

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
              label={result.type === 'derivative' ? '📐 Derivative' : '📐 Definite Integral'}
            >
              {result.type === 'derivative' && (
                <View>
                  <Text style={styles.finalExpr}>
                    f'({variable}) = {result.expression}
                  </Text>
                  {result.pointValue !== null && (
                    <Text style={styles.finalPoint}>
                      f'({point}) = {result.pointValue.toFixed(6)}
                    </Text>
                  )}
                </View>
              )}
              {result.type === 'integral' && (
                <View>
                  <Text style={styles.finalExpr}>
                    ∫[{result.lower}, {result.upper}] f(x)dx
                  </Text>
                  <Text style={styles.finalPoint}>
                    = {result.value.toFixed(6)}
                  </Text>
                </View>
              )}
            </FinalAnswer>
          </View>
        )}

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>💡 Examples</Text>
          <Text style={styles.helpText}>• Polynomials: x^3, 2x^2 - 5x + 1</Text>
          <Text style={styles.helpText}>• Trig: sin(x), cos(2x)</Text>
          <Text style={styles.helpText}>• Exponential: e^x, 2^x</Text>
          <Text style={styles.helpText}>• Log: log(x), ln(x)</Text>
        </View>
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
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  inputCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  exprInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 16,
    textAlign: 'center',
  },
  varRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  varItem: { flex: 1 },
  varLabel: { color: colors.textSecondary, fontSize: 11, marginBottom: 4, textAlign: 'center' },
  varInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.white,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 12,
    textAlign: 'center',
  },
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
  finalExpr: {
    color: colors.white,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 28,
  },
  finalPoint: {
    color: colors.accentGlow,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 8,
  },
  helpCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
  },
  helpTitle: { color: colors.white, fontSize: 16, fontWeight: '600', marginBottom: 10 },
  helpText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 22,
  },
});