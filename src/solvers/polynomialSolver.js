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
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Linear Equation of the form:' },
      { type: 'formula', text: 'ax + b = 0' },
      { type: 'text', text: `With coefficients a = ${a}, b = ${b}` },
      { type: 'formula', text: `${a}x + ${b} = 0` },
    ],
  });
  
  const solution = -b / a;
  
  // 2. FORMULA
  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'To isolate x, we perform inverse operations:' },
      { type: 'formula', text: 'x = −(b/a)' },
    ],
  });

  // 3. CALCULATION
  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: `1. Subtract ${b} from both sides:` },
      { type: 'text', text: `${a}x = ${-b}` },
      { type: 'text', text: `2. Divide both sides by ${a}:` },
      { type: 'text', text: `x = ${-b} / ${a}` },
      { type: 'result', text: `x = ${solution}` },
    ],
  });
  
  // 4. ANALYSIS
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: `✅ The equation is satisfied when x = ${solution}.` },
      { type: 'text', text: `🔍 Check: ${a}(${solution}) + ${b} = ${a * solution + b} ≈ 0` },
    ],
  });
  
  return { steps, roots: [solution] };
}

function solveQuadratic([a, b, c]) {
  const steps = [];
  
  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Quadratic Equation of the form:' },
      { type: 'formula', text: 'ax² + bx + c = 0' },
      { type: 'text', text: `With coefficients a = ${a}, b = ${b}, c = ${c}` },
      { type: 'formula', text: `${a}x² + ${b}x + ${c} = 0` },
    ],
  });
  
  // 2. FORMULA
  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'We use the Quadratic Formula:' },
      { type: 'formula', text: 'x = (−b ± √(b² − 4ac)) / 2a' },
      { type: 'text', text: 'The term Δ = b² − 4ac is called the Discriminant.' },
    ],
  });
  
  // 3. CALCULATION
  const discriminant = b * b - 4 * a * c;
  
  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Step 1: Calculate the Discriminant (Δ)' },
      { type: 'formula', text: 'Δ = b² − 4ac' },
      { type: 'text', text: `Δ = (${b})² − 4(${a})(${c})` },
      { type: 'result', text: `Δ = ${discriminant}` },
    ],
  });
  
  let roots;
  
  if (discriminant >= 0) {
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const root1 = (-b + sqrtDiscriminant) / (2 * a);
    const root2 = (-b - sqrtDiscriminant) / (2 * a);
    
    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: 'Step 2: Substitute into Quadratic Formula' },
        { type: 'formula', text: 'x = (−b ± √Δ) / 2a' },
        { type: 'text', text: `x = (−${b} ± √${discriminant}) / 2(${a})` },
        { type: 'result', text: `x₁ = ${root1}` },
        { type: 'result', text: `x₂ = ${root2}` },
      ],
    });
    
    roots = [root1, root2];
  } else {
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-discriminant) / (2 * a);
    
    steps.push({
      step: 'COMPLEX ROOTS',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Since Δ < 0, the roots are complex:' },
        { type: 'text', text: 'x = (−b ± i√|Δ|) / 2a' },
        { type: 'text', text: `x = (−${b} ± i√${-discriminant}) / ${2 * a}` },
        { type: 'text', text: `x = (−${b} ± ${imagPart * 2 * a}i) / ${2 * a}` },
        { type: 'result', text: `x₁ = ${realPart} + ${imagPart}i` },
        { type: 'result', text: `x₂ = ${realPart} − ${imagPart}i` },
      ],
    });
    
    roots = [
      `${realPart} + ${imagPart}i`,
      `${realPart} − ${imagPart}i`
    ];
  }
  
  // 4. ANALYSIS
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: discriminant === 0
        ? '✅ There is exactly one real root (repeated).'
        : discriminant > 0
        ? '✅ There are two distinct real roots.'
        : '✅ There are two complex conjugate roots.'
      },
      ...roots.map((root, idx) => ({ type: 'result', text: `• Root ${idx + 1}: ${root}` })),
    ],
  });
  
  return { steps, roots };
}

function solveCubicDetailed([a, b, c, d]) {
  const steps = [];
  
  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Cubic Equation of the form:' },
      { type: 'formula', text: 'ax³ + bx² + cx + d = 0' },
      { type: 'formula', text: `${a}x³ + ${b}x² + ${c}x + ${d} = 0` },
      { type: 'text', text: 'Strategy: Find the first root using the Rational Root Theorem, then reduce to a quadratic.' },
    ],
  });
  
  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Rational Root Theorem:' },
      { type: 'formula', text: 'Possible Roots = ±(Factors of d)/(Factors of a)' },
      { type: 'text', text: `Constant term d = ${d}, Leading coefficient a = ${a}` },
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
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Possible rational roots to test:' },
      { type: 'text', text: possibleRoots.slice(0, 12).join(', ') + (possibleRoots.length > 12 ? '...' : '') },
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
    // Use numerical approach as fallback
    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: 'No rational root found. Using numerical methods...' },
      ],
    });
    
    // Use Newton's method as fallback
    const newtonResult = findRootNewton(f, (x) => 3 * a * x * x + 2 * b * x + c);
    if (newtonResult) {
      root1 = newtonResult;
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: "Found root using Newton's method:" },
          { type: 'result', text: `x₁ = ${root1.toFixed(6)}` },
        ],
      });
    }
  } else {
    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: 'Testing possible rational roots:' },
        ...testResults.slice(0, 5).map(r => ({ type: 'text', text: r })),
        { type: 'result', text: `✓ Found: x₁ = ${root1}` },
      ],
    });
  }
  
  if (root1 === null) {
    return { steps, roots: ['Could not find roots analytically'] };
  }
  
  steps.push({
    step: 'SYNTHETIC DIVISION',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Synthetic Division: Divide the cubic by (x − x₁)' },
      { type: 'text', text: `Dividing f(x) by (x − ${root1})` },
    ],
  });
  
  const A = a;
  const B = b + root1 * A;
  const C = c + root1 * B;
  
  steps.push({
    step: 'SYNTHETIC DIVISION',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Performing synthetic division:' },
      { type: 'text', text: `${root1} | ${a}  ${b}  ${c}  ${d}` },
      { type: 'text', text: `    |    ${(root1 * A).toFixed(4)}  ${(root1 * B).toFixed(4)}  ${(root1 * C).toFixed(4)}` },
      { type: 'text', text: '    ────────────────────' },
      { type: 'result', text: `    ${A}  ${B.toFixed(4)}  ${C.toFixed(4)}  ≈ 0 ✓` },
      { type: 'text', text: 'Resulting quadratic factor: ' },
      { type: 'formula', text: `${A}x² + ${B.toFixed(4)}x + ${C.toFixed(4)} = 0` },
    ],
  });
  
  // Solve the quadratic
  const quadResult = solveQuadratic([A, B, C]);
  
  steps.push({
    step: 'QUADRATIC SOLUTION',
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
  const degree = coefficients.length - 1;
  const steps = [];
  const leading = coefficients[0];
  const constant = coefficients[coefficients.length - 1];

  // 1. GIVEN
  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: `📝 ${degree}th Degree Polynomial Equation:` },
      { type: 'formula', text: formatPolynomial(coefficients) + ' = 0' },
      { type: 'text', text: 'To solve higher-degree polynomials, we use the Rational Root Theorem to find integer or fractional roots, and then use Synthetic Division to "depress" the equation into a lower degree.' },
    ],
  });

  // 2. FORMULA: Rational Root Theorem
  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🔍 Step 1: Rational Root Theorem' },
      { type: 'text', text: 'Possible rational roots are of the form ±(p/q), where p is a factor of the constant term and q is a factor of the leading coefficient.' },
      { type: 'text', text: `Constant (p) = ${constant}, Leading (q) = ${leading}` },
    ],
  });

  // Process roots
  const allRoots = [];
  let currentPoly = [...coefficients];
  
  // Find rational roots first
  const factorsP = getFactors(Math.abs(Math.round(constant)));
  const factorsQ = getFactors(Math.abs(Math.round(leading)));
  const candidates = [];
  factorsP.forEach(p => {
    factorsQ.forEach(q => {
      const val = p / q;
      if (!candidates.includes(val)) candidates.push(val);
      if (!candidates.includes(-val)) candidates.push(-val);
    });
  });

  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: `Generated ${candidates.length} candidate roots to test:` },
      { type: 'text', text: candidates.slice(0, 10).join(', ') + (candidates.length > 10 ? '...' : '') },
    ],
  });

  // Iterative testing and reduction
  let foundRoot;
  do {
    foundRoot = null;
    for (const root of candidates) {
      if (Math.abs(evaluatePolynomial(currentPoly, root)) < 1e-10) {
        foundRoot = root;
        break;
      }
    }

    if (foundRoot !== null) {
      allRoots.push(foundRoot);

      // Detailed Synthetic Division step
      const nextPoly = [];
      let running = currentPoly[0];
      nextPoly.push(running);

      const products = [0];
      const currentTerms = [...currentPoly];

      for (let i = 1; i < currentPoly.length; i++) {
        const product = running * foundRoot;
        products.push(product);
        running = currentPoly[i] + product;
        nextPoly.push(running);
      }

      steps.push({
        step: 'SYNTHETIC DIVISION',
        badge: 'primary',
        content: [
          { type: 'result', text: `✓ Root Found: x = ${foundRoot}` },
          { type: 'text', text: `Using Synthetic Division to divide by (x − ${foundRoot}):` },
          { type: 'text', text: `${foundRoot} | ` + currentTerms.map(v => v.toString().padStart(5)).join(' ') },
          { type: 'text', text: `    | ` + products.map(v => v.toFixed(2).padStart(5)).join(' ') },
          { type: 'text', text: '    ' + '─'.repeat(currentPoly.length * 6) },
          { type: 'text', text: '    ' + nextPoly.map(v => v.toFixed(2).padStart(5)).join(' ') },
          { type: 'text', text: `The remainder is ${nextPoly[nextPoly.length-1].toFixed(2)}. The new depressed equation is:` },
          { type: 'formula', text: formatPolynomial(nextPoly.slice(0, -1)) + ' = 0' },
        ],
      });

      currentPoly = nextPoly.slice(0, -1);
      if (currentPoly.length === 3) break; // Hand off to quadratic
    }
  } while (foundRoot !== null && currentPoly.length > 3);

  // Numerical Fallback if degree still > 2
  if (currentPoly.length > 3) {
    steps.push({
      step: 'NUMERICAL METHOD',
      badge: 'primary',
      content: [
        { type: 'text', text: 'No more rational roots found. Switching to Newton-Raphson method for numerical approximation.' },
      ],
    });

    while (currentPoly.length > 2 && allRoots.length < degree) {
      const newRoot = findRootNewton(
        x => evaluatePolynomial(currentPoly, x),
        x => evaluateDerivative(currentPoly, x)
      );

      if (newRoot && !allRoots.some(r => Math.abs(r - newRoot) < 1e-5)) {
        allRoots.push(newRoot);
        steps.push({
          step: 'NUMERICAL METHOD',
          badge: 'primary',
          content: [
            { type: 'text', text: `Newton's Iteration converged at x ≈ ${newRoot.toFixed(6)}` },
            { type: 'result', text: `≈ Found real root: x = ${newRoot.toFixed(6)}` },
          ],
        });
        currentPoly = reducePolynomial(currentPoly, [newRoot]);
      } else {
        break;
      }
    }
  }

  // Final Quadratic/Linear check
  if (currentPoly.length === 3) {
    steps.push({
      step: 'QUADRATIC SOLUTION',
      badge: 'primary',
      content: [
        { type: 'text', text: 'Remaining factor is a quadratic. Applying Quadratic Formula:' },
      ],
    });
    const quad = solveQuadratic(currentPoly);
    quad.steps.forEach(s => steps.push(s));
    quad.roots.forEach(r => allRoots.push(r));
  } else if (currentPoly.length === 2) {
    const r = -currentPoly[1] / currentPoly[0];
    allRoots.push(r);
    steps.push({
      step: 'LINEAR SOLUTION',
      badge: 'primary',
      content: [{ type: 'result', text: `Final linear root: x = ${r}` }],
    });
  }

  // 4. ANALYSIS
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: `Polynomial Analysis Complete.` },
      { type: 'text', text: `Fundamental Theorem of Algebra states a degree ${degree} polynomial has ${degree} roots.` },
      ...allRoots.map((r, i) => ({
        type: 'result',
        text: `x${getSubscript(i + 1)} = ${typeof r === 'number' ? r.toFixed(6).replace(/\.?0+$/, '') : r}`
      })),
    ],
  });
  
  return { steps, roots: allRoots };
}

// Helper function for subscripts
function getSubscript(num) {
  const subscripts = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return String(num).split('').map(digit => subscripts[digit] || digit).join('');
}

function formatPolynomial(coeffs) {
  const degree = coeffs.length - 1;
  return coeffs.map((c, i) => {
    if (c === 0) return '';
    const p = degree - i;
    const sign = c > 0 ? (i === 0 ? '' : ' + ') : ' − ';
    const absC = Math.abs(c);
    const val = (absC === 1 && p > 0) ? '' : absC;
    
    // Use Unicode superscripts for powers
    const superscripts = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    
    let x;
    if (p === 0) {
      x = '';
    } else if (p === 1) {
      x = 'x';
    } else {
      const powerStr = String(p).split('').map(d => superscripts[d] || d).join('');
      x = `x${powerStr}`;
    }
    
    return sign + val + x;
  }).join('').trim();
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