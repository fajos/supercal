import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { InputCard } from '../components/InputCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveDynamics } from '../solvers/dynamicsSolver';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';
import { useHistory } from '../utils/history';
import { ModeChip } from '../components/ModeChip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function DynamicsScreen() {
  const [mode, setMode] = useState('newton2');
  const [mass, setMass] = useState('10');
  const [force, setForce] = useState('50');
  const [friction, setFriction] = useState('0.3');
  const [angle, setAngle] = useState('30');
  const [velocity, setVelocity] = useState('5');
  const [time, setTime] = useState('2');
  const [distance, setDistance] = useState('10');
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
          mass: parseFloat(mass) || 0,
          force: parseFloat(force) || 0,
          friction: parseFloat(friction) || 0,
          angle: parseFloat(angle) || 0,
          gravity: 9.81,
          velocity: parseFloat(velocity) || 0,
          time: parseFloat(time) || 0,
          distance: parseFloat(distance) || 0,
        };
        const solverResult = solveDynamics(mode, params);

        const modeLabels = {
          newton2: "Newton's 2nd Law",
          friction: 'Friction',
          inclinedPlane: 'Inclined Plane',
          momentum: 'Momentum',
          weight: 'Weight'
        };

        const shareText = `Dynamics Result (${modeLabels[mode]}):\nInput: ${JSON.stringify(params)}\nResult: ${solverResult.result}\n\nSolved with SuperCalc`;

        setResult({ ...solverResult, shareText });

        addToHistory({
          type: 'dynamics',
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

  // Operation buttons configuration with symbols
  const operations = [
    { id: 'newton2', label: '2nd Law', symbol: 'F=ma' },
    { id: 'friction', label: 'Friction', symbol: 'μ' },
    { id: 'inclinedPlane', label: 'Incline', symbol: '∠' },
    { id: 'momentum', label: 'Momentum', symbol: 'p' },
    { id: 'weight', label: 'Weight', symbol: 'W' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="💪 Dynamics" subtitle="Forces, Friction & Newton's Laws" />
          </View>

          <InputCard style={isTablet && styles.tabletInputCard}>
            {/* Operation Selector Grid */}
            <View style={styles.operationGrid}>
              {operations.map(op => (
                <TouchableOpacity
                  key={op.id}
                  style={[
                    styles.operationBtn,
                    mode === op.id && styles.operationBtnActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setMode(op.id);
                    setResult(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.operationSymbol,
                    mode === op.id && styles.operationSymbolActive,
                  ]}>
                    {op.symbol}
                  </Text>
                  <Text style={[
                    styles.operationLabel,
                    mode === op.id && styles.operationLabelActive,
                  ]} numberOfLines={1} adjustsFontSizeToFit>
                    {op.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Mass (kg):</Text>
            <TextInput 
              style={styles.input} 
              value={mass} 
              onChangeText={setMass} 
              keyboardType="decimal-pad" 
              placeholder="Enter mass"
              placeholderTextColor={colors.textSecondary} 
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>
              {mode === 'momentum' ? 'Force (N) − for impulse:' : 'Applied Force (N):'}
            </Text>
            <TextInput 
              style={styles.input} 
              value={force} 
              onChangeText={setForce} 
              keyboardType="decimal-pad" 
              placeholder="Enter force"
              placeholderTextColor={colors.textSecondary} 
            />

            {mode === 'friction' || mode === 'inclinedPlane' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Coefficient of Friction (μ):</Text>
                <TextInput 
                  style={styles.input} 
                  value={friction} 
                  onChangeText={setFriction} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter coefficient"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            ) : null}

            {mode === 'inclinedPlane' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Angle of Incline (degrees):</Text>
                <TextInput 
                  style={styles.input} 
                  value={angle} 
                  onChangeText={setAngle} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter angle"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            ) : null}

            {mode === 'momentum' ? (
              <>
                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Initial Velocity (m/s):</Text>
                <TextInput 
                  style={styles.input} 
                  value={velocity} 
                  onChangeText={setVelocity} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter velocity"
                  placeholderTextColor={colors.textSecondary} 
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>Time of Force Application (s):</Text>
                <TextInput 
                  style={styles.input} 
                  value={time} 
                  onChangeText={setTime} 
                  keyboardType="decimal-pad" 
                  placeholder="Enter time"
                  placeholderTextColor={colors.textSecondary} 
                />
              </>
            ) : null}

            <SolveButton
              onPress={handleSolve}
              label="💪 CALCULATE"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {result && (
            <View style={styles.solutionArea}>
              {result.steps.map((step, idx) => (
                <StepCard key={idx} step={step.step} badge={step.badge} index={idx}>
                  {renderContent(step.content)}
                </StepCard>
              ))}
              <FinalAnswer label="💪 Result" shareText={result.shareText}>
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
  
  // Operation Grid Styles
  operationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  operationBtn: {
    width: '18%', // 5 buttons per row
    minWidth: 60,
    aspectRatio: 1, // Makes it square
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  operationBtnActive: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accent,
  },
  operationSymbol: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  operationSymbolActive: {
    color: colors.accent,
  },
  operationLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  operationLabelActive: {
    color: colors.accentGlow,
    fontWeight: '600',
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
    fontSize: 22, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontWeight: '700' 
  },
});