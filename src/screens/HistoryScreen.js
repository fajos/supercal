import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useHistory } from '../utils/history';

export default function HistoryScreen() {
  const { history, clearHistory, loadHistory } = useHistory();

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = () => {
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
  };

  const getModeIcon = (type) => {
    switch (type) {
      case 'quadratic':
        return '📐';
      case 'statistics':
        return '📊';
      case 'linear':
        return '📏';
      case 'polynomial':
        return '📈';
      case 'trigonometry':
        return '🔺';
      default:
        return '🧮';
    }
  };

  const getModeName = (type) => {
    switch (type) {
      case 'quadratic':
        return 'Quadratic';
      case 'statistics':
        return 'Statistics';
      case 'linear':
        return 'Linear System';
      case 'polynomial':
        return 'Polynomial';
      case 'trigonometry':
        return 'Trigonometry';
      default:
        return 'Unknown';
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
    switch (entry.type) {
      case 'quadratic':
        return (
          <Text style={styles.resultPreview}>
            x₁ = {typeof entry.result.root1 === 'string' 
              ? entry.result.root1 
              : entry.result.root1?.toFixed(4)}
            {'\n'}
            x₂ = {typeof entry.result.root2 === 'string'
              ? entry.result.root2
              : entry.result.root2?.toFixed(4)}
          </Text>
        );
      case 'statistics':
        return (
          <Text style={styles.resultPreview}>
            Mean: {entry.result.mean?.toFixed(2)} | StdDev: {entry.result.stdDev?.toFixed(2)}
          </Text>
        );
      case 'linear':
        return (
          <Text style={styles.resultPreview}>
            x = {entry.result.x?.toFixed(4)}, y = {entry.result.y?.toFixed(4)}
          </Text>
        );
      default:
        return (
          <Text style={styles.resultPreview}>
            {JSON.stringify(entry.result).slice(0, 60)}...
          </Text>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearBtn}>Clear All</Text>
          </TouchableOpacity>
        )}
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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {history.map((entry, index) => (
            <View key={index} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.modeRow}>
                  <Text style={styles.modeIcon}>{getModeIcon(entry.type)}</Text>
                  <Text style={styles.modeName}>{getModeName(entry.type)}</Text>
                </View>
                <Text style={styles.timestamp}>{formatDate(entry.timestamp)}</Text>
              </View>
              <View style={styles.cardBody}>
                {renderResultPreview(entry)}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  },
  historyCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
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
    color: '#c8c8d8',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
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