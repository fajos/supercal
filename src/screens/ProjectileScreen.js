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
            {/* Operation Selector */}
            <View style={styles.operationGrid}>
              <TouchableOpacity
                style={[
                  styles.operationBtn,
                  mode === 'groundLaunch' && styles.operationBtnActive,
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setMode('groundLaunch');
                  setResult(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.operationSymbol,
                  mode === 'groundLaunch' && styles.operationSymbolActive,
                ]}>
                  🚀
                </Text>
                <Text style={[
                  styles.operationLabel,
                  mode === 'groundLaunch' && styles.operationLabelActive,
                ]} numberOfLines={1} adjustsFontSizeToFit>
                  Ground
                </Text>
                <Text style={[
                  styles.operationLabel,
                  mode === 'groundLaunch' && styles.operationLabelActive,
                ]} numberOfLines={1} adjustsFontSizeToFit>
                  Launch
                </Text>
                <Text style={[
                  styles.operationFormula,
                  mode === 'groundLaunch' && styles.operationFormulaActive,
                ]} numberOfLines={1} adjustsFontSizeToFit>
                  ∠ θ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.operationBtn,
                  mode === 'horizontalLaunch' && styles.operationBtnActive,
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setMode('horizontalLaunch');
                  setResult(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.operationSymbol,
                  mode === 'horizontalLaunch' && styles.operationSymbolActive,
                ]}>
                  📐
                </Text>
                <Text style={[
                  styles.operationLabel,
                  mode === 'horizontalLaunch' && styles.operationLabelActive,
                ]} numberOfLines={1} adjustsFontSizeToFit>
                  Horizontal
                </Text>
                <Text style={[
                  styles.operationLabel,
                  mode === 'horizontalLaunch' && styles.operationLabelActive,
                ]} numberOfLines={1} adjustsFontSizeToFit>
                  Launch
                </Text>
                <Text style={[
                  styles.operationFormula,
                  mode === 'horizontalLaunch' && styles.operationFormulaActive,
                ]} numberOfLines={1} adjustsFontSizeToFit>
                  vₓ
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Input Parameters</Text>

            <Text style={styles.inputLabel}>Initial Velocity, u (m/s):</Text>
            <TextInput 
              style={styles.input} 
              value={velocity} 
              onChangeText={setVelocity} 
              keyboardType="decimal-pad" 
              placeholder="Enter velocity"
              placeholderTextColor={colors.textSecondary} 
            />

            {mode === 'groundLaunch' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Launch Angle, θ (degrees):</Text>
                <TextInput 
                  style={styles.input} 
                  value={angle} 
                  onChangeText={setAngle} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter angle (0-90°)"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            )}

            {mode === 'horizontalLaunch' && (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Initial Height, h (meters):</Text>
                <TextInput 
                  style={styles.input} 
                  value={height} 
                  onChangeText={setHeight} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter height"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              label="🎯 LAUNCH PROJECTILE"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {result && (
            <View style={styles.solutionArea}>
              {result.steps.map((step, idx) => (
                <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                  {step.content.map((item, i) => {
                    switch (item.type) {
                      case 'formula':
                        return (
                          <View key={i} style={styles.formulaBox}>
                            <Text style={styles.formulaText}>{item.text}</Text>
                          </View>
                        );
                      case 'highlight':
                        return (
                          <Text key={i} style={styles.highlightText}>
                            {item.text}
                          </Text>
                        );
                      case 'result':
                        return (
                          <View key={i} style={styles.resultBox}>
                            <Text style={styles.resultText}>{item.text}</Text>
                          </View>
                        );
                      case 'badge':
                        return (
                          <View key={i} style={styles.inlineBadge}>
                            <Text style={styles.inlineBadgeText}>{item.text}</Text>
                          </View>
                        );
                      default:
                        return (
                          <Text key={i} style={styles.stepText}>
                            {item.text}
                          </Text>
                        );
                    }
                  })}
                </StepCard>
              ))}
              <FinalAnswer
                label="🎯 Range Result"
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
  container: { 
    flex: 1, 
    backgroundColor: colors.bgPrimary 
  },
  flex: { 
    flex: 1 
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 40, 
    alignItems: 'center' 
  },
  headerContainer: { 
    width: '100%', 
    maxWidth: 800 
  },
  tabletInputCard: {
    maxWidth: 600,
    width: '100%',
  },
  solutionArea: { 
    gap: 0, 
    width: '100%', 
    maxWidth: 800 
  },
  
  // Operation Grid Styles
  operationGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  operationBtn: {
    flex: 1,
    maxWidth: 160,
    aspectRatio: 0.9,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  operationBtnActive: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accent,
    borderWidth: 2,
  },
  operationSymbol: {
    fontSize: 28,
    marginBottom: 6,
  },
  operationSymbolActive: {
    // Emoji stays the same
  },
  operationLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  operationLabelActive: {
    color: colors.accentGlow,
    fontWeight: '700',
  },
  operationFormula: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.6,
  },
  operationFormulaActive: {
    color: colors.accent,
    opacity: 0.9,
  },
  
  // Section Label
  sectionLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Input Styles
  inputLabel: { 
    fontSize: 13, 
    color: colors.textSecondary, 
    marginBottom: 8 
  },
  input: { 
    backgroundColor: colors.bgInput, 
    borderWidth: 1.5, 
    borderColor: colors.border, 
    borderRadius: 14, 
    color: colors.white, 
    fontSize: 16, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    padding: 14, 
    textAlign: 'center' 
  },
  
  // Step Content Styles
  stepText: { 
    color: colors.textPrimary, 
    fontSize: 14, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    lineHeight: 22 
  },
  highlightText: { 
    color: colors.accentGlow, 
    fontSize: 14, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontWeight: '600', 
    lineHeight: 22 
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
  
  // Final Answer
  finalText: { 
    color: colors.white, 
    fontSize: 20, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontWeight: '700' 
  },
});