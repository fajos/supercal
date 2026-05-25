// src/screens/ProjectileScreen.js
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
import { StepCard } from '../components/StepCard';
import { InputCard } from '../components/InputCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveProjectile } from '../solvers/projectileSolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { ModeChip } from '../components/ModeChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function ProjectileScreen() {
  const [mode, setMode] = useState('groundLaunch');
  const [velocity, setVelocity] = useState('25');
  const [angle, setAngle] = useState('45');
  const [height, setHeight] = useState('10');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const params = {
          velocity: parseFloat(velocity) || 0,
          angle: parseFloat(angle) || 0,
          height: parseFloat(height) || 0,
        };
        const solverResult = solveProjectile(mode, params);
        const opLabel = mode === 'groundLaunch' ? 'Ground Launch' : 'Horizontal Launch';
        const shareText = `Projectile Motion Result (${opLabel}):\nVelocity: ${params.velocity}m/s, Angle: ${params.angle}°, Height: ${params.height}m\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'projectile',
          mode,
          input: params,
          result: solverResult.result,
          timestamp: new Date().toISOString(),
        });

        setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
      } catch (err) {
        setError(err.message);
        setResult(null);
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="🎯 Projectile Motion" subtitle="Two-Dimensional Kinematics" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            <View style={styles.modeGrid}>
              {[
                { id: 'groundLaunch', label: 'Ground Launch' },
                { id: 'horizontalLaunch', label: 'Horizontal Launch' },
              ].map(m => (
                <ModeChip
                  key={m.id}
                  label={m.label}
                  active={mode === m.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setMode(m.id);
                    setResult(null);
                  }}
                  style={styles.modeBtn}
                />
              ))}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Initial Velocity (u) m/s:</Text>
            <TextInput style={styles.input} value={velocity} onChangeText={setVelocity} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />

            {mode === 'groundLaunch' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Launch Angle (θ) degrees:</Text>
                <TextInput style={styles.input} value={angle} onChangeText={setAngle} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            {mode === 'horizontalLaunch' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Initial Height (h) meters:</Text>
                <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🎯 CALCULATE"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {result && (
            <View style={styles.solutionArea}>
              {result.steps.map((step, idx) => (
                <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                  {step.content.map((item, i) => {
                    if (item.type === 'highlight') return <Text key={i} style={styles.highlightText}>{item.text}</Text>;
                    if (item.type === 'formula') return <Text key={i} style={styles.formulaText}>{item.text}</Text>;
                    return <Text key={i} style={styles.stepText}>{item.text}</Text>;
                  })}
                </StepCard>
              ))}
              <FinalAnswer
                label="🎯 Result"
                shareText={result.shareText}
              >
                <Text style={styles.finalText}>{result.result}</Text>
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
  flex: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: {
    maxWidth: 600,
    width: '100%',
  },
  solutionArea: { gap: 0, width: '100%', maxWidth: 800 },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '45%',
    flex: 1,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 14, textAlign: 'center' },
  stepText: { color: colors.textPrimary, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  highlightText: { color: colors.accentGlow, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', lineHeight: 22 },
  formulaText: { color: '#ffd93d', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700', lineHeight: 24, textAlign: 'center', marginVertical: 4 },
  finalText: { color: colors.white, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },
});