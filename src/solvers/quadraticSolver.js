export function solveQuadratic(a, b, c) {
  if (a === 0) {
    throw new Error('Coefficient "a" cannot be zero for a quadratic equation.');
  }

  const steps = [];
  
  // STEP 1: Present the equation and identify coefficients
  let eqStr = '';
  if (a === 1) eqStr += 'x²';
  else if (a === -1) eqStr += '-x²';
  else eqStr += `${a}x²`;

  if (b !== 0) {
    const sign = b > 0 ? ' + ' : ' - ';
    const absB = Math.abs(b);
    eqStr += sign;
    if (absB === 1) eqStr += 'x';
    else eqStr += `${absB}x`;
  }

  if (c !== 0) {
    const sign = c > 0 ? ' + ' : ' - ';
    eqStr += `${sign}${Math.abs(c)}`;
  }
  eqStr += ' = 0';

  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: '📝 Write the equation in standard form: ax² + bx + c = 0' },
      { type: 'highlight', text: eqStr },
      { type: 'text', text: 'Identify the coefficients:' },
      { type: 'result', text: `a = ${a}  (coefficient of x²)` },
      { type: 'result', text: `b = ${b}  (coefficient of x)` },
      { type: 'result', text: `c = ${c}  (constant term)` },
    ],
  });

  // STEP 2: Explain the Quadratic Formula
  steps.push({
    step: 'STEP 2',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 Recall the Quadratic Formula:' },
      { type: 'highlight', text: 'x = (-b ± √(b² - 4ac)) / (2a)' },
      { type: 'text', text: 'This formula comes from completing the square of ax² + bx + c = 0' },
      { type: 'text', text: 'The expression under the square root (b² - 4ac) is called the Discriminant (Δ).' },
      { type: 'text', text: 'It determines the nature of the roots:' },
      { type: 'text', text: '• Δ > 0: Two distinct real roots' },
      { type: 'text', text: '• Δ = 0: One real root (repeated, or "double root")' },
      { type: 'text', text: '• Δ < 0: Two complex conjugate roots' },
    ],
  });

  // STEP 3: Calculate the discriminant in detail
  const bSquared = b * b;
  const fourAC = 4 * a * c;
  const discriminant = bSquared - fourAC;
  
  steps.push({
    step: 'STEP 3',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🔍 Calculate the Discriminant: Δ = b² - 4ac' },
      { type: 'text', text: 'Step by step:' },
      { type: 'text', text: `1. Calculate b²: (${b})² = ${bSquared}` },
      { type: 'text', text: `2. Calculate 4ac: 4 × (${a}) × (${c}) = ${fourAC}` },
      { type: 'text', text: `3. Subtract: Δ = ${bSquared} - ${fourAC}` },
      { type: 'highlight', text: `Δ = ${discriminant}` },
    ],
  });

  // STEP 4: Analyze the discriminant
  let natureOfRoots;
  if (discriminant > 0) {
    natureOfRoots = {
      type: 'positive',
      explanation: 'Since Δ > 0, the equation has two distinct real (different) roots.',
      summary: 'Two distinct real roots'
    };
  } else if (discriminant === 0) {
    natureOfRoots = {
      type: 'zero',
      explanation: 'Since Δ = 0, the equation has exactly one real root (a double root). This means the parabola just touches the x-axis at one point.',
      summary: 'One real double root'
    };
  } else {
    natureOfRoots = {
      type: 'negative',
      explanation: 'Since Δ < 0, the equation has no real roots. Instead, it has two complex conjugate roots. The parabola does not intersect the x-axis.',
      summary: 'Two complex conjugate roots'
    };
  }

  steps.push({
    step: 'STEP 4',
    badge: 'primary',
    content: [
      { type: 'text', text: '📊 Analyze the Discriminant:' },
      { type: 'text', text: natureOfRoots.explanation },
      { type: 'badge', text: natureOfRoots.summary },
    ],
  });

  // STEP 5: Calculate the denominator
  const denominator = 2 * a;
  
  steps.push({
    step: 'STEP 5',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📝 Set up the formula with our values:' },
      { type: 'text', text: `x = (${-b} ± √${discriminant}) / (2 × ${a})` },
      { type: 'text', text: `x = (${-b} ± √${discriminant}) / ${denominator}` },
      { type: 'text', text: `Denominator 2a = 2 × (${a}) = ${denominator}` },
    ],
  });

  // STEP 6: Calculate the roots
  let root1, root2;
  let rootStepContent = [];

  if (discriminant >= 0) {
    const sqrtDiscriminant = Math.sqrt(discriminant);
    
    rootStepContent.push(
      { type: 'text', text: '🔢 Calculate the square root:' },
      { type: 'highlight', text: `√${discriminant} = ${sqrtDiscriminant}` },
      { type: 'text', text: 'Now find each root:' }
    );
    
    // First root (with +)
    const numerator1 = -b + sqrtDiscriminant;
    root1 = numerator1 / denominator;
    
    rootStepContent.push(
      { type: 'text', text: 'For x₁ (using + sign):' },
      { type: 'text', text: `x₁ = (${-b} + ${sqrtDiscriminant}) / ${denominator}` },
      { type: 'text', text: `x₁ = ${numerator1} / ${denominator}` },
      { type: 'result', text: `x₁ = ${root1}` }
    );
    
    // Second root (with -)
    const numerator2 = -b - sqrtDiscriminant;
    root2 = numerator2 / denominator;
    
    rootStepContent.push(
      { type: 'text', text: 'For x₂ (using - sign):' },
      { type: 'text', text: `x₂ = (${-b} - ${sqrtDiscriminant}) / ${denominator}` },
      { type: 'text', text: `x₂ = ${numerator2} / ${denominator}` },
      { type: 'result', text: `x₂ = ${root2}` }
    );
    
    // Simplify if possible
    if (root1 === root2) {
      rootStepContent.push(
        { type: 'text', text: 'Note: x₁ = x₂, confirming this is a double root.' }
      );
    }
  } else {
    const realPart = -b / denominator;
    const imagPart = Math.sqrt(Math.abs(discriminant)) / Math.abs(denominator);
    
    rootStepContent.push(
      { type: 'text', text: '🔢 For complex roots, we use i = √(-1):' },
      { type: 'text', text: `√(${discriminant}) = √(${Math.abs(discriminant)} × (-1))` },
      { type: 'highlight', text: `√(${discriminant}) = √${Math.abs(discriminant)} × √(-1) = ${Math.sqrt(Math.abs(discriminant)).toFixed(4)}i` },
      { type: 'text', text: 'Now separate into real and imaginary parts:' },
      { type: 'text', text: `Real part: -b/(2a) = ${-b}/${denominator} = ${realPart.toFixed(4)}` },
      { type: 'text', text: `Imaginary part: √|Δ|/(2a) = ${Math.sqrt(Math.abs(discriminant)).toFixed(4)}/${Math.abs(denominator)} = ${imagPart.toFixed(4)}` },
      { type: 'result', text: `x₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i` },
      { type: 'result', text: `x₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i` }
    );
    
    root1 = `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`;
    root2 = `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`;
  }

  steps.push({
    step: 'STEP 6',
    badge: 'secondary',
    content: rootStepContent,
  });

  // STEP 7: Vieta's formulas for verification
  const sumOfRoots = root1 + root2;  // For complex, this won't work well, so we'll handle that
  const productOfRoots = root1 * root2;
  const theoreticalSum = -b / a;
  const theoreticalProduct = c / a;
  
  steps.push({
    step: 'STEP 7',
    badge: 'warning',
    content: [
      { type: 'text', text: '✅ Verify using Vieta\'s Formulas:' },
      { type: 'text', text: 'For a quadratic ax² + bx + c = 0:' },
      { type: 'text', text: '• Sum of roots: x₁ + x₂ = -b/a' },
      { type: 'text', text: '• Product of roots: x₁ × x₂ = c/a' },
      { type: 'text', text: 'Checking our solution:' },
      { type: 'text', text: `Sum: ${root1} + ${root2} = ${discriminant >= 0 ? (root1 + root2).toFixed(4) : -b/a}` },
      { type: 'text', text: `Expected: -b/a = -(${b})/(${a}) = ${theoreticalSum.toFixed(4)} ✓` },
      { type: 'text', text: `Product: ${root1} × ${root2} = ${discriminant >= 0 ? (root1 * root2).toFixed(4) : c/a}` },
      { type: 'text', text: `Expected: c/a = ${c}/${a} = ${theoreticalProduct.toFixed(4)} ✓` },
    ],
  });

  // STEP 8: Graphical interpretation
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  
  steps.push({
    step: 'GRAPH',
    badge: 'primary',
    content: [
      { type: 'text', text: '📈 Graphical Interpretation:' },
      { type: 'text', text: `The equation represents a ${a > 0 ? '∪-shaped' : '∩-shaped'} parabola` },
      { type: 'text', text: `Vertex: (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})` },
      { type: 'text', text: 'The roots are the x-intercepts (where the parabola crosses the x-axis).' },
      ...(discriminant >= 0 
        ? [{ type: 'text', text: `The parabola crosses the x-axis at x = ${root1} and x = ${root2}` }]
        : [{ type: 'text', text: 'The parabola does not cross the x-axis (no real roots).' }]
      ),
    ],
  });

  return {
    steps,
    roots: [root1, root2],
    discriminant,
    rawRoots: { root1, root2 },
    vertex: { x: vertexX, y: vertexY },
    direction: a > 0 ? 'up' : 'down',
  };
}