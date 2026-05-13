import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Account for tab bar (typical height ~50-55 on iOS, ~60 on Android)
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 50 : 60;
const GAP = 3;
const PAD = 6;
const COLS = 6;
const STATUS_H = 28;
const ROWS = 8;

// Calculate available height after subtracting status bar, padding, and tab bar
const AVAILABLE_HEIGHT = SCREEN_HEIGHT - STATUS_H - TAB_BAR_HEIGHT;
const KEYBOARD_PADDING = PAD * 2 + GAP * (ROWS - 1);
const BTN_H = Math.floor((AVAILABLE_HEIGHT * 0.58 - KEYBOARD_PADDING) / ROWS);
const KEYBOARD_H = ROWS * BTN_H + KEYBOARD_PADDING;
const BTN_W = Math.floor((SCREEN_WIDTH - PAD * 2 - GAP * (COLS - 1)) / COLS);
const DISPLAY_H = AVAILABLE_HEIGHT - KEYBOARD_H;

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [shift, setShift] = useState(false);
  const [isRadian, setIsRadian] = useState(true);
  const [history, setHistory] = useState([]);
  const displayScrollRef = useRef(null);

  const evaluate = (expr) => {
    try {
      let p = expr
        .replace(/−/g, '-')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `(${Math.PI})`)
        .replace(/\be\b/g, `(${Math.E})`)
        .replace(/sin⁻¹/g, 'Math.asin')
        .replace(/cos⁻¹/g, 'Math.acos')
        .replace(/tan⁻¹/g, 'Math.atan')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/ln/g, 'Math.log')
        .replace(/log/g, 'Math.log10')
        .replace(/√/g, 'Math.sqrt')
        .replace(/\^/g, '**')
        .replace(/abs/g, 'Math.abs')
        .replace(/EXP/g, '*10**')
        .replace(/(\d+)!/g, (_, n) => { 
          let f = 1; 
          for (let i = 2; i <= parseInt(n); i++) f *= i; 
          return f; 
        });
      
      const r = eval(p);
      if (!isFinite(r)) return 'Error';
      return String(Math.round(r * 1e10) / 1e10);
    } catch { 
      return 'Error'; 
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      displayScrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Delete all calculation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => setHistory([])
        },
      ]
    );
  };

  const press = (action, val) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (action === 'clear') { 
      setDisplay('0'); 
      setExpression(''); 
    }
    else if (action === 'delete') {
      setDisplay(p => p.length <= 1 || p === 'Error' ? '0' : p.slice(0, -1));
      setExpression(p => p.slice(0, -1));
    }
    else if (action === 'equals') {
      const expr = expression || display;
      const result = evaluate(expr);
      if (result !== 'Error') {
        setHistory(prev => [...prev, { expr, result, id: Date.now() }]);
      }
      setDisplay(result);
      setExpression('');
      scrollToBottom();
    }
    else if (action === 'shift') setShift(p => !p);
    else if (action === 'raddeg') setIsRadian(p => !p);
    else if (action === 'memory') {
      if (val === 'MC') setMemory(0);
      else if (val === 'MR') { 
        const memStr = String(memory);
        setDisplay(memStr); 
        setExpression(memStr); 
      }
      else if (val === 'M+') { 
        const r = evaluate(expression || display); 
        if (r !== 'Error') setMemory(p => p + parseFloat(r)); 
      }
      else if (val === 'M-') { 
        const r = evaluate(expression || display); 
        if (r !== 'Error') setMemory(p => p - parseFloat(r)); 
      }
    }
    else {
      const char = val;
      if (history.length > 0 && expression === '' && display !== '0' && display !== 'Error' && action === 'number') {
        setDisplay(char);
        setExpression(char);
        scrollToBottom();
        return;
      }
      setDisplay(p => {
        if (p === '0' || p === 'Error') return char;
        if (p.length >= 14) return p;
        if (action === 'operator') {
          if (expression === '' && history.length > 0 && p !== '0') {
            setExpression(p + char);
            return p + char;
          }
          const last = p.slice(-1);
          if ('+−×÷^'.includes(last)) return p.slice(0, -1) + char;
        }
        return p + char;
      });
      setExpression(p => {
        if (p === '' && history.length > 0 && display !== '0' && display !== 'Error' && action === 'operator') {
          return display + char;
        }
        return p + char;
      });
    }
    scrollToBottom();
  };

  const getButtonShadow = (type, isShifted) => {
    // 3D shadow effect that creates depth
    if (type === 'equals') {
      return {
        shadowColor: '#00ffaa',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        borderBottomWidth: 4,
        borderBottomColor: '#003322',
      };
    }
    if (type === 'clear') {
      return {
        shadowColor: '#ff5555',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        borderBottomWidth: 4,
        borderBottomColor: '#1a0a0a',
      };
    }
    if (type === 'delete') {
      return {
        shadowColor: '#ffaa00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        borderBottomWidth: 4,
        borderBottomColor: '#1a1a00',
      };
    }
    // Default 3D effect for all buttons
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
      borderBottomWidth: 3,
      borderBottomColor: 'rgba(0,0,0,0.4)',
      borderLeftWidth: 1,
      borderLeftColor: 'rgba(255,255,255,0.05)',
      borderRightWidth: 1,
      borderRightColor: 'rgba(0,0,0,0.2)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.1)',
    };
  };

  const B = ({ label, action, value, type, w }) => {
    const isShifted = type === 'shift' && shift;
    const bg = type === 'number' ? '#252540' :
               type === 'operator' ? '#2a2a50' :
               type === 'function' ? '#1e2a40' :
               type === 'shift' ? (shift ? '#0a2a1a' : '#1e1e35') :
               type === 'clear' ? '#401515' :
               type === 'delete' ? '#402a15' :
               type === 'equals' ? '#005535' :
               type === 'memory' ? '#1d1d35' :
               type === 'constant' ? '#1e2a40' : '#252540';
    
    const fg = type === 'equals' ? '#00ffaa' :
               type === 'clear' ? '#ff6666' :
               type === 'delete' ? '#ffaa00' :
               type === 'shift' ? (shift ? '#00ffaa' : '#88aa88') :
               type === 'function' ? '#88bbee' :
               type === 'operator' ? '#eecc88' :
               type === 'memory' ? '#aaaacc' :
               type === 'constant' ? '#77ccdd' : '#e0e0f0';
    
    const fs = type === 'number' ? Math.max(14, BTN_W * 0.22) : 
               type === 'operator' || type === 'equals' ? Math.max(16, BTN_W * 0.25) : 
               Math.max(9, BTN_W * 0.15);

    const shadowStyle = getButtonShadow(type, isShifted);

    return (
      <TouchableOpacity
        style={[styles.btn, {
          width: (w || 1) * BTN_W + (w ? (w - 1) * GAP : 0),
          height: BTN_H,
          backgroundColor: bg,
          ...shadowStyle,
        }, (isShifted || type === 'equals') && styles.highlightedBtn]}
        onPress={() => press(action, value)}
        activeOpacity={0.7}
      >
        <Text style={[styles.bt, { 
          color: fg, 
          fontSize: fs,
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const Row = ({ children }) => <View style={styles.row}>{children}</View>;

  const sci = shift ? [
    ['sin⁻¹','cos⁻¹','tan⁻¹','10ˣ','n!','abs'],
    ['nCr','nPr','eˣ','mod','M+','M-'],
  ] : [
    ['sin','cos','tan','ln','log','√'],
    ['x²','xⁿ','EXP','π','e','mod'],
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Status Bar */}
      <View style={styles.stat}>
        <Text style={styles.st}>{isRadian ? 'RAD' : 'DEG'}  {shift ? '🟢' : '⚫'} Shift</Text>
        <View style={styles.statRight}>
          {history.length > 0 && (
            <TouchableOpacity onPress={clearHistory} activeOpacity={0.6} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.st}>M={memory}</Text>
        </View>
      </View>

      {/* Display Area */}
      <View style={[styles.disp, { height: DISPLAY_H }]}>
        <ScrollView
          ref={displayScrollRef}
          style={styles.displayScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => displayScrollRef.current?.scrollToEnd({ animated: false })}
          bounces={true}
          keyboardShouldPersistTaps="handled"
        >
          {history.map((h, idx) => (
            <View key={h.id}>
              <TouchableOpacity
                style={styles.historyItem}
                onPress={() => {
                  setDisplay(h.result);
                  setExpression('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.historyExpr} numberOfLines={1}>{h.expr}</Text>
                <Text style={styles.historyResult}> = {h.result}</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          ))}

          <View style={styles.currentSection}>
            <Text style={styles.currentExpr} numberOfLines={2}>{expression || ' '}</Text>
            <Text style={styles.currentDisplay} numberOfLines={1} adjustsFontSizeToFit>
              {display}
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Keyboard */}
      <View style={styles.kb}>
        <Row>
          {sci[0].map((s, i) => (
            <B key={`s1-${i}`} label={s} 
              action={s === 'π' || s === 'e' ? 'constant' : s === 'mod' || s === 'xⁿ' ? 'operator' : s === 'M+' || s === 'M-' ? 'memory' : 'function'}
              value={s === 'x²' ? '^(2)' : s === 'xⁿ' ? '^' : s + (['sin','cos','tan','ln','log','√','sin⁻¹','cos⁻¹','tan⁻¹','abs'].includes(s) ? '(' : '')}
              type={s === 'π' || s === 'e' ? 'constant' : s === 'M+' || s === 'M-' ? 'memory' : s === 'mod' || s === 'xⁿ' ? 'operator' : 'function'} />
          ))}
        </Row>

        <Row>
          {sci[1].map((s, i) => (
            <B key={`s2-${i}`} label={s}
              action={s === 'π' || s === 'e' ? 'constant' : s === 'mod' || s === 'xⁿ' ? 'operator' : 'function'}
              value={s === 'x²' ? '^(2)' : s === 'xⁿ' ? '^' : s}
              type={s === 'π' || s === 'e' ? 'constant' : s === 'mod' || s === 'xⁿ' ? 'operator' : 'function'} />
          ))}
        </Row>

        <Row>
          <B label="Shift" action="shift" value="" type="shift" />
          <B label="R/D" action="raddeg" value="" type="shift" />
          <B label="(" action="function" value="(" type="function" />
          <B label=")" action="function" value=")" type="function" />
          <B label="%" action="operator" value="%" type="operator" />
          <B label="⌫" action="delete" value="" type="delete" />
        </Row>

        <Row>
          <B label="MC" action="memory" value="MC" type="memory" />
          <B label="MR" action="memory" value="MR" type="memory" />
          <B label="M+" action="memory" value="M+" type="memory" />
          <B label="M-" action="memory" value="M-" type="memory" />
          <B label="AC" action="clear" value="" type="clear" w={2} />
        </Row>

        <Row>
          <B label="7" action="number" value="7" type="number" />
          <B label="8" action="number" value="8" type="number" />
          <B label="9" action="number" value="9" type="number" />
          <B label="÷" action="operator" value="÷" type="operator" />
          <B label="×" action="operator" value="×" type="operator" />
          <B label="n!" action="function" value="!" type="function" />
        </Row>

        <Row>
          <B label="4" action="number" value="4" type="number" />
          <B label="5" action="number" value="5" type="number" />
          <B label="6" action="number" value="6" type="number" />
          <B label="+" action="operator" value="+" type="operator" />
          <B label="−" action="operator" value="−" type="operator" />
          <B label="nCr" action="function" value="nCr" type="function" />
        </Row>

        <Row>
          <B label="1" action="number" value="1" type="number" />
          <B label="2" action="number" value="2" type="number" />
          <B label="3" action="number" value="3" type="number" />
          <B label="nPr" action="function" value="nPr" type="function" />
          <B label="." action="number" value="." type="number" w={2} />
        </Row>

        <Row>
          <B label="0" action="number" value="0" type="number" w={2} />
          <B label="EXP" action="function" value="EXP" type="function" />
          <B label="e⁰" action="constant" value="e" type="constant" />
          <B label="=" action="equals" value="" type="equals" w={2} />
        </Row>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#080812',
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    height: STATUS_H,
    backgroundColor: '#0c0c1a',
  },
  statRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  st: {
    color: '#88bb88',
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  clearBtn: {
    backgroundColor: '#2a1518',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  clearBtnText: {
    color: '#ff5555',
    fontSize: 8,
    fontWeight: '600',
  },
  disp: {
    backgroundColor: '#060618',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a30',
  },
  displayScroll: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  historyItem: {
    paddingVertical: 6,
  },
  historyExpr: {
    color: '#666688',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'right',
  },
  historyResult: {
    color: '#f0f0ff',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#1a1a30',
    marginVertical: 6,
    marginHorizontal: 4,
    borderStyle: 'dashed',
  },
  currentSection: {
    paddingTop: 4,
  },
  currentExpr: {
    color: '#555577',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'right',
    marginBottom: 4,
  },
  currentDisplay: {
    color: '#ffffff',
    fontSize: 30,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'right',
    fontWeight: '300',
    paddingBottom: 4,
  },
  kb: {
    padding: PAD,
    backgroundColor: '#080812',
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
    marginBottom: GAP,
    justifyContent: 'center',
  },
  btn: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // 3D base styling
    transform: [{ perspective: 1000 }],
  },
  highlightedBtn: {
    borderWidth: 1.5,
    borderColor: '#00d4aa',
  },
  bt: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
    fontWeight: '600',
    textAlign: 'center',
  },
});