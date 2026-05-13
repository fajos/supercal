import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

// NEW Solver Screens
import SimultaneousScreen from './src/screens/SimultaneousScreen';
import ProbabilityScreen from './src/screens/ProbabilityScreen';
import ComplexScreen from './src/screens/ComplexScreen';
import SequenceScreen from './src/screens/SequenceScreen';
import FinanceScreen from './src/screens/FinanceScreen';

const Tab = createBottomTabNavigator();
const SolveStack = createNativeStackNavigator();

// Stack navigator for the Solver section
function SolveStackScreen() {
  return (
    <SolveStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
      }}
    >
      <SolveStack.Screen name="SolversHome" component={SolversScreen} />
      <SolveStack.Screen name="QuadraticSolver" component={QuadraticScreen} />
      <SolveStack.Screen name="StatisticsSolver" component={StatisticsScreen} />
      <SolveStack.Screen name="LinearSolver" component={LinearScreen} />
      <SolveStack.Screen name="PolynomialSolver" component={PolynomialScreen} />
      <SolveStack.Screen name="TrigonometrySolver" component={TrigonometryScreen} />
      
      {/* NEW Solver Screens */}
      <SolveStack.Screen name="SimultaneousSolver" component={SimultaneousScreen} />
      <SolveStack.Screen name="ProbabilitySolver" component={ProbabilityScreen} />
      <SolveStack.Screen name="ComplexSolver" component={ComplexScreen} />
      <SolveStack.Screen name="SequenceSolver" component={SequenceScreen} />
      <SolveStack.Screen name="FinanceSolver" component={FinanceScreen} />
    </SolveStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HistoryProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={colors.bgPrimary} />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: styles.tabBar,
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
                  case 'Graph':
                    iconName = focused ? 'trending-up' : 'trending-up-outline';
                    break;
                  case 'Matrix':
                    iconName = focused ? 'grid' : 'grid-outline';
                    break;
                  case 'Calculus':
                    iconName = focused ? 'infinite' : 'infinite-outline';
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
            <Tab.Screen name="Graph" component={GraphScreen} options={{ tabBarLabel: 'Graph' }} />
            <Tab.Screen name="Matrix" component={MatrixScreen} options={{ tabBarLabel: 'Matrix' }} />
            <Tab.Screen name="Calculus" component={CalculusScreen} options={{ tabBarLabel: 'Calculus' }} />
          </Tab.Navigator>
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
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});