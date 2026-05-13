export function solveLinearSystem(a1, b1, c1, a2, b2, c2) {
  const det = a1 * b2 - a2 * b1;
  const steps = [];

  // STEP 1: Present the system
  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: '📝 Write the system in standard form:' },
      { type: 'text', text: 'Equation ①: a₁x + b₁y = c₁' },
      { type: 'text', text: 'Equation ②: a₂x + b₂y = c₂' },
      { type: 'highlight', text: `①: ${a1}x ${b1 >= 0 ? '+' : '-'} ${Math.abs(b1)}y = ${c1}` },
      { type: 'highlight', text: `②: ${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}y = ${c2}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'We can solve this system using several methods:' },
      { type: 'text', text: '• Method 1: Elimination (add/subtract equations)' },
      { type: 'text', text: '• Method 2: Substitution (solve for one variable)' },
      { type: 'text', text: '• Method 3: Cramer\'s Rule (using determinants)' },
    ],
  });

  // STEP 2: Calculate determinant and analyze system
  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🔍 Calculate the Determinant (D) of the coefficient matrix:' },
      { type: 'text', text: 'D = a₁b₂ - a₂b₁' },
      { type: 'text', text: `D = (${a1})(${b2}) - (${a2})(${b1})` },
      { type: 'text', text: `D = ${a1 * b2} - ${a2 * b1}` },
      { type: 'highlight', text: `D = ${det.toFixed(4)}` },
    ],
  });

  // Handle special cases
  if (Math.abs(det) < 1e-10) {
    // Check if the system has infinite solutions or no solution
    // For infinite solutions: a1/a2 = b1/b2 = c1/c2
    const ratioCheck = Math.abs(a1 * c2 - a2 * c1) < 1e-10 && 
                       Math.abs(b1 * c2 - b2 * c1) < 1e-10;
    
    if (ratioCheck) {
      steps.push({
        step: 'STEP 3',
        badge: 'warning',
        content: [
          { type: 'text', text: '⚠️ System Analysis: D = 0' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Checking if the equations are proportional:' },
          { type: 'text', text: `Ratio of x coefficients: ${a1}/${a2} = ${(a1/a2).toFixed(4)}` },
          { type: 'text', text: `Ratio of y coefficients: ${b1}/${b2} = ${(b1/b2).toFixed(4)}` },
          { type: 'text', text: `Ratio of constants: ${c1}/${c2} = ${(c1/c2).toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'highlight', text: 'All ratios are equal! The equations represent the SAME line.' },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 Geometric Interpretation:' },
          { type: 'text', text: 'The two equations represent the same line on the coordinate plane.' },
          { type: 'text', text: 'Every point on this line is a solution.' },
        ],
      });

      // Show the solution in parametric form
      const slopeIfPossible = Math.abs(b1) > 1e-10 ? -a1 / b1 : null;
      
      steps.push({
        step: 'RESULT',
        badge: 'secondary',
        content: [
          { type: 'text', text: '✨ INFINITELY MANY SOLUTIONS' },
          { type: 'text', text: '' },
          { type: 'text', text: 'We can express the solution in parametric form...' },
          { type: 'text', text: `From equation ①: ${a1}x + ${b1}y = ${c1}` },
          ...(slopeIfPossible 
            ? [
                { type: 'text', text: `Solve for y: y = ${slopeIfPossible.toFixed(4)}x + ${(c1/b1).toFixed(4)}` },
                { type: 'text', text: 'Let x = t (any real number), then:' },
                { type: 'result', text: `x = t` },
                { type: 'result', text: `y = ${slopeIfPossible.toFixed(4)}t + ${(c1/b1).toFixed(4)}` },
                { type: 'text', text: `where t ∈ ℝ (t can be any real number)` },
              ]
            : [
                { type: 'text', text: `Since b₁ = 0, x = ${(c1/a1).toFixed(4)} is fixed` },
                { type: 'text', text: 'y can be any real number' },
                { type: 'result', text: `x = ${(c1/a1).toFixed(4)}` },
                { type: 'result', text: `y = t (any real number)` },
              ]
          ),
        ],
      });

      // Calculate determinant-based values for reference
      const x = a1 !== 0 ? c1 / a1 : 0;
      const y = b1 !== 0 ? c1 / b1 : 0;
      
      return { 
        steps, 
        x, 
        y, 
        det: 0,
        solutionType: 'infinite',
        parametricForm: slopeIfPossible ? 
          { x: 't', y: `${slopeIfPossible.toFixed(4)}t + ${(c1/b1).toFixed(4)}` } :
          { x: `${(c1/a1).toFixed(4)}`, y: 't' }
      };
    } else {
      // No solution
      steps.push({
        step: 'STEP 3',
        badge: 'warning',
        content: [
          { type: 'text', text: '⚠️ System Analysis: D = 0' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Checking if the equations are proportional:' },
          { type: 'text', text: `Ratio of x coefficients: ${a1}/${a2} = ${(a1/a2).toFixed(4)}` },
          { type: 'text', text: `Ratio of y coefficients: ${b1}/${b2} = ${(b1/b2).toFixed(4)}` },
          { type: 'text', text: `Ratio of constants: ${c1}/${c2} = ${(c1/c2).toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'highlight', text: 'Ratios of coefficients match, but constants differ!' },
          { type: 'text', text: 'The equations represent PARALLEL lines.' },
        ],
      });

      steps.push({
        step: 'STEP 4',
        badge: 'secondary',
        content: [
          { type: 'text', text: '📊 Geometric Interpretation:' },
          { type: 'text', text: 'Recall: y = mx + b form' },
          { type: 'text', text: `Equation ①: y = ${(-a1/b1).toFixed(4)}x + ${(c1/b1).toFixed(4)}` },
          { type: 'text', text: `Equation ②: y = ${(-a2/b2).toFixed(4)}x + ${(c2/b2).toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: `Slopes are equal: ${(-a1/b1).toFixed(4)}` },
          { type: 'text', text: `Y-intercepts differ: ${(c1/b1).toFixed(4)} ≠ ${(c2/b2).toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'highlight', text: 'These are parallel lines that never intersect!' },
        ],
      });

      steps.push({
        step: 'RESULT',
        badge: 'warning',
        content: [
          { type: 'text', text: '❌ NO SOLUTION' },
          { type: 'text', text: '' },
          { type: 'text', text: 'The system is INCONSISTENT.' },
          { type: 'text', text: 'There is no point (x,y) that satisfies both equations simultaneously.' },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 What would make it have a solution?' },
          { type: 'text', text: 'If c₂ were changed to match the ratio, the lines would overlap (infinite solutions).' },
        ],
      });

      return { 
        steps, 
        x: null, 
        y: null, 
        det: 0,
        solutionType: 'none'
      };
    }
  }

  // For unique solution: Use both elimination and Cramer's rule
  steps.push({
    step: 'STEP 3',
    badge: 'primary',
    content: [
      { type: 'text', text: `✅ D = ${det.toFixed(4)} ≠ 0` },
      { type: 'text', text: 'The system has a unique solution.' },
      { type: 'text', text: 'The lines intersect at exactly one point.' },
    ],
  });

  // Method 1: Elimination (more intuitive)
  steps.push({
    step: 'STEP 4',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📐 Method 1: ELIMINATION' },
      { type: 'text', text: 'Strategy: Eliminate one variable by making coefficients opposites.' },
      { type: 'text', text: '' },
      { type: 'text', text: 'Let\'s eliminate x:' },
      { type: 'text', text: `Multiply equation ① by ${a2}:` },
      { type: 'highlight', text: `${a2 * a1}x + ${a2 * b1}y = ${a2 * c1}` },
      { type: 'text', text: `Multiply equation ② by ${-a1}:` },
      { type: 'highlight', text: `${-a1 * a2}x + ${-a1 * b2}y = ${-a1 * c2}` },
    ],
  });

  const elimYTerm = a2 * b1 - a1 * b2; // This is actually -det
  const elimRHS = a2 * c1 - a1 * c2;
  
  steps.push({
    step: 'STEP 5',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Add the equations (x terms cancel):' },
      { type: 'text', text: `(${a2 * b1}y) + (${-a1 * b2}y) = ${a2 * c1} + (${-a1 * c2})` },
      { type: 'highlight', text: `${elimYTerm}y = ${elimRHS}` },
      { type: 'text', text: '' },
      { type: 'text', text: `Solve for y:` },
      { type: 'text', text: `y = ${elimRHS} / ${elimYTerm}` },
    ],
  });

  // Calculate x and y
  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;

  steps.push({
    step: 'STEP 6',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Calculate y:' },
      { type: 'result', text: `y = ${y.toFixed(6)}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Substitute y back to find x:' },
      { type: 'text', text: `Using equation ①: ${a1}x + ${b1}(${y.toFixed(4)}) = ${c1}` },
      { type: 'text', text: `${a1}x + ${(b1 * y).toFixed(4)} = ${c1}` },
      { type: 'text', text: `${a1}x = ${c1} - ${(b1 * y).toFixed(4)}` },
      { type: 'text', text: `${a1}x = ${(c1 - b1 * y).toFixed(4)}` },
      { type: 'text', text: `x = ${(c1 - b1 * y).toFixed(4)} / ${a1}` },
      { type: 'result', text: `x = ${x.toFixed(6)}` },
    ],
  });

  // Method 2: Cramer's Rule (more elegant)
  const detX = c1 * b2 - c2 * b1;
  const detY = a1 * c2 - a2 * c1;

  steps.push({
    step: 'STEP 7',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🔢 Method 2: CRAMER\'S RULE (Verification)' },
      { type: 'text', text: 'Cramer\'s Rule provides a direct formula using determinants.' },
      { type: 'text', text: '' },
      { type: 'text', text: 'Replace x-column with constants to find Dx:' },
      { type: 'text', text: 'Dx = c₁b₂ - c₂b₁' },
      { type: 'text', text: `Dx = (${c1})(${b2}) - (${c2})(${b1})` },
      { type: 'text', text: `Dx = ${detX.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Replace y-column with constants to find Dy:' },
      { type: 'text', text: 'Dy = a₁c₂ - a₂c₁' },
      { type: 'text', text: `Dy = (${a1})(${c2}) - (${a2})(${c1})` },
      { type: 'text', text: `Dy = ${detY.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Apply Cramer\'s Rule:' },
      { type: 'highlight', text: `x = Dx/D = ${detX.toFixed(4)}/${det.toFixed(4)} = ${x.toFixed(6)} ✓` },
      { type: 'highlight', text: `y = Dy/D = ${detY.toFixed(4)}/${det.toFixed(4)} = ${y.toFixed(6)} ✓` },
    ],
  });

  // Verification
  steps.push({
    step: 'VERIFICATION',
    badge: 'warning',
    content: [
      { type: 'text', text: '✅ Verify by substituting into original equations:' },
      { type: 'text', text: '' },
      { type: 'text', text: 'Equation ①:' },
      { type: 'text', text: `${a1}(${x.toFixed(6)}) + ${b1}(${y.toFixed(6)})` },
      { type: 'text', text: `= ${(a1 * x).toFixed(6)} + ${(b1 * y).toFixed(6)}` },
      { type: 'highlight', text: `= ${(a1 * x + b1 * y).toFixed(6)} ≈ ${c1} ✓` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Equation ②:' },
      { type: 'text', text: `${a2}(${x.toFixed(6)}) + ${b2}(${y.toFixed(6)})` },
      { type: 'text', text: `= ${(a2 * x).toFixed(6)} + ${(b2 * y).toFixed(6)}` },
      { type: 'highlight', text: `= ${(a2 * x + b2 * y).toFixed(6)} ≈ ${c2} ✓` },
    ],
  });

  // Geometric interpretation
  steps.push({
    step: 'GEOMETRY',
    badge: 'primary',
    content: [
      { type: 'text', text: '📊 Geometric Interpretation:' },
      { type: 'text', text: 'Each equation represents a line in the xy-plane.' },
      { type: 'text', text: `Line ①: y = ${(-a1/b1).toFixed(4)}x + ${(c1/b1).toFixed(4)}` },
      { type: 'text', text: `Line ②: y = ${(-a2/b2).toFixed(4)}x + ${(c2/b2).toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: `The lines have different slopes (${(-a1/b1).toFixed(4)} ≠ ${(-a2/b2).toFixed(4)}),` },
      { type: 'text', text: 'so they intersect at exactly one point.' },
      { type: 'highlight', text: `Intersection point: (${x.toFixed(4)}, ${y.toFixed(4)})` },
    ],
  });

  return { 
    steps, 
    x, 
    y, 
    det,
    solutionType: 'unique',
    intersectionPoint: { x, y },
    line1: { slope: -a1/b1, intercept: c1/b1 },
    line2: { slope: -a2/b2, intercept: c2/b2 }
  };
}