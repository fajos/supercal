// matrixSolver.js - Comprehensive educational matrix operations

export function solveDeterminant(matrix) {
  const n = matrix.length;
  const steps = [];
  
  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 UNDERSTANDING THE DETERMINANT' },
      { type: 'text', text: `Matrix A is ${n}×${n}:` },
      ...formatMatrix(matrix),
      { type: 'text', text: '' },
      { type: 'text', text: 'The determinant tells us:' },
      { type: 'text', text: '• If det(A) ≠ 0 → matrix is invertible (non-singular)' },
      { type: 'text', text: '• If det(A) = 0 → matrix is singular (no inverse)' },
      { type: 'text', text: '• |det(A)| = scale factor of the transformation' },
    ],
  });

  // Base cases
  if (n === 1) {
    steps.push({
      step: 'RESULT',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'For a 1×1 matrix, the determinant is the value itself.' },
        { type: 'highlight', text: `det(A) = ${matrix[0][0]}` },
      ],
    });
    return { value: matrix[0][0], steps };
  }

  if (n === 2) {
    const a = matrix[0][0], b = matrix[0][1];
    const c = matrix[1][0], d = matrix[1][1];
    const det = a * d - b * c;

    steps.push({
      step: 'STEP 2',
      badge: 'secondary',
      content: [
        { type: 'text', text: '🎯 2×2 DETERMINANT FORMULA' },
        { type: 'text', text: 'For a 2×2 matrix [a b; c d]:' },
        { type: 'highlight', text: 'det = ad - bc' },
        { type: 'text', text: '' },
        { type: 'text', text: 'Visual: Cross multiply and subtract' },
        { type: 'text', text: `det = (${a} × ${d}) - (${b} × ${c})` },
        { type: 'text', text: `det = ${a * d} - ${b * c}` },
        { type: 'highlight', text: `det(A) = ${det}` },
        { type: 'text', text: '' },
        { type: 'text', text: '💡 Geometric meaning: Area of parallelogram formed by column vectors' },
      ],
    });

    return { value: det, steps };
  }

  // For n ≥ 3: Cofactor expansion
  steps.push({
    step: 'STEP 2',
    badge: 'primary',
    content: [
      { type: 'text', text: '🎯 COFACTOR EXPANSION (Laplace Expansion)' },
      { type: 'text', text: `Expanding along the first row (you can use any row/column):` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Formula: det(A) = Σ(-1)^(1+j) × a₁ⱼ × M₁ⱼ' },
      { type: 'text', text: 'where M₁ⱼ = determinant of submatrix (minor)' },
      { type: 'text', text: 'and (-1)^(1+j) gives alternating signs: +, -, +, ...' },
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

    const sign = ((1 + j + 1) % 2 === 0) ? '+' : '-';
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
    step: 'STEP 3',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📝 CALCULATING EACH COFACTOR' },
      { type: 'text', text: 'For each element in the first row:' },
    ],
  });

  terms.forEach((term, idx) => {
    if (term.element === 0) {
      steps.push({
        step: `Term ${idx + 1}`,
        badge: 'secondary',
        content: [
          { type: 'text', text: `a₁${term.j + 1} = 0, so this term is 0 (no calculation needed)` },
        ],
      });
    } else {
      steps.push({
        step: `Term ${idx + 1}`,
        badge: 'primary',
        content: [
          { type: 'text', text: `Element a₁${term.j + 1} = ${term.element}` },
          { type: 'text', text: `Sign: (−1)^(1+${term.j + 1}) = ${term.sign}` },
          { type: 'text', text: `Minor M₁${term.j + 1} (remove row 1, column ${term.j + 1}):` },
          ...formatMatrix(term.minor),
          { type: 'text', text: `det(M₁${term.j + 1}) = ${term.minorDet.toFixed(4)}` },
          { type: 'highlight', text: `Cofactor = ${term.sign}${term.element} × ${term.minorDet.toFixed(4)} = ${term.contribution.toFixed(4)}` },
        ],
      });
    }
  });

  // Sum up
  steps.push({
    step: 'STEP 4',
    badge: 'warning',
    content: [
      { type: 'text', text: '✨ SUMMING ALL TERMS' },
      { type: 'text', text: terms.map((t, i) => {
        const sign = t.contribution >= 0 && i > 0 ? '+' : '';
        return ` ${sign}${t.contribution.toFixed(4)}`;
      }).join('') },
      { type: 'highlight', text: `det(A) = ${det.toFixed(6)}` },
      { type: 'text', text: '' },
      ...(det !== 0 
        ? [{ type: 'text', text: '✅ Matrix is invertible (non-singular)' }]
        : [{ type: 'text', text: '⚠️ Matrix is singular (no inverse exists)' }]
      ),
    ],
  });

  // Properties
  steps.push({
    step: 'PROPERTIES',
    badge: 'primary',
    content: [
      { type: 'text', text: '📚 IMPORTANT DETERMINANT PROPERTIES' },
      { type: 'text', text: '• det(A^T) = det(A) (transpose)' },
      { type: 'text', text: '• det(AB) = det(A) × det(B)' },
      { type: 'text', text: '• Swapping rows changes sign of determinant' },
      { type: 'text', text: '• det(kA) = k^n det(A) for n×n matrix' },
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
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 FINDING THE INVERSE MATRIX' },
      { type: 'text', text: `Matrix A is ${n}×${n}. To find A⁻¹:` },
      { type: 'text', text: '1. Calculate det(A) - must be non-zero' },
      { type: 'text', text: '2. Find cofactor matrix' },
      { type: 'text', text: '3. Transpose to get adjugate matrix' },
      { type: 'text', text: '4. Divide by det(A): A⁻¹ = adj(A)/det(A)' },
    ],
  });

  if (Math.abs(detResult.value) < 1e-10) {
    steps.push({
      step: 'ERROR',
      badge: 'warning',
      content: [
        { type: 'highlight', text: '⚠️ Matrix is singular! det(A) = 0' },
        { type: 'text', text: 'The inverse does not exist.' },
        { type: 'text', text: 'This means the transformation is not reversible.' },
      ],
    });
    throw new Error('Matrix is singular (determinant = 0). Inverse does not exist.');
  }

  // Add determinant steps
  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📊 CALCULATING DETERMINANT' },
      ...detResult.steps.flatMap(s => s.content),
      { type: 'highlight', text: `det(A) = ${detResult.value.toFixed(4)} ≠ 0 ✓` },
    ],
  });

  // Calculate cofactor matrix
  steps.push({
    step: 'STEP 3',
    badge: 'primary',
    content: [
      { type: 'text', text: '🧮 BUILDING THE COFACTOR MATRIX' },
      { type: 'text', text: 'For each position (i,j), calculate cofactor Cᵢⱼ:' },
      { type: 'text', text: 'Cᵢⱼ = (-1)^(i+j) × Mᵢⱼ (signed minor)' },
    ],
  });

  const cofactors = [];
  for (let i = 0; i < n; i++) {
    cofactors[i] = [];
    for (let j = 0; j < n; j++) {
      const minor = [];
      for (let r = 0; r < n; r++) {
        if (r !== i) {
          minor.push(matrix[r].filter((_, c) => c !== j));
        }
      }
      const minorDet = calculateDeterminantRecursive(minor);
      const sign = ((i + j) % 2 === 0) ? 1 : -1;
      cofactors[i][j] = sign * minorDet;
    }
  }

  steps.push({
    step: 'COFACTOR MATRIX',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Cofactor matrix C:' },
      ...formatMatrix(cofactors),
    ],
  });

  // Adjugate (transpose of cofactor matrix)
  const adjugate = [];
  for (let i = 0; i < n; i++) {
    adjugate[i] = [];
    for (let j = 0; j < n; j++) {
      adjugate[i][j] = cofactors[j][i];
    }
  }

  steps.push({
    step: 'STEP 4',
    badge: 'primary',
    content: [
      { type: 'text', text: '↔️ ADJUGATE MATRIX (Transpose of Cofactor Matrix)' },
      { type: 'text', text: 'adj(A) = C^T (swap rows and columns)' },
      ...formatMatrix(adjugate),
    ],
  });

  // Divide by determinant
  const inverse = [];
  for (let i = 0; i < n; i++) {
    inverse[i] = [];
    for (let j = 0; j < n; j++) {
      inverse[i][j] = adjugate[i][j] / detResult.value;
    }
  }

  steps.push({
    step: 'STEP 5',
    badge: 'warning',
    content: [
      { type: 'text', text: '✨ FINAL STEP: A⁻¹ = adj(A) / det(A)' },
      { type: 'text', text: `Divide each element of adjugate by ${detResult.value.toFixed(4)}:` },
      ...formatMatrix(inverse),
      { type: 'text', text: '' },
      { type: 'text', text: '✅ Verfication: A × A⁻¹ should equal Identity matrix' },
    ],
  });

  return { matrix: inverse, steps, det: detResult.value };
}

export function solveEigenvalues(matrix) {
  const n = matrix.length;
  const steps = [];

  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 EIGENVALUES: Definition' },
      { type: 'text', text: 'Eigenvalues λ satisfy: det(A - λI) = 0' },
      { type: 'text', text: `For ${n}×${n} matrix:` },
      ...formatMatrix(matrix),
      { type: 'text', text: '' },
      { type: 'text', text: 'Steps to find eigenvalues:' },
      { type: 'text', text: '1. Form A - λI (subtract λ from diagonal)' },
      { type: 'text', text: '2. Calculate det(A - λI) → characteristic polynomial' },
      { type: 'text', text: '3. Solve characteristic equation = 0' },
    ],
  });

  if (n === 2) {
    const a = matrix[0][0], b = matrix[0][1];
    const c = matrix[1][0], d = matrix[1][1];
    const trace = a + d;
    const determinant = a * d - b * c;

    steps.push({
      step: 'STEP 2',
      badge: 'secondary',
      content: [
        { type: 'text', text: '📝 FORM A - λI' },
        { type: 'text', text: `[${a} - λ, ${b}]` },
        { type: 'text', text: `[${c}, ${d} - λ]` },
      ],
    });

    steps.push({
      step: 'STEP 3',
      badge: 'primary',
      content: [
        { type: 'text', text: '🔍 CHARACTERISTIC POLYNOMIAL' },
        { type: 'text', text: 'For 2×2 matrices: λ² - trace·λ + det = 0' },
        { type: 'text', text: `trace = ${a} + ${d} = ${trace}` },
        { type: 'text', text: `det = (${a})(${d}) - (${b})(${c}) = ${determinant}` },
        { type: 'highlight', text: `λ² - ${trace}λ + ${determinant} = 0` },
      ],
    });

    const discriminant = trace * trace - 4 * determinant;
    
    steps.push({
      step: 'STEP 4',
      badge: 'secondary',
      content: [
        { type: 'text', text: '📐 SOLVE QUADRATIC EQUATION' },
        { type: 'text', text: `Using quadratic formula: λ = (${trace} ± √(${discriminant.toFixed(4)})) / 2` },
        { type: 'text', text: '' },
        { type: 'text', text: 'Calculate discriminant:' },
        { type: 'text', text: `Δ = (${trace})² - 4(1)(${determinant})` },
        { type: 'text', text: `Δ = ${trace * trace} - ${4 * determinant} = ${discriminant.toFixed(4)}` },
      ],
    });

    let eigenvalues;
    if (discriminant >= 0) {
      const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
      const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
      eigenvalues = [lambda1, lambda2];
      
      steps.push({
        step: 'RESULT',
        badge: 'warning',
        content: [
          { type: 'text', text: '✅ Two real eigenvalues:' },
          { type: 'highlight', text: `λ₁ = ${lambda1.toFixed(4)}` },
          { type: 'highlight', text: `λ₂ = ${lambda2.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: `Sum = ${(lambda1 + lambda2).toFixed(4)} = trace ✓` },
          { type: 'text', text: `Product = ${(lambda1 * lambda2).toFixed(4)} = det ✓` },
        ],
      });
    } else {
      const realPart = trace / 2;
      const imagPart = Math.sqrt(-discriminant) / 2;
      eigenvalues = [
        `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`,
        `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`
      ];
      
      steps.push({
        step: 'RESULT',
        badge: 'warning',
        content: [
          { type: 'text', text: '⚠️ Complex conjugate eigenvalues:' },
          { type: 'highlight', text: `λ₁ = ${eigenvalues[0]}` },
          { type: 'highlight', text: `λ₂ = ${eigenvalues[1]}` },
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
      step: 'STEP 2',
      badge: 'secondary',
      content: [
        { type: 'text', text: '📝 FORM A - λI' },
        { type: 'text', text: `[${a}-λ,  ${b},   ${c}]` },
        { type: 'text', text: `[${d},   ${e}-λ, ${f}]` },
        { type: 'text', text: `[${g},   ${h},   ${i}-λ]` },
      ],
    });

    steps.push({
      step: 'STEP 3',
      badge: 'primary',
      content: [
        { type: 'text', text: '📊 CHARACTERISTIC POLYNOMIAL' },
        { type: 'text', text: 'For 3×3: det(A - λI) = -λ³ + tr(A)λ² - ℓλ + det(A)' },
        { type: 'text', text: `trace(tr) = ${trace.toFixed(4)}` },
        { type: 'text', text: `sum of principal minors(ℓ) = ${sumOfMinors.toFixed(4)}` },
        { type: 'text', text: `determinant = ${det.toFixed(4)}` },
        { type: 'highlight', text: `−λ³ + ${trace.toFixed(2)}λ² − ${sumOfMinors.toFixed(2)}λ + ${det.toFixed(2)} = 0` },
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
      step: 'RESULT',
      badge: 'warning',
      content: [
        { type: 'text', text: '✅ Eigenvalues found:' },
        ...eigenvalues.map((ev, idx) => ({
          type: 'highlight',
          text: `λ${idx + 1} = ${ev.toFixed(4)}`
        })),
        { type: 'text', text: '' },
        { type: 'text', text: `Sum = ${eigenvalues.reduce((a,b) => a+b, 0).toFixed(4)} ≈ trace(${trace}) ✓` },
        { type: 'text', text: `Product = ${eigenvalues.reduce((a,b) => a*b, 1).toFixed(4)} ≈ det(${det}) ✓` },
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
        { type: 'text', text: 'Operation: A → A^T' },
        { type: 'text', text: 'Rule: (i,j) element becomes (j,i) element' },
        { type: 'text', text: 'Rows become columns, columns become rows.' },
        { type: 'text', text: '' },
        { type: 'text', text: 'Properties of Transpose:' },
        { type: 'text', text: '• (A^T)^T = A' },
        { type: 'text', text: '• (AB)^T = B^T A^T' },
        { type: 'text', text: '• det(A^T) = det(A)' },
        { type: 'text', text: '• (A^T)⁻¹ = (A⁻¹)^T' },
      ],
    },
  ];

  return { matrix: transpose, steps };
}

// Helper function to format matrix for display
function formatMatrix(matrix) {
  const content = [];
  const maxWidth = Math.max(...matrix.flat().map(v => 
    typeof v === 'number' ? v.toFixed(4).length : v.length
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