// src/screens/PhysicsScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const PHYSICS_SOLVERS = [
  {
    id: 'kinematics',
    title: 'Kinematics',
    icon: '🏃',
    description: 'Motion, velocity, acceleration',
    color: '#00d4aa',
    screen: 'KinematicsSolver',
    category: 'Mechanics',
  },
  {
    id: 'dynamics',
    title: 'Dynamics',
    icon: '💪',
    description: 'Forces, Newton\'s Laws, Friction',
    color: '#ff6b6b',
    screen: 'DynamicsSolver',
    category: 'Mechanics',
  },
  {
    id: 'energy',
    title: 'Energy & Work',
    icon: '⚡',
    description: 'Kinetic, Potential, Conservation',
    color: '#ffd93d',
    screen: 'EnergySolver',
    category: 'Mechanics',
  },
  {
    id: 'waves',
    title: 'Waves & Sound',
    icon: '🌊',
    description: 'Frequency, wavelength, speed',
    color: '#6c5ce7',
    screen: 'WavesSolver',
    category: 'Waves',
  },
  {
    id: 'circuits',
    title: 'Circuits',
    icon: '⚡',
    description: 'Ohm\'s Law, Series, Parallel',
    color: '#ff9f43',
    screen: 'CircuitsSolver',
    category: 'Electricity',
  },
];

const THEORIES = [
  {
    title: 'Newton\'s Laws of Motion',
    icon: '🍎',
    color: '#ff6b6b',
    description: 'The foundation of classical mechanics explaining how forces affect motion.',
    formula: 'F = ma',
    keyPoints: [
      'First Law: Inertia - objects maintain their state of motion unless acted upon by a force',
      'Second Law: F = ma - force equals mass times acceleration',
      'Third Law: Action-Reaction - forces come in equal and opposite pairs',
    ],
  },
  {
    title: 'Conservation of Energy',
    icon: '⚡',
    color: '#ffd93d',
    description: 'Energy cannot be created or destroyed, only converted between forms.',
    formula: 'E_total = KE + PE = constant',
    keyPoints: [
      'Kinetic Energy: KE = ½mv²',
      'Potential Energy: PE = mgh (gravitational)',
      'In isolated systems, total mechanical energy is conserved',
    ],
  },
  {
    title: 'Ohm\'s Law & Circuits',
    icon: '🔌',
    color: '#ff9f43',
    description: 'The relationship between voltage, current, and resistance in electrical circuits.',
    formula: 'V = IR',
    keyPoints: [
      'Voltage (V) is the electrical pressure that drives current',
      'Current (I) is the flow of electric charge',
      'Resistance (R) opposes the flow of current',
    ],
  },
];

export default function PhysicsScreen({ navigation }) {
  const handleSolverPress = (solver) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate(solver.screen);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>⚡ Physics</Text>
          <Text style={styles.subtitle}>Solvers & Essential Theories</Text>
        </View>

        {/* Solvers Section */}
        <Text style={styles.sectionTitle}>🔬 Problem Solvers</Text>
        <View style={styles.grid}>
          {PHYSICS_SOLVERS.map((solver) => (
            <TouchableOpacity
              key={solver.id}
              style={[styles.card, { borderColor: solver.color + '40' }]}
              onPress={() => handleSolverPress(solver)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: solver.color + '20' }]}>
                <Text style={styles.icon}>{solver.icon}</Text>
              </View>
              <Text style={[styles.cardTitle, { color: solver.color }]}>{solver.title}</Text>
              <Text style={styles.cardDescription}>{solver.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Theories Section */}
        <Text style={styles.sectionTitle}>📚 Key Theories</Text>
        {THEORIES.map((theory, idx) => (
          <View key={idx} style={styles.theoryCard}>
            <View style={styles.theoryHeader}>
              <Text style={styles.theoryIcon}>{theory.icon}</Text>
              <View style={styles.theoryTitleContainer}>
                <Text style={[styles.theoryTitle, { color: theory.color }]}>{theory.title}</Text>
                <View style={[styles.formulaBadge, { backgroundColor: theory.color + '20' }]}>
                  <Text style={[styles.formulaText, { color: theory.color }]}>{theory.formula}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.theoryDescription}>{theory.description}</Text>
            <View style={styles.keyPointsContainer}>
              {theory.keyPoints.map((point, kidx) => (
                <View key={kidx} style={styles.keyPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.keyPointText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Quick Reference */}
        <Text style={styles.sectionTitle}>📖 Quick Reference</Text>
        <View style={styles.referenceCard}>
          <Text style={styles.refTitle}>Common Constants</Text>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Gravity (g)</Text>
            <Text style={styles.refValue}>9.81 m/s²</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Speed of Light (c)</Text>
            <Text style={styles.refValue}>3.00 × 10⁸ m/s</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Planck's Constant (h)</Text>
            <Text style={styles.refValue}>6.626 × 10⁻³⁴ J·s</Text>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Electron Charge (e)</Text>
            <Text style={styles.refValue}>1.602 × 10⁻¹⁹ C</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 24, paddingTop: 8 },
  title: { fontSize: 32, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 6 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
    marginTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 28 },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  cardDescription: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },
  theoryCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  theoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  theoryIcon: { fontSize: 32 },
  theoryTitleContainer: { flex: 1, gap: 6 },
  theoryTitle: { fontSize: 18, fontWeight: '700' },
  formulaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  formulaText: { fontSize: 16, fontFamily: 'monospace', fontWeight: '700' },
  theoryDescription: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  keyPointsContainer: { gap: 8 },
  keyPoint: { flexDirection: 'row', gap: 8 },
  bullet: { color: colors.accent, fontSize: 16, lineHeight: 20 },
  keyPointText: { flex: 1, fontSize: 13, color: '#c8c8d8', lineHeight: 20 },
  referenceCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
  },
  refTitle: { fontSize: 16, fontWeight: '600', color: colors.white, marginBottom: 12 },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  refLabel: { fontSize: 13, color: colors.textSecondary },
  refValue: { fontSize: 13, color: colors.accent, fontFamily: 'monospace', fontWeight: '600' },
});