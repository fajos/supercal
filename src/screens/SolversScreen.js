import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const SOLVERS = [
  // === ALGEBRA ===
  {
    id: 'quadratic',
    title: 'Quadratic',
    icon: '📐',
    description: 'ax² + bx + c = 0',
    color: '#00d4aa',
    screen: 'QuadraticSolver',
    category: 'Algebra',
  },
  {
    id: 'linear',
    title: 'Linear System',
    icon: '📏',
    description: '2×2 & 3×3 Equations',
    color: '#3498db',
    screen: 'LinearSolver',
    category: 'Algebra',
  },
  {
    id: 'polynomial',
    title: 'Polynomial',
    icon: '📈',
    description: 'Cubic & Higher Degree',
    color: '#ffa502',
    screen: 'PolynomialSolver',
    category: 'Algebra',
  },
  {
    id: 'simultaneous',
    title: 'Simultaneous',
    icon: '⚡',
    description: '3 Equations, 3 Unknowns',
    color: '#e056a0',
    screen: 'SimultaneousSolver',
    category: 'Algebra',
  },
  
  // === ADVANCED ALGEBRA ===
{
  id: 'radical',
  title: 'Radical Equations',
  icon: '√',
  description: 'Square roots & radicals',
  color: '#e17055',
  screen: 'RadicalSolver',
  category: 'Advanced Algebra',
},
{
  id: 'exponential',
  title: 'Exponential & Log',
  icon: '📊',
  description: 'e^x, ln(x), growth/decay',
  color: '#00cec9',
  screen: 'ExponentialSolver',
  category: 'Advanced Algebra',
},

  // === TRIGONOMETRY ===
  {
    id: 'trigonometry',
    title: 'Trigonometry',
    icon: '🔺',
    description: 'sin, cos, tan Equations',
    color: '#ff4757',
    screen: 'TrigonometrySolver',
    category: 'Trigonometry',
  },
  
  // === CALCULUS ===
  {
    id: 'calculus',
    title: 'Calculus',
    icon: '∫',
    description: 'Derivatives & Integrals',
    color: '#a29bfe',
    screen: 'CalculusSolver',
    category: 'Calculus',
  },
  
  // === STATISTICS ===
  {
    id: 'statistics',
    title: 'Statistics',
    icon: '📊',
    description: 'Mean, Median, Std Dev',
    color: '#7c5ce7',
    screen: 'StatisticsSolver',
    category: 'Statistics',
  },
  {
    id: 'probability',
    title: 'Probability',
    icon: '🎲',
    description: 'Combinations & More',
    color: '#fd79a8',
    screen: 'ProbabilitySolver',
    category: 'Statistics',
  },
  
  // === LINEAR ALGEBRA ===
  {
    id: 'matrix',
    title: 'Matrix',
    icon: '🧮',
    description: 'Det, Inverse, Eigenvalues',
    color: '#00b894',
    screen: 'MatrixSolver',
    category: 'Linear Algebra',
  },
  
  // === COMPLEX NUMBERS ===
  {
    id: 'complex',
    title: 'Complex Numbers',
    icon: '🔄',
    description: 'a + bi Operations',
    color: '#6c5ce7',
    screen: 'ComplexSolver',
    category: 'Complex Numbers',
  },
  
  // === SEQUENCES ===
  {
    id: 'sequences',
    title: 'Sequences',
    icon: '🔢',
    description: 'Arithmetic & Geometric',
    color: '#fdcb6e',
    screen: 'SequenceSolver',
    category: 'Sequences',
  },
  
  // === FINANCE ===
  {
    id: 'finance',
    title: 'Financial Math',
    icon: '💰',
    description: 'Interest, Loans, NPV',
    color: '#55efc4',
    screen: 'FinanceSolver',
    category: 'Finance',
  },
];

export default function SolversScreen({ navigation }) {
  const handleSolverPress = (solver) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate(solver.screen);
  };

  // Group solvers by category
  const categories = [...new Set(SOLVERS.map(s => s.category))];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🧮 Math Solvers</Text>
          <Text style={styles.subtitle}>Step-by-step solutions for every problem</Text>
        </View>

        {/* Solver Cards by Category */}
        {categories.map(category => {
          const categorySolvers = SOLVERS.filter(s => s.category === category);
          
          return (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <View style={styles.categoryLine} />
              </View>
              
              <View style={styles.grid}>
                {categorySolvers.map((solver) => (
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
                    <View style={styles.arrowRow}>
                      <Text style={styles.solveText}>Solve →</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}

        {/* Quick Tips Section */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>💡 Learning Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={20} color={colors.accent} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Understand, Don't Memorize</Text>
              <Text style={styles.tipText}>
                Each solver shows detailed steps to help you learn the underlying concepts.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.purple} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Practice with Different Values</Text>
              <Text style={styles.tipText}>
                Try modifying the input values to see how the solution changes.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="analytics-outline" size={20} color="#ffa502" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Check Your Work</Text>
              <Text style={styles.tipText}>
                Use the verification steps to ensure your manual calculations are correct.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  categoryLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 18,
    gap: 10,
    flexShrink: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  arrowRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  solveText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  recentSection: {
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});