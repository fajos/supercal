import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

export function FinalAnswer({ label, children, shareText }) {
  const onShare = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await Share.share({
        message: shareText || 'Check out this result from SuperCalc!',
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <LinearGradient
      colors={[colors.accentBg, colors.purpleBg]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          {shareText && (
            <TouchableOpacity onPress={onShare} style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color={colors.accent} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.valueContainer}>{children}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.accent,
    marginTop: 16,
    padding: 2,
  },
  inner: {
    padding: 22,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
    position: 'relative',
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  shareButton: {
    position: 'absolute',
    right: -10,
    padding: 8,
  },
  valueContainer: {
    alignItems: 'center',
  },
});
