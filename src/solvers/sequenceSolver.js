// sequenceSolver.js
export function solveSequence(type, a1, d_or_r, n) {
  const steps = [];
  let terms = [];
  let sum = 0;
  let nthTerm;
  
  if (type === 'arithmetic') {
    const d = d_or_r; // common difference
    
    steps.push({
      step: 'ARITHMETIC SEQUENCE',
      badge: 'primary',
      content: [
        { type: 'text', text: '📐 Arithmetic Sequence: aₙ = a₁ + (n-1)d' },
        { type: 'text', text: `a₁ = ${a1}, d = ${d}, n = ${n}` },
      ],
    });
    
    // Generate terms
    steps.push({
      step: 'TERMS',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'First few terms:' },
        ...Array.from({length: Math.min(10, n)}, (_, i) => {
          const term = a1 + i * d;
          terms.push(term);
          return { type: 'text', text: `a${i+1} = ${a1} + ${i}×${d} = ${term}` };
        }),
      ],
    });
    
    nthTerm = a1 + (n - 1) * d;
    sum = (n / 2) * (2 * a1 + (n - 1) * d);
    
    steps.push({
      step: 'NTH TERM',
      badge: 'primary',
      content: [
        { type: 'text', text: `a${n} = ${a1} + (${n}-1)×${d}` },
        { type: 'highlight', text: `a${n} = ${nthTerm}` },
      ],
    });
    
    steps.push({
      step: 'SUM',
      badge: 'warning',
      content: [
        { type: 'text', text: 'Sum: Sₙ = n/2[2a₁ + (n-1)d]' },
        { type: 'text', text: `S${n} = ${n}/2[2(${a1}) + (${n}-1)(${d})]` },
        { type: 'highlight', text: `S${n} = ${sum}` },
      ],
    });
    
  } else if (type === 'geometric') {
    const r = d_or_r; // common ratio
    
    steps.push({
      step: 'GEOMETRIC SEQUENCE',
      badge: 'primary',
      content: [
        { type: 'text', text: '📈 Geometric Sequence: aₙ = a₁ × r^(n-1)' },
        { type: 'text', text: `a₁ = ${a1}, r = ${r}, n = ${n}` },
      ],
    });
    
    // Generate terms
    steps.push({
      step: 'TERMS',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'First few terms:' },
        ...Array.from({length: Math.min(10, n)}, (_, i) => {
          const term = a1 * Math.pow(r, i);
          terms.push(term);
          return { type: 'text', text: `a${i+1} = ${a1} × ${r}^${i} = ${term.toFixed(4)}` };
        }),
      ],
    });
    
    nthTerm = a1 * Math.pow(r, n - 1);
    
    if (r === 1) {
      sum = a1 * n;
    } else {
      sum = a1 * (1 - Math.pow(r, n)) / (1 - r);
    }
    
    steps.push({
      step: 'NTH TERM',
      badge: 'primary',
      content: [
        { type: 'text', text: `a${n} = ${a1} × ${r}^(${n}-1)` },
        { type: 'highlight', text: `a${n} = ${nthTerm.toFixed(4)}` },
      ],
    });
    
    steps.push({
      step: 'SUM',
      badge: 'warning',
      content: [
        { type: 'text', text: 'Sum: Sₙ = a₁(1 - r^n)/(1 - r)' },
        { type: 'highlight', text: `S${n} = ${sum.toFixed(4)}` },
        ...(Math.abs(r) < 1 ? [
          { type: 'text', text: `Infinite sum exists: S∞ = a₁/(1-r) = ${(a1/(1-r)).toFixed(4)}` },
        ] : []),
      ],
    });
  }
  
  return { terms, nthTerm, sum, steps };
}