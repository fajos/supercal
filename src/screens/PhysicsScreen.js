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

const getGridConfig = () => {
  if (SCREEN_WIDTH >= 768) return { cols: 4, gap: 16 }; // 10" tablet
  if (SCREEN_WIDTH >= 600) return { cols: 3, gap: 14 }; // 7" tablet
  return { cols: 2, gap: 12 }; // Phone
};

const { cols: COLUMN_COUNT, gap: GRID_GAP } = getGridConfig();
const CARD_WIDTH = (SCREEN_WIDTH - 32 - (COLUMN_COUNT - 1) * GRID_GAP) / COLUMN_COUNT;

const PHYSICS_SOLVERS = [
  {
    id: 'kinematics',
    title: 'Kinematics',
    icon: '🏃',
    description: 'Motion, velocity, acceleration',
    color: '#00d4aa',
    screen: 'KinematicsScreen',
    category: 'Mechanics',
  },
  {
    id: 'dynamics',
    title: 'Dynamics',
    icon: '💪',
    description: 'Forces, Newton\'s Laws, Friction',
    color: '#ff6b6b',
    screen: 'DynamicsScreen',
    category: 'Mechanics',
  },
  {
    id: 'equilibrium',
    title: 'Equilibrium',
    icon: '⚖️',
    description: 'Moments, Levers, Center of Gravity',
    color: '#feca57',
    screen: 'EquilibriumScreen',
    category: 'Mechanics',
  },
  {
    id: 'elasticity',
    title: 'Elasticity',
    icon: '📏',
    description: 'Hooke\'s Law, Young\'s Modulus',
    color: '#48dbfb',
    screen: 'ElasticityScreen',
    category: 'Mechanics',
  },
  {
    id: 'energy',
    title: 'Energy & Work',
    icon: '⚡',
    description: 'Kinetic, Potential, Conservation',
    color: '#ffd93d',
    screen: 'EnergyScreen',
    category: 'Mechanics',
  },
  {
    id: 'projectile',
    title: 'Projectile',
    icon: '🎯',
    description: 'Trajectory, Range, Height',
    color: '#ff4757',
    screen: 'ProjectileScreen',
    category: 'Mechanics',
  },
  {
    id: 'circular',
    title: 'Circular Motion',
    icon: '🎡',
    description: 'Centripetal Force, Angular Velocity',
    color: '#4db8ff',
    screen: 'CircularScreen',
    category: 'Mechanics',
  },
  {
    id: 'thermal',
    title: 'Thermal Physics',
    icon: '🔥',
    description: 'Heat Capacity, Latent Heat, Gas Laws',
    color: '#ff9f43',
    screen: 'ThermalScreen',
    category: 'Thermal',
  },
  {
    id: 'waves',
    title: 'Waves & Sound',
    icon: '🌊',
    description: 'Frequency, wavelength, speed',
    color: '#6c5ce7',
    screen: 'WavesScreen',
    category: 'Waves',
  },
  {
    id: 'magnetic',
    title: 'Magnetic Fields',
    icon: '🧲',
    description: 'Lorentz Force, BIL, Flux',
    color: '#1dd1a1',
    screen: 'MagneticScreen',
    category: 'Electricity',
  },
  {
    id: 'circuits',
    title: 'Circuits',
    icon: '⚡',
    description: 'Ohm\'s Law, Series, Parallel',
    color: '#ff9f43',
    screen: 'CircuitsScreen',
    category: 'Electricity',
  },
  {
    id: 'radioactivity',
    title: 'Radioactivity',
    icon: '⚛️',
    description: 'Half-life, Decay Constant',
    color: '#ff6b6b',
    screen: 'RadioactivityScreen',
    category: 'Modern Physics',
  },
  {
    id: 'optics',
    title: 'Optics & Light',
    icon: '🔭',
    description: 'Reflection, Refraction, Lenses',
    color: '#a29bfe',
    screen: 'OpticsScreen',
    category: 'Waves',
  },
  {
    id: 'electrostatics',
    title: 'Electrostatics',
    icon: '⚡',
    description: 'Coulomb\'s Law, Electric Fields',
    color: '#00d4aa',
    screen: 'ElectrostaticsScreen',
    category: 'Electricity',
  },
  {
    id: 'fluids',
    title: 'Fluids & Pressure',
    icon: '💧',
    description: 'Pressure, Density, Hydraulics',
    color: '#48dbfb',
    screen: 'FluidsScreen',
    category: 'Mechanics',
  },
  {
    id: 'gravitation',
    title: 'Gravitation',
    icon: '🌍',
    description: 'Universal Gravity, Orbitals',
    color: '#feca57',
    screen: 'GravitationScreen',
    category: 'Mechanics',
  },
  {
    id: 'induction',
    title: 'Induction',
    icon: '🔌',
    description: 'Transformers, Magnetic Flux',
    color: '#ff9f43',
    screen: 'InductionScreen',
    category: 'Electricity',
  },
  {
    id: 'quantum',
    title: 'Quantum Physics',
    icon: '🔮',
    description: 'Photon Energy, Wave-Particle',
    color: '#6c5ce7',
    screen: 'QuantumScreen',
    category: 'Modern Physics',
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
    title: 'Principle of Moments',
    icon: '⚖️',
    color: '#feca57',
    description: 'Conditions for a body to be in equilibrium under the action of forces.',
    formula: 'ΣM = 0',
    keyPoints: [
      'Clockwise moments must equal anticlockwise moments for equilibrium',
      'The resultant force on the body must be zero',
      'Moment = Force × Perpendicular distance from pivot',
    ],
  },
  {
    title: 'Elasticity & Hooke\'s Law',
    icon: '📏',
    color: '#48dbfb',
    description: 'The property of a material to return to its original shape after deformation.',
    formula: 'F = ke',
    keyPoints: [
      'Hooke\'s Law: Extension is proportional to force until the elastic limit',
      'Young\'s Modulus measures the stiffness of a solid material',
      'Elastic Potential Energy is stored in a stretched material (W = ½Fe)',
    ],
  },
  {
    title: 'Thermal Physics & Gas Laws',
    icon: '🔥',
    color: '#ff7f50',
    description: 'Study of heat, temperature, and their relation to energy and work.',
    formula: 'Q = mcΔT',
    keyPoints: [
      'Specific Heat Capacity: heat required to raise 1kg of substance by 1°C',
      'Gas Laws: PV = nRT (Ideal Gas Equation)',
      'First Law of Thermodynamics: ΔU = Q - W',
    ],
  },
  {
    title: 'Radioactive Decay',
    icon: '⚛️',
    color: '#ff6b6b',
    description: 'The spontaneous disintegration of unstable atomic nuclei.',
    formula: 'N = N₀e^(-λt)',
    keyPoints: [
      'Half-life: Time taken for half the nuclei in a sample to decay',
      'Activity (A): Rate of decay, measured in Becquerels (Bq)',
      'Alpha, Beta, and Gamma radiation have different ionizing powers',
    ],
  },
  {
    title: 'Magnetic Forces',
    icon: '🧲',
    color: '#1dd1a1',
    description: 'Forces acting on moving charges and current-carrying wires.',
    formula: 'F = qvB sinθ',
    keyPoints: [
      'Lorentz Force: Force on a charge moving through a magnetic field',
      'Force on Wire: F = BIL sinθ',
      'Fleming\'s Left Hand Rule: Relates Force, Field, and Current',
    ],
  },
  {
    title: 'Optics & Light',
    icon: '💡',
    color: '#a29bfe',
    description: 'Behavior of light including reflection, refraction and lens properties.',
    formula: '1/f = 1/u + 1/v',
    keyPoints: [
      'Snell\'s Law: n₁sinθ₁ = n₂sinθ₂ for refraction at boundaries',
      'Lens Formula: relates focal length, object distance, and image distance',
      'Magnification: M = -v/u = hᵢ/hₒ',
    ],
  },
  {
    title: 'Coulomb\'s Law',
    icon: '⚡',
    color: '#00d4aa',
    description: 'The electric force between two stationary charged particles.',
    formula: 'F = k(q₁q₂/r²)',
    keyPoints: [
      'The force is attractive for opposite charges and repulsive for like charges',
      'k ≈ 8.99 × 10⁹ N·m²/C² (Coulomb constant)',
      'Electric field (E) is the force per unit positive charge (E = F/q)',
    ],
  },
  {
    title: 'Fluid Pressure',
    icon: '💧',
    color: '#48dbfb',
    description: 'Pressure exerted by fluids at rest due to gravity.',
    formula: 'P = ρgh',
    keyPoints: [
      'Pressure increases linearly with depth in a liquid',
      'Archimedes\' Principle: Upthrust equals weight of fluid displaced',
      'Pressure is the same at all points at the same depth in a static fluid',
    ],
  },
  {
    title: 'Law of Gravitation',
    icon: '🌍',
    color: '#feca57',
    description: 'Every particle attracts every other particle with a gravitational force.',
    formula: 'F = G(Mm/r²)',
    keyPoints: [
      'G ≈ 6.674 × 10⁻¹¹ N·m²/kg² (Universal Gravitational Constant)',
      'Gravitational Field Strength (g) is the force per unit mass (g = F/m)',
      'Gravity follows an inverse square law relative to distance',
    ],
  },
  {
    title: 'Electromagnetic Induction',
    icon: '🔌',
    color: '#ff9f43',
    description: 'Generation of an electromotive force (EMF) across an electrical conductor.',
    formula: 'Vₚ/Vₛ = Nₚ/Nₛ',
    keyPoints: [
      'Faraday\'s Law: Induced EMF is proportional to rate of change of flux',
      'Lenz\'s Law: Induced current opposes the change that produced it',
      'Transformers only work with alternating current (AC)',
    ],
  },
  {
    title: 'Quantum & Atomic Physics',
    icon: '🔮',
    color: '#6c5ce7',
    description: 'Physics of the very small where energy is quantized.',
    formula: 'E = hf',
    keyPoints: [
      'Photons are discrete "packets" of electromagnetic energy',
      'Wave-Particle Duality: Matter exhibits both wave and particle properties',
      'de Broglie Wavelength relates momentum to wavelength (λ = h/p)',
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
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  header: { marginBottom: 24, paddingTop: 8, width: '100%', maxWidth: 800 },
  title: { fontSize: 32, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 6 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
    marginTop: 20,
    width: '100%',
    maxWidth: 800,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginBottom: 16,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 800,
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
    width: '100%',
    maxWidth: 800,
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
    width: '100%',
    maxWidth: 800,
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