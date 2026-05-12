import React, { useState, useCallback, useRef } from 'react';
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
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_SIZE = (SCREEN_WIDTH - 48) / 4 - 8;

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [isRadian, setIsRadian] = useState(true);
  const [showSecond, setShowSecond] = useState(false);
  const scrollRef = useRef();

  // Format number for display
  const formatNumber = (num) => {
    if (isNaN(num) || !isFinite(num)) return 'Error';
    
    // Handle very large or very small numbers
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
      return num.toExponential(8);
    }
    
    // Round to avoid floating point issues
    const rounded = Math.round(num * 1e12) / 1e12;
    const str = rounded.toString();
    
    // Limit display length
    if (str.length > 16) {
      return rounded.toPrecision(12);
    }
    
    return str;
  };

  // Evaluate expression safely
  const evaluate = useCallback((expr) => {
    try {
      // Replace display symbols with JavaScript equivalents
      let processed = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `(${Math.PI})`)
        .replace(/e(?![xp])/g, `(${Math.E})`)
        .replace(/(\d+)!/g, (match, num) => {
          let fact = 1;
          for (let i = 2; i <= parseInt(num); i++) fact *= i;
          return fact.toString();
        })
        .replace(/sin⁻¹/g, 'Math.asin')
        .replace(/cos⁻¹/g, 'Math.acos')
        .replace(/tan⁻¹/g, 'Math.atan')
        .replace(/sinh/g, 'Math.sinh')
        .replace(/cosh/g, 'Math.cosh')
        .replace(/tanh/g, 'Math.tanh')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/√/g, 'Math.sqrt')
        .replace(/∛/g, 'Math.cbrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/\|([^|]+)\|/g, 'Math.abs($1)')
        .replace(/\^/g, '**')
        .replace(/mod/g, '%');

      // Handle percentage
      processed = processed.replace(/([\d.]+)%/g, '($1/100)');

      // Security check - only allow safe characters
      const safeCheck = processed.replace(/Math\.\w+/g, '').replace(/[0-9+\-*/().,% ]/g, '');
      if (safeCheck.length > 0) {
        throw new Error('Invalid expression');
      }

      const result = eval(processed);
      
      if (typeof result !== 'number' || !isFinite(result)) {
        return { error: true, message: 'Math Error' };
      }
      
      return { error: false, value: result };
    } catch (err) {
      return { error: true, message: 'Syntax Error' };
    }
  }, [isRadian]);

  // Handle button press
  const handlePress = useCallback((action, value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (action) {
      case 'number':
        setDisplay(prev => {
          if (prev === '0' || prev === 'Error' || prev === 'Math Error') {
            return value;
          }
          if (prev.length >= 16) return prev;
          return prev + value;
        });
        break;

      case 'operator':
        setDisplay(prev => {
          if (prev === 'Error') return '0' + value;
          // Don't allow double operators
          const lastChar = prev.slice(-1);
          if (['+', '-', '×', '÷', '^', '%', 'm'].includes(lastChar)) {
            return prev.slice(0, -1) + value;
          }
          return prev + value;
        });
        break;

      case 'function':
        if (display === 'Error') {
          setDisplay(value);
        } else if (display === '0' || display === '') {
          setDisplay(value);
        } else {
          setDisplay(prev => prev + value);
        }
        break;

      case 'constant':
        if (display === '0' || display === 'Error') {
          setDisplay(value);
        } else {
          setDisplay(prev => prev + value);
        }
        break;

      case 'clear':
        setDisplay('0');
        break;

      case 'delete':
        setDisplay(prev => {
          if (prev.length <= 1 || prev === 'Error') return '0';
          // Handle multi-char functions
          if (prev.endsWith('sin(') || prev.endsWith('cos(') || 
              prev.endsWith('tan(') || prev.endsWith('log(') ||
              prev.endsWith('ln(') || prev.endsWith('abs(') ||
              prev.endsWith('√(') || prev.endsWith('∛(')) {
            return prev.slice(0, -4);
          }
          if (prev.endsWith('sinh(') || prev.endsWith('cosh(') || prev.endsWith('tanh(')) {
            return prev.slice(0, -5);
          }
          return prev.slice(0, -1);
        });
        break;

      case 'equals':
        const result = evaluate(display);
        if (result.error) {
          setDisplay(result.message);
        } else {
          const formattedResult = formatNumber(result.value);
          setHistory(prev => [{
            expression: display,
            result: formattedResult,
            id: Date.now(),
          }, ...prev].slice(0, 20));
          setDisplay(formattedResult);
        }
        break;

      case 'memory':
        switch (value) {
          case 'MC':
            setMemory(0);
            break;
          case 'MR':
            setDisplay(prev => {
              if (prev === '0' || prev === 'Error') return memory.toString();
              return prev + memory.toString();
            });
            break;
          case 'M+':
            const evalResult = evaluate(display);
            if (!evalResult.error) {
              setMemory(prev => prev + evalResult.value);
            }
            break;
          case 'M-':
            const evalResult2 = evaluate(display);
            if (!evalResult.error) {
              setMemory(prev => prev - evalResult2.value);
            }
            break;
        }
        break;

      case 'parenthesis':
        if (display === '0' || display === 'Error') {
          setDisplay(value);
        } else {
          setDisplay(prev => prev + value);
        }
        break;

      case 'toggle':
        if (value === 'rad/deg') {
          setIsRadian(prev => !prev);
        } else if (value === '2nd') {
          setShowSecond(prev => !prev);
        }
        break;
    }
  }, [display, evaluate, memory]);

  // Button definitions
  const firstRowButtons = [
    { label: 'Rad', action: 'toggle', value: 'rad/deg', type: 'toggle', display: isRadian ? 'RAD' : 'DEG' },
    { label: '2nd', action: 'toggle', value: '2nd', type: 'toggle', display: showSecond ? '1st' : '2nd' },
    { label: 'MC', action: 'memory', value: 'MC', type: 'memory' },
    { label: 'MR', action: 'memory', value: 'MR', type: 'memory' },
  ];

  const secondRowButtons = [
    { label: 'M+', action: 'memory', value: 'M+', type: 'memory' },
    { label: 'M-', action: 'memory', value: 'M-', type: 'memory' },
    { label: '(', action: 'parenthesis', value: '(', type: 'operator' },
    { label: ')', action: 'parenthesis', value: ')', type: 'operator' },
  ];

  const mainButtons = showSecond ? [
    // Second function layout
    [
      { label: 'sin⁻¹', action: 'function', value: 'sin⁻¹(', type: 'function' },
      { label: 'cos⁻¹', action: 'function', value: 'cos⁻¹(', type: 'function' },
      { label: 'tan⁻¹', action: 'function', value: 'tan⁻¹(', type: 'function' },
      { label: '÷', action: 'operator', value: '÷', type: 'operator' },
    ],
    [
      { label: 'sinh', action: 'function', value: 'sinh(', type: 'function' },
      { label: 'cosh', action: 'function', value: 'cosh(', type: 'function' },
      { label: 'tanh', action: 'function', value: 'tanh(', type: 'function' },
      { label: '×', action: 'operator', value: '×', type: 'operator' },
    ],
    [
      { label: '∛', action: 'function', value: '∛(', type: 'function' },
      { label: 'xʸ', action: 'operator', value: '^', type: 'operator' },
      { label: '10ˣ', action: 'function', value: '10^(', type: 'function' },
      { label: '−', action: 'operator', value: '−', type: 'operator' },
    ],
    [
      { label: 'n!', action: 'function', value: '!', type: 'function' },
      { label: 'abs', action: 'function', value: 'abs(', type: 'function' },
      { label: 'mod', action: 'operator', value: 'mod', type: 'operator' },
      { label: '+', action: 'operator', value: '+', type: 'operator' },
    ],
  ] : [
    // Normal layout
    [
      { label: 'sin', action: 'function', value: 'sin(', type: 'function' },
      { label: 'cos', action: 'function', value: 'cos(', type: 'function' },
      { label: 'tan', action: 'function', value: 'tan(', type: 'function' },
      { label: '÷', action: 'operator', value: '÷', type: 'operator' },
    ],
    [
      { label: 'ln', action: 'function', value: 'ln(', type: 'function' },
      { label: 'log', action: 'function', value: 'log(', type: 'function' },
      { label: '√', action: 'function', value: '√(', type: 'function' },
      { label: '×', action: 'operator', value: '×', type: 'operator' },
    ],
    [
      { label: 'xʸ', action: 'operator', value: '^', type: 'operator' },
      { label: 'π', action: 'constant', value: 'π', type: 'constant' },
      { label: 'e', action: 'constant', value: 'e', type: 'constant' },
      { label: '−', action: 'operator', value: '−', type: 'operator' },
    ],
    [
      { label: '%', action: 'operator', value: '%', type: 'operator' },
      { label: '(', action: 'parenthesis', value: '(', type: 'operator' },
      { label: ')', action: 'parenthesis', value: ')', type: 'operator' },
      { label: '+', action: 'operator', value: '+', type: 'operator' },
    ],
  ];

  const bottomButtons = [
    [
      { label: 'C', action: 'clear', value: '', type: 'clear' },
      { label: '⌫', action: 'delete', value: '', type: 'delete' },
      { label: '.', action: 'number', value: '.', type: 'number' },
      { label: '=', action: 'equals', value: '', type: 'equals' },
    ],
  ];

  const numberGrid = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '00', '.'],
  ];

  const getButtonStyle = (type) => {
    switch (type) {
      case 'operator': return styles.btnOperator;
      case 'function': return styles.btnFunction;
      case 'toggle': return styles.btnToggle;
      case 'memory': return styles.btnMemory;
      case 'clear': return styles.btnClear;
      case 'delete': return styles.btnDelete;
      case 'equals': return styles.btnEquals;
      case 'constant': return styles.btnConstant;
      default: return styles.btnNumber;
    }
  };

  const getButtonTextStyle = (type) => {
    switch (type) {
      case 'operator': return styles.btnTextOperator;
      case 'function': return styles.btnTextFunction;
      case 'toggle': return styles.btnTextToggle;
      case 'memory': return styles.btnTextMemory;
      case 'clear': return styles.btnTextClear;
      case 'delete': return styles.btnTextDelete;
      case 'equals': return styles.btnTextEquals;
      case 'constant': return styles.btnTextConstant;
      default: return styles.btnTextNumber;
    }
  };

  const renderButton = (btn, size = BUTTON_SIZE) => (
    <TouchableOpacity
      key={btn.label}
      style={[
        styles.btn,
        getButtonStyle(btn.type),
        { width: size, height: size },
      ]}
      onPress={() => handlePress(btn.action, btn.value)}
      activeOpacity={0.7}
    >
      <Text style={[styles.btnText, getButtonTextStyle(btn.type)]}>
        {btn.display || btn.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Display */}
      <View style={styles.displayContainer}>
        <View style={styles.modeIndicator}>
          <Text style={styles.modeText}>
            {isRadian ? 'RAD' : 'DEG'} | {showSecond ? '2nd' : '1st'} | M: {memory}
          </Text>
        </View>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.displayScroll}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
            {display}
          </Text>
        </ScrollView>
        <Text style={styles.expressionText} numberOfLines={1}>
          {display}
        </Text>
      </View>

      {/* Scientific Functions Row */}
      <View style={styles.buttonRow}>
        {firstRowButtons.map(btn => renderButton(btn, (SCREEN_WIDTH - 56) / 4))}
      </View>

      <View style={styles.buttonRow}>
        {secondRowButtons.map(btn => renderButton(btn, (SCREEN_WIDTH - 56) / 4))}
      </View>

      {/* Main Scientific Buttons */}
      {mainButtons.map((row, idx) => (
        <View key={`main-${idx}`} style={styles.buttonRow}>
          {row.map(btn => renderButton(btn))}
        </View>
      ))}

      {/* Number Pad */}
      <View style={styles.numberPadContainer}>
        <View style={styles.numberGrid}>
          {numberGrid.map((row, rowIdx) => (
            <View key={`num-${rowIdx}`} style={styles.buttonRow}>
              {row.map(num => {
                const isZero = num === '0';
                return (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.btn,
                      styles.btnNumber,
                      {
                        width: isZero ? BUTTON_SIZE * 2 + 8 : BUTTON_SIZE,
                        height: BUTTON_SIZE,
                      },
                    ]}
                    onPress={() => handlePress('number', num)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.btnText, styles.btnTextNumber]}>{num}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Equals Column */}
        <View style={styles.equalsColumn}>
          {bottomButtons[0].map(btn => (
            <TouchableOpacity
              key={btn.label}
              style={[
                styles.btn,
                getButtonStyle(btn.type),
                { width: BUTTON_SIZE, height: btn.label === '=' ? BUTTON_SIZE * 2 + 8 : BUTTON_SIZE },
              ]}
              onPress={() => handlePress(btn.action, btn.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, getButtonTextStyle(btn.type)]}>
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* History */}
      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recent Calculations</Text>
          {history.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.historyItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setDisplay(item.result);
              }}
            >
              <Text style={styles.historyExpression} numberOfLines={1}>
                {item.expression}
              </Text>
              <Text style={styles.historyResult}> = {item.result}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  displayContainer: {
    backgroundColor: colors.bgInput,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    justifyContent: 'flex-end',
  },
  modeIndicator: {
    marginBottom: 8,
  },
  modeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  displayScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  displayText: {
    color: colors.white,
    fontSize: 36,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '300',
    textAlign: 'right',
    letterSpacing: 1,
  },
  expressionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'right',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  numberPadContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  numberGrid: {
    flex: 1,
    gap: 8,
  },
  equalsColumn: {
    gap: 8,
  },
  btn: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
  // Button types
  btnNumber: {
    backgroundColor: colors.bgCard,
  },
  btnOperator: {
    backgroundColor: colors.purpleBg,
    borderColor: colors.purple,
  },
  btnFunction: {
    backgroundColor: colors.accentBg,
    borderColor: 'rgba(0,212,170,0.3)',
  },
  btnToggle: {
    backgroundColor: 'rgba(255,165,2,0.1)',
    borderColor: 'rgba(255,165,2,0.3)',
  },
  btnMemory: {
    backgroundColor: colors.bgCard,
    borderColor: colors.border,
  },
  btnClear: {
    backgroundColor: 'rgba(255,71,87,0.15)',
    borderColor: colors.danger,
  },
  btnDelete: {
    backgroundColor: 'rgba(255,165,2,0.1)',
    borderColor: colors.warning,
  },
  btnEquals: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  btnConstant: {
    backgroundColor: 'rgba(52,152,219,0.1)',
    borderColor: 'rgba(52,152,219,0.3)',
  },
  // Button text colors
  btnTextNumber: {
    color: colors.white,
  },
  btnTextOperator: {
    color: colors.purpleGlow,
    fontSize: 20,
  },
  btnTextFunction: {
    color: colors.accentGlow,
    fontSize: 15,
  },
  btnTextToggle: {
    color: colors.warning,
    fontSize: 13,
  },
  btnTextMemory: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  btnTextClear: {
    color: colors.danger,
    fontWeight: '700',
  },
  btnTextDelete: {
    color: colors.warning,
    fontSize: 20,
  },
  btnTextEquals: {
    color: colors.black,
    fontSize: 24,
    fontWeight: '700',
  },
  btnTextConstant: {
    color: colors.info,
    fontSize: 16,
  },
  historyContainer: {
    backgroundColor: colors.bgCard,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  historyExpression: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    flex: 1,
    textAlign: 'right',
  },
  historyResult: {
    color: colors.accentGlow,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
    width: 120,
  },
});