import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { StepCard } from '../components/StepCard';
import { FinalAnswer } from '../components/FinalAnswer';
import { solveStatistics } from '../solvers/statisticsSolver';
import { useHistory } from '../utils/history';
import { BackHeader } from '../components/BackHeader';
import { SolveButton } from '../components/SolveButton';
import { ErrorCard } from '../components/ErrorCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

export default function StatisticsScreen() {
  const [dataInput, setDataInput] = useState('12, 15, 18, 22, 25, 30');
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const { addToHistory } = useHistory();

  const handleSolve = () => {
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const result = solveStatistics(dataInput);
        const shareText = `Statistics Analysis Result:\nDataset: ${dataInput}\nMean: ${result.summary.mean.toFixed(4)}\nMedian: ${result.summary.median.toFixed(4)}\nStd Dev: ${result.summary.stdDev.toFixed(4)}\nRange: ${result.summary.range.toFixed(4)}\n\nSolved with SuperCalc`;

        setSolution({ ...result, shareText });

        addToHistory({
          type: 'statistics',
          input: { data: dataInput },
          result: result.summary,
          timestamp: new Date().toISOString(),
        });

        setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 300);
      } catch (err) {
        setError(err.message);
        setSolution(null);
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const renderContent = (content) => {
    return content.map((item, idx) => {
      switch (item.type) {
        case 'highlight':
          return (
            <Text key={idx} style={styles.highlightText}>
              {item.text}
            </Text>
          );
        case 'subtext':
          return (
            <Text key={idx} style={styles.subText}>
              {item.text}
            </Text>
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <BackHeader title="📊 Statistics" subtitle="Mean, Median, Standard Deviation" />
          </View>

          {/* Input Card */}
          <InputCard style={isTablet && styles.tabletInputCard}>
            <Text style={styles.inputLabel}>
              Enter dataset (comma-separated values):
            </Text>
            <TextInput
              style={styles.dataInput}
              value={dataInput}
              onChangeText={setDataInput}
              placeholder="e.g., 2, 4, 6, 8, 10, 12"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />

            <SolveButton
              onPress={handleSolve}
              label="📊 ANALYZE DATA"
              loading={loading}
            />
          </InputCard>

          <ErrorCard message={error} />

          {/* Solution Steps */}
          {solution && (
            <View style={styles.solutionArea}>
              {solution.steps.map((step, index) => (
                <StepCard
                  key={index}
                  step={step.step}
                  badge={step.badge}
                  index={index}
                >
                  {renderContent(step.content)}
                </StepCard>
              ))}

              <FinalAnswer
                label="📊 Statistical Summary"
                shareText={solution.shareText}
              >
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Mean</Text>
                    <Text style={styles.summaryValue}>
                      {solution.summary.mean.toFixed(4)}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Median</Text>
                    <Text style={styles.summaryValue}>
                      {solution.summary.median.toFixed(4)}
                    </Text>
                  </View>
                </View>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Std Dev</Text>
                    <Text style={styles.summaryValue}>
                      {solution.summary.stdDev.toFixed(4)}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Range</Text>
                    <Text style={styles.summaryValue}>
                      {solution.summary.range.toFixed(4)}
                    </Text>
                  </View>
                </View>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Min / Max</Text>
                    <Text style={styles.summaryValue}>
                      {solution.summary.min} / {solution.summary.max}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>IQR</Text>
                    <Text style={styles.summaryValue}>
                      {solution.summary.iqr.toFixed(4)}
                    </Text>
                  </View>
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
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  flex: {
    flex: 1,
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
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  dataInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 14,
    minHeight: 60,
    textAlignVertical: 'top',
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
  subText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 4,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  summaryValue: {
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
  },
});