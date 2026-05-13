import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Simple dense grid: 6 columns
const COLS = 6;
const GAP = 2;
const PAD = 4;
const BTN_W = Math.floor((SCREEN_WIDTH - PAD * 2 - GAP * (COLS - 1)) / COLS);
const BTN_H = Math.floor(BTN_W * 0.7);

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [shift, setShift] = useState(false);
  const [isRadian, setIsRadian] = useState(true);

  const evaluate = (expr) => {
    try {
      let p = expr
        .replace(/×/g, '*').replace(/÷/g, '/')
        .replace(/π/g, `(${Math.PI})`).replace(/\be\b/g, `(${Math.E})`)
        .replace(/sin⁻¹/g, 'Math.asin').replace(/cos⁻¹/g, 'Math.acos').replace(/tan⁻¹/g, 'Math.atan')
        .replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/tan/g, 'Math.tan')
        .replace(/ln/g, 'Math.log').replace(/log/g, 'Math.log10')
        .replace(/√/g, 'Math.sqrt').replace(/\^/g, '**')
        .replace(/(\d+)!/g, (_, n) => { let f = 1; for (let i = 2; i <= parseInt(n); i++) f *= i; return f; });
      const r = eval(p);
      return isFinite(r) ? r : 'Error';
    } catch { return 'Error'; }
  };

  const press = (action, val) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (action === 'clear') { setDisplay('0'); setExpression(''); }
    else if (action === 'delete') {
      setDisplay(p => p.length <= 1 || p === 'Error' ? '0' : p.slice(0, -1));
      setExpression(p => p.slice(0, -1));
    }
    else if (action === 'equals') {
      const r = evaluate(expression || display);
      setDisplay(String(r));
      setExpression(String(r));
    }
    else if (action === 'shift') setShift(p => !p);
    else if (action === 'raddeg') setIsRadian(p => !p);
    else if (action === 'memory') {
      if (val === 'MC') setMemory(0);
      else if (val === 'MR') { setDisplay(String(memory)); setExpression(String(memory)); }
      else if (val === 'M+') { const r = evaluate(expression || display); if (r !== 'Error') setMemory(p => p + r); }
      else if (val === 'M-') { const r = evaluate(expression || display); if (r !== 'Error') setMemory(p => p - r); }
    }
    else {
      const char = val;
      setDisplay(p => {
        if (p === '0' || p === 'Error') return char;
        if (p.length >= 14) return p;
        if (action === 'operator') {
          const last = p.slice(-1);
          if ('+−×÷^'.includes(last)) return p.slice(0, -1) + char;
        }
        return p + char;
      });
      setExpression(p => p + char);
    }
  };

  const B = ({ label, action, value, type, w }) => {
    const isShifted = type === 'shift' && shift;
    const bg = type === 'number' ? '#1e1e35' :
               type === 'operator' ? '#252545' :
               type === 'function' ? '#1a2535' :
               type === 'shift' ? (shift ? '#0a2a1a' : '#1a1a2a') :
               type === 'clear' ? '#351515' :
               type === 'delete' ? '#352515' :
               type === 'equals' ? '#005535' :
               type === 'memory' ? '#181830' :
               type === 'constant' ? '#1a2535' : '#1e1e35';
    const fg = type === 'equals' ? '#00ffaa' :
               type === 'clear' ? '#ff5555' :
               type === 'delete' ? '#ffaa00' :
               type === 'shift' ? (shift ? '#00ffaa' : '#88aa88') :
               type === 'function' ? '#88bbee' :
               type === 'operator' ? '#eecc88' :
               type === 'memory' ? '#aaaacc' :
               type === 'constant' ? '#77ccdd' : '#e0e0f0';
    const fs = type === 'number' ? 15 : type === 'operator' || type === 'equals' ? 18 : 10;

    return (
      <TouchableOpacity
        style={[styles.btn, {
          width: (w || 1) * BTN_W + (w ? (w - 1) * GAP : 0),
          height: BTN_H,
          backgroundColor: bg,
          borderColor: (isShifted || type === 'equals') ? '#00d4aa' : 'transparent',
          borderWidth: (isShifted || type === 'equals') ? 1.5 : 0,
        }]}
        onPress={() => press(action, value)}
        activeOpacity={0.65}
      >
        <Text style={[styles.bt, { color: fg, fontSize: fs }]}>{label}</Text>
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
    <SafeAreaView style={styles.safe} edges={['top','bottom']}>
      {/* Status */}
      <View style={styles.stat}>
        <Text style={styles.st}>{isRadian ? 'RAD' : 'DEG'}  {shift ? '🟢' : '⚫'} Shift</Text>
        <Text style={styles.st}>M={memory}</Text>
      </View>

      {/* Display */}
      <View style={styles.disp}>
        <Text style={styles.expr} numberOfLines={1}>{expression || ' '}</Text>
        <Text style={styles.dispt} numberOfLines={1} adjustsFontSizeToFit>{display}</Text>
      </View>

      {/* Keyboard */}
      <View style={styles.kb}>
        {/* Scientific Row 1 */}
        <Row>
          {sci[0].map((s, i) => <B key={`s1-${i}`} label={s} action={s === 'π' || s === 'e' ? 'constant' : s === 'mod' || s === 'xⁿ' ? 'operator' : s === 'M+' || s === 'M-' ? 'memory' : 'function'} value={s === 'M+' ? 'M+' : s === 'M-' ? 'M-' : s + (s.includes('⁻¹') || ['sin','cos','tan','ln','log'].includes(s) ? '(' : '')} type={s === 'π' || s === 'e' ? 'constant' : s === 'M+' || s === 'M-' ? 'memory' : 'function'} />)}
        </Row>

        {/* Scientific Row 2 */}
        <Row>
          {sci[1].map((s, i) => <B key={`s2-${i}`} label={s} action={s === 'π' || s === 'e' ? 'constant' : s === 'mod' || s === 'xⁿ' ? 'operator' : 'function'} value={s === 'x²' ? '^(2)' : s === 'xⁿ' ? '^' : s === 'EXP' ? 'EXP' : s} type={s === 'π' || s === 'e' ? 'constant' : s === 'mod' || s === 'xⁿ' ? 'operator' : 'function'} />)}
        </Row>

        {/* Row 3: Shift, brackets, etc */}
        <Row>
          <B label="Shift" action="shift" value="" type="shift" />
          <B label="R/D" action="raddeg" value="" type="shift" />
          <B label="(" action="function" value="(" type="function" />
          <B label=")" action="function" value=")" type="function" />
          <B label="%" action="operator" value="%" type="operator" />
          <B label="⌫" action="delete" value="" type="delete" />
        </Row>

        {/* Row 4: Memory */}
        <Row>
          <B label="MC" action="memory" value="MC" type="memory" />
          <B label="MR" action="memory" value="MR" type="memory" />
          <B label="M+" action="memory" value="M+" type="memory" />
          <B label="M-" action="memory" value="M-" type="memory" />
          <B label="AC" action="clear" value="" type="clear" w={2} />
        </Row>

        {/* Row 5: 7 8 9 ÷ × */}
        <Row>
          <B label="7" action="number" value="7" type="number" />
          <B label="8" action="number" value="8" type="number" />
          <B label="9" action="number" value="9" type="number" />
          <B label="÷" action="operator" value="÷" type="operator" />
          <B label="×" action="operator" value="×" type="operator" />
          <B label="n!" action="function" value="!" type="function" />
        </Row>

        {/* Row 6: 4 5 6 + − */}
        <Row>
          <B label="4" action="number" value="4" type="number" />
          <B label="5" action="number" value="5" type="number" />
          <B label="6" action="number" value="6" type="number" />
          <B label="+" action="operator" value="+" type="operator" />
          <B label="−" action="operator" value="−" type="operator" />
          <B label="nCr" action="function" value="nCr" type="function" />
        </Row>

        {/* Row 7: 1 2 3 nPr */}
        <Row>
          <B label="1" action="number" value="1" type="number" />
          <B label="2" action="number" value="2" type="number" />
          <B label="3" action="number" value="3" type="number" />
          <B label="nPr" action="function" value="nPr" type="function" />
          <B label="." action="number" value="." type="number" w={2} />
        </Row>

        {/* Row 8: 0 . = */}
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
  safe: { flex: 1, backgroundColor: '#080812' },
  stat: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 3, backgroundColor: '#0c0c1a' },
  st: { color: '#88bb88', fontSize: 9, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  disp: { backgroundColor: '#060618', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1a1a30', height: 90, justifyContent: 'flex-end', alignItems: 'flex-end' },
  expr: { color: '#555577', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', textAlign: 'right', marginBottom: 2 },
  dispt: { color: '#f0f0ff', fontSize: 30, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', textAlign: 'right', fontWeight: '300' },
  kb: { flex: 1, padding: PAD, gap: GAP, justifyContent: 'center' },
  row: { flexDirection: 'row', gap: GAP, marginBottom: GAP, justifyContent: 'center' },
  btn: { borderRadius: 3, justifyContent: 'center', alignItems: 'center' },
  bt: { fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif', fontWeight: '600', textAlign: 'center' },
});