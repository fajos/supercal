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
const CARD_WIDTH = isTablet ? (SCREEN_WIDTH - 64) / 3 : (SCREEN_WIDTH - 44) / 2;

const PHYSICAL_CONSTANTS = [
  { name: 'Speed of Light', symbol: 'c', value: '299,792,458', unit: 'm/s', category: 'Electromagnetism' },
  { name: 'Gravitational Constant', symbol: 'G', value: '6.674×10⁻¹¹', unit: 'm³/(kg·s²)', category: 'Gravity' },
  { name: 'Planck Constant', symbol: 'h', value: '6.626×10⁻³⁴', unit: 'J·s', category: 'Quantum' },
  { name: 'Reduced Planck', symbol: 'ħ', value: '1.055×10⁻³⁴', unit: 'J·s', category: 'Quantum' },
  { name: 'Boltzmann Constant', symbol: 'k', value: '1.381×10⁻²³', unit: 'J/K', category: 'Thermodynamics' },
  { name: 'Elementary Charge', symbol: 'e', value: '1.602×10⁻¹⁹', unit: 'C', category: 'Electromagnetism' },
  { name: 'Avogadro Number', symbol: 'Nₐ', value: '6.022×10²³', unit: 'mol⁻¹', category: 'Chemistry' },
  { name: 'Gas Constant', symbol: 'R', value: '8.314', unit: 'J/(mol·K)', category: 'Thermodynamics' },
  { name: 'Electron Mass', symbol: 'mₑ', value: '9.109×10⁻³¹', unit: 'kg', category: 'Particle Physics' },
  { name: 'Proton Mass', symbol: 'mₚ', value: '1.673×10⁻²⁷', unit: 'kg', category: 'Particle Physics' },
  { name: 'Neutron Mass', symbol: 'mₙ', value: '1.675×10⁻²⁷', unit: 'kg', category: 'Particle Physics' },
  { name: 'Vacuum Permittivity', symbol: 'ε₀', value: '8.854×10⁻¹²', unit: 'F/m', category: 'Electromagnetism' },
  { name: 'Vacuum Permeability', symbol: 'μ₀', value: '4π×10⁻⁷', unit: 'N/A²', category: 'Electromagnetism' },
  { name: 'Bohr Radius', symbol: 'a₀', value: '5.292×10⁻¹¹', unit: 'm', category: 'Quantum' },
  { name: 'Rydberg Constant', symbol: 'R∞', value: '1.097×10⁷', unit: 'm⁻¹', category: 'Quantum' },
  { name: 'Stefan-Boltzmann', symbol: 'σ', value: '5.670×10⁻⁸', unit: 'W/(m²·K⁴)', category: 'Thermodynamics' },
];

const UNIT_CATEGORIES = [
  { name: 'Length', icon: '📏', units: ['m', 'km', 'cm', 'mm', 'μm', 'nm', 'in', 'ft', 'yd', 'mi'] },
  { name: 'Mass', icon: '⚖️', units: ['kg', 'g', 'mg', 'μg', 'lb', 'oz', 'ton'] },
  { name: 'Temperature', icon: '🌡️', units: ['°C', '°F', 'K'] },
  { name: 'Pressure', icon: '💨', units: ['Pa', 'kPa', 'atm', 'bar', 'psi', 'mmHg'] },
  { name: 'Energy', icon: '⚡', units: ['J', 'kJ', 'cal', 'kcal', 'eV', 'kWh'] },
  { name: 'Time', icon: '⏱️', units: ['s', 'min', 'hr', 'day', 'yr'] },
  { name: 'Speed', icon: '🏃', units: ['m/s', 'km/h', 'mph', 'knot'] },
  { name: 'Area', icon: '📐', units: ['m²', 'km²', 'cm²', 'ha', 'acre', 'ft²'] },
];

export default function ConstantsScreen() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('constants');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Conversion state
  const [convCategory, setConvCategory] = useState(UNIT_CATEGORIES[0]);
  const [convValue, setConvValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(UNIT_CATEGORIES[0].units[0]);
  const [toUnit, setToUnit] = useState(UNIT_CATEGORIES[0].units[1]);

  const copyToClipboard = async (text) => {
    const cleaned = text.replace(/,/g, '').replace(/×/g, 'e').replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '');
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const filteredConstants = PHYSICAL_CONSTANTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group constants by category
  const groupedConstants = {};
  filteredConstants.forEach(c => {
    if (!groupedConstants[c.category]) groupedConstants[c.category] = [];
    groupedConstants[c.category].push(c);
  });

  const handleConvert = () => {
    const val = parseFloat(convValue);
    if (isNaN(val)) return '0';
    return convertUnit(val, fromUnit, toUnit, convCategory.name).toFixed(6).replace(/\.?0+$/, '');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="📚 Constants & Units" subtitle="Physics Data & Unit Converter" />

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        {[
          { id: 'constants', label: 'Constants', icon: 'flask-outline' },
          { id: 'units', label: 'Converter', icon: 'swap-horizontal-outline' },
          { id: 'about', label: 'About', icon: 'information-circle-outline' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons name={tab.icon} size={18} color={activeTab === tab.id ? colors.accent : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'constants' && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search constants by name, symbol, or category..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'constants' ? (
          <View style={styles.constantsContainer}>
            {Object.keys(groupedConstants).map(category => (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryHeader}>
                  <Text style={styles.categoryDot}>●</Text> {category}
                </Text>
                <View style={styles.grid}>
                  {groupedConstants[category].map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.constantCard}
                      onPress={() => copyToClipboard(item.value)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.constantCardContent}>
                        <View style={styles.cardTop}>
                          <Text style={styles.symbol}>{item.symbol}</Text>
                          <Ionicons name="copy-outline" size={14} color={colors.accent + '80'} />
                        </View>
                        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.value} numberOfLines={1}>{item.value}</Text>
                        <Text style={styles.unit}>{item.unit}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
            {filteredConstants.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No constants found</Text>
                <Text style={styles.emptySubtext}>Try a different search term</Text>
              </View>
            )}
          </View>
        ) : activeTab === 'units' ? (
          <View style={styles.unitsContainer}>
            {/* Category Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catScrollContent}>
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
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={[styles.catChipText, convCategory.name === cat.name && styles.catChipTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Converter */}
            <InputCard style={styles.converterCard}>
              <Text style={styles.converterTitle}>{convCategory.name} Conversion</Text>
              
              <View style={styles.converterRow}>
                <View style={styles.convCol}>
                  <Text style={styles.convLabel}>From</Text>
                  <TextInput
                    style={styles.convInput}
                    value={convValue}
                    onChangeText={setConvValue}
                    keyboardType="decimal-pad"
                    placeholder="Value"
                    placeholderTextColor={colors.textSecondary}
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

                <View style={styles.swapContainer}>
                  <TouchableOpacity
                    style={styles.swapBtn}
                    onPress={() => {
                      const temp = fromUnit;
                      setFromUnit(toUnit);
                      setToUnit(temp);
                    }}
                  >
                    <Ionicons name="swap-vertical" size={20} color={colors.accent} />
                  </TouchableOpacity>
                </View>

                <View style={styles.convCol}>
                  <Text style={styles.convLabel}>To</Text>
                  <TouchableOpacity
                    style={styles.resultBox}
                    onPress={() => copyToClipboard(handleConvert())}
                  >
                    <Text style={styles.resultText}>{handleConvert()}</Text>
                  </TouchableOpacity>
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

            {/* Unit Reference */}
            <View style={styles.unitsReference}>
              <Text style={styles.referenceTitle}>Available Units</Text>
              <View style={styles.referenceGrid}>
                {UNIT_CATEGORIES.map((cat, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.refCard, convCategory.name === cat.name && styles.refCardActive]}
                    onPress={() => {
                      setConvCategory(cat);
                      setFromUnit(cat.units[0]);
                      setToUnit(cat.units[1]);
                    }}
                  >
                    <Text style={styles.refIcon}>{cat.icon}</Text>
                    <Text style={styles.refCatName}>{cat.name}</Text>
                    <Text style={styles.refUnitCount}>{cat.units.length} units</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.aboutContainer}>
            <View style={styles.aboutHeader}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>🚀</Text>
              </View>
              <Text style={styles.appName}>SuperCalc</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
            </View>

            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Developer</Text>
              <View style={styles.devRow}>
                <Ionicons name="code-slash" size={20} color={colors.accent} />
                <Text style={styles.devName}>Fajostech</Text>
              </View>
              <Text style={styles.devTagline}>Building tools for the future of math and science.</Text>
            </View>

            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Features</Text>
              <View style={styles.featureList}>
                <Text style={styles.featureItem}>📐 30+ Physics & Math Solvers</Text>
                <Text style={styles.featureItem}>📈 Interactive Graphing Calculator</Text>
                <Text style={styles.featureItem}>📚 16 Physical Constants Reference</Text>
                <Text style={styles.featureItem}>🔄 8-Category Unit Converter</Text>
                <Text style={styles.featureItem}>📊 Step-by-Step Solutions</Text>
                <Text style={styles.featureItem}>🎨 Beautiful Dark Theme UI</Text>
              </View>
            </View>

            <View style={styles.footerInfo}>
              <Text style={styles.copyrightText}>© 2026 Fajostech. All rights reserved.</Text>
              <Text style={styles.madeWithText}>Made with ⚛️ React Native & Expo</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  
  // Tabs
  tabContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    marginBottom: 16,
    gap: 4,
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row',
    paddingVertical: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 6,
    borderBottomWidth: 2, 
    borderBottomColor: colors.border,
  },
  activeTab: { borderBottomColor: colors.accent },
  tabText: { color: colors.textSecondary, fontWeight: '600', fontSize: 13 },
  activeTabText: { color: colors.accent },
  
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.white, paddingVertical: 12, marginLeft: 8, fontSize: 14 },
  
  scrollContent: { padding: 16, paddingTop: 0 },
  
  // Constants
  constantsContainer: { gap: 20 },
  categorySection: { marginBottom: 4 },
  categoryHeader: { 
    color: colors.white, 
    fontSize: 15, 
    fontWeight: '700', 
    marginBottom: 10,
    marginLeft: 4,
  },
  categoryDot: { color: colors.accent, fontSize: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  constantCard: {
    backgroundColor: colors.bgCard,
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  constantCardContent: { padding: 14 },
  cardTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 6,
  },
  symbol: { color: colors.accent, fontSize: 20, fontWeight: 'bold' },
  name: { color: colors.textSecondary, fontSize: 11, marginBottom: 8 },
  value: { 
    color: colors.white, 
    fontSize: 13, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontWeight: '600',
    marginBottom: 4,
  },
  unit: { color: colors.textSecondary, fontSize: 10, opacity: 0.8 },
  
  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: colors.textSecondary, fontSize: 16, fontWeight: '600', marginTop: 12 },
  emptySubtext: { color: colors.textSecondary, fontSize: 13, marginTop: 4, opacity: 0.7 },
  
  // Unit Converter
  unitsContainer: { gap: 16 },
  catScroll: { marginBottom: 4 },
  catScrollContent: { gap: 8, paddingRight: 16 },
  catChip: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 12, 
    backgroundColor: colors.bgInput, 
    borderWidth: 1, 
    borderColor: colors.border,
  },
  catChipActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  catIcon: { fontSize: 16 },
  catChipText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  catChipTextActive: { color: colors.accent },
  
  converterCard: {},
  converterTitle: { 
    color: colors.white, 
    fontSize: 15, 
    fontWeight: '700', 
    marginBottom: 16,
    textAlign: 'center',
  },
  converterRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  convCol: { flex: 1, gap: 10 },
  convLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  convInput: { 
    backgroundColor: colors.bgInput, 
    borderRadius: 12, 
    color: colors.white, 
    padding: 14, 
    fontSize: 18, 
    textAlign: 'center', 
    borderWidth: 1, 
    borderColor: colors.border,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  swapContainer: { 
    paddingTop: 20,
    alignItems: 'center',
  },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBox: { 
    backgroundColor: colors.accentBg, 
    borderRadius: 12, 
    padding: 14, 
    minHeight: 52, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: colors.accent + '60',
  },
  resultText: { color: colors.accentGlow, fontSize: 18, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  unitPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  unitSmallChip: { 
    paddingHorizontal: 8, 
    paddingVertical: 5, 
    borderRadius: 8, 
    backgroundColor: colors.bgInput, 
    borderWidth: 1, 
    borderColor: colors.border,
  },
  unitSmallChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  unitSmallText: { color: colors.textSecondary, fontSize: 10, fontWeight: '600' },
  unitSmallTextActive: { color: colors.black, fontWeight: '700' },
  
  // Units Reference
  unitsReference: { marginTop: 8 },
  referenceTitle: { 
    color: colors.white, 
    fontSize: 15, 
    fontWeight: '700', 
    marginBottom: 12,
  },
  referenceGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10,
  },
  refCard: {
    width: (SCREEN_WIDTH - 52) / 4,
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  refCardActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentBg,
  },
  refIcon: { fontSize: 24, marginBottom: 6 },
  refCatName: { color: colors.white, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  refUnitCount: { color: colors.textSecondary, fontSize: 9, marginTop: 2 },
  
  // About
  aboutContainer: { gap: 20, alignItems: 'center', paddingTop: 20 },
  aboutHeader: { alignItems: 'center', marginBottom: 10 },
  logoContainer: { 
    width: 80, height: 80, borderRadius: 24, 
    backgroundColor: colors.accentBg, justifyContent: 'center', 
    alignItems: 'center', marginBottom: 16, 
    borderWidth: 2, borderColor: colors.accent,
  },
  logoEmoji: { fontSize: 40 },
  appName: { color: colors.white, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  appVersion: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  aboutCard: { 
    backgroundColor: colors.bgCard, width: '100%', 
    padding: 20, borderRadius: 20, 
    borderWidth: 1, borderColor: colors.border,
  },
  aboutTitle: { 
    color: colors.accent, fontSize: 12, fontWeight: '700', 
    textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1,
  },
  devRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  devName: { color: colors.white, fontSize: 18, fontWeight: '700' },
  devTagline: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  featureList: { gap: 8 },
  featureItem: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  footerInfo: { alignItems: 'center', marginTop: 20, gap: 8 },
  copyrightText: { color: colors.textSecondary, fontSize: 12 },
  madeWithText: { color: colors.textSecondary, fontSize: 12, opacity: 0.7 },
});