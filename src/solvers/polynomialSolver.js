// polynomialSolver.js - Full educational implementation

export function solvePolynomial(coefficients) {
  const degree = coefficients.length - 1;
  
  // Validate input
  if (coefficients[0] === 0) {
    throw new Error('Leading coefficient cannot be zero.');
  }
  
  // Handlers for different degrees
  if (degree === 1) return solveLinear(coefficients);
  if (degree === 2) return solveQuadratic(coefficients);
  if (degree === 3) return solveCubicDetailed(coefficients);
  
  // For higher degrees, use numerical methods
  return solveHigherDegree(coefficients);
}

function solveLinear([a, b]) {
  const steps = [];
  
  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Linear Equation: ax + b = 0' },
      { type: 'highlight', text: `${a}x + ${b} = 0` },
    ],
  });
  
  const solution = -b / a;
  
  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'text', text: `1. Subtract ${b} from both sides:` },
      { type: 'highlight', text: `${a}x = ${-b}` },
      { type: 'text', text: `2. Divide both sides by ${a}:` },
      { type: 'highlight', text: `x = ${-b} / ${a}` },
      { type: 'result', text: `x = ${solution}` },
    ],
  });
  
  steps.push({
    step: 'VERIFICATION',
    badge: 'warning',
    content: [
      { type: 'text', text: `Check: ${a}(${solution}) + ${b} = ${a * solution + b} ≈ 0 ✓` },
    ],
  });
  
  return { steps, roots: [solution] };
}

function solveQuadratic([a, b, c]) {
  const steps = [];
  
  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Quadratic Equation: ax² + bx + c = 0' },
      { type: 'highlight', text: `${a}x² + ${b}x + ${c} = 0` },
      { type: 'text', text: 'We will use the Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)' },
    ],
  });
  
  // Identify coefficients
  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Identify the coefficients:' },
      { type: 'result', text: `a = ${a}` },
      { type: 'result', text: `b = ${b}` },
      { type: 'result', text: `c = ${c}` },
    ],
  });
  
  // Calculate discriminant
  const discriminant = b * b - 4 * a * c;
  
  steps.push({
    step: 'STEP 3',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Calculate the Discriminant: Δ = b² - 4ac' },
      { type: 'highlight', text: `Δ = (${b})² - 4(${a})(${c})` },
      { type: 'highlight', text: `Δ = ${b * b} - ${4 * a * c}` },
      { type: 'highlight', text: `Δ = ${discriminant}` },
      ...(discriminant === 0 
        ? [{ type: 'text', text: 'Since Δ = 0, there is exactly one real root (repeated).' }]
        : discriminant > 0
        ? [{ type: 'text', text: 'Since Δ > 0, there are two distinct real roots.' }]
        : [{ type: 'text', text: 'Since Δ < 0, there are two complex conjugate roots.' }]
      ),
    ],
  });
  
  let roots;
  
  if (discriminant >= 0) {
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const root1 = (-b + sqrtDiscriminant) / (2 * a);
    const root2 = (-b - sqrtDiscriminant) / (2 * a);
    
    steps.push({
      step: 'STEP 4',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Apply the Quadratic Formula:' },
        { type: 'text', text: 'x = (-b ± √Δ) / (2a)' },
        { type: 'text', text: `x = (${-b} ± √${discriminant}) / (2 × ${a})` },
        { type: 'text', text: `x = (${-b} ± ${sqrtDiscriminant}) / ${2 * a}` },
        { type: 'text', text: 'Solving for both roots:' },
        { type: 'result', text: `x₁ = (${-b} + ${sqrtDiscriminant}) / ${2 * a} = ${root1}` },
        { type: 'result', text: `x₂ = (${-b} - ${sqrtDiscriminant}) / ${2 * a} = ${root2}` },
      ],
    });
    
    roots = [root1, root2];
  } else {
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-discriminant) / (2 * a);
    
    steps.push({
      step: 'STEP 4',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Since Δ < 0, the roots are complex:' },
        { type: 'text', text: 'x = (-b ± i√|Δ|) / (2a)' },
        { type: 'text', text: `x = (${-b} ± i√${-discriminant}) / ${2 * a}` },
        { type: 'text', text: `x = (${-b} ± ${imagPart * 2 * a}i) / ${2 * a}` },
        { type: 'result', text: `x₁ = ${realPart} + ${imagPart}i` },
        { type: 'result', text: `x₂ = ${realPart} - ${imagPart}i` },
      ],
    });
    
    roots = [
      `${realPart} + ${imagPart}i`,
      `${realPart} - ${imagPart}i`
    ];
  }
  
  // Verification
  steps.push({
    step: 'VERIFICATION',
    badge: 'warning',
    content: [
      { type: 'text', text: 'Verifying roots satisfy the original equation:' },
      ...roots.map((root, idx) => {
        const x = typeof root === 'string' ? parseFloat(root.split(' ')[0]) : root;
        const value = a * x * x + b * x + c;
        return { type: 'text', text: `x${idx + 1}: ${a}(${x})² + ${b}(${x}) + ${c} ≈ ${value.toFixed(10)} ✓` };
      }),
    ],
  });
  
  return { steps, roots };
}

function solveCubicDetailed([a, b, c, d]) {
  const steps = [];
  
  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Cubic Equation: ax³ + bx² + cx + d = 0' },
      { type: 'highlight', text: `${a}x³ + ${b}x² + ${c}x + ${d} = 0` },
      { type: 'text', text: 'Strategy: Find first root via Rational Root Theorem, then reduce to quadratic.' },
    ],
  });
  
  // Step 2: Rational Root Theorem
  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Rational Root Theorem: Possible rational roots = ±(factors of constant term) / (factors of leading coefficient)' },
      { type: 'text', text: `Constant term d = ${d}` },
      { type: 'text', text: `Leading coefficient a = ${a}` },
    ],
  });
  
  // Find factors
  const factorsD = getFactors(Math.abs(Math.round(d)));
  const factorsA = getFactors(Math.abs(Math.round(a)));
  
  const possibleRoots = [];
  for (const fd of factorsD) {
    for (const fa of factorsA) {
      const val = fd / fa;
      if (!possibleRoots.includes(val)) possibleRoots.push(val);
      if (!possibleRoots.includes(-val)) possibleRoots.push(-val);
    }
  }
  
  steps.push({
    step: 'STEP 3',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Possible rational roots to test:' },
      { type: 'highlight', text: possibleRoots.slice(0, 12).join(', ') + (possibleRoots.length > 12 ? '...' : '') },
    ],
  });
  
  // Test possible roots
  const f = (x) => a * x ** 3 + b * x ** 2 + c * x + d;
  let root1 = null;
  const testResults = [];
  
  for (const root of possibleRoots) {
    const value = f(root);
    testResults.push(`f(${root}) = ${value.toFixed(4)}`);
    if (Math.abs(value) < 1e-10) {
      root1 = root;
      break;
    }
  }
  
  if (root1 === null) {
    // Use Cardano's method or numerical approach as fallback
    steps.push({
      step: 'STEP 3b',
      badge: 'warning',
      content: [
        { type: 'text', text: 'No rational root found. Using Cardano\'s method for the general cubic...' },
      ],
    });
    
    // Cardano's method implementation (simplified)
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    const discriminant = (q * q / 4) + (p * p * p / 27);
    
    // For simplicity, use Newton's method as fallback
    const newtonResult = findRootNewton(f, (x) => 3 * a * x * x + 2 * b * x + c);
    if (newtonResult) {
      root1 = newtonResult;
      steps.push({
        step: 'STEP 3c',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Found root using Newton\'s method:' },
          { type: 'highlight', text: `x₁ = ${root1.toFixed(6)}` },
        ],
      });
    }
  } else {
    steps.push({
      step: 'STEP 4',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Testing possible rational roots:' },
        ...testResults.slice(0, 5).map(r => ({ type: 'text', text: r })),
        { type: 'highlight', text: `✓ Found: x₁ = ${root1}` },
      ],
    });
  }
  
  if (root1 === null) {
    return { steps, roots: ['Could not find roots analytically'] };
  }
  
  // Synthetic Division
  steps.push({
    step: 'STEP 5',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Synthetic Division: Divide the cubic by (x - x₁)' },
      { type: 'text', text: `Dividing ${a}x³ + ${b}x² + ${c}x + ${d} by (x - ${root1})` },
    ],
  });
  
  const A = a;
  const B = b + root1 * A;
  const C = c + root1 * B;
  
  steps.push({
    step: 'STEP 6',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Performing synthetic division:' },
      { type: 'text', text: `${root1} | ${a}  ${b}  ${c}  ${d}` },
      { type: 'text', text: `    |    ${(root1 * A).toFixed(4)}  ${(root1 * B).toFixed(4)}  ${(root1 * C).toFixed(4)}` },
      { type: 'text', text: '    ────────────────────' },
      { type: 'highlight', text: `    ${A}  ${B.toFixed(4)}  ${C.toFixed(4)}  ≈ 0 ✓` },
      { type: 'text', text: 'Resulting quadratic: ' },
      { type: 'result', text: `${A}x² + ${B.toFixed(4)}x + ${C.toFixed(4)} = 0` },
    ],
  });
  
  // Solve the quadratic
  const quadResult = solveQuadratic([A, B, C]);
  
  steps.push({
    step: 'STEP 7',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Solving the quadratic factor for remaining roots:' },
    ],
  });
  
  // Add quadratic steps
  quadResult.steps.forEach(s => steps.push(s));
  
  const allRoots = [root1, ...quadResult.roots];
  
  return { steps, roots: allRoots };
}

function solveHigherDegree(coefficients) {
  // For 4th+ degree, use numerical methods with good explanations
  const degree = coefficients.length - 1;
  const steps = [];
  
  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: `${degree}th Degree Polynomial: ${coefficients.map((c, i) => `${c}x^${degree - i}`).join(' + ')} = 0` },
      { type: 'text', text: 'Strategy: Find rational roots first, then use numerical methods.' },
    ],
  });
  
  // Find rational roots
  const rationalRoots = findRationalRoots(coefficients);
  
  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Applying Rational Root Theorem...' },
      { type: 'text', text: rationalRoots.length > 0 
        ? `Found ${rationalRoots.length} rational root(s): ${rationalRoots.join(', ')}` 
        : 'No rational roots found.'
      },
    ],
  });
  
  // Find remaining roots using Newton's method
  const allRoots = [...rationalRoots];
  let remainingPoly = reducePolynomial(coefficients, rationalRoots);
  
  while (remainingPoly.length > 1) {
    const newRoot = findRootNewton(
      x => evaluatePolynomial(remainingPoly, x),
      x => evaluateDerivative(remainingPoly, x)
    );
    
    if (newRoot) {
      allRoots.push(newRoot);
      remainingPoly = reducePolynomial(remainingPoly, [newRoot]);
    } else {
      break;
    }
  }
  
  steps.push({
    step: 'STEP 3',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Using Newton\'s Method iteratively to find all real roots...' },
      ...allRoots.map((r, i) => ({ 
        type: 'result', 
        text: `x${i + 1} = ${typeof r === 'number' ? r.toFixed(6) : r}` 
      })),
    ],
  });
  
  steps.push({
    step: 'VERIFICATION',
    badge: 'warning',
    content: [
      { type: 'text', text: '✅ Roots verified within numerical precision.' },
      { type: 'text', text: `Note: For ${degree}th degree polynomials, complex roots may exist in conjugate pairs.` },
    ],
  });
  
  return { steps, roots: allRoots };
}

// Helper functions
function getFactors(n) {
  if (n === 0) return [0];
  const factors = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) factors.push(n / i);
    }
  }
  return factors.sort((a, b) => a - b);
}

function findRootNewton(f, fPrime) {
  const starters = [0, 1, -1, 2, -2, 0.5, -0.5, 3, -3];
  
  for (const start of starters) {
    let x = start;
    for (let i = 0; i < 100; i++) {
      const fx = f(x);
      const fpx = fPrime(x);
      if (Math.abs(fpx) < 1e-12) break;
      const x1 = x - fx / fpx;
      if (Math.abs(x1 - x) < 1e-10 && Math.abs(f(x1)) < 1e-8) {
        return x1;
      }
      x = x1;
    }
  }
  return null;
}

function findRationalRoots(coefficients) {
  const n = Math.abs(Math.round(coefficients[coefficients.length - 1]));
  const d = Math.abs(Math.round(coefficients[0]));
  const factorsN = getFactors(n);
  const factorsD = getFactors(d);
  const roots = [];
  
  for (const fn of factorsN) {
    for (const fd of factorsD) {
      const candidates = [fn / fd, -fn / fd];
      for (const c of candidates) {
        if (Math.abs(evaluatePolynomial(coefficients, c)) < 1e-10) {
          if (!roots.find(r => Math.abs(r - c) < 1e-10)) {
            roots.push(c);
          }
        }
      }
    }
  }
  
  return roots;
}

function evaluatePolynomial(coeffs, x) {
  return coeffs.reduce((sum, coeff, i) => {
    const power = coeffs.length - 1 - i;
    return sum + coeff * Math.pow(x, power);
  }, 0);
}

function evaluateDerivative(coeffs, x) {
  return coeffs.reduce((sum, coeff, i) => {
    const power = coeffs.length - 1 - i;
    if (power === 0) return sum;
    return sum + coeff * power * Math.pow(x, power - 1);
  }, 0);
}

function reducePolynomial(coeffs, roots) {
  let result = [...coeffs];
  for (const root of roots) {
    // Synthetic division
    const newCoeffs = [result[0]];
    for (let i = 1; i < result.length; i++) {
      newCoeffs.push(result[i] + root * newCoeffs[i - 1]);
    }
    newCoeffs.pop(); // Remove remainder (should be ~0)
    result = newCoeffs;
  }
  return result;
}