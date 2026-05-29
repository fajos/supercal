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
import { useHistory } from '../utils/history';
import { colors } from '../theme/colors';

const COLS = 6;
const STATUS_H = 28;
const ROWS = 8;

const BlinkCursor = React.memo(() => {
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
});

const CalculatorButton = React.memo(({ label, secondaryLabel, action, value, type, w, onPress, BTN_H, BTN_W, GAP, shift }) => {
  const isShifted = type === 'shift' && shift;
  
  const bg = useMemo(() => {
    if (type === 'number') return '#252540';
    if (type === 'operator') return '#2a2a50';
    if (type === 'function') return '#1e2a40';
    if (type === 'shift') return shift ? '#0a2a1a' : '#1e1e35';
    if (type === 'clear') return '#401515';
    if (type === 'delete') return '#402a15';
    if (type === 'equals') return '#005535';
    if (type === 'memory') return '#1d1d35';
    if (type === 'constant') return '#1e2a40';
    return '#252540';
  }, [type, shift]);
  
  const fg = useMemo(() => {
    if (type === 'equals') return '#00ffaa';
    if (type === 'clear') return '#ff6666';
    if (type === 'delete') return '#ffaa00';
    if (type === 'shift') return shift ? '#00ffaa' : '#88aa88';
    if (type === 'function') return '#88bbee';
    if (type === 'operator') return '#eecc88';
    if (type === 'memory') return '#aaaacc';
    if (type === 'constant') return '#77ccdd';
    return '#e0e0f0';
  }, [type, shift]);
  
  const fs = useMemo(() => {
    if (type === 'number') return Math.min(BTN_H * 0.58, Math.max(28, BTN_W * 0.52));
    if (type === 'operator' || type === 'equals') return Math.min(BTN_H * 0.65, Math.max(32, BTN_W * 0.58));
    return Math.min(BTN_H * 0.42, Math.max(16, BTN_W * 0.35));
  }, [type, BTN_H, BTN_W]);

  const shadowStyle = useMemo(() => {
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
  }, [type]);

  return (
    <TouchableOpacity
      style={[styles.btn, {
        width: (w || 1) * BTN_W + (w ? (w - 1) * GAP : 0),
        height: BTN_H,
        backgroundColor: bg,
        ...shadowStyle,
      }, (isShifted || type === 'equals') && styles.highlightedBtn]}
      onPress={() => onPress(action, value)}
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
});

const Row = React.memo(({ children }) => (
  <View style={[styles.row, { gap: 2 }]}>{children}</View>
));

export default function CalculatorScreen() {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  let tabBarHeight = 0;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (e) {
    tabBarHeight = 0;
  }

  const GAP = 2;
  const PAD = 8;

  const bottomReserved = tabBarHeight > 0 ? tabBarHeight : insets.bottom;
  const AVAILABLE_HEIGHT = SCREEN_HEIGHT - insets.top - STATUS_H - bottomReserved;

  const KB_HEIGHT_RATIO = 0.72;
  const KB_VPAD = 6;
  const KEYBOARD_INTERNAL_PAD_V = KB_VPAD + GAP * (ROWS - 1);

  const BTN_H = Math.floor((AVAILABLE_HEIGHT * KB_HEIGHT_RATIO - KEYBOARD_INTERNAL_PAD_V) / ROWS);
  const BTN_W = Math.floor((SCREEN_WIDTH - PAD * 2 - GAP * (COLS - 1)) / COLS);
  const DISPLAY_H = AVAILABLE_HEIGHT - (BTN_H * ROWS + KEYBOARD_INTERNAL_PAD_V);

  const [display, setDisplay] = useState('');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [shift, setShift] = useState(false);
  const [isRadian, setIsRadian] = useState(true);
  const { history, addToHistory, clearHistory: clearAllHistory } = useHistory();

  const calculatorHistory = useMemo(() =>
    history
      .filter(h => h && h.type === 'calculator')
      .map(h => ({
        ...h,
        // Ensure we always have strings for rendering to avoid React child errors
        expr: String(h.expr || ''),
        result: typeof h.result === 'object' ? JSON.stringify(h.result) : String(h.result ?? ''),
      }))
      .reverse(),
    [history]
  );

  const [isFinished, setIsFinished] = useState(false);
  const [isPrompt, setIsPrompt] = useState(true);
  
  const displayScrollRef = useRef(null);
  const currentInputRef = useRef(null);
  const lastScrollTime = useRef(0);

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

  const evaluate = useCallback((expr) => {
    try {
      const fact = (n) => {
        if (n < 0) return NaN;
        if (n === 0) return 1;
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        return f;
      };
      const nCr = (n, r) => fact(n) / (fact(r) * fact(n - r));
      const nPr = (n, r) => fact(n) / fact(n - r);

      const lastResult = calculatorHistory.length > 0 ? calculatorHistory[calculatorHistory.length - 1].result : '0';
      let p = expr
        .replace(/Ans/g, `(${lastResult})`)
        .replace(/Rand/g, () => `(${Math.random()})`)
        .replace(/−/g, '-')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, `(${Math.PI})`)
        .replace(/\be\b/g, `(${Math.E})`);

      p = p.replace(/10\^/g, '10**').replace(/e\^/g, 'Math.E**');

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
  }, [history, isRadian]);

  // Ensure current input area is always visible
  const ensureCurrentInputVisible = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < 16) {
      return;
    }
    lastScrollTime.current = now;
    
    requestAnimationFrame(() => {
      if (currentInputRef.current) {
        currentInputRef.current.measureLayout(
          displayScrollRef.current,
          (x, y, width, height) => {
            // Scroll to show the current input with some padding at the bottom
            displayScrollRef.current?.scrollTo({
              y: y + height - DISPLAY_H + 60, // 60px padding to ensure visibility
              animated: false
            });
          },
          (error) => {
            // Fallback if measureLayout fails
            displayScrollRef.current?.scrollToEnd({ animated: false });
          }
        );
      }
    });
  }, [DISPLAY_H]);

  // Auto-scroll when display or history changes
  useEffect(() => {
    if (display || history.length > 0 || isPrompt) {
      // Small delay to allow layout to complete
      const timer = setTimeout(() => {
        ensureCurrentInputVisible();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [display, history, isPrompt, ensureCurrentInputVisible]);

  const clearHistory = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Delete all calculation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => clearAllHistory()
        },
      ]
    );
  }, [clearAllHistory]);

  const press = useCallback((action, val) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isPrompt) {
      setIsPrompt(false);
      setDisplay('');
      setExpression('');
    }
    
    if (action === 'shift') { 
      setShift(p => !p); 
      return; 
    }
    if (action === 'raddeg') { 
      setIsRadian(p => !p); 
      return; 
    }
    if (action === 'clear') {
      setDisplay('');
      setExpression('');
      setIsFinished(false);
      setIsPrompt(true);
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
          setMemory(p => {
            const r = parseFloat(display);
            if (!isNaN(r)) return val === 'M+' ? p + r : p - r;
            return p;
          });
          setIsFinished(true);
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
      return;
    }

    if (action === 'delete') {
      if (isPrompt) return;
      
      setDisplay(prev => {
        if (!prev || prev === 'Error' || prev.length <= 1) {
          if (!isPrompt) setIsPrompt(true);
          return '';
        }
        return prev.slice(0, -1);
      });

      setExpression(prev => prev.length > 0 ? prev.slice(0, -1) : '');
      return;
    }

    if (action === 'equals') {
      const expr = expression || display;
      if (expr === '' || expr === 'Error') return;
      const result = evaluate(expr);
      if (result !== 'Error') {
        addToHistory({
          type: 'calculator',
          expr,
          result,
          id: Date.now(),
          timestamp: new Date().toISOString(),
        });
        setDisplay('');
        setExpression('');
        setIsFinished(false);
        setIsPrompt(true);
      } else {
        setDisplay('Error');
        setExpression('');
        setIsFinished(true);
      }
    } else if (action === 'memory') {
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
    } else {
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
  }, [isPrompt, isFinished, display, expression, memory, evaluate]);

  const scrollViewContent = useMemo(() => (
    <React.Fragment>
      {calculatorHistory.map((h, index) => (
        <View key={h.id || h.timestamp || `calc-hist-${index}`}>
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

      <View 
        ref={currentInputRef}
        style={styles.currentSection}
      >
        <Text style={styles.currentExpr} numberOfLines={2} adjustsFontSizeToFit>
          {String(display)}
          {isPrompt && <BlinkCursor />}
        </Text>
      </View>
    </React.Fragment>
  ), [calculatorHistory, display, isPrompt]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
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

      <View style={[styles.disp, { height: DISPLAY_H }]}>
        <ScrollView
          ref={displayScrollRef}
          style={styles.displayScroll}
          showsVerticalScrollIndicator={false}
          bounces={true}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
        >
          {scrollViewContent}
        </ScrollView>
      </View>

      <View style={[styles.kb, {
        paddingTop: KB_VPAD,
        paddingHorizontal: PAD,
        paddingBottom: 0,
        gap: GAP
      }]}>
        {sciRows.map((row, rowIndex) => (
          <Row key={`sci-row-${rowIndex}`}>
            {row.map((btn, i) => (
              <CalculatorButton
                key={`sci-${rowIndex}-${i}`}
                label={shift ? btn.s : btn.p}
                secondaryLabel={!shift ? btn.s : null}
                action={shift ? (btn.st || btn.t) : btn.t}
                value={shift ? btn.sv : btn.v}
                type={shift ? (btn.st || btn.t) : btn.t}
                BTN_H={BTN_H}
                BTN_W={BTN_W}
                GAP={GAP}
                shift={shift}
                onPress={press}
              />
            ))}
          </Row>
        ))}

        <Row>
          <CalculatorButton label="Shift" action="shift" value="" type="shift" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="R/D" action="raddeg" value="" type="shift" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="(" action="function" value="(" type="function" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label=")" action="function" value=")" type="function" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="%" action="operator" value="%" type="operator" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="⌫" action="delete" value="" type="delete" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
        </Row>

        <Row>
          <CalculatorButton label="MC" action="memory" value="MC" type="memory" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="MR" action="memory" value="MR" type="memory" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="M+" action="memory" value="M+" type="memory" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="M-" action="memory" value="M-" type="memory" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="AC" action="clear" value="" type="clear" w={2} BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
        </Row>

        <Row>
          <CalculatorButton label="7" action="number" value="7" type="number" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="8" action="number" value="8" type="number" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="9" action="number" value="9" type="number" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="÷" action="operator" value="÷" type="operator" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="×" action="operator" value="×" type="operator" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="n!" action="function" value="!" type="function" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
        </Row>

        <Row>
          <CalculatorButton label="4" action="number" value="4" type="number" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="5" action="number" value="5" type="number" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="6" action="number" value="6" type="number" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="+" action="operator" value="+" type="operator" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="−" action="operator" value="−" type="operator" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="Ans" action="function" value="Ans" type="function" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
        </Row>

        <Row>
          <CalculatorButton label="1" action="number" value="1" type="number" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="2" action="number" value="2" type="number" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="3" action="number" value="3" type="number" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="Rand" action="function" value="Rand" type="function" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="." action="number" value="." type="number" w={2} BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
        </Row>

        <Row>
          <CalculatorButton label="0" action="number" value="0" type="number" w={2} BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="π" action="constant" value="π" type="constant" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="°" action="constant" value="°" type="constant" BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
          <CalculatorButton label="=" action="equals" value="" type="equals" w={2} BTN_H={BTN_H} BTN_W={BTN_W} GAP={GAP} shift={shift} onPress={press} />
        </Row>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    height: STATUS_H,
    backgroundColor: colors.bgSecondary,
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
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  clearBtnText: {
    color: colors.danger,
    fontSize: 8,
    fontWeight: '600',
  },
  disp: {
    flex: 1,
    backgroundColor: colors.bgInput,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
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
    color: colors.accent,
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'left',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 212, 170, 0.3)',
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
    color: colors.accent,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    marginRight: 8,
    opacity: 0.5,
  },
  historyResult: {
    color: colors.accent,
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 212, 170, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 6,
    marginHorizontal: 4,
    borderStyle: 'dashed',
  },
  currentSection: {
    paddingBottom: 16,
    paddingTop: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: 80,
    justifyContent: 'flex-start',
  },
  currentExpr: {
    color: colors.accent,
    fontSize: 42,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'left',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 212, 170, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  kb: {
    paddingBottom: 0,
    backgroundColor: colors.bgPrimary,
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
    color: colors.accent,
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 212, 170, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});