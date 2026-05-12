export function solveQuadratic(a, b, c) {
  if (a === 0) {
    throw new Error('Coefficient "a" cannot be zero for a quadratic equation.');
  }

  const steps = [];
  
  // Step 1: Identify coefficients
  let eqStr = '';
  if (a === 1) eqStr += 'x²';
  else if (a === -1) eqStr += '-x²';
  else eqStr += `${a}x²`;

  if (b !== 0) {
    const sign = b > 0 ? '+' : '-';
    const absB = Math.abs(b);
    eqStr += ` ${sign} `;
    if (absB === 1) eqStr += 'x';
    else eqStr += `${absB}x`;
  }

  if (c !== 0) {
    const sign = c > 0 ? '+' : '-';
    eqStr += ` ${sign} ${Math.abs(c)}`;
  }
  eqStr += ' = 0';

  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: `Equation: ${eqStr}` },
      { type: 'highlight', text: `a = ${a}` },
      { type: 'highlight', text: `b = ${b}` },
      { type: 'highlight', text: `c = ${c}` },
    ],
  });

  // Step 2: Discriminant
  const discriminant = b * b - 4 * a * c;
  let discLabel, discBadge;
  if (discriminant > 0) {
    discLabel = 'Two distinct real roots';
    discBadge = 'primary';
  } else if (discriminant === 0) {
    discLabel = 'One real double root';
    discBadge = 'warning';
  } else {
    discLabel = 'Two complex conjugate roots';
    discBadge = 'secondary';
  }

  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Calculate discriminant Δ = b² − 4ac:' },
      { type: 'text', text: `Δ = (${b})² − 4(${a})(${c})` },
      { type: 'text', text: `Δ = ${b * b} − ${4 * a * c}` },
      { type: 'highlight', text: `Δ = ${discriminant}` },
      { type: 'badge', text: discLabel, badgeType: discBadge },
    ],
  });

  // Step 3: Quadratic Formula
  const denom = 2 * a;
  steps.push({
    step: 'STEP 3',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Apply quadratic formula: x = (−b ± √Δ) / (2a)' },
      { type: 'text', text: `x = (−(${b}) ± √${discriminant}) / (2 × ${a})` },
      { type: 'text', text: `x = (${-b} ± √${discriminant}) / ${denom}` },
    ],
  });

  // Step 4: Compute roots
  let root1, root2;
  const sqrtAbsDisc = Math.sqrt(Math.abs(discriminant));

  if (discriminant >= 0) {
    root1 = (-b + Math.sqrt(discriminant)) / denom;
    root2 = (-b - Math.sqrt(discriminant)) / denom;
    steps.push({
      step: 'STEP 4',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Compute real roots:' },
        { type: 'text', text: `√${discriminant} = ${sqrtAbsDisc.toFixed(4)}` },
        { type: 'text', text: `x₁ = (${-b} + ${sqrtAbsDisc.toFixed(4)}) / ${denom}` },
        { type: 'text', text: `x₁ = ${(-b + sqrtAbsDisc).toFixed(4)} / ${denom}` },
        { type: 'result', text: `x₁ = ${root1.toFixed(4)}` },
        { type: 'text', text: `x₂ = (${-b} − ${sqrtAbsDisc.toFixed(4)}) / ${denom}` },
        { type: 'text', text: `x₂ = ${(-b - sqrtAbsDisc).toFixed(4)} / ${denom}` },
        { type: 'result', text: `x₂ = ${root2.toFixed(4)}` },
      ],
    });
  } else {
    const realPart = -b / denom;
    const imagPart = sqrtAbsDisc / denom;
    root1 = `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`;
    root2 = `${realPart.toFixed(4)} − ${imagPart.toFixed(4)}i`;
    steps.push({
      step: 'STEP 4',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Compute complex roots:' },
        { type: 'text', text: `√|${discriminant}| = ${sqrtAbsDisc.toFixed(4)}` },
        { type: 'text', text: `√${discriminant} = ${sqrtAbsDisc.toFixed(4)}i` },
        { type: 'text', text: `Real part = −b/(2a) = ${realPart.toFixed(4)}` },
        { type: 'text', text: `Imag part = √|Δ|/(2a) = ${imagPart.toFixed(4)}` },
        { type: 'result', text: `x₁ = ${root1}` },
        { type: 'result', text: `x₂ = ${root2}` },
      ],
    });
  }

  // Verification
  steps.push({
    step: 'VERIFICATION',
    badge: 'warning',
    content: [
      { type: 'text', text: `✅ Sum of roots = −b/a = ${(-b / a).toFixed(4)}` },
      { type: 'text', text: `✅ Product of roots = c/a = ${(c / a).toFixed(4)}` },
    ],
  });

  return {
    steps,
    roots: [root1, root2],
    discriminant,
    rawRoots: { root1, root2 },
  };
}