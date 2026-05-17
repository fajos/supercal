// complexSolver.js - Pedagogical complex number tutor

export function solveComplexOperation(op, z1, z2) {
  // z1 = { real, imag }, z2 = { real, imag }
  const steps = [];
  let result;
  
  // 1. GIVEN VALUES
  const givenText = op === 'conjugate' || op === 'magnitude'
    ? `We are analyzing the complex number z = ${z1.real} + ${z1.imag}i.`
    : `We are performing the "${op}" operation on z₁ = ${z1.real} + ${z1.imag}i and z₂ = ${z2.real} + ${z2.imag}i.`;

  steps.push({
    step: 'GIVEN VALUES',
    badge: 'input',
    content: [
      { type: 'text', text: givenText },
      { type: 'text', text: 'In the complex plane, the real part corresponds to the x-axis and the imaginary part to the y-axis.' },
    ],
  });

  // 2. EQUATIONS
  let equationText = '';
  let formula = '';
  switch(op) {
    case 'add':
      equationText = 'To add complex numbers, we combine the real parts and imaginary parts independently.';
      formula = '(a + bi) + (c + di) = (a + c) + (b + d)i';
      break;
    case 'multiply':
      equationText = 'We use the FOIL method, remembering that i² = -1.';
      formula = '(a + bi)(c + di) = (ac - bd) + (ad + bc)i';
      break;
    case 'conjugate':
      equationText = 'The conjugate of a complex number is obtained by changing the sign of its imaginary part.';
      formula = 'z̄ = a - bi';
      break;
    case 'magnitude':
      equationText = 'The magnitude (or modulus) represents the distance of the number from the origin in the complex plane.';
      formula = '|z| = √(a² + b²)';
      break;
  }

  steps.push({
    step: 'EQUATIONS',
    badge: 'formula',
    content: [
      { type: 'text', text: equationText },
      { type: 'highlight', text: formula },
    ],
  });

  // 3. CALCULATION
  const calculationContent = [];
  switch(op) {
    case 'add':
      result = { real: z1.real + z2.real, imag: z1.imag + z2.imag };
      calculationContent.push(
        { type: 'text', text: `Real part: ${z1.real} + ${z2.real} = ${result.real}` },
        { type: 'text', text: `Imaginary part: ${z1.imag} + ${z2.imag} = ${result.imag}` },
        { type: 'highlight', text: `Result: ${result.real} + ${result.imag}i` }
      );
      break;
      
    case 'multiply':
      const ac = z1.real * z2.real;
      const bd = z1.imag * z2.imag;
      const ad = z1.real * z2.imag;
      const bc = z1.imag * z2.real;
      result = { real: ac - bd, imag: ad + bc };
      calculationContent.push(
        { type: 'text', text: `ac = ${z1.real} × ${z2.real} = ${ac}` },
        { type: 'text', text: `bd = ${z1.imag} × ${z2.imag} = ${bd}` },
        { type: 'text', text: `ad = ${z1.real} × ${z2.imag} = ${ad}` },
        { type: 'text', text: `bc = ${z1.imag} × ${z2.real} = ${bc}` },
        { type: 'text', text: `Final Real: ${ac} - ${bd} = ${result.real}` },
        { type: 'text', text: `Final Imag: ${ad} + ${bc} = ${result.imag}` },
        { type: 'highlight', text: `Result: ${result.real} + ${result.imag}i` }
      );
      break;
      
    case 'conjugate':
      result = { real: z1.real, imag: -z1.imag };
      calculationContent.push(
        { type: 'text', text: `Change ${z1.imag}i to ${-z1.imag}i` },
        { type: 'highlight', text: `z̄ = ${result.real} ${result.imag >= 0 ? '+' : ''}${result.imag}i` }
      );
      break;
      
    case 'magnitude':
      const magSq = z1.real * z1.real + z1.imag * z1.imag;
      const magnitude = Math.sqrt(magSq);
      result = magnitude;
      calculationContent.push(
        { type: 'text', text: `|z| = √(${z1.real}² + ${z1.imag}²)` },
        { type: 'text', text: `|z| = √(${z1.real * z1.real} + ${z1.imag * z1.imag})` },
        { type: 'text', text: `|z| = √(${magSq})` },
        { type: 'highlight', text: `|z| ≈ ${magnitude.toFixed(4)}` }
      );
      break;
  }
  
  steps.push({
    step: 'CALCULATION',
    badge: 'math',
    content: calculationContent,
  });

  // 4. INTERPRETATION / ANALYSIS
  const insightContent = [];
  if (op === 'magnitude') {
    insightContent.push({ type: 'text', text: `The point (${z1.real}, ${z1.imag}) is exactly ${typeof result === 'number' ? result.toFixed(2) : result} units away from the origin (0,0).` });
  } else if (op === 'conjugate') {
    insightContent.push({ type: 'text', text: 'The conjugate is a reflection of the original point across the real (horizontal) axis.' });
  } else {
    insightContent.push({ type: 'text', text: 'Complex operations behave much like vector operations in 2D space, with multiplication also involving a rotation and scaling.' });
  }

  // Add Polar Form as an extra insight
  if (z1.real !== 0 || z1.imag !== 0) {
    const r = Math.sqrt(z1.real * z1.real + z1.imag * z1.imag);
    const theta = Math.atan2(z1.imag, z1.real);
    insightContent.push(
      { type: 'text', text: '' },
      { type: 'text', text: '🔄 POLAR FORM REPRESENTATION' },
      { type: 'text', text: `In polar coordinates (r, θ), z₁ is represented as:` },
      { type: 'text', text: `r = ${r.toFixed(4)}` },
      { type: 'text', text: `θ = ${theta.toFixed(4)} rad (${(theta * 180 / Math.PI).toFixed(2)}°)` },
      { type: 'highlight', text: `z = ${r.toFixed(2)} [cos(${(theta * 180 / Math.PI).toFixed(1)}°) + i sin(${(theta * 180 / Math.PI).toFixed(1)}°)]` }
    );
  }

  steps.push({
    step: 'INTERPRETATION / ANALYSIS',
    badge: 'insight',
    content: insightContent,
  });

  return { result, steps };
}
