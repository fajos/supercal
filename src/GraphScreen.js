import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Circle, Text as SvgText, Rect, G, Polygon } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRAPH_WIDTH = SCREEN_WIDTH - 48;
const GRAPH_HEIGHT = 320;

export default function GraphScreen() {
  const [equation, setEquation] = useState('x^2 - 4');
  const [xMin, setXMin] = useState('-5');
  const [xMax, setXMax] = useState('5');
  const [yMin, setYMin] = useState('-5');
  const [yMax, setYMax] = useState('10');
  const [points, setPoints] = useState([]);
  const [error, setError] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Parse and evaluate equation
  const evaluateFunction = useCallback((expr, x) => {
    try {
      // Replace common math notations
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
        .replace(/e(?![xp])/gi, 'Math.E')
        .replace(/\^/g, '**');

      // Security check
      if (/[^0-9+\-*/().,% Math.sqrtncsitaplogbxeE.PI]/.test(processed.replace(/Math\.\w+/g, ''))) {
        throw new Error('Invalid expression');
      }

      const result = eval(processed);
      return isFinite(result) ? result : null;
    } catch {
      return null;
    }
  }, []);

  // Generate plot points
  const plotGraph = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError(null);

    try {
      const xMinVal = parseFloat(xMin);
      const xMaxVal = parseFloat(xMax);
      const yMinVal = parseFloat(yMin);
      const yMaxVal = parseFloat(yMax);

      if (xMinVal >= xMaxVal || yMinVal >= yMaxVal) {
        throw new Error('Min must be less than Max values');
      }

      const numPoints = 500;
      const step = (xMaxVal - xMinVal) / numPoints;
      const plotPoints = [];

      for (let i = 0; i <= numPoints; i++) {
        const x = xMinVal + i * step;
        const y = evaluateFunction(equation, x);
        if (y !== null) {
          plotPoints.push({ x, y });
        } else if (plotPoints.length > 0) {
          // Add break for discontinuities
          plotPoints.push({ x, y: null, gap: true });
        }
      }

      setPoints(plotPoints);

      // Auto-adjust Y range if needed
      if (plotPoints.length > 0) {
        const validPoints = plotPoints.filter(p => !p.gap && p.y !== null);
        if (validPoints.length > 0) {
          const yValues = validPoints.map(p => p.y);
          const computedYMin = Math.min(...yValues);
          const computedYMax = Math.max(...yValues);
          const padding = (computedYMax - computedYMin) * 0.2 || 1;
          // Optional: auto-adjust (commented out to respect user settings)
          // setYMin((computedYMin - padding).toFixed(1));
          // setYMax((computedYMax + padding).toFixed(1));
        }
      }
    } catch (err) {
      setError(err.message);
      setPoints([]);
    }
  }, [equation, xMin, xMax, yMin, yMax, evaluateFunction]);

  // Convert math coords to SVG coords
  const toSvgX = (x) => {
    const xMinVal = parseFloat(xMin);
    const xMaxVal = parseFloat(xMax);
    return ((x - xMinVal) / (xMaxVal - xMinVal)) * GRAPH_WIDTH;
  };

  const toSvgY = (y) => {
    const yMinVal = parseFloat(yMin);
    const yMaxVal = parseFloat(yMax);
    return GRAPH_HEIGHT - ((y - yMinVal) / (yMaxVal - yMinVal)) * GRAPH_HEIGHT;
  };

  // Generate SVG path
  const pathData = useMemo(() => {
    if (points.length === 0) return '';

    let path = '';
    let isNewSegment = true;

    points.forEach((point) => {
      if (point.gap) {
        isNewSegment = true;
        return;
      }

      const svgX = toSvgX(point.x);
      const svgY = toSvgY(point.y);

      if (svgY < -50 || svgY > GRAPH_HEIGHT + 50) {
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
  }, [points]);

  // Grid lines
  const gridLines = useMemo(() => {
    const xMinVal = parseFloat(xMin);
    const xMaxVal = parseFloat(xMax);
    const yMinVal = parseFloat(yMin);
    const yMaxVal = parseFloat(yMax);
    const lines = [];

    // X-axis grid lines
    const xStep = (xMaxVal - xMinVal) / 10;
    for (let x = Math.ceil(xMinVal / xStep) * xStep; x <= xMaxVal; x += xStep) {
      const svgX = toSvgX(x);
      lines.push(
        <Line
          key={`gx-${x}`}
          x1={svgX}
          y1={0}
          x2={svgX}
          y2={GRAPH_HEIGHT}
          stroke={x === 0 ? colors.accent : colors.border}
          strokeWidth={x === 0 ? 1.5 : 0.5}
          strokeDasharray={x === 0 ? '' : '4,4'}
        />
      );
    }

    // Y-axis grid lines
    const yStep = (yMaxVal - yMinVal) / 10;
    for (let y = Math.ceil(yMinVal / yStep) * yStep; y <= yMaxVal; y += yStep) {
      const svgY = toSvgY(y);
      lines.push(
        <Line
          key={`gy-${y}`}
          x1={0}
          y1={svgY}
          x2={GRAPH_WIDTH}
          y2={svgY}
          stroke={y === 0 ? colors.accent : colors.border}
          strokeWidth={y === 0 ? 1.5 : 0.5}
          strokeDasharray={y === 0 ? '' : '4,4'}
        />
      );
    }

    return lines;
  }, [xMin, xMax, yMin, yMax]);

  // Axis labels
  const axisLabels = useMemo(() => {
    const xMinVal = parseFloat(xMin);
    const xMaxVal = parseFloat(xMax);
    const yMinVal = parseFloat(yMin);
    const yMaxVal = parseFloat(yMax);
    const labels = [];

    const xStep = (xMaxVal - xMinVal) / 5;
    for (let x = Math.ceil(xMinVal / xStep) * xStep; x <= xMaxVal; x += xStep) {
      if (Math.abs(x) < 0.001) continue;
      const svgX = toSvgX(x);
      labels.push(
        <SvgText
          key={`lx-${x}`}
          x={svgX}
          y={GRAPH_HEIGHT + 18}
          fill={colors.textSecondary}
          fontSize={10}
          textAnchor="middle"
          fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
        >
          {x.toFixed(1)}
        </SvgText>
      );
    }

    const yStep = (yMaxVal - yMinVal) / 5;
    for (let y = Math.ceil(yMinVal / yStep) * yStep; y <= yMaxVal; y += yStep) {
      if (Math.abs(y) < 0.001) continue;
      const svgY = toSvgY(y);
      labels.push(
        <SvgText
          key={`ly-${y}`}
          x={-8}
          y={svgY + 4}
          fill={colors.textSecondary}
          fontSize={10}
          textAnchor="end"
          fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
        >
          {y.toFixed(1)}
        </SvgText>
      );
    }

    // Origin label
    labels.push(
      <SvgText
        key="origin"
        x={toSvgX(0) - 8}
        y={toSvgY(0) + 18}
        fill={colors.accent}
        fontSize={10}
        textAnchor="end"
        fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
      >
        0
      </SvgText>
    );

    return labels;
  }, [xMin, xMax, yMin, yMax]);

  // Find intersections, roots, extrema
  const specialPoints = useMemo(() => {
    const xMinVal = parseFloat(xMin);
    const xMaxVal = parseFloat(xMax);
    const found = [];

    if (points.length < 2) return found;

    // Find roots (where y ≈ 0)
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

    // Find local extrema
    for (let i = 2; i < points.length - 1; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      const p3 = points[i + 1];
      if (!p1.gap && !p2.gap && !p3.gap &&
          p1.y !== null && p2.y !== null && p3.y !== null) {
        if ((p2.y > p1.y && p2.y > p3.y) || (p2.y < p1.y && p2.y < p3.y)) {
          found.push({ x: p2.x, y: p2.y, type: p2.y > p1.y ? 'max' : 'min' });
        }
      }
    }

    return found.slice(0, 10); // Limit special points
  }, [points]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📈 Graphing Calculator</Text>
          <Text style={styles.subtitle}>Interactive Function Plotter</Text>
        </View>

        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Function f(x) =</Text>
          <TextInput
            style={styles.eqInput}
            value={equation}
            onChangeText={setEquation}
            placeholder="e.g., x^2 - 4, sin(x), 2x + 1"
            placeholderTextColor={colors.textSecondary}
          />

          <View style={styles.rangeRow}>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>X Min</Text>
              <TextInput
                style={styles.rangeInput}
                value={xMin}
                onChangeText={setXMin}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>X Max</Text>
              <TextInput
                style={styles.rangeInput}
                value={xMax}
                onChangeText={setXMax}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>Y Min</Text>
              <TextInput
                style={styles.rangeInput}
                value={yMin}
                onChangeText={setYMin}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>Y Max</Text>
              <TextInput
                style={styles.rangeInput}
                value={yMax}
                onChangeText={setYMax}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.solveBtn} onPress={plotGraph} activeOpacity={0.8}>
            <Text style={styles.solveBtnText}>📈 PLOT GRAPH</Text>
          </TouchableOpacity>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Graph Display */}
        {points.length > 0 && (
          <View style={styles.graphCard}>
            <Text style={styles.graphTitle}>
              f(x) = {equation}
            </Text>
            <Text style={styles.graphRange}>
              x: [{xMin}, {xMax}] | y: [{yMin}, {yMax}]
            </Text>

            <View style={styles.graphContainer}>
              <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} style={styles.svg}>
                {/* Background */}
                <Rect
                  x={0}
                  y={0}
                  width={GRAPH_WIDTH}
                  height={GRAPH_HEIGHT}
                  fill={colors.bgInput}
                  rx={8}
                />

                {/* Grid */}
                {showGrid && gridLines}

                {/* Axis Labels */}
                {showLabels && axisLabels}

                {/* Function curve */}
                {pathData.length > 0 && (
                  <Path
                    d={pathData}
                    stroke={colors.accent}
                    strokeWidth={2.5}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Special Points */}
                {specialPoints.map((point, idx) => (
                  <G key={`sp-${idx}`}>
                    <Circle
                      cx={toSvgX(point.x)}
                      cy={toSvgY(point.y)}
                      r={point.type === 'root' ? 5 : 4}
                      fill={point.type === 'root' ? colors.accent : colors.purple}
                      stroke={colors.white}
                      strokeWidth={1.5}
                    />
                    {point.type === 'root' && (
                      <SvgText
                        x={toSvgX(point.x)}
                        y={toSvgY(point.y) - 12}
                        fill={colors.accent}
                        fontSize={9}
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        ({point.x.toFixed(2)}, 0)
                      </SvgText>
                    )}
                  </G>
                ))}

                {/* X-axis */}
                <Line
                  x1={0}
                  y1={toSvgY(0)}
                  x2={GRAPH_WIDTH}
                  y2={toSvgY(0)}
                  stroke={colors.accent}
                  strokeWidth={1}
                />

                {/* Y-axis */}
                <Line
                  x1={toSvgX(0)}
                  y1={0}
                  x2={toSvgX(0)}
                  y2={GRAPH_HEIGHT}
                  stroke={colors.accent}
                  strokeWidth={1}
                />
              </Svg>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
                <Text style={styles.legendText}>Function</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent, width: 10, height: 10 }]} />
                <Text style={styles.legendText}>Roots</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.purple }]} />
                <Text style={styles.legendText}>Extrema</Text>
              </View>
            </View>

            {/* Root Info */}
            {specialPoints.filter(p => p.type === 'root').length > 0 && (
              <View style={styles.rootsCard}>
                <Text style={styles.rootsTitle}>🔍 Roots Found:</Text>
                {specialPoints.filter(p => p.type === 'root').map((root, idx) => (
                  <Text key={idx} style={styles.rootText}>
                    x{idx + 1} = {root.x.toFixed(4)}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Help Card */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>💡 Supported Functions</Text>
          <View style={styles.helpGrid}>
            <Text style={styles.helpText}>• Polynomials: x^2, 2x+1</Text>
            <Text style={styles.helpText}>• Trig: sin(x), cos(x), tan(x)</Text>
            <Text style={styles.helpText}>• Log: log(x), ln(x)</Text>
            <Text style={styles.helpText}>• sqrt(x), abs(x)</Text>
            <Text style={styles.helpText}>• Constants: pi, e</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  inputCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  eqInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 16,
    textAlign: 'center',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  rangeItem: {
    flex: 1,
  },
  rangeLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    marginBottom: 4,
    textAlign: 'center',
  },
  rangeInput: {
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    color: colors.white,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 10,
    textAlign: 'center',
  },
  solveBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  solveBtnText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorCard: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
  graphCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  graphTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
  graphRange: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  graphContainer: {
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  svg: {
    backgroundColor: colors.bgInput,
    borderRadius: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  rootsCard: {
    backgroundColor: colors.accentBg,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  rootsTitle: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  rootText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 22,
  },
  helpCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
  },
  helpTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  helpGrid: {
    gap: 6,
  },
  helpText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
});