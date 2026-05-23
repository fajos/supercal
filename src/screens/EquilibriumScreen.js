// src/screens/EquilibriumScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { StepCard } from '../components/StepCard';
import { InputCard } from '../components/InputCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { ErrorCard } from '../components/ErrorCard';
import { SolveButton } from '../components/SolveButton';
import { solveEquilibrium } from '../solvers/equilibriumSolver';
import { BackHeader } from '../components/BackHeader';
import { storeValue, getMemory } from '../utils/memory';

export default function EquilibriumScreen() {
  const [mode, setMode] = useState('moment');
  const [force, setForce] = useState('10');
  const [distance, setDistance] = useState('2');
  const [angle, setAngle] = useState('90');

  // Lever mode
  const [force1, setForce1] = useState('50');
  const [dist1, setDist1] = useState('2');
  const [dist2, setDist2] = useState('4');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSaveToMemory = async (val) => {
    const success = await storeValue('last_physics_result', val.toString());
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRecallMemory = async (field) => {
    const memory = await getMemory();
    if (memory.last_physics_result) {
      const val = memory.last_physics_result;
      if (field === 'force') setForce(val);
      if (field === 'distance') setDistance(val);
      if (field === 'angle') setAngle(val);
      if (field === 'force1') setForce1(val);
      if (field === 'dist1') setDist1(val);
      if (field === 'dist2') setDist2(val);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSolve = () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);

    setTimeout(() => {
      try {
        const params = {
          force: parseFloat(force) || 0,
          distance: parseFloat(distance) || 0,
          angle: parseFloat(angle) || 90,
          force1: parseFloat(force1) || 0,
          dist1: parseFloat(dist1) || 0,
          dist2: parseFloat(dist2) || 1,
        };
        const solverResult = solveEquilibrium(mode, params);
        setResult(solverResult);
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
      if (item.type === 'highlight') return <Text key={idx} style={styles.highlightText}>{item.text}</Text>;
      if (item.type === 'formula') return <Text key={idx} style={styles.formulaText}>{item.text}</Text>;
      return <Text key={idx} style={styles.stepText}>{item.text}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <BackHeader title="⚖️ Equilibrium" subtitle="Moments & Levers" />
          </View>

          <InputCard>
            <View style={styles.modeGrid}>
              {[
                { id: 'moment', label: 'Moment' },
                { id: 'lever', label: 'Lever' },
              ].map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.modeBtn, mode === m.id && styles.modeBtnActive]}
                  onPress={() => { setMode(m.id); setResult(null); }}
                >
                  <Text style={[styles.modeText, mode === m.id && styles.modeTextActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {mode === 'moment' ? (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Force (F) N:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('force')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={force} onChangeText={setForce} keyboardType="decimal-pad" />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Distance from pivot (d) m:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('distance')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={distance} onChangeText={setDistance} keyboardType="decimal-pad" />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Angle (θ) degrees:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('angle')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={angle} onChangeText={setAngle} keyboardType="decimal-pad" />
              </>
            ) : (
              <>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Effort/Force 1 (F1) N:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('force1')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={force1} onChangeText={setForce1} keyboardType="decimal-pad" />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Distance 1 (d1) m:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('dist1')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={dist1} onChangeText={setDist1} keyboardType="decimal-pad" />

                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Distance 2 (d2) m:</Text>
                  <TouchableOpacity onPress={() => handleRecallMemory('dist2')}>
                    <Text style={styles.recallBtn}>Recall MR</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.input} value={dist2} onChangeText={setDist2} keyboardType="decimal-pad" />
              </>
            )}

            <SolveButton
              onPress={handleSolve}
              loading={loading}
              label="⚖️ CALCULATE"
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
              <FinalAnswer label="⚖️ Result">
                <View style={styles.finalResultRow}>
                  <Text style={styles.finalText}>{result.result}</Text>
                  <TouchableOpacity
                    style={styles.memoryBtn}
                    onPress={() => handleSaveToMemory(result.result)}
                  >
                    <Ionicons name="save-outline" size={18} color={colors.accent} />
                    <Text style={styles.memoryBtnText}>M+</Text>
                  </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
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
    minWidth: '40%',
    flex: 1,
  },
  modeBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  modeText: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  modeTextActive: { color: colors.accentGlow, fontWeight: '600' },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  inputLabel: { fontSize: 13, color: colors.textSecondary, letterSpacing: 0.3 },
  recallBtn: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
  formulaText: {
    color: '#ffd93d',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
    marginVertical: 4,
  },
  finalText: {
    color: colors.white,
    fontSize: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    lineHeight: 32,
  },
  finalResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  memoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  memoryBtnText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});
