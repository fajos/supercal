import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../theme/colors';
import { BackHeader } from '../components/BackHeader';
import { convertUnit } from '../utils/unitConverter';
import { InputCard } from '../components/InputCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;

const PHYSICAL_CONSTANTS = [
  { name: 'Speed of Light', symbol: 'c', value: '299,792,458', unit: 'm/s' },
  { name: 'Gravitational Constant', symbol: 'G', value: '6.674 × 10⁻¹¹', unit: 'm³/(kg·s²)' },
  { name: 'Planck Constant', symbol: 'h', value: '6.626 × 10⁻³⁴', unit: 'J·s' },
  { name: 'Boltzmann Constant', symbol: 'k', value: '1.381 × 10⁻²³', unit: 'J/K' },
  { name: 'Elementary Charge', symbol: 'e', value: '1.602 × 10⁻¹⁹', unit: 'C' },
  { name: 'Avogadro Number', symbol: 'Nₐ', value: '6.022 × 10²³', unit: 'mol⁻¹' },
  { name: 'Gas Constant', symbol: 'R', value: '8.314', unit: 'J/(mol·K)' },
  { name: 'Electron Mass', symbol: 'mₑ', value: '9.109 × 10⁻³¹', unit: 'kg' },
  { name: 'Proton Mass', symbol: 'mₚ', value: '1.673 × 10⁻²⁷', unit: 'kg' },
  { name: 'Vacuum Permittivity', symbol: 'ε₀', value: '8.854 × 10⁻¹²', unit: 'F/m' },
];

const UNIT_CATEGORIES = [
  { name: 'Length', units: ['m', 'km', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'] },
  { name: 'Mass', units: ['kg', 'g', 'mg', 'lb', 'oz'] },
  { name: 'Temperature', units: ['°C', '°F', 'K'] },
  { name: 'Pressure', units: ['Pa', 'atm', 'bar', 'psi'] },
  { name: 'Energy', units: ['J', 'cal', 'eV', 'kWh'] },
];

export default function ConstantsScreen() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('constants');

  // Conversion state
  const [convCategory, setConvCategory] = useState(UNIT_CATEGORIES[0]);
  const [convValue, setConvValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(UNIT_CATEGORIES[0].units[0]);
  const [toUnit, setToUnit] = useState(UNIT_CATEGORIES[0].units[1]);

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const filteredConstants = PHYSICAL_CONSTANTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleConvert = () => {
    const val = parseFloat(convValue);
    if (isNaN(val)) return '0';
    return convertUnit(val, fromUnit, toUnit, convCategory.name).toFixed(6).replace(/\.?0+$/, '');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="📚 Constants & Units" subtitle="Physics Data & Unit Tool" />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'constants' && styles.activeTab]}
          onPress={() => setActiveTab('constants')}
        >
          <Text style={[styles.tabText, activeTab === 'constants' && styles.activeTabText]}>Constants</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'units' && styles.activeTab]}
          onPress={() => setActiveTab('units')}
        >
          <Text style={[styles.tabText, activeTab === 'units' && styles.activeTabText]}>Units</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'constants' && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search constants..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'constants' ? (
          <View style={styles.grid}>
            {filteredConstants.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.card}
                onPress={() => copyToClipboard(item.value.replace(/,/g, ''))}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.symbol}>{item.symbol}</Text>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
                <Text style={styles.value}>{item.value}</Text>
                <Text style={styles.unit}>{item.unit}</Text>
                <Ionicons name="copy-outline" size={16} color={colors.accent} style={styles.copyIcon} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.unitsContainer}>
            <InputCard>
              <Text style={styles.categoryLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                {UNIT_CATEGORIES.map((cat, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.catChip, convCategory.name === cat.name && styles.catChipActive]}
                    onPress={() => {
                      setConvCategory(cat);
                      setFromUnit(cat.units[0]);
                      setToUnit(cat.units[1]);
                    }}
                  >
                    <Text style={[styles.catChipText, convCategory.name === cat.name && styles.catChipTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.converterRow}>
                <View style={styles.convCol}>
                  <TextInput
                    style={styles.convInput}
                    value={convValue}
                    onChangeText={setConvValue}
                    keyboardType="decimal-pad"
                  />
                  <View style={styles.unitPicker}>
                    {convCategory.units.map(u => (
                      <TouchableOpacity
                        key={u}
                        style={[styles.unitSmallChip, fromUnit === u && styles.unitSmallChipActive]}
                        onPress={() => setFromUnit(u)}
                      >
                        <Text style={[styles.unitSmallText, fromUnit === u && styles.unitSmallTextActive]}>{u}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <Ionicons name="arrow-forward" size={24} color={colors.accent} style={{ marginTop: 15 }} />

                <View style={styles.convCol}>
                  <View style={styles.resultBox}>
                    <Text style={styles.resultText}>{handleConvert()}</Text>
                  </View>
                  <View style={styles.unitPicker}>
                    {convCategory.units.map(u => (
                      <TouchableOpacity
                        key={u}
                        style={[styles.unitSmallChip, toUnit === u && styles.unitSmallChipActive]}
                        onPress={() => setToUnit(u)}
                      >
                        <Text style={[styles.unitSmallText, toUnit === u && styles.unitSmallTextActive]}>{u}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </InputCard>

            <View style={styles.infoCard}>
              <Ionicons name="bulb-outline" size={20} color={colors.accent} />
              <Text style={styles.infoText}>Select a category and units to convert. Tap result to copy.</Text>
            </View>

            <View style={styles.categoriesOverview}>
              {UNIT_CATEGORIES.map((cat, idx) => (
                <View key={idx} style={styles.categoryCard}>
                  <Text style={styles.categoryTitle}>{cat.name}</Text>
                  <View style={styles.unitChipContainer}>
                    {cat.units.map((unit, uIdx) => (
                      <View key={uIdx} style={styles.unitChip}>
                        <Text style={styles.unitChipText}>{unit}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: colors.border },
  activeTab: { borderBottomColor: colors.accent },
  tabText: { color: colors.textSecondary, fontWeight: '600' },
  activeTabText: { color: colors.accent },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  searchInput: { flex: 1, color: colors.white, paddingVertical: 12, marginLeft: 8 },
  scrollContent: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    backgroundColor: colors.bgCard,
    width: (SCREEN_WIDTH - 44) / (isTablet ? 3 : 2),
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative'
  },
  cardHeader: { marginBottom: 8 },
  symbol: { color: colors.accent, fontSize: 18, fontWeight: 'bold' },
  name: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  value: { color: colors.white, fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600' },
  unit: { color: colors.textSecondary, fontSize: 10, marginTop: 4 },
  copyIcon: { position: 'absolute', top: 12, right: 12 },
  unitsContainer: { gap: 16 },
  categoryLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 8, fontWeight: '600' },
  catScroll: { marginBottom: 16 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.bgInput, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  catChipActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  catChipText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  catChipTextActive: { color: colors.accent },
  converterRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  convCol: { flex: 1, gap: 12 },
  convInput: { backgroundColor: colors.bgInput, borderRadius: 12, color: colors.white, padding: 12, fontSize: 16, textAlign: 'center', borderWidth: 1, borderColor: colors.border },
  resultBox: { backgroundColor: colors.bgInput, borderRadius: 12, padding: 12, height: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.accent + '40' },
  resultText: { color: colors.accentGlow, fontSize: 16, fontWeight: '700' },
  unitPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  unitSmallChip: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border },
  unitSmallChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  unitSmallText: { color: colors.textSecondary, fontSize: 10, fontWeight: '600' },
  unitSmallTextActive: { color: colors.black },
  categoryCard: { backgroundColor: colors.bgCard, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  categoryTitle: { color: colors.white, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  unitChipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  unitChip: { backgroundColor: colors.bgInput, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  unitChipText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentBg, padding: 12, borderRadius: 12, gap: 12 },
  infoText: { color: colors.white, fontSize: 12, flex: 1 },
  categoriesOverview: { marginTop: 8 },
});
