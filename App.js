import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './src/theme/colors';
import { HistoryProvider } from './src/utils/history';

// Screens
import CalculatorScreen from './src/screens/CalculatorScreen';
import QuadraticScreen from './src/screens/QuadraticScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import GraphScreen from './src/screens/GraphScreen';
import MatrixScreen from './src/screens/MatrixScreen';
import CalculusScreen from './src/screens/CalculusScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();

// Create a wrapper for the solve screens
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

function SolveStack() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.bgPrimary,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.accent,
          height: 2,
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 'auto', paddingHorizontal: 10 },
        lazy: true,
      }}
    >
      <TopTab.Screen name="Quadratic" component={QuadraticScreen} />
      <TopTab.Screen name="Statistics" component={StatisticsScreen} options={{ tabBarLabel: 'Stats' }} />
      <TopTab.Screen 
        name="LinearSys" 
        component={require('./src/screens/LinearScreen').default} 
        options={{ tabBarLabel: 'Linear' }} 
      />
      <TopTab.Screen name="Polynomial" component={require('./src/screens/PolynomialScreen').default} />
      <TopTab.Screen 
        name="Trigonometry" 
        component={require('./src/screens/TrigonometryScreen').default} 
        options={{ tabBarLabel: 'Trig' }} 
      />
    </TopTab.Navigator>
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
                  case 'History': 
                    iconName = focused ? 'time' : 'time-outline'; 
                    break;
                  default: 
                    iconName = 'help-circle-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen 
              name="Calculator" 
              component={CalculatorScreen} 
              options={{ tabBarLabel: 'Calc' }}
            />
            <Tab.Screen 
              name="Solve" 
              component={SolveStack} 
              options={{ tabBarLabel: 'Solve' }}
            />
            <Tab.Screen 
              name="Graph" 
              component={GraphScreen} 
              options={{ tabBarLabel: 'Graph' }}
            />
            <Tab.Screen 
              name="Matrix" 
              component={MatrixScreen} 
              options={{ tabBarLabel: 'Matrix' }}
            />
            <Tab.Screen 
              name="Calculus" 
              component={CalculusScreen} 
              options={{ tabBarLabel: 'Calculus' }}
            />
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