import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';


const COLS = 6;
const STATUS_H = 28;
const ROWS = 8;

const BlinkCursor = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.Text style={[styles.promptCursor, { opacity }]}>|</Animated.Text>
  );
};

export default function CalculatorScreen() {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  let tabBarHeight = 0;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (e) {
    // If we're not inside a tab navigator, default to 0 and rely on safe area insets
    tabBarHeight = 0;
  }

  const GAP = 2;
  const PAD = 8;

  // Total vertical space excluding system-reserved areas for proportionality
  const bottomReserved = tabBarHeight > 0 ? tabBarHeight : insets.bottom;
  const AVAILABLE_HEIGHT = SCREEN_HEIGHT - insets.top - STATUS_H - bottomReserved;

  const KB_HEIGHT_RATIO = 0.72;
  const KB_VPAD = 6; // All top padding
  const KEYBOARD_INTERNAL_PAD_V = KB_VPAD + GAP * (ROWS - 1);

  const BTN_H = Math.floor((AVAILABLE_HEIGHT * KB_HEIGHT_RATIO - KEYBOARD_INTERNAL_PAD_V) / ROWS);
  const BTN_W = Math.floor((SCREEN_WIDTH - PAD * 2 - GAP * (COLS - 1)) / COLS);
  const DISPLAY_H = AVAILABLE_HEIGHT - (BTN_H * ROWS + KEYBOARD_INTERNAL_PAD_V);

  const [display, setDisplay] = useState('');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [shift, setShift] = useState(false);
  const [isRadian, setIsRadian] = useState(true);
  const [history, setHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const displayScrollRef = useRef(null);

  const [isPrompt, setIsPrompt] = useState(true);

  const sciRows = useMemo(() => [
    [
      { p: 'sin', s: 'sin⁻¹', v: 'sin(', sv: 'sin⁻¹(', t: 'function', st: 'function' },
      { p: 'cos', s: 'cos⁻¹', v: 'cos(', sv: 'cos⁻¹(', t: 'function', st: 'function' },
      { p: 'tan', s: 'tan⁻¹', v: 'tan(', sv: 'tan⁻¹(', t: 'function', st: 'function' },
      { p: 'ln', s: 'eˣ', v: 'ln(', sv: 'e^', t: 'function', st: 'function' },
      { p: 'log', s: '10ˣ', v: 'log(', sv: '10^', t: 'function', st: 'function' },
      { p: 'log₂', s: '2ˣ', v: 'log₂(', sv: '2^', t: 'function', st: 'function' },
    ],
    [
      { p: '√', s: 'x²', v: '√(', sv: '^2', t: 'function', st: 'operator' },
      { p: '∛', s: 'x³', v: '∛(', sv: '^3', t: 'function', st: 'operator' },
      { p: 'xʸ', s: 'ʸ√x', v: '^', sv: '^(1/', t: 'operator', st: 'operator' },
      { p: 'abs', s: 'x!', v: 'abs(', sv: '!', t: 'function', st: 'function' },
      { p: 'nCr', s: 'nPr', v: 'nCr', sv: 'nPr', t: 'operator', st: 'operator' },
      { p: 'EXP', s: 'mod', v: 'EXP', sv: 'mod', t: 'operator', st: 'operator' },
    ],
  ], []);

  const evaluate = (expr) => {
    try {
      // Helper functions for nCr and nPr
      const fact = (n) => {
        if (n < 0) return NaN;
        if (n === 0) return 1;
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        return f;
      };
      const nCr = (n, r) => fact(n) / (fact(r) * fact(n - r));
      const nPr = (n, r) => fact(n) / fact(n - r);

      const lastResult = history.length > 0 ? history[history.length - 1].result : '0';
      let p = expr
        .replace(/Ans/g, `(${lastResult})`)
        .replace(/Rand/g, () => `(${Math.random()})`)
        .replace(/−/g, '-')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `(${Math.PI})`)
        .replace(/\be\b/g, `(${Math.E})`);

      // Handle scientific powers
      p = p.replace(/10\^/g, '10**').replace(/e\^/g, 'Math.E**');

      // Handle trig functions based on Radian/Degree mode
      if (isRadian) {
        p = p
          .replace(/sin⁻¹/g, 'Math.asin')
          .replace(/cos⁻¹/g, 'Math.acos')
          .replace(/tan⁻¹/g, 'Math.atan')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan');
      } else {
        p = p
          .replace(/sin⁻¹/g, '(x => Math.asin(x) * 180 / Math.PI)')
          .replace(/cos⁻¹/g, '(x => Math.acos(x) * 180 / Math.PI)')
          .replace(/tan⁻¹/g, '(x => Math.atan(x) * 180 / Math.PI)')
          .replace(/sin/g, '(x => Math.sin(x * Math.PI / 180))')
          .replace(/cos/g, '(x => Math.cos(x * Math.PI / 180))')
          .replace(/tan/g, '(x => Math.tan(x * Math.PI / 180))');
      }

      p = p
        .replace(/ln/g, 'Math.log')
        .replace(/log₂/g, 'Math.log2')
        .replace(/log/g, 'Math.log10')
        .replace(/√/g, 'Math.sqrt')
        .replace(/∛/g, 'Math.cbrt')
        .replace(/\^/g, '**')
        .replace(/abs/g, 'Math.abs')
        .replace(/EXP/g, '*10**')
        .replace(/mod/g, '%')
        .replace(/°/g, isRadian ? '*Math.PI/180' : '')
        .replace(/(\d+)nCr(\d+)/g, (_, n, r) => nCr(parseInt(n), parseInt(r)))
        .replace(/(\d+)nPr(\d+)/g, (_, n, r) => nPr(parseInt(n), parseInt(r)))
        .replace(/(\d+)!/g, (_, n) => fact(parseInt(n)));
      
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

    if (isPrompt) {
    setIsPrompt(false);
    setDisplay('');
    setExpression('');
  }
    
    if (action === 'shift') { setShift(p => !p); return; }
    if (action === 'raddeg') { setIsRadian(p => !p); return; }
    if (action === 'clear') {
      setDisplay('');
      setExpression('');
      setIsFinished(false);
      setIsPrompt(true);   // reset to cursor mode
      return;
    }


    if (isFinished) {
      if (action === 'equals') return;
      if (action === 'delete') {
        setDisplay('0');
        setExpression('');
        setIsFinished(false);
        return;
      }

      setIsFinished(false);
      if (action === 'operator') {
        const startVal = '0' + val;
        setDisplay(startVal);
        setExpression(startVal);
      } else if (action === 'memory') {
        if (val === 'MC') setMemory(0);
        else if (val === 'M+' || val === 'M-') {
          const r = parseFloat(display);
          if (!isNaN(r)) setMemory(p => val === 'M+' ? p + r : p - r);
          setIsFinished(true); // Keep result visible
        } else if (val === 'MR') {
          const memStr = String(memory);
          setDisplay(memStr);
          setExpression(memStr);
        }
        return;
      } else if (action === 'number' || action === 'function' || action === 'constant') {
        setDisplay(val);
        setExpression(val);
      }
      scrollToBottom();
      return;
    }

if (action === 'delete') {
  // If already in prompt mode, do nothing
  if (isPrompt) {
    return; // keep the blinking cursor visible
  }

  setDisplay(prev => {
    if (!prev || prev === 'Error' || prev.length <= 1) {
      // Switch to prompt mode once, and stay there
      if (!isPrompt) setIsPrompt(true);
      return '';
    }
    return prev.slice(0, -1);
  });

  setExpression(prev => prev.length > 0 ? prev.slice(0, -1) : '');
  return;
}


    else if (action === 'equals') {
      const expr = expression || display;
      if (expr === '' || expr === 'Error') return;
      const result = evaluate(expr);
      if (result !== 'Error') {
        setHistory(prev => [...prev, { expr, result, id: Date.now() }]);
        setDisplay('');
        setExpression('');
        setIsFinished(false);
        setIsPrompt(true);
      } else {
        setDisplay('Error');
        setExpression('');
        setIsFinished(true);
      }
    }
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
      if (action === 'operator') {
        setDisplay(p => {
          if (p === 'Error') return char;
          const last = p.slice(-1);
          if ('+−×÷^'.includes(last)) return p.slice(0, -1) + char;
          return p + char;
        });
        setExpression(p => {
          const last = p.slice(-1);
          if ('+−×÷^'.includes(last)) return p.slice(0, -1) + char;
          return p + char;
        });
      } else {
        setDisplay(p => (p === '0' || p === 'Error') ? char : (p.length < 40 ? p + char : p));
        setExpression(p => p + char);
      }
    }
    scrollToBottom();
  };

  const getButtonShadow = (type, isShifted) => {
    // 3D shadow effect that creates depth
    if (type === 'equals') {
      return {
        shadowColor: '#00ffaa',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 1,
        borderBottomWidth: 0,
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

  const B = ({ label, secondaryLabel, action, value, type, w }) => {
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
    
    const fs = type === 'number' ? Math.min(BTN_H * 0.58, Math.max(28, BTN_W * 0.52)) :
               type === 'operator' || type === 'equals' ? Math.min(BTN_H * 0.65, Math.max(32, BTN_W * 0.58)) :
               Math.min(BTN_H * 0.42, Math.max(16, BTN_W * 0.35));

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
        {secondaryLabel && (
          <Text
            style={styles.secondaryLabel}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {secondaryLabel}
          </Text>
        )}
        <Text
          style={[styles.bt, {
            color: fg,
            fontSize: fs,
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
            letterSpacing: -0.6,
          }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >{label}</Text>
      </TouchableOpacity>
    );
  };

  const Row = ({ children }) => <View style={[styles.row, { gap: GAP }]}>{children}</View>;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
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
                  setExpression(h.expr);
                  setIsFinished(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.historyExpr} numberOfLines={1} adjustsFontSizeToFit>{h.expr}</Text>
                <View style={styles.historyResultContainer}>
                  <Text style={styles.historyEqual}>=</Text>
                  <Text style={styles.historyResult} numberOfLines={1} adjustsFontSizeToFit>{h.result}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          ))}

          <View style={styles.currentSection}>
            <Text style={styles.currentExpr} numberOfLines={2} adjustsFontSizeToFit>
              {display}
              {isPrompt && <BlinkCursor />}
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Keyboard */}
      <View style={[styles.kb, {
        paddingTop: KB_VPAD,
        paddingHorizontal: PAD,
        paddingBottom: 0,
        gap: GAP
      }]}>
        {sciRows.map((row, rowIndex) => (
          <Row key={`sci-row-${rowIndex}`}>
            {row.map((btn, i) => (
              <B
                key={`sci-${rowIndex}-${i}`}
                label={shift ? btn.s : btn.p}
                secondaryLabel={!shift ? btn.s : null}
                action={shift ? (btn.st || btn.t) : btn.t}
                value={shift ? btn.sv : btn.v}
                type={shift ? (btn.st || btn.t) : btn.t}
              />
            ))}
          </Row>
        ))}

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
          <B label="Ans" action="function" value="Ans" type="function" />
        </Row>

        <Row>
          <B label="1" action="number" value="1" type="number" />
          <B label="2" action="number" value="2" type="number" />
          <B label="3" action="number" value="3" type="number" />
          <B label="Rand" action="function" value="Rand" type="function" />
          <B label="." action="number" value="." type="number" w={2} />
        </Row>

        <Row>
          <B label="0" action="number" value="0" type="number" w={2} />
          <B label="π" action="constant" value="π" type="constant" />
          <B label="°" action="constant" value="°" type="constant" />
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
    flex: 1,
    backgroundColor: '#060618',
    borderBottomWidth: 1,
    borderBottomColor: '#00ffcc',
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  displayScroll: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  historyItem: {
    paddingVertical: 12,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  historyExpr: {
    color: '#00ffcc',
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'left',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 255, 204, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    opacity: 0.8,
  },
  historyResultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  historyEqual: {
    color: '#00ffcc',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    marginRight: 8,
    opacity: 0.5,
  },
  historyResult: {
    color: '#00ffcc',
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 255, 204, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#1a1a30',
    marginVertical: 6,
    marginHorizontal: 4,
    borderStyle: 'dashed',
  },
  currentSection: {
    paddingBottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: 120,
    justifyContent: 'flex-start',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  resultEqual: {
    color: '#00ffcc',
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    marginRight: 12,
    opacity: 0.7,
    textShadowColor: 'rgba(0, 255, 204, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  currentExpr: {
    color: '#00ffcc',
    fontSize: 42,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'left',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 255, 204, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  currentDisplay: {
    color: '#00ffcc',
    fontSize: 38,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'right',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 255, 204, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    flexShrink: 1,
  },
  kb: {
    paddingBottom: 0,
    backgroundColor: '#080812',
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
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
    fontWeight: '900',
    textAlign: 'center',
  },
  secondaryLabel: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 11,
    color: '#ffaa00',
    fontWeight: '900',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
promptCursor: {
  color: '#00ffcc',
  fontSize: 28,
  fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  fontWeight: '900',
  textShadowColor: 'rgba(0, 255, 204, 0.6)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 12,
},

});