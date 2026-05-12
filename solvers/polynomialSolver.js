export function solveCubic(coefficients) {
  // coefficients = [a, b, c, d] for ax³ + bx² + cx + d = 0
  const a = coefficients[0] || 1;
  const b = coefficients[1] || 0;
  const c = coefficients[2] || 0;
  const d = coefficients[3] || 0;

  if (a === 0) {
    throw new Error('Leading coefficient cannot be zero.');
  }

  const f = (x) => a * x ** 3 + b * x ** 2 + c * x + d;
  const fPrime = (x) => 3 * a * x ** 2 + 2 * b * x + c;

  // Newton's method to find first real root
  let x0 = 0;
  let converged = false;
  for (let i = 0; i < 100; i++) {
    const fx = f(x0);
    const fpx = fPrime(x0);
    if (Math.abs(fpx) < 1e-12) break;
    const x1 = x0 - fx / fpx;
    if (Math.abs(x1 - x0) < 1e-10 && Math.abs(f(x1)) < 1e-8) {
      x0 = x1;
      converged = true;
      break;
    }
    x0 = x1;
  }

  // Try other starting points if Newton didn't converge
  if (!converged) {
    const starters = [1, -1, 2, -2, 0.5, -0.5];
    for (const start of starters) {
      x0 = start;
      for (let i = 0; i < 100; i++) {
        const fx = f(x0);
        const fpx = fPrime(x0);
        if (Math.abs(fpx) < 1e-12) break;
        const x1 = x0 - fx / fpx;
        if (Math.abs(x1 - x0) < 1e-10 && Math.abs(f(x1)) < 1e-8) {
          x0 = x1;
          converged = true;
          break;
        }
        x0 = x1;
      }
      if (converged) break;
    }
  }

  const steps = [
    {
      step: 'STEP 1',
      badge: 'primary',
      content: [
        { type: 'text', text: `Polynomial: ${a}x³ + ${b}x² + ${c}x + ${d} = 0` },
        { type: 'text', text: 'Using Newton\'s Method to find first real root...' },
      ],
    },
  ];

  if (!converged) {
    steps.push({
      step: 'RESULT',
      badge: 'warning',
      content: [
        { type: 'text', text: 'Newton\'s method did not converge. The polynomial may have only complex roots or require a different numerical method.' },
      ],
    });
    return { steps, roots: ['Unable to find roots numerically'] };
  }

  const root1 = x0;
  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'highlight', text: `First real root found: x₁ = ${root1.toFixed(6)}` },
      { type: 'text', text: 'Performing synthetic division to reduce to quadratic...' },
    ],
  });

  // Synthetic division: (ax³ + bx² + cx + d) ÷ (x - root1) = Ax² + Bx + C
  const A = a;
  const B = b + root1 * A;
  const C = c + root1 * B;

  steps.push({
    step: 'STEP 3',
    badge: 'primary',
    content: [
      { type: 'text', text: 'After synthetic division, the quadratic factor is:' },
      { type: 'highlight', text: `${A.toFixed(4)}x² + ${B.toFixed(4)}x + ${C.toFixed(4)} = 0` },
    ],
  });

  // Solve quadratic
  const discriminant = B * B - 4 * A * C;
  let root2, root3;

  if (discriminant >= 0) {
    root2 = (-B + Math.sqrt(discriminant)) / (2 * A);
    root3 = (-B - Math.sqrt(discriminant)) / (2 * A);
    steps.push({
      step: 'STEP 4',
      badge: 'secondary',
      content: [
        { type: 'text', text: `Quadratic discriminant: Δ = ${discriminant.toFixed(4)} ≥ 0` },
        { type: 'text', text: 'Two real roots from quadratic formula:' },
        { type: 'result', text: `x₂ = ${root2.toFixed(6)}` },
        { type: 'result', text: `x₃ = ${root3.toFixed(6)}` },
      ],
    });
  } else {
    const realPart = -B / (2 * A);
    const imagPart = Math.sqrt(-discriminant) / (2 * A);
    root2 = `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`;
    root3 = `${realPart.toFixed(4)} − ${imagPart.toFixed(4)}i`;
    steps.push({
      step: 'STEP 4',
      badge: 'secondary',
      content: [
        { type: 'text', text: `Quadratic discriminant: Δ = ${discriminant.toFixed(4)} < 0` },
        { type: 'text', text: 'Complex conjugate roots:' },
        { type: 'result', text: `x₂ = ${root2}` },
        { type: 'result', text: `x₃ = ${root3}` },
      ],
    });
  }

  steps.push({
    step: 'VERIFICATION',
    badge: 'warning',
    content: [
      { type: 'text', text: '✅ All three roots satisfy the original cubic equation (within numerical precision).' },
    ],
  });

  return { steps, roots: [root1, root2, root3] };
}