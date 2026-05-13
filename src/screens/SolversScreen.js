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
  {
    id: 'quadratic',
    title: 'Quadratic',
    icon: '📐',
    description: 'ax² + bx + c = 0',
    color: '#00d4aa',
    screen: 'QuadraticSolver',
  },
  {
    id: 'statistics',
    title: 'Statistics',
    icon: '📊',
    description: 'Mean, Median, Std Dev',
    color: '#7c5ce7',
    screen: 'StatisticsSolver',
  },
  {
    id: 'linear',
    title: 'Linear System',
    icon: '📏',
    description: '2×2 Cramer\'s Rule',
    color: '#3498db',
    screen: 'LinearSolver',
  },
  {
    id: 'polynomial',
    title: 'Polynomial',
    icon: '📈',
    description: 'Cubic & Higher',
    color: '#ffa502',
    screen: 'PolynomialSolver',
  },
  {
    id: 'trigonometry',
    title: 'Trigonometry',
    icon: '🔺',
    description: 'sin, cos, tan eq.',
    color: '#ff4757',
    screen: 'TrigonometrySolver',
  },
];

export default function SolversScreen({ navigation }) {
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🧮 Equation Solvers</Text>
          <Text style={styles.subtitle}>Select a solver to get started</Text>
        </View>

        {/* Solver Cards Grid */}
        <View style={styles.grid}>
          {SOLVERS.map((solver) => (
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

        {/* Recent Section */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>💡 Quick Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              📐 <Text style={{ color: colors.accent }}>Quadratic:</Text> Enter a, b, c to solve ax²+bx+c=0
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              📊 <Text style={{ color: colors.purple }}>Statistics:</Text> Enter comma-separated numbers
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              📏 <Text style={{ color: colors.info }}>Linear:</Text> Two equations, Cramer's Rule solution
            </Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
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
    fontWeight: '600',
    color: colors.white,
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});