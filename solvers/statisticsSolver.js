export function solveStatistics(rawData) {
  const data = rawData
    .split(',')
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n));

  if (data.length < 2) {
    throw new Error('Please enter at least 2 valid numbers separated by commas.');
  }

  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const sum = data.reduce((a, v) => a + v, 0);
  const mean = sum / n;
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  // Mode
  const freq = {};
  data.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq)
    .filter((k) => freq[k] === maxFreq)
    .map(Number);
  const modeStr = maxFreq === 1 ? 'None (all unique)' : modes.join(', ');

  // Dispersion
  const variance = data.reduce((a, v) => a + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);
  const sampleVariance =
    data.reduce((a, v) => a + (v - mean) ** 2, 0) / (n - 1);
  const sampleStdDev = Math.sqrt(sampleVariance);
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Quartiles
  const q1 = sorted[Math.floor(n / 4)];
  const q3 = sorted[Math.floor((3 * n) / 4)];
  const iqr = q3 - q1;

  const steps = [
    {
      step: 'STEP 1',
      badge: 'primary',
      content: [
        { type: 'text', text: `Dataset (sorted): [${sorted.join(', ')}]` },
        { type: 'subtext', text: `n = ${n} values` },
      ],
    },
    {
      step: 'STEP 2',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Measures of Central Tendency:' },
        { type: 'text', text: `📌 Sum (Σx) = ${sum.toFixed(4)}` },
        { type: 'highlight', text: `Mean (μ) = Σx/n = ${sum.toFixed(4)}/${n} = ${mean.toFixed(4)}` },
        { type: 'highlight', text: `Median = ${median.toFixed(4)}` },
        { type: 'highlight', text: `Mode = ${modeStr}` },
      ],
    },
    {
      step: 'STEP 3',
      badge: 'primary',
      content: [
        { type: 'text', text: 'Measures of Dispersion:' },
        { type: 'text', text: `📏 Range = Max − Min = ${max} − ${min} = ${range.toFixed(4)}` },
        { type: 'text', text: `📏 Variance (Population) = Σ(x−μ)²/n` },
        { type: 'highlight', text: `σ² = ${variance.toFixed(4)}` },
        { type: 'text', text: `📏 Standard Deviation (Population) = √σ²` },
        { type: 'highlight', text: `σ = ${stdDev.toFixed(4)}` },
        { type: 'text', text: `📏 Sample Standard Deviation` },
        { type: 'highlight', text: `s = ${sampleStdDev.toFixed(4)}` },
      ],
    },
    {
      step: 'STEP 4',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Five-Number Summary:' },
        { type: 'highlight', text: `Min = ${min} | Q1 = ${q1} | Median = ${median.toFixed(4)} | Q3 = ${q3} | Max = ${max}` },
        { type: 'highlight', text: `IQR = Q3 − Q1 = ${iqr.toFixed(4)}` },
      ],
    },
  ];

  return {
    steps,
    summary: { mean, median, mode: modeStr, stdDev, sampleStdDev, variance, range, min, max, q1, q3, iqr, n, sum },
  };
}