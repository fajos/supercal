export function solveLinearSystem(a1, b1, c1, a2, b2, c2) {
  const det = a1 * b2 - a2 * b1;

  if (Math.abs(det) < 1e-10) {
    throw new Error(
      'Determinant is zero. The system has either no solution (inconsistent) or infinitely many solutions (dependent).'
    );
  }

  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;

  const steps = [
    {
      step: 'STEP 1',
      badge: 'primary',
      content: [
        { type: 'text', text: 'Write the system of equations:' },
        { type: 'text', text: `Eq 1: ${a1}x + ${b1}y = ${c1}` },
        { type: 'text', text: `Eq 2: ${a2}x + ${b2}y = ${c2}` },
      ],
    },
    {
      step: 'STEP 2',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Calculate determinant D = a₁b₂ − a₂b₁:' },
        { type: 'text', text: `D = (${a1})(${b2}) − (${a2})(${b1})` },
        { type: 'text', text: `D = ${a1 * b2} − ${a2 * b1}` },
        { type: 'highlight', text: `D = ${det.toFixed(4)} ≠ 0 ✅ (unique solution exists)` },
      ],
    },
    {
      step: 'STEP 3',
      badge: 'primary',
      content: [
        { type: 'text', text: "Apply Cramer's Rule:" },
        { type: 'text', text: `x = (c₁b₂ − c₂b₁) / D` },
        { type: 'text', text: `x = ((${c1})(${b2}) − (${c2})(${b1})) / ${det.toFixed(4)}` },
        { type: 'text', text: `x = (${c1 * b2} − ${c2 * b1}) / ${det.toFixed(4)}` },
        { type: 'text', text: `x = ${c1 * b2 - c2 * b1} / ${det.toFixed(4)}` },
        { type: 'result', text: `x = ${x.toFixed(4)}` },
        { type: 'text', text: '' },
        { type: 'text', text: `y = (a₁c₂ − a₂c₁) / D` },
        { type: 'text', text: `y = ((${a1})(${c2}) − (${a2})(${c1})) / ${det.toFixed(4)}` },
        { type: 'text', text: `y = (${a1 * c2} − ${a2 * c1}) / ${det.toFixed(4)}` },
        { type: 'text', text: `y = ${a1 * c2 - a2 * c1} / ${det.toFixed(4)}` },
        { type: 'result', text: `y = ${y.toFixed(4)}` },
      ],
    },
    {
      step: 'VERIFICATION',
      badge: 'warning',
      content: [
        { type: 'text', text: '✅ Plug back into original equations:' },
        { type: 'text', text: `Eq 1: ${a1}(${x.toFixed(4)}) + ${b1}(${y.toFixed(4)}) = ${(a1 * x + b1 * y).toFixed(4)} ≈ ${c1}` },
        { type: 'text', text: `Eq 2: ${a2}(${x.toFixed(4)}) + ${b2}(${y.toFixed(4)}) = ${(a2 * x + b2 * y).toFixed(4)} ≈ ${c2}` },
      ],
    },
  ];

  return { steps, x, y, det };
}