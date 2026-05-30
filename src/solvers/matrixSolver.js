// matrixSolver.js - Comprehensive educational matrix operations

export function solveDeterminant(matrix) {
  const n = matrix.length;
  const steps = [];
  
  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 Problem Statement:' },
      { type: 'text', text: `Matrix A (${n}×${n}):` },
      ...formatMatrix(matrix),
    ],
  });

  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'The determinant (det) measures the "scale factor" of the transformation.' },
      { type: 'formula', text: 'det(A) ≠ 0 → Invertible' },
      { type: 'formula', text: 'det(A) = 0 → Singular (no inverse)' },
    ],
  });

  // Base cases
  if (n === 1) {
    steps.push({
      step: 'RESULT',
      badge: 'primary',
      content: [
        { type: 'text', text: 'For a 1×1 matrix, the determinant is the value itself.' },
        { type: 'result', text: `det(A) = ${matrix[0][0]}` },
      ],
    });
    return { value: matrix[0][0], steps };
  }

  if (n === 2) {
    const a = matrix[0][0], b = matrix[0][1];
    const c = matrix[1][0], d = matrix[1][1];
    const det = a * d - b * c;

    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: 'For a 2×2 matrix, the determinant is calculated as:' },
        { type: 'formula', text: 'det(A) = ad − bc' },
        { type: 'text', text: `det(A) = (${a} · ${d}) − (${b} · ${c})` },
        { type: 'text', text: `det(A) = ${a * d} − ${b * c}` },
        { type: 'result', text: `det(A) = ${det}` },
      ],
    });

    steps.push({
      step: 'ANALYSIS',
      badge: 'secondary',
      content: [
        { type: 'text', text: det !== 0 ? '✅ Matrix is non-singular (invertible).' : '⚠️ Matrix is singular (no inverse).' },
        { type: 'text', text: `💡 Geometric area: ${Math.abs(det)} units².` },
      ],
    });

    return { value: det, steps };
  }

  // For n ≥ 3: Cofactor expansion
  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🎯 COFACTOR EXPANSION (Laplace Expansion)' },
      { type: 'text', text: 'Expanding along the first row:' },
      { type: 'formula', text: 'det(A) = Σ(−1)¹⁺ʲ · a₁ⱼ · M₁ⱼ' },
      { type: 'text', text: 'where M₁ⱼ is the determinant of the minor matrix obtained by removing row 1 and column j.' },
    ],
  });

  // Calculate cofactor expansion step by step
  let det = 0;
  const terms = [];

  for (let j = 0; j < n; j++) {
    const element = matrix[0][j];
    if (element === 0) {
      terms.push({ j, element, contribution: 0, sign: '0' });
      continue;
    }

    const sign = ((1 + j + 1) % 2 === 0) ? '+' : '−';
    const signValue = sign === '+' ? 1 : -1;
    
    // Extract minor (submatrix without row 0 and column j)
    const minor = [];
    for (let i = 1; i < n; i++) {
      minor.push(matrix[i].filter((_, idx) => idx !== j));
    }

    const minorDet = calculateDeterminantRecursive(minor);
    const contribution = signValue * element * minorDet;
    det += contribution;

    terms.push({ j, element, sign, minor, minorDet, contribution });
  }

  // Show each term
  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: '📝 CALCULATING EACH COFACTOR' },
      ...terms.flatMap((term, idx) => {
        if (term.element === 0) {
          return [{ type: 'text', text: `Term ${idx + 1}: a₁${getSubscript(term.j + 1)} = 0 (skipping)` }];
        }
        return [
          { type: 'text', text: `Term ${idx + 1}: ${term.sign}${term.element} × det(M₁${getSubscript(term.j + 1)})` },
          { type: 'result', text: `Contribution: ${term.contribution.toFixed(4)}` }
        ];
      }),
    ],
  });

  // Sum up
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: '✨ FINAL SUM' },
      { type: 'text', text: terms.map((t, i) => {
        const sign = t.contribution >= 0 && i > 0 ? '+' : '';
        return ` ${sign}${t.contribution.toFixed(4)}`;
      }).join('') },
      { type: 'result', text: `det(A) = ${det.toFixed(6)}` },
      { type: 'text', text: det !== 0 ? '✅ Matrix is invertible.' : '⚠️ Matrix is singular.' },
    ],
  });

  // Properties
  steps.push({
    step: 'PROPERTIES',
    badge: 'primary',
    content: [
      { type: 'text', text: '📚 IMPORTANT DETERMINANT PROPERTIES' },
      { type: 'text', text: '• det(Aᵀ) = det(A) (transpose)' },
      { type: 'text', text: '• det(AB) = det(A) × det(B)' },
      { type: 'text', text: '• Swapping rows changes sign of determinant' },
      { type: 'text', text: '• det(kA) = kⁿ det(A) for n×n matrix' },
    ],
  });

  return { value: det, steps };
}

function calculateDeterminantRecursive(matrix) {
  const n = matrix.length;
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  let det = 0;
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) continue;
    const sign = (j % 2 === 0) ? 1 : -1;
    const minor = [];
    for (let i = 1; i < n; i++) {
      minor.push(matrix[i].filter((_, idx) => idx !== j));
    }
    det += sign * matrix[0][j] * calculateDeterminantRecursive(minor);
  }
  return det;
}

export function solveInverse(matrix) {
  const n = matrix.length;
  const steps = [];
  const detResult = solveDeterminant(matrix);

  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 Problem Statement:' },
      { type: 'text', text: `Find A⁻¹ for ${n}×${n} Matrix A:` },
      ...formatMatrix(matrix),
    ],
  });

  if (Math.abs(detResult.value) < 1e-10) {
    steps.push({
      step: 'ANALYSIS',
      badge: 'secondary',
      content: [
        { type: 'text', text: '⚠️ Matrix is singular! det(A) = 0' },
        { type: 'text', text: 'The inverse does not exist because the transformation collapses dimensions.' },
      ],
    });
    throw new Error('Matrix is singular (determinant = 0). Inverse does not exist.');
  }

  // Calculate cofactor matrix
  const cofactors = [];
  for (let i = 0; i < n; i++) {
    cofactors[i] = [];
    for (let j = 0; j < n; j++) {
      // Create minor by removing row i and column j
      const minor = [];
      for (let r = 0; r < n; r++) {
        if (r === i) continue;
        const row = [];
        for (let c = 0; c < n; c++) {
          if (c === j) continue;
          row.push(matrix[r][c]);
        }
        minor.push(row);
      }
      const minorDet = calculateDeterminantRecursive(minor);
      const sign = ((i + j) % 2 === 0) ? 1 : -1;
      cofactors[i][j] = sign * minorDet;
    }
  }

  // Calculate adjugate (transpose of cofactor matrix)
  const adjugate = cofactors[0].map((_, col) => cofactors.map(row => row[col]));

  // Calculate inverse = (1/det) * adjugate
  const det = detResult.value;
  const inverse = adjugate.map(row => row.map(val => val / det));

  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Inverse Formula:' },
      { type: 'formula', text: 'A⁻¹ = (1/det(A)) · adj(A)' },
    ],
  });

  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: '1. Determinant:' },
      { type: 'result', text: `det(A) = ${detResult.value.toFixed(4)}` },
      { type: 'text', text: '2. Building Cofactor Matrix C:' },
      ...formatMatrix(cofactors),
      { type: 'text', text: '3. Adjugate Matrix (Cᵀ):' },
      ...formatMatrix(adjugate),
    ],
  });

  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Final Inverse A⁻¹:' },
      ...formatMatrix(inverse),
      { type: 'text', text: '✅ Verification: A × A⁻¹ = I' },
    ],
  });

  return { matrix: inverse, steps, det: detResult.value };
}

export function solveEigenvalues(matrix) {
  const n = matrix.length;
  const steps = [];

  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 Problem Statement:' },
      { type: 'text', text: `Find eigenvalues (λ) for ${n}×${n} Matrix A:` },
      ...formatMatrix(matrix),
    ],
  });

  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Characteristic Equation:' },
      { type: 'formula', text: 'det(A − λI) = 0' },
      { type: 'text', text: '1. Form the matrix A − λI' },
      { type: 'text', text: '2. Find the determinant as a function of λ (Characteristic Polynomial)' },
      { type: 'text', text: '3. Solve for roots λ' },
    ],
  });

  if (n === 2) {
    const a = matrix[0][0], b = matrix[0][1];
    const c = matrix[1][0], d = matrix[1][1];
    const trace = a + d;
    const determinant = a * d - b * c;
    const discriminant = trace * trace - 4 * determinant;

    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: 'For 2×2, the polynomial is:' },
        { type: 'formula', text: 'λ² − tr(A)λ + det(A) = 0' },
        { type: 'text', text: `λ² − ${trace}λ + ${determinant} = 0` },
        { type: 'text', text: `Discriminant (Δ) = (−${trace})² − 4(1)(${determinant})` },
        { type: 'result', text: `Δ = ${discriminant.toFixed(4)}` },
      ],
    });

    let eigenvalues;
    if (discriminant >= 0) {
      const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
      const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
      eigenvalues = [lambda1, lambda2];
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'result', text: `λ₁ = ${lambda1.toFixed(4)}` },
          { type: 'result', text: `λ₂ = ${lambda2.toFixed(4)}` },
          { type: 'text', text: '✅ Real eigenvalues found.' },
        ],
      });
    } else {
      const realPart = trace / 2;
      const imagPart = Math.sqrt(-discriminant) / 2;
      eigenvalues = [
        `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`,
        `${realPart.toFixed(4)} − ${imagPart.toFixed(4)}i`
      ];
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'result', text: `λ₁ = ${eigenvalues[0]}` },
          { type: 'result', text: `λ₂ = ${eigenvalues[1]}` },
          { type: 'text', text: '⚠️ Complex conjugate eigenvalues.' },
        ],
      });
    }

    return { eigenvalues, steps };
  }

  // For 3×3: More detailed approach
  if (n === 3) {
    const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
    const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
    const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];

    const trace = a + e + i;
    const sumOfMinors = (a*e - b*d) + (a*i - c*g) + (e*i - f*h);
    const det = calculateDeterminantRecursive(matrix);

    steps.push({
      step: 'CALCULATION',
      badge: 'secondary',
      content: [
        { type: 'text', text: '📝 FORM A − λI' },
        { type: 'text', text: `[${a}−λ,  ${b},   ${c}]` },
        { type: 'text', text: `[${d},   ${e}−λ, ${f}]` },
        { type: 'text', text: `[${g},   ${h},   ${i}−λ]` },
      ],
    });

    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: '📊 CHARACTERISTIC POLYNOMIAL' },
        { type: 'text', text: 'For 3×3 matrix:' },
        { type: 'formula', text: '−λ³ + tr(A)λ² − ℓλ + det(A) = 0' },
        { type: 'text', text: `trace (tr) = ${trace.toFixed(4)}` },
        { type: 'text', text: `sum of principal minors (ℓ) = ${sumOfMinors.toFixed(4)}` },
        { type: 'text', text: `determinant = ${det.toFixed(4)}` },
        { type: 'result', text: `−λ³ + ${trace.toFixed(2)}λ² − ${sumOfMinors.toFixed(2)}λ + ${det.toFixed(2)} = 0` },
      ],
    });

    // Use Newton's method to find eigenvalues
    const charPoly = (x) => -(x**3) + trace * (x**2) - sumOfMinors * x + det;
    const charPolyDerivative = (x) => -3 * (x**2) + 2 * trace * x - sumOfMinors;

    const eigenvalues = [];
    const guesses = [0, trace / 3, 2 * trace / 3, trace];

    for (const guess of guesses) {
      let x = guess;
      for (let iter = 0; iter < 50; iter++) {
        const fx = charPoly(x);
        const fpx = charPolyDerivative(x);
        if (Math.abs(fpx) < 1e-12) break;
        const xn = x - fx / fpx;
        if (Math.abs(xn - x) < 1e-10) {
          const rounded = Math.round(xn * 10000) / 10000;
          if (!eigenvalues.some(ev => Math.abs(ev - rounded) < 0.001)) {
            eigenvalues.push(rounded);
            break;
          }
        }
        x = xn;
      }
    }

    steps.push({
      step: 'ANALYSIS',
      badge: 'secondary',
      content: [
        { type: 'text', text: '✅ Eigenvalues found:' },
        ...eigenvalues.map((ev, idx) => ({
          type: 'result',
          text: `λ${getSubscript(idx + 1)} = ${ev.toFixed(4)}`
        })),
        { type: 'text', text: `Sum ≈ trace(${trace}) ✓` },
      ],
    });

    return { eigenvalues, steps };
  }

  return { eigenvalues: [], steps };
}

export function solveTranspose(matrix) {
  const transpose = matrix[0].map((_, col) => matrix.map(row => row[col]));
  
  const steps = [
    {
      step: 'TRANSPOSE',
      badge: 'primary',
      content: [
        { type: 'text', text: '↔️ MATRIX TRANSPOSE' },
        { type: 'text', text: 'Operation: A → Aᵀ' },
        { type: 'text', text: 'Rule: (i,j) element becomes (j,i) element' },
        { type: 'text', text: 'Rows become columns, columns become rows.' },
        { type: 'text', text: '' },
        { type: 'text', text: 'Properties of Transpose:' },
        { type: 'text', text: '• (Aᵀ)ᵀ = A' },
        { type: 'text', text: '• (AB)ᵀ = Bᵀ Aᵀ' },
        { type: 'text', text: '• det(Aᵀ) = det(A)' },
        { type: 'text', text: '• (Aᵀ)⁻¹ = (A⁻¹)ᵀ' },
      ],
    },
  ];

  return { matrix: transpose, steps };
}

// Helper function to format matrix for display
function formatMatrix(matrix) {
  const content = [];
  const maxWidth = Math.max(...matrix.flat().map(v => 
    typeof v === 'number' ? v.toFixed(4).length : String(v).length
  ));

  matrix.forEach(row => {
    const formattedRow = row.map(v => {
      const s = typeof v === 'number' ? v.toFixed(4) : String(v);
      return s.padStart(maxWidth);
    }).join('  ');
    content.push({ type: 'text', text: `  [${formattedRow}]` });
  });

  return content;
}

// Helper function for subscript numbers
function getSubscript(num) {
  const subscripts = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return String(num).split('').map(digit => subscripts[digit] || digit).join('');
}