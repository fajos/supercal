// sequenceSolver.js

export function solveSequence(type, a1, d_or_r, n) {
  const steps = [];
  let terms = [];
  let sum = 0;
  let nthTerm;

  // Helper function for subscripts
  const getSubscript = (num) => {
    const subscripts = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
      '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };
    return String(num).split('').map(digit => subscripts[digit] || digit).join('');
  };

  // Helper function for superscripts
  const getSuperscript = (num) => {
    const superscripts = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return String(num).split('').map(digit => superscripts[digit] || digit).join('');
  };

  if (type === 'arithmetic') {
    const d = d_or_r; // common difference
    nthTerm = a1 + (n - 1) * d;
    sum = (n / 2) * (2 * a1 + (n - 1) * d);

    // 1. GIVEN
    steps.push({
      step: 'GIVEN',
      badge: 'primary',
      content: [
        { type: 'text', text: 'We are analyzing an arithmetic sequence where each term increases by a constant difference:' },
        { type: 'text', text: `• First Term (a₁): ${a1}` },
        { type: 'text', text: `• Common Difference (d): ${d}` },
        { type: 'text', text: `• Target Position (n): ${n}` },
      ],
    });

    // 2. FORMULA
    steps.push({
      step: 'FORMULA',
      badge: 'secondary',
      content: [
        { type: 'text', text: '1. To find the nth term (General Term):' },
        { type: 'formula', text: `aₙ = a₁ + (n − 1)d` },
        { type: 'text', text: '2. To find the sum of the first n terms (Series):' },
        { type: 'formula', text: `Sₙ = (n/2) · [2a₁ + (n − 1)d]` },
      ],
    });

    // 3. CALCULATION
    const termDisplay = [];
    for (let i = 0; i < Math.min(5, n); i++) {
      termDisplay.push(a1 + i * d);
    }

    const nSub = getSubscript(n);
    
    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: `Finding the ${n}th term:` },
        { type: 'text', text: `a${nSub} = ${a1} + (${n} − 1) × ${d}` },
        { type: 'text', text: `a${nSub} = ${a1} + ${n - 1} × ${d}` },
        { type: 'text', text: `a${nSub} = ${a1} + ${(n - 1) * d}` },
        { type: 'result', text: `a${nSub} = ${nthTerm}` },
        { type: 'text', text: '' },
        { type: 'text', text: `Calculating the sum S${nSub}:` },
        { type: 'text', text: `S${nSub} = (${n}/2) × [2(${a1}) + (${n} − 1)(${d})]` },
        { type: 'text', text: `S${nSub} = ${n/2} × [${2 * a1} + ${(n - 1) * d}]` },
        { type: 'text', text: `S${nSub} = ${n/2} × ${2 * a1 + (n - 1) * d}` },
        { type: 'result', text: `S${nSub} = ${sum}` },
      ],
    });

    // 4. ANALYSIS
    const growthType = d > 0 ? 'increasing' : d < 0 ? 'decreasing' : 'constant';
    
    steps.push({
      step: 'ANALYSIS',
      badge: 'secondary',
      content: [
        { type: 'text', text: `The sequence starts as: ${termDisplay.join(', ')}${n > 5 ? '...' : ''}` },
        { type: 'text', text: `💡 Linearity: Arithmetic sequences grow linearly. If you graphed these terms against their position (n), they would form a straight line with a slope of ${d}.` },
        { type: 'text', text: `💡 The common difference is ${d}, so the sequence is ${growthType}.` },
      ],
    });

    // Generate full terms for the return object
    for (let i = 0; i < n; i++) {
      terms.push(a1 + i * d);
    }

  } else if (type === 'geometric') {
    const r = d_or_r; // common ratio
    nthTerm = a1 * Math.pow(r, n - 1);

    if (r === 1) {
      sum = a1 * n;
    } else {
      sum = a1 * (1 - Math.pow(r, n)) / (1 - r);
    }

    // 1. GIVEN
    steps.push({
      step: 'GIVEN',
      badge: 'primary',
      content: [
        { type: 'text', text: 'We are analyzing a geometric sequence where each term is multiplied by a constant ratio:' },
        { type: 'text', text: `• First Term (a₁): ${a1}` },
        { type: 'text', text: `• Common Ratio (r): ${r}` },
        { type: 'text', text: `• Target Position (n): ${n}` },
      ],
    });

    // 2. FORMULA
    const nMinus1 = getSuperscript(n - 1);
    const nSuper = getSuperscript(n);
    
    steps.push({
      step: 'FORMULA',
      badge: 'secondary',
      content: [
        { type: 'text', text: '1. To find the nth term:' },
        { type: 'formula', text: `aₙ = a₁ · rⁿ⁻¹` },
        { type: 'text', text: `aₙ = a₁ · r${nMinus1}` },
        { type: 'text', text: '2. To find the sum of the first n terms:' },
        { type: 'formula', text: `Sₙ = a₁(1 − rⁿ) / (1 − r)` },
        { type: 'text', text: `Sₙ = a₁(1 − r${nSuper}) / (1 − r)` },
        ...(Math.abs(r) < 1 ? [
          { type: 'text', text: '3. Infinite Sum (since |r| < 1):' },
          { type: 'formula', text: 'S∞ = a₁ / (1 − r)' }
        ] : []),
      ],
    });

    // 3. CALCULATION
    const termDisplay = [];
    for (let i = 0; i < Math.min(5, n); i++) {
      termDisplay.push((a1 * Math.pow(r, i)).toFixed(2));
    }

    const nSubCalc = getSubscript(n);
    
    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: `Finding the ${n}th term:` },
        { type: 'text', text: `a${nSubCalc} = ${a1} × ${r}${nMinus1}` },
        { type: 'text', text: `a${nSubCalc} = ${a1} × ${Math.pow(r, n - 1).toFixed(4)}` },
        { type: 'result', text: `a${nSubCalc} = ${nthTerm.toFixed(4)}` },
        { type: 'text', text: '' },
        { type: 'text', text: `Calculating the sum S${nSubCalc}:` },
        { type: 'text', text: `S${nSubCalc} = ${a1}(1 − ${r}${nSuper}) / (1 − ${r})` },
        { type: 'text', text: `S${nSubCalc} = ${a1}(1 − ${Math.pow(r, n).toFixed(4)}) / (1 − ${r})` },
        { type: 'result', text: `S${nSubCalc} = ${sum.toFixed(4)}` },
      ],
    });

    // 4. ANALYSIS
    const infiniteSumVal = Math.abs(r) < 1 ? (a1 / (1 - r)).toFixed(4) : null;

    steps.push({
      step: 'ANALYSIS',
      badge: 'secondary',
      content: [
        { type: 'text', text: `The sequence starts as: ${termDisplay.join(', ')}${n > 5 ? '...' : ''}` },
        { type: 'text', text: `💡 Exponential Growth: Geometric sequences grow exponentially. Small changes in the ratio 'r' lead to massive differences in later terms.` },
        ...(infiniteSumVal ? [
          { type: 'text', text: `💡 Convergence: Because the ratio |${r}| < 1, the terms get smaller and smaller, approaching zero. The total sum of every single term in this infinite sequence would eventually settle at exactly ${infiniteSumVal}.` }
        ] : [
          { type: 'text', text: `💡 Divergence: Because |r| ≥ 1, the terms do not approach zero, and the sum will continue to grow towards infinity.` }
        ]),
      ],
    });

    // Generate full terms for the return object
    for (let i = 0; i < n; i++) {
      terms.push(a1 * Math.pow(r, i));
    }
  }

  return { terms, nthTerm, sum, steps };
}