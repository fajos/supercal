export function solveStatistics(rawData) {
  const data = rawData
    .split(',')
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n));

  if (data.length < 2) {
    throw new Error('Please enter at least 2 valid numbers separated by commas.');
  }

  const steps = [];
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const sum = data.reduce((a, v) => a + v, 0);
  const mean = sum / n;

  // STEP 1: Present and organize the data
  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: '📊 DATA ORGANIZATION' },
      { type: 'text', text: `Raw data (${n} values): ${data.join(', ')}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Step 1a: Sort the data from lowest to highest' },
      { type: 'highlight', text: `Sorted: [${sorted.join(', ')}]` },
      { type: 'text', text: '' },
      { type: 'text', text: `Sample size (n) = ${n}` },
      { type: 'text', text: n < 30 ? '⚠️ Small sample size - results may not be representative of the population' : '✅ Good sample size for statistical analysis' },
    ],
  });

  // STEP 2: Measures of Central Tendency
  steps.push({
    step: 'STEP 2',
    badge: 'primary',
    content: [
      { type: 'text', text: '🎯 MEASURES OF CENTRAL TENDENCY' },
      { type: 'text', text: 'These tell us where the "center" of our data is.' },
    ],
  });

  // Mean calculation with detailed steps
  const meanCalcSteps = data.map((val, idx) => 
    `${idx + 1}) ${val}`
  ).join(' + ');

  steps.push({
    step: '2a',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📌 MEAN (Arithmetic Average)' },
      { type: 'text', text: 'The mean is the sum of all values divided by the count.' },
      { type: 'text', text: '' },
      { type: 'text', text: 'Formula: x̄ = (Σxᵢ) / n' },
      { type: 'text', text: `Sum = ${data[0]}` + data.slice(1).map(v => ` + ${v}`).join('') },
      { type: 'text', text: `Sum = ${sum.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: `Mean = ${sum.toFixed(4)} / ${n}` },
      { type: 'highlight', text: `x̄ = ${mean.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: '💡 Interpretation: The "average" or "expected" value.' },
      { type: 'text', text: 'Sensitive to outliers - extreme values pull the mean toward them.' },
    ],
  });

  // Median calculation
  let medianExplanation = '';
  if (n % 2 === 0) {
    const midLeft = sorted[n / 2 - 1];
    const midRight = sorted[n / 2];
    medianExplanation = `Even number of values (${n}), so median = average of the two middle values (positions ${n/2} and ${n/2 + 1})`;
  } else {
    medianExplanation = `Odd number of values (${n}), so median = middle value (position ${Math.ceil(n/2)})`;
  }

  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];

  steps.push({
    step: '2b',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📌 MEDIAN (Middle Value)' },
      { type: 'text', text: 'The median is the value that splits the sorted data into two equal halves.' },
      { type: 'text', text: medianExplanation },
      ...(n % 2 === 0 ? [
        { type: 'text', text: `Middle values: ${sorted[n/2 - 1]} and ${sorted[n/2]}` },
        { type: 'text', text: `Median = (${sorted[n/2 - 1]} + ${sorted[n/2]}) / 2 = ${median}` },
      ] : [
        { type: 'text', text: `Middle value at position ${Math.ceil(n/2)}: ${median}` },
      ]),
      { type: 'highlight', text: `Median = ${median.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: '💡 Interpretation: 50% of values are below this, 50% above.' },
      { type: 'text', text: 'Robust against outliers - extreme values don\'t affect it much.' },
    ],
  });

  // Mode calculation
  const freq = {};
  data.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq)
    .filter((k) => freq[k] === maxFreq)
    .map(Number);
  const modeStr = maxFreq === 1 ? 'None (all values appear once)' : modes.join(', ');

  steps.push({
    step: '2c',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📌 MODE (Most Frequent Value)' },
      { type: 'text', text: 'The mode is the value that appears most often.' },
      { type: 'text', text: 'Frequency count:' },
      ...Object.entries(freq).map(([val, count]) => ({
        type: 'text',
        text: `  ${val}: appears ${count} time${count > 1 ? 's' : ''}`
      })),
      { type: 'text', text: '' },
      { type: 'highlight', text: `Mode = ${modeStr}` },
      { type: 'text', text: maxFreq === 1 ? '📊 Uniform distribution - all values equally frequent' : `Appears ${maxFreq} time${maxFreq > 1 ? 's' : ''}` },
      { type: 'text', text: '' },
      { type: 'text', text: '💡 A dataset can have one mode (unimodal), two (bimodal), or more (multimodal).' },
    ],
  });

  // Compare central tendency measures
  const tendencyComparison = [];
  if (Math.abs(mean - median) < 0.01) {
    tendencyComparison.push({ type: 'text', text: '✅ Mean ≈ Median: Data is approximately symmetric' });
  } else if (mean > median) {
    tendencyComparison.push({ type: 'text', text: '📈 Mean > Median: Data is right-skewed (positive skew)' });
  } else {
    tendencyComparison.push({ type: 'text', text: '📉 Mean < Median: Data is left-skewed (negative skew)' });
  }

  steps.push({
    step: '2d',
    badge: 'warning',
    content: [
      { type: 'text', text: '📊 COMPARISON & SKEWNESS' },
      { type: 'text', text: `Mean = ${mean.toFixed(4)}` },
      { type: 'text', text: `Median = ${median.toFixed(4)}` },
      { type: 'text', text: `Mode = ${modeStr}` },
      ...tendencyComparison,
    ],
  });

  // STEP 3: Measures of Dispersion
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  steps.push({
    step: 'STEP 3',
    badge: 'primary',
    content: [
      { type: 'text', text: '📏 MEASURES OF DISPERSION (SPREAD)' },
      { type: 'text', text: 'These tell us how spread out the data is from the center.' },
    ],
  });

  // Range
  steps.push({
    step: '3a',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📌 RANGE' },
      { type: 'text', text: 'Range = Maximum - Minimum' },
      { type: 'text', text: `Range = ${max} - ${min}` },
      { type: 'highlight', text: `Range = ${range.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: '💡 Simplest measure of spread, but very sensitive to outliers.' },
    ],
  });

  // Variance and Standard Deviation
  const deviations = data.map(v => v - mean);
  const squaredDeviations = deviations.map(d => d * d);
  const variance = squaredDeviations.reduce((a, v) => a + v, 0) / n;
  const stdDev = Math.sqrt(variance);
  
  // Sample statistics
  const sampleVariance = squaredDeviations.reduce((a, v) => a + v, 0) / (n - 1);
  const sampleStdDev = Math.sqrt(sampleVariance);

  steps.push({
    step: '3b',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📌 VARIANCE & STANDARD DEVIATION' },
      { type: 'text', text: 'Step-by-step calculation:' },
      { type: 'text', text: '' },
      { type: 'text', text: '1. Calculate deviations from mean (xᵢ - x̄):' },
      { type: 'text', text: data.map((v, i) => `${v} - ${mean.toFixed(4)} = ${deviations[i].toFixed(4)}`).join(', ') },
      { type: 'text', text: '' },
      { type: 'text', text: '2. Square each deviation:' },
      { type: 'text', text: squaredDeviations.map(d => d.toFixed(4)).join(', ') },
      { type: 'text', text: '' },
      { type: 'text', text: '3. For POPULATION variance:' },
      { type: 'text', text: 'Sum of squared deviations / n' },
      { type: 'text', text: `σ² = (${squaredDeviations.map(d => d.toFixed(4)).join(' + ')}) / ${n}` },
      { type: 'text', text: `σ² = ${squaredDeviations.reduce((a, v) => a + v, 0).toFixed(4)} / ${n}` },
      { type: 'highlight', text: `σ² = ${variance.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: '4. Standard Deviation = √(Variance):' },
      { type: 'highlight', text: `σ = √(${variance.toFixed(4)}) = ${stdDev.toFixed(4)}` },
    ],
  });

  // Explain population vs sample
  steps.push({
    step: '3c',
    badge: 'primary',
    content: [
      { type: 'text', text: '📌 POPULATION vs SAMPLE STATISTICS' },
      { type: 'text', text: '' },
      { type: 'text', text: 'Population (divide by n): Assumes this is ALL the data' },
      { type: 'text', text: `σ = ${stdDev.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Sample (divide by n-1): For a sample of a larger population' },
      { type: 'text', text: `s = ${sampleStdDev.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: '💡 Use sample standard deviation (n-1) when estimating from a sample.' },
      { type: 'text', text: 'The n-1 correction (Bessel\'s correction) reduces bias in the estimate.' },
    ],
  });

  // STEP 4: Five-Number Summary and Quartiles
  const q1 = calculateQuartile(sorted, 0.25);
  const q2 = median;
  const q3 = calculateQuartile(sorted, 0.75);
  const iqr = q3 - q1;

  steps.push({
    step: 'STEP 4',
    badge: 'primary',
    content: [
      { type: 'text', text: '📦 FIVE-NUMBER SUMMARY & BOX PLOT' },
      { type: 'text', text: 'The five-number summary gives a complete picture of data distribution.' },
    ],
  });

  steps.push({
    step: '4a',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📊 Quartiles divide sorted data into four equal parts:' },
      { type: 'text', text: '' },
      { type: 'text', text: `Minimum (0th percentile):` },
      { type: 'highlight', text: `Min = ${min}` },
      { type: 'text', text: 'The smallest value in the dataset.' },
      { type: 'text', text: '' },
      { type: 'text', text: `First Quartile - Q1 (25th percentile):` },
      { type: 'highlight', text: `Q1 = ${q1.toFixed(4)}` },
      { type: 'text', text: '25% of values are below Q1.' },
      { type: 'text', text: '' },
      { type: 'text', text: `Second Quartile - Q2 (50th percentile, Median):` },
      { type: 'highlight', text: `Q2 = ${q2.toFixed(4)}` },
      { type: 'text', text: 'The middle value of the dataset.' },
      { type: 'text', text: '' },
      { type: 'text', text: `Third Quartile - Q3 (75th percentile):` },
      { type: 'highlight', text: `Q3 = ${q3.toFixed(4)}` },
      { type: 'text', text: '75% of values are below Q3.' },
      { type: 'text', text: '' },
      { type: 'text', text: `Maximum (100th percentile):` },
      { type: 'highlight', text: `Max = ${max}` },
      { type: 'text', text: 'The largest value in the dataset.' },
    ],
  });

  // IQR and Outlier Detection
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = sorted.filter(v => v < lowerFence || v > upperFence);

  steps.push({
    step: '4b',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📏 INTERQUARTILE RANGE (IQR)' },
      { type: 'text', text: 'IQR = Q3 - Q1' },
      { type: 'text', text: `IQR = ${q3.toFixed(4)} - ${q1.toFixed(4)}` },
      { type: 'highlight', text: `IQR = ${iqr.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: '💡 IQR measures the spread of the middle 50% of data.' },
      { type: 'text', text: 'It\'s robust against outliers, unlike the range.' },
      { type: 'text', text: '' },
      { type: 'text', text: '🔍 OUTLIER DETECTION (1.5 × IQR Rule):' },
      { type: 'text', text: `Lower fence = Q1 - 1.5(IQR) = ${q1.toFixed(4)} - 1.5(${iqr.toFixed(4)}) = ${lowerFence.toFixed(4)}` },
      { type: 'text', text: `Upper fence = Q3 + 1.5(IQR) = ${q3.toFixed(4)} + 1.5(${iqr.toFixed(4)}) = ${upperFence.toFixed(4)}` },
      { type: 'text', text: '' },
      ...(outliers.length > 0 
        ? [
            { type: 'highlight', text: `⚠️ Outliers detected: ${outliers.join(', ')}` },
            { type: 'text', text: 'Values outside the fences are considered potential outliers.' },
          ]
        : [
            { type: 'text', text: '✅ No outliers detected (all values within fences).' },
          ]
      ),
    ],
  });

  // Visual box plot representation
  steps.push({
    step: '4c',
    badge: 'primary',
    content: [
      { type: 'text', text: '🎨 BOX PLOT VISUALIZATION' },
      { type: 'text', text: 'Min ───[Q1 | Q2 | Q3]─── Max' },
      { type: 'text', text: `${min} ───[${q1.toFixed(1)} | ${q2.toFixed(1)} | ${q3.toFixed(1)}]─── ${max}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'The box represents the middle 50% (IQR).' },
      { type: 'text', text: 'The line in the box is the median.' },
      { type: 'text', text: 'The whiskers extend to min and max (or to fences).' },
    ],
  });

  // STEP 5: Distribution Shape Analysis
steps.push({
  step: 'STEP 5',
  badge: 'warning',
  content: [
    { type: 'text', text: '📈 DISTRIBUTION SHAPE ANALYSIS' },
    { type: 'text', text: '' },
    { type: 'text', text: 'Comparing measures to determine shape:' },
    { type: 'text', text: `Mean (${mean.toFixed(4)}) vs Median (${median.toFixed(4)})` },
    ...(Math.abs(mean - median) < mean * 0.05 
      ? [
          { type: 'highlight', text: '📊 Approximately SYMMETRIC distribution' },
          { type: 'text', text: 'Values are evenly spread around the center.' },
        ]
      : mean > median 
        ? [
            { type: 'highlight', text: '📈 RIGHT-SKEWED (Positive Skew)' },
            { type: 'text', text: 'Tail extends to the right. Mean is pulled up by high values.' },
          ]
        : [
            { type: 'highlight', text: '📉 LEFT-SKEWED (Negative Skew)' },
            { type: 'text', text: 'Tail extends to the left. Mean is pulled down by low values.' },
          ]
    ),
    { type: 'text', text: '' },
    { type: 'text', text: `Standard Deviation (σ): ${stdDev.toFixed(4)}` },
    { type: 'text', text: 'Coefficient of Variation (CV) = (σ / |μ|) × 100%' },
    { type: 'highlight', text: `CV = (${stdDev.toFixed(4)} / ${Math.abs(mean).toFixed(4)}) × 100% = ${((stdDev / Math.abs(mean)) * 100).toFixed(2)}%` },
    { type: 'text', text: ((stdDev / Math.abs(mean)) * 100) < 25 
      ? 'Low variability relative to the mean' 
      : ((stdDev / Math.abs(mean)) * 100) < 50 
        ? 'Moderate variability' 
        : 'High variability relative to the mean' 
    },
  ],
});

  // SUMMARY
  steps.push({
    step: 'SUMMARY',
    badge: 'primary',
    content: [
      { type: 'text', text: '📋 COMPLETE STATISTICAL SUMMARY' },
      { type: 'text', text: '' },
      { type: 'text', text: 'Central Tendency:' },
      { type: 'result', text: `Mean: ${mean.toFixed(4)}` },
      { type: 'result', text: `Median: ${median.toFixed(4)}` },
      { type: 'result', text: `Mode: ${modeStr}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Dispersion:' },
      { type: 'result', text: `Range: ${range.toFixed(4)}` },
      { type: 'result', text: `IQR: ${iqr.toFixed(4)}` },
      { type: 'result', text: `Std Dev (pop): ${stdDev.toFixed(4)}` },
      { type: 'result', text: `Std Dev (sample): ${sampleStdDev.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Five-Number Summary:' },
      { type: 'result', text: `[${min}, ${q1.toFixed(4)}, ${median.toFixed(4)}, ${q3.toFixed(4)}, ${max}]` },
    ],
  });

  return {
  steps,
  summary: { 
    mean, median, mode: modeStr, 
    stdDev, sampleStdDev, variance, sampleVariance,
    range, iqr, min, max, q1, q3, 
    n, sum,
    outliers: outliers.length > 0 ? outliers : 'None',
    skewness: mean > median ? 'Right-skewed' : mean < median ? 'Left-skewed' : 'Symmetric',
    coefficientOfVariation: ((stdDev / Math.abs(mean)) * 100),
  },
};
}

// Helper function for more accurate quartile calculation
function calculateQuartile(sortedData, percentile) {
  const n = sortedData.length;
  const index = percentile * (n - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  
  if (lower === upper) {
    return sortedData[lower];
  }
  
  const fraction = index - lower;
  return sortedData[lower] + fraction * (sortedData[upper] - sortedData[lower]);
}