import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Circle, Text as SvgText, Rect, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { InputCard } from '../components/InputCard';
import { SolveButton } from '../components/SolveButton';
import { useHistory } from '../utils/history';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 600;
const GRAPH_WIDTH = isTablet ? 760 : SCREEN_WIDTH - 48;
const GRAPH_HEIGHT = 340;

const PRESET_FUNCTIONS = [
  { label: 'Parabola', symbol: 'x²', fn: 'x^2 - 4', range: { xMin: -5, xMax: 5, yMin: -5, yMax: 10 } },
  { label: 'Cubic', symbol: 'x³', fn: 'x^3 - 3x', range: { xMin: -3, xMax: 3, yMin: -5, yMax: 5 } },
  { label: 'Sine', symbol: 'sin', fn: 'sin(x)', range: { xMin: -2*Math.PI, xMax: 2*Math.PI, yMin: -2, yMax: 2 } },
  { label: 'Cosine', symbol: 'cos', fn: 'cos(x)', range: { xMin: -2*Math.PI, xMax: 2*Math.PI, yMin: -2, yMax: 2 } },
  { label: 'Exponential', symbol: 'eˣ', fn: 'e^x', range: { xMin: -2, xMax: 3, yMin: -1, yMax: 10 } },
  { label: 'Natural Log', symbol: 'ln', fn: 'ln(x)', range: { xMin: 0.1, xMax: 5, yMin: -3, yMax: 3 } },
  { label: 'Absolute', symbol: '|x|', fn: 'abs(x)', range: { xMin: -5, xMax: 5, yMin: -1, yMax: 6 } },
  { label: 'Sqrt', symbol: '√', fn: 'sqrt(x)', range: { xMin: -1, xMax: 5, yMin: -1, yMax: 4 } },
];

// Helper function to format equation for display
const formatEquation = (eq) => {
  if (!eq) return '';
  return eq
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^4/g, '⁴')
    .replace(/\^5/g, '⁵')
    .replace(/\^6/g, '⁶')
    .replace(/\^7/g, '⁷')
    .replace(/\^8/g, '⁸')
    .replace(/\^9/g, '⁹')
    .replace(/\^(\d+)/g, (match, num) => {
      const superscripts = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
      return num.split('').map(d => superscripts[d] || d).join('');
    })
    .replace(/\*/g, '·')
    .replace(/sqrt/g, '√')
    .replace(/abs/g, '|')
    .replace(/pi/g, 'π');
};

export default function GraphScreen() {
  const [equation, setEquation] = useState('x^2 - 4');
  const [equation2, setEquation2] = useState('');
  const [equation3, setEquation3] = useState('');
  const [xMin, setXMin] = useState('-5');
  const [xMax, setXMax] = useState('5');
  const [yMin, setYMin] = useState('-5');
  const [yMax, setYMax] = useState('10');
  const [points, setPoints] = useState([]);
  const [points2, setPoints2] = useState([]);
  const [points3, setPoints3] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showRoots, setShowRoots] = useState(true);
  const [showExtrema, setShowExtrema] = useState(true);
  const [showDerivative, setShowDerivative] = useState(false);
  const [derivativePoints, setDerivativePoints] = useState([]);
  const { addToHistory } = useHistory();

  // Parse and evaluate equation
  const evaluateFunction = useCallback((expr, x) => {
    try {
      let processed = expr
        .replace(/\^/g, '**')
        .replace(/(\d)(x)/gi, '$1*$2')
        .replace(/\)(\()/g, ')*(')
        .replace(/(\d)\(/g, '$1*(')
        .replace(/\)\(/g, ')*(')
        .replace(/x/gi, `(${x})`)
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e(?![xp])/gi, 'Math.E');

      const result = eval(processed);
      return isFinite(result) ? result : null;
    } catch {
      return null;
    }
  }, []);

  // Numerical derivative
  const evaluateDerivative = useCallback((expr, x) => {
    const h = 0.0001;
    const y1 = evaluateFunction(expr, x + h);
    const y2 = evaluateFunction(expr, x - h);
    if (y1 === null || y2 === null) return null;
    return (y1 - y2) / (2 * h);
  }, [evaluateFunction]);

  // Generate plot points
  const generatePoints = useCallback((expr) => {
    const xMinVal = parseFloat(xMin);
    const xMaxVal = parseFloat(xMax);
    const numPoints = 500;
    const step = (xMaxVal - xMinVal) / numPoints;
    const plotPoints = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = xMinVal + i * step;
      const y = evaluateFunction(expr, x);
      if (y !== null) {
        plotPoints.push({ x, y });
      } else if (plotPoints.length > 0) {
        plotPoints.push({ x, y: null, gap: true });
      }
    }

    return plotPoints;
  }, [xMin, xMax, evaluateFunction]);

  const plotGraph = useCallback(() => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        const xMinVal = parseFloat(xMin);
        const xMaxVal = parseFloat(xMax);
        const yMinVal = parseFloat(yMin);
        const yMaxVal = parseFloat(yMax);

        if (xMinVal >= xMaxVal || yMinVal >= yMaxVal) {
          throw new Error('Min must be less than Max values');
        }

        setPoints(generatePoints(equation));
        
        if (equation2.trim()) {
          setPoints2(generatePoints(equation2));
        } else {
          setPoints2([]);
        }

        if (equation3.trim()) {
          setPoints3(generatePoints(equation3));
        } else {
          setPoints3([]);
        }

        if (showDerivative) {
          const derivPoints = [];
          const xMinV = parseFloat(xMin);
          const xMaxV = parseFloat(xMax);
          const step = (xMaxV - xMinV) / 200;

          for (let i = 0; i <= 200; i++) {
            const x = xMinV + i * step;
            const dy = evaluateDerivative(equation, x);
            if (dy !== null && isFinite(dy)) {
              derivPoints.push({ x, y: dy });
            }
          }
          setDerivativePoints(derivPoints);
        }

        addToHistory({
          type: 'graph',
          input: { equation, equation2, equation3, domain: `from x=${xMin} to x=${xMax}` },
          result: 'Plotted',
          timestamp: new Date().toISOString(),
        });

        setTimeout(() => {
          scrollRef.current?.scrollTo({ y: 400, animated: true });
        }, 300);
      } catch (err) {
        setError(err.message);
        setPoints([]);
      } finally {
        setLoading(false);
      }
    }, 600);
  }, [equation, equation2, equation3, xMin, xMax, yMin, yMax, generatePoints, showDerivative, evaluateDerivative]);

  const toSvgX = useCallback((x) => {
    const xMinVal = parseFloat(xMin);
    const xMaxVal = parseFloat(xMax);
    return ((x - xMinVal) / (xMaxVal - xMinVal)) * GRAPH_WIDTH;
  }, [xMin, xMax]);

  const toSvgY = useCallback((y) => {
    const yMinVal = parseFloat(yMin);
    const yMaxVal = parseFloat(yMax);
    return GRAPH_HEIGHT - ((y - yMinVal) / (yMaxVal - yMinVal)) * GRAPH_HEIGHT;
  }, [yMin, yMax]);

  const generatePathData = useCallback((pts) => {
    if (pts.length === 0) return '';
    let path = '';
    let isNewSegment = true;

    pts.forEach((point) => {
      if (point.gap) {
        isNewSegment = true;
        return;
      }
      const svgX = toSvgX(point.x);
      const svgY = toSvgY(point.y);
      if (svgY < -100 || svgY > GRAPH_HEIGHT + 100) {
        isNewSegment = true;
        return;
      }
      if (isNewSegment) {
        path += `M ${svgX} ${svgY} `;
        isNewSegment = false;
      } else {
        path += `L ${svgX} ${svgY} `;
      }
    });
    return path;
  }, [toSvgX, toSvgY]);

  const pathData = useMemo(() => generatePathData(points), [points, generatePathData]);
  const pathData2 = useMemo(() => generatePathData(points2), [points2, generatePathData]);
  const pathData3 = useMemo(() => generatePathData(points3), [points3, generatePathData]);
  const derivativePathData = useMemo(() => generatePathData(derivativePoints), [derivativePoints, generatePathData]);

  const gridLines = useMemo(() => {
    const xMinVal = parseFloat(xMin);
    const xMaxVal = parseFloat(xMax);
    const yMinVal = parseFloat(yMin);
    const yMaxVal = parseFloat(yMax);
    const lines = [];
    const xStep = (xMaxVal - xMinVal) / 10;
    for (let x = Math.ceil(xMinVal / xStep) * xStep; x <= xMaxVal; x += xStep) {
      lines.push(
        <Line key={`gx-${x}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={GRAPH_HEIGHT}
          stroke={x === 0 ? colors.accent + '40' : colors.border + '30'}
          strokeWidth={x === 0 ? 1.5 : 0.5} strokeDasharray={x === 0 ? '' : '4,4'} />
      );
    }
    const yStep = (yMaxVal - yMinVal) / 10;
    for (let y = Math.ceil(yMinVal / yStep) * yStep; y <= yMaxVal; y += yStep) {
      lines.push(
        <Line key={`gy-${y}`} x1={0} y1={toSvgY(y)} x2={GRAPH_WIDTH} y2={toSvgY(y)}
          stroke={y === 0 ? colors.accent + '40' : colors.border + '30'}
          strokeWidth={y === 0 ? 1.5 : 0.5} strokeDasharray={y === 0 ? '' : '4,4'} />
      );
    }
    return lines;
  }, [xMin, xMax, yMin, yMax, toSvgX, toSvgY]);

  const axisLabels = useMemo(() => {
    const xMinVal = parseFloat(xMin);
    const xMaxVal = parseFloat(xMax);
    const yMinVal = parseFloat(yMin);
    const yMaxVal = parseFloat(yMax);
    const labels = [];
    const xStep = (xMaxVal - xMinVal) / 5;
    for (let x = Math.ceil(xMinVal / xStep) * xStep; x <= xMaxVal; x += xStep) {
      if (Math.abs(x) < 0.001) continue;
      labels.push(
        <SvgText key={`lx-${x}`} x={toSvgX(x)} y={GRAPH_HEIGHT + 18} fill={colors.textSecondary}
          fontSize={10} textAnchor="middle" fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}>
          {Number.isInteger(x) ? x : x.toFixed(1)}
        </SvgText>
      );
    }
    const yStep = (yMaxVal - yMinVal) / 5;
    for (let y = Math.ceil(yMinVal / yStep) * yStep; y <= yMaxVal; y += yStep) {
      if (Math.abs(y) < 0.001) continue;
      labels.push(
        <SvgText key={`ly-${y}`} x={-8} y={toSvgY(y) + 4} fill={colors.textSecondary}
          fontSize={10} textAnchor="end" fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}>
          {Number.isInteger(y) ? y : y.toFixed(1)}
        </SvgText>
      );
    }
    return labels;
  }, [xMin, xMax, yMin, yMax, toSvgX, toSvgY]);

  const specialPoints = useMemo(() => {
    const xMinVal = parseFloat(xMin);
    const xMaxVal = parseFloat(xMax);
    const found = [];
    if (points.length < 2) return found;
    if (showRoots) {
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        if (!prev.gap && !curr.gap && prev.y !== null && curr.y !== null) {
          if (prev.y * curr.y <= 0 && Math.abs(prev.y - curr.y) < 10) {
            const rootX = prev.x - prev.y * (curr.x - prev.x) / (curr.y - prev.y);
            if (rootX >= xMinVal && rootX <= xMaxVal) {
              found.push({ x: rootX, y: 0, type: 'root' });
            }
          }
        }
      }
    }
    if (showExtrema) {
      for (let i = 2; i < points.length - 1; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        const p3 = points[i + 1];
        if (!p1.gap && !p2.gap && !p3.gap && p1.y !== null && p2.y !== null && p3.y !== null) {
          if ((p2.y > p1.y && p2.y > p3.y) || (p2.y < p1.y && p2.y < p3.y)) {
            const extremaType = p2.y > p1.y ? 'max' : 'min';
            if (!found.some(f => Math.abs(f.x - p2.x) < 0.01 && f.type === extremaType)) {
              found.push({ x: p2.x, y: p2.y, type: extremaType });
            }
          }
        }
      }
    }
    return found.slice(0, 15);
  }, [points, showRoots, showExtrema]);

  const applyPreset = (preset) => {
    Haptics.selectionAsync();
    setEquation(preset.fn);
    setXMin(String(preset.range.xMin));
    setXMax(String(preset.range.xMax));
    setYMin(String(preset.range.yMin));
    setYMax(String(preset.range.yMax));
    setEquation2('');
    setEquation3('');
    setShowDerivative(false);
  };

  const graphStats = useMemo(() => {
    if (points.length === 0) return null;
    const validPoints = points.filter(p => !p.gap && p.y !== null);
    if (validPoints.length === 0) return null;
    const yValues = validPoints.map(p => p.y);
    const roots = specialPoints.filter(p => p.type === 'root');
    const maxima = specialPoints.filter(p => p.type === 'max');
    const minima = specialPoints.filter(p => p.type === 'min');
    return {
      yMin: Math.min(...yValues),
      yMax: Math.max(...yValues),
      rootCount: roots.length,
      maxCount: maxima.length,
      minCount: minima.length,
      hasDiscontinuities: points.some(p => p.gap),
    };
  }, [points, specialPoints]);

  const curveColors = [colors.accent, '#ff6b6b', '#ffd93d'];
  const displayEquation = formatEquation(equation);
  const displayEquation2 = formatEquation(equation2);
  const displayEquation3 = formatEquation(equation3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>📈 Graphing Calculator</Text>
            <Text style={styles.subtitle}>Multi-Function Plotter with Analysis</Text>
          </View>
        </View>

        {/* Preset Functions */}
        <View style={[styles.presetCard, isTablet && styles.headerContainer]}>
          <Text style={styles.presetTitle}>Quick Functions</Text>
          <View style={styles.presetGrid}>
            {PRESET_FUNCTIONS.map((preset, idx) => (
              <TouchableOpacity key={idx} style={[styles.presetBtn, equation === preset.fn && styles.presetBtnActive]}
                onPress={() => applyPreset(preset)} activeOpacity={0.7}>
                <Text style={[styles.presetSymbol, equation === preset.fn && styles.presetSymbolActive]}>{preset.symbol}</Text>
                <Text style={[styles.presetLabel, equation === preset.fn && styles.presetLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Input Card */}
        <InputCard style={isTablet && styles.tabletInputCard}>
          <Text style={styles.inputLabel}>Function f(x) = {displayEquation || '...'}</Text>
          <TextInput style={styles.eqInput} value={equation} onChangeText={setEquation}
            placeholder="e.g., x^2 - 4" placeholderTextColor={colors.textSecondary} />

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Function g(x) = {displayEquation2 || '(optional)'}</Text>
          <TextInput style={[styles.eqInput, styles.eqInputSecondary]} value={equation2} onChangeText={setEquation2}
            placeholder="e.g., 2x + 1" placeholderTextColor={colors.textSecondary} />

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Function h(x) = {displayEquation3 || '(optional)'}</Text>
          <TextInput style={[styles.eqInput, styles.eqInputSecondary]} value={equation3} onChangeText={setEquation3}
            placeholder="e.g., sin(x)" placeholderTextColor={colors.textSecondary} />

          <View style={styles.optionsRow}>
            <View style={styles.optionItem}>
              <Text style={styles.optionLabel}>Grid</Text>
              <Switch value={showGrid} onValueChange={setShowGrid}
                trackColor={{ false: colors.border, true: colors.accent + '60' }}
                thumbColor={showGrid ? colors.accent : colors.textSecondary} />
            </View>
            <View style={styles.optionItem}>
              <Text style={styles.optionLabel}>Roots</Text>
              <Switch value={showRoots} onValueChange={setShowRoots}
                trackColor={{ false: colors.border, true: colors.accent + '60' }}
                thumbColor={showRoots ? colors.accent : colors.textSecondary} />
            </View>
            <View style={styles.optionItem}>
              <Text style={styles.optionLabel}>Extrema</Text>
              <Switch value={showExtrema} onValueChange={setShowExtrema}
                trackColor={{ false: colors.border, true: colors.accent + '60' }}
                thumbColor={showExtrema ? colors.accent : colors.textSecondary} />
            </View>
            <View style={styles.optionItem}>
              <Text style={styles.optionLabel}>f′(x)</Text>
              <Switch value={showDerivative} onValueChange={setShowDerivative}
                trackColor={{ false: colors.border, true: '#ff6b6b60' }}
                thumbColor={showDerivative ? '#ff6b6b' : colors.textSecondary} />
            </View>
          </View>

          <View style={[styles.inputHeader, { marginTop: 12 }]}>
            <Text style={styles.inputLabel}>Domain (Horizontal Range):</Text>
          </View>
          <View style={styles.rangeRow}>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>From x =</Text>
              <TextInput style={styles.rangeInput} value={xMin} onChangeText={setXMin} keyboardType="decimal-pad" />
            </View>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>To x =</Text>
              <TextInput style={styles.rangeInput} value={xMax} onChangeText={setXMax} keyboardType="decimal-pad" />
            </View>
          </View>

          <View style={[styles.inputHeader, { marginTop: 12 }]}>
            <Text style={styles.inputLabel}>Y-Axis View Range:</Text>
          </View>
          <View style={styles.rangeRow}>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>Min y =</Text>
              <TextInput style={styles.rangeInput} value={yMin} onChangeText={setYMin} keyboardType="decimal-pad" />
            </View>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>Max y =</Text>
              <TextInput style={styles.rangeInput} value={yMax} onChangeText={setYMax} keyboardType="decimal-pad" />
            </View>
          </View>

          <SolveButton onPress={plotGraph} label="📈 PLOT GRAPH" loading={loading} />
        </InputCard>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Graph Display */}
        {points.length > 0 && (
          <View style={[styles.graphCard, isTablet && styles.headerContainer]}>
            <Text style={styles.graphTitle}>
              {[displayEquation, displayEquation2, displayEquation3].filter(e => e).join(' | ')}
            </Text>
            <Text style={styles.graphRange}>x: [{xMin}, {xMax}] | y: [{yMin}, {yMax}]</Text>

            <View style={styles.graphContainer}>
              <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} style={styles.svg}>
                <Defs>
                  <LinearGradient id="graphBg" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={colors.bgInput} stopOpacity="1" />
                    <Stop offset="1" stopColor="#0a0a1a" stopOpacity="1" />
                  </LinearGradient>
                </Defs>

                <Rect x={0} y={0} width={GRAPH_WIDTH} height={GRAPH_HEIGHT} fill="url(#graphBg)" rx={8} />
                {showGrid && gridLines}
                {showLabels && axisLabels}

                {pathData.length > 0 && <Path d={pathData} stroke={curveColors[0]} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                {pathData2.length > 0 && <Path d={pathData2} stroke={curveColors[1]} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8,4" />}
                {pathData3.length > 0 && <Path d={pathData3} stroke={curveColors[2]} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4,4" />}
                {showDerivative && derivativePathData.length > 0 && <Path d={derivativePathData} stroke="#ff6b6b" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeDasharray="3,3" opacity={0.7} />}

                {/* Special Points with labels */}
                {specialPoints.map((point, idx) => (
                  <G key={`sp-${idx}`}>
                    <Circle cx={toSvgX(point.x)} cy={toSvgY(point.y)}
                      r={point.type === 'root' ? 5 : 4}
                      fill={point.type === 'root' ? colors.accent : point.type === 'max' ? '#ff6b6b' : '#ffd93d'}
                      stroke={colors.white} strokeWidth={1.5} />
                    {point.type === 'root' && (
                      <SvgText x={toSvgX(point.x)} y={toSvgY(point.y) - 12}
                        fill={colors.accent} fontSize={9} textAnchor="middle" fontWeight="bold">
                        ({point.x.toFixed(2)}, 0)
                      </SvgText>
                    )}
                    {(point.type === 'max' || point.type === 'min') && (
                      <SvgText x={toSvgX(point.x)} y={toSvgY(point.y) + (point.type === 'max' ? -12 : 20)}
                        fill={point.type === 'max' ? '#ff6b6b' : '#ffd93d'} fontSize={8} textAnchor="middle">
                        {point.type === 'max' ? 'max' : 'min'}
                      </SvgText>
                    )}
                  </G>
                ))}

                <Line x1={0} y1={toSvgY(0)} x2={GRAPH_WIDTH} y2={toSvgY(0)} stroke={colors.accent + '80'} strokeWidth={1.5} />
                <Line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={GRAPH_HEIGHT} stroke={colors.accent + '80'} strokeWidth={1.5} />
                <Polygon points={`${GRAPH_WIDTH-8},${toSvgY(0)-4} ${GRAPH_WIDTH},${toSvgY(0)} ${GRAPH_WIDTH-8},${toSvgY(0)+4}`} fill={colors.accent} />
                <Polygon points={`${toSvgX(0)-4},8 ${toSvgX(0)},0 ${toSvgX(0)+4},8`} fill={colors.accent} />
              </Svg>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: curveColors[0] }]} /><Text style={styles.legendText}>f(x)</Text></View>
              {equation2.trim() !== '' && <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: curveColors[1] }]} /><Text style={styles.legendText}>g(x)</Text></View>}
              {equation3.trim() !== '' && <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: curveColors[2] }]} /><Text style={styles.legendText}>h(x)</Text></View>}
              {showDerivative && <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: '#ff6b6b', height: 1 }]} /><Text style={styles.legendText}>f′(x)</Text></View>}
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.accent }]} /><Text style={styles.legendText}>Roots</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} /><Text style={styles.legendText}>Max</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ffd93d' }]} /><Text style={styles.legendText}>Min</Text></View>
            </View>

            {/* Graph Statistics */}
            {graphStats && (
              <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>📊 Graph Analysis</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}><Text style={styles.statValue}>{graphStats.rootCount}</Text><Text style={styles.statLabel}>Roots</Text></View>
                  <View style={styles.statItem}><Text style={styles.statValue}>{graphStats.maxCount}</Text><Text style={styles.statLabel}>Maxima</Text></View>
                  <View style={styles.statItem}><Text style={styles.statValue}>{graphStats.minCount}</Text><Text style={styles.statLabel}>Minima</Text></View>
                  <View style={styles.statItem}><Text style={styles.statValue}>{graphStats.hasDiscontinuities ? 'Yes' : 'No'}</Text><Text style={styles.statLabel}>Discont.</Text></View>
                </View>
              </View>
            )}

            {/* Special Points Details */}
            {specialPoints.length > 0 && (
              <View style={styles.rootsCard}>
                <Text style={styles.rootsTitle}>🔍 Special Points:</Text>
                {specialPoints.map((point, idx) => (
                  <View key={idx} style={styles.pointRow}>
                    <View style={[styles.pointDot, { backgroundColor: point.type === 'root' ? colors.accent : point.type === 'max' ? '#ff6b6b' : '#ffd93d' }]} />
                    <Text style={styles.pointText}>
                      {point.type === 'root' ? 'Root' : point.type === 'max' ? 'Maximum' : 'Minimum'}
                      : ({point.x.toFixed(4)}, {point.y.toFixed(4)})
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Help Card */}
        <View style={[styles.helpCard, isTablet && styles.headerContainer]}>
          <Text style={styles.helpTitle}>💡 Tips & Supported Functions</Text>
          <View style={styles.helpGrid}>
            <Text style={styles.helpText}>• Plot up to 3 functions simultaneously</Text>
            <Text style={styles.helpText}>• Toggle derivative f′(x) to analyze slopes</Text>
            <Text style={styles.helpText}>• Supports: sin, cos, tan, log, ln, sqrt, abs</Text>
            <Text style={styles.helpText}>• Use e for Euler's number, pi for π</Text>
            <Text style={styles.helpText}>• Implicit multiplication: 2x = 2·x</Text>
            <Text style={styles.helpText}>• Roots show where f(x) = 0 (x-intercepts)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  headerContainer: { width: '100%', maxWidth: 800 },
  tabletInputCard: { maxWidth: 600, width: '100%' },
  header: { marginBottom: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: colors.white, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4, letterSpacing: 0.3 },
  presetCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, marginBottom: 16, width: '100%' },
  presetTitle: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, textAlign: 'center' },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  presetBtn: { width: '22%', minWidth: 70, aspectRatio: 1, backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, alignItems: 'center', justifyContent: 'center', padding: 8 },
  presetBtnActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  presetSymbol: { color: colors.textSecondary, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  presetSymbolActive: { color: colors.accent },
  presetLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '500', textAlign: 'center' },
  presetLabelActive: { color: colors.accentGlow, fontWeight: '600' },
  inputLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, letterSpacing: 0.3 },
  inputHeader: {},
  eqInput: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, color: colors.white, fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 16, textAlign: 'center' },
  eqInputSecondary: { fontSize: 16, opacity: 0.8 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  optionItem: { alignItems: 'center', gap: 4 },
  optionLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '500' },
  rangeRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  rangeItem: { flex: 1 },
  rangeLabel: { color: colors.textSecondary, fontSize: 10, marginBottom: 4, textAlign: 'center' },
  rangeInput: { backgroundColor: colors.bgInput, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, color: colors.white, fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 10, textAlign: 'center' },
  errorCard: { backgroundColor: 'rgba(255,71,87,0.1)', borderWidth: 1, borderColor: colors.danger, borderRadius: 14, padding: 16, marginBottom: 16, width: '100%', maxWidth: 600 },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: '500' },
  graphCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 16, marginBottom: 16, width: '100%' },
  graphTitle: { color: colors.white, fontSize: 16, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', textAlign: 'center' },
  graphRange: { color: colors.textSecondary, fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 12 },
  graphContainer: { alignItems: 'center', borderRadius: 12, overflow: 'hidden' },
  svg: { backgroundColor: colors.bgInput, borderRadius: 12 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLine: { width: 20, height: 3, borderRadius: 2 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.textSecondary, fontSize: 11 },
  statsCard: { backgroundColor: colors.bgInput, borderRadius: 12, padding: 14, marginTop: 12 },
  statsTitle: { color: colors.white, fontSize: 14, fontWeight: '600', marginBottom: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { color: colors.accent, fontSize: 18, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: 10, marginTop: 2 },
  rootsCard: { backgroundColor: colors.accentBg, borderRadius: 12, padding: 14, marginTop: 12 },
  rootsTitle: { color: colors.accent, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  pointRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  pointDot: { width: 8, height: 8, borderRadius: 4 },
  pointText: { color: '#c8c8d8', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  helpCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, width: '100%' },
  helpTitle: { color: colors.white, fontSize: 16, fontWeight: '600', marginBottom: 10 },
  helpGrid: { gap: 6 },
  helpText: { color: colors.textSecondary, fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 20 },
});