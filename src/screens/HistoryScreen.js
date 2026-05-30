import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useHistory } from '../utils/history';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HistoryScreen() {
  const { history, clearHistory, loadHistory } = useHistory();

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all saved solutions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  }, [clearHistory]);

  const getModeIcon = (type) => {
    switch (type) {
      case 'quadratic': return '📐';
      case 'statistics': return '📊';
      case 'linear':
      case 'linear_2x2':
      case 'linear_3x3': return '📏';
      case 'polynomial': return '📈';
      case 'trigonometry': return '🔺';
      case 'complex': return '🔄';
      case 'matrix': return '🧮';
      case 'kinematics': return '🏃';
      case 'circuits': return '⚡';
      case 'energy': return '🔋';
      case 'fluids': return '💧';
      case 'waves': return '🌊';
      case 'induction': return '🧲';
      case 'simultaneous': return '🔢';
      case 'calculator': return '📱';
      case 'thermal': return '🌡️';
      case 'quantum': return '⚛️';
      case 'magnetic': return '🧭';
      case 'projectile': return '🏹';
      case 'circular': return '🎡';
      case 'equilibrium': return '⚖️';
      case 'radioactivity': return '☢️';
      case 'electrostatics': return '⚡';
      case 'finance': return '💰';
      case 'calculus': return '∫';
      case 'sequence': return '🔢';
      case 'probability': return '🎲';
      case 'elasticity': return '📏';
      case 'gravitation': return '🌍';
      default: return '➕';
    }
  };

  const getModeName = (type) => {
    switch (type) {
      case 'quadratic': return 'Quadratic';
      case 'statistics': return 'Statistics';
      case 'linear':
      case 'linear_2x2': return 'Linear System (2x2)';
      case 'linear_3x3': return 'Linear System (3x3)';
      case 'polynomial': return 'Polynomial';
      case 'trigonometry': return 'Trigonometry';
      case 'complex': return 'Complex Numbers';
      case 'matrix': return 'Matrix Ops';
      case 'kinematics': return 'Kinematics';
      case 'circuits': return 'Electric Circuits';
      case 'energy': return 'Energy & Work';
      case 'fluids': return 'Fluids & Pressure';
      case 'waves': return 'Waves & Sound';
      case 'induction': return 'Induction';
      case 'simultaneous': return 'Simultaneous Eq';
      case 'calculator': return 'Calculator';
      case 'thermal': return 'Thermal Physics';
      case 'quantum': return 'Quantum Physics';
      case 'magnetic': return 'Magnetism';
      case 'projectile': return 'Projectile Motion';
      case 'circular': return 'Circular Motion';
      case 'equilibrium': return 'Equilibrium';
      case 'radioactivity': return 'Radioactivity';
      case 'electrostatics': return 'Electrostatics';
      case 'finance': return 'Finance';
      case 'calculus': return 'Calculus';
      case 'sequence': return 'Sequences';
      case 'probability': return 'Probability';
      case 'radicals': return 'Radicals';
      case 'elasticity': return 'Elasticity';
      case 'gravitation': return 'Gravitation';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderResultPreview = (entry) => {
    let previewText = '';

    if (entry.type === 'calculator') {
      previewText = `${entry.expr} = ${entry.result}`;
    } else if (entry.type === 'graph') {
      const eqs = [entry.input.equation, entry.input.equation2, entry.input.equation3].filter(e => e && e.trim());
      previewText = `Functions: ${eqs.join(', ')}\nDomain: ${entry.input.domain}`;
    } else if (typeof entry.result === 'string') {
      previewText = entry.result;
    } else if (typeof entry.result === 'number') {
      previewText = entry.result.toString();
    } else if ((entry.type === 'linear' || entry.type === 'linear_2x2') && entry.result.x !== undefined) {
      previewText = `x = ${entry.result.x.toFixed(4)}, y = ${entry.result.y.toFixed(4)}`;
    } else if (entry.type === 'linear_3x3' && entry.result.x !== undefined) {
      previewText = `x = ${entry.result.x.toFixed(4)}, y = ${entry.result.y.toFixed(4)}, z = ${entry.result.z.toFixed(4)}`;
    } else if (entry.type === 'complex' && entry.result.real !== undefined) {
      previewText = `${entry.result.real} ${entry.result.imag >= 0 ? '+' : '-'} ${Math.abs(entry.result.imag)}i`;
    } else if (entry.type === 'sequence') {
      previewText = `a(n) = ${entry.result.nthTerm}\nS(n) = ${entry.result.sum}`;
    } else if (entry.type === 'probability') {
      previewText = `Result = ${entry.result.value}`;
    } else if (entry.type === 'polynomial') {
      previewText = Array.isArray(entry.result) ? entry.result.map((r, i) => `x${i+1}=${typeof r === 'number' ? r.toFixed(4) : r}`).join(', ') : JSON.stringify(entry.result);
    } else if (entry.type === 'matrix') {
      if (entry.mode === 'determinant') previewText = `det(A) = ${entry.result.value.toFixed(4)}`;
      else if (entry.mode === 'eigenvalues') previewText = `λ = [${entry.result.eigenvalues.map(v => typeof v === 'number' ? v.toFixed(2) : v).join(', ')}]`;
      else previewText = `${entry.mode.charAt(0).toUpperCase() + entry.mode.slice(1)} calculated`;
    } else if (entry.type === 'statistics') {
      previewText = `Mean: ${entry.result.mean.toFixed(2)}, Median: ${entry.result.median.toFixed(2)}, σ: ${entry.result.stdDev.toFixed(2)}`;
    } else {
      previewText = JSON.stringify(entry.result).slice(0, 100);
    }

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultPreview} numberOfLines={3}>
          {previewText}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.modeRow}>
          <Text style={styles.modeIcon}>{getModeIcon(item.type)}</Text>
          <Text style={styles.modeName}>{getModeName(item.type)}</Text>
        </View>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
      <View style={styles.cardBody}>
        {renderResultPreview(item)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>📋 History</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearBtn}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptySubtitle}>
            Solutions you calculate will appear here for quick reference.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => item.id || item.timestamp || `hist-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%',
    maxWidth: 800,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },
  clearBtn: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    alignItems: 'center',
  },
  historyCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 600,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeIcon: {
    fontSize: 18,
  },
  modeName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  cardBody: {
    backgroundColor: colors.bgInput,
    borderRadius: 10,
    padding: 12,
  },
  resultPreview: {
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});