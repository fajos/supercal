import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './src/theme/colors';
import { HistoryProvider } from './src/utils/history';

// Screens
import CalculatorScreen from './src/screens/CalculatorScreen';
import SolversScreen from './src/screens/SolversScreen';
import GraphScreen from './src/screens/GraphScreen';
import MatrixScreen from './src/screens/MatrixScreen';
import CalculusScreen from './src/screens/CalculusScreen';

// Individual Solver Screens
import QuadraticScreen from './src/screens/QuadraticScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import LinearScreen from './src/screens/LinearScreen';
import PolynomialScreen from './src/screens/PolynomialScreen';
import TrigonometryScreen from './src/screens/TrigonometryScreen';
import SimultaneousScreen from './src/screens/SimultaneousScreen';
import ProbabilityScreen from './src/screens/ProbabilityScreen';
import ComplexScreen from './src/screens/ComplexScreen';
import SequenceScreen from './src/screens/SequenceScreen';
import FinanceScreen from './src/screens/FinanceScreen';
import RadicalScreen from './src/screens/RadicalScreen';
import ExponentialScreen from './src/screens/ExponentialScreen';

// Physics Screens
import PhysicsScreen from './src/screens/PhysicsScreen';
import KinematicsScreen from './src/screens/KinematicsScreen';
import DynamicsScreen from './src/screens/DynamicsScreen';
import EnergyScreen from './src/screens/EnergyScreen';
import WavesScreen from './src/screens/WavesScreen';
import CircuitsScreen from './src/screens/CircuitsScreen';
import ProjectileScreen from './src/screens/ProjectileScreen';
import ThermalScreen from './src/screens/ThermalScreen';
import CircularScreen from './src/screens/CircularScreen';
import EquilibriumScreen from './src/screens/EquilibriumScreen';
import ElasticityScreen from './src/screens/ElasticityScreen';
import RadioactivityScreen from './src/screens/RadioactivityScreen';
import MagneticScreen from './src/screens/MagneticScreen';
import OpticsScreen from './src/screens/OpticsScreen';
import ElectrostaticsScreen from './src/screens/ElectrostaticsScreen';
import FluidsScreen from './src/screens/FluidsScreen';
import GravitationScreen from './src/screens/GravitationScreen';
import InductionScreen from './src/screens/InductionScreen';
import QuantumScreen from './src/screens/QuantumScreen';
import ConstantsScreen from './src/screens/ConstantsScreen';


const Tab = createBottomTabNavigator();
const SolveStack = createNativeStackNavigator();
const PhysicsStack = createNativeStackNavigator();

function SolveStackScreen() {
  return (
    <SolveStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
      }}
    >
      <SolveStack.Screen name="SolversHome" component={SolversScreen} />
      <SolveStack.Screen name="QuadraticScreen" component={QuadraticScreen} />
      <SolveStack.Screen name="StatisticsScreen" component={StatisticsScreen} />
      <SolveStack.Screen name="LinearScreen" component={LinearScreen} />
      <SolveStack.Screen name="PolynomialScreen" component={PolynomialScreen} />
      <SolveStack.Screen name="TrigonometryScreen" component={TrigonometryScreen} />
      <SolveStack.Screen name="SimultaneousScreen" component={SimultaneousScreen} />
      <SolveStack.Screen name="ProbabilityScreen" component={ProbabilityScreen} />
      <SolveStack.Screen name="ComplexScreen" component={ComplexScreen} />
      <SolveStack.Screen name="CalculusScreen" component={CalculusScreen} />
      <SolveStack.Screen name="MatrixScreen" component={MatrixScreen} />
      <SolveStack.Screen name="SequenceScreen" component={SequenceScreen} />
      <SolveStack.Screen name="FinanceScreen" component={FinanceScreen} />
      <SolveStack.Screen name="RadicalScreen" component={RadicalScreen} />
      <SolveStack.Screen name="ExponentialScreen" component={ExponentialScreen} />
      <SolveStack.Screen name="ConstantsScreen" component={ConstantsScreen} />
    </SolveStack.Navigator>
  );
}

function PhysicsStackScreen() {
  return (
    <PhysicsStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
      }}
    >
      <PhysicsStack.Screen name="PhysicsHome" component={PhysicsScreen} />
      <PhysicsStack.Screen name="KinematicsScreen" component={KinematicsScreen} />
      <PhysicsStack.Screen name="DynamicsScreen" component={DynamicsScreen} />
      <PhysicsStack.Screen name="EnergyScreen" component={EnergyScreen} />
      <PhysicsStack.Screen name="WavesScreen" component={WavesScreen} />
      <PhysicsStack.Screen name="CircuitsScreen" component={CircuitsScreen} />
      <PhysicsStack.Screen name="ProjectileScreen" component={ProjectileScreen} />
      <PhysicsStack.Screen name="ThermalScreen" component={ThermalScreen} />
      <PhysicsStack.Screen name="CircularScreen" component={CircularScreen} />
      <PhysicsStack.Screen name="EquilibriumScreen" component={EquilibriumScreen} />
      <PhysicsStack.Screen name="ElasticityScreen" component={ElasticityScreen} />
      <PhysicsStack.Screen name="RadioactivityScreen" component={RadioactivityScreen} />
      <PhysicsStack.Screen name="MagneticScreen" component={MagneticScreen} />
      <PhysicsStack.Screen name="OpticsScreen" component={OpticsScreen} />
      <PhysicsStack.Screen name="ElectrostaticsScreen" component={ElectrostaticsScreen} />
      <PhysicsStack.Screen name="FluidsScreen" component={FluidsScreen} />
      <PhysicsStack.Screen name="GravitationScreen" component={GravitationScreen} />
      <PhysicsStack.Screen name="InductionScreen" component={InductionScreen} />
      <PhysicsStack.Screen name="QuantumScreen" component={QuantumScreen} />
      <PhysicsStack.Screen name="ConstantsScreen" component={ConstantsScreen} />
    </PhysicsStack.Navigator>
  );
}

function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          ...styles.tabBar,
          // Dynamic height: Base content (60) + safe area inset
          // This ensures the tab bar "shifts" up to accommodate 3-button nav vs gesture nav
          height: Platform.OS === 'ios'
            ? 64 + insets.bottom
            : 68 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingBottom: Platform.OS === 'ios'
            ? insets.bottom
            : (insets.bottom > 0 ? insets.bottom : 10),
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Calculator':
              iconName = focused ? 'calculator' : 'calculator-outline';
              break;
            case 'Solve':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'Physics':
              iconName = focused ? 'flash' : 'flash-outline';
              break;
            case 'Graph':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Constants':
              iconName = focused ? 'information-circle' : 'information-circle-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Calculator" component={CalculatorScreen} options={{ tabBarLabel: 'Calc' }} />
      <Tab.Screen name="Solve" component={SolveStackScreen} options={{ tabBarLabel: 'Solve' }} />
      <Tab.Screen name="Physics" component={PhysicsStackScreen} options={{ tabBarLabel: 'Physics' }} />
      <Tab.Screen name="Graph" component={GraphScreen} options={{ tabBarLabel: 'Graph' }} />
      <Tab.Screen name="Constants" component={ConstantsScreen} options={{ tabBarLabel: 'Constants' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HistoryProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="transparent" translucent />
          <AppTabs />
        </NavigationContainer>
      </HistoryProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bgCard,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});