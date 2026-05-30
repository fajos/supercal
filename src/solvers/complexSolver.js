// complexSolver.js - Pedagogical complex number tutor

export function solveComplexOperation(op, z1, z2) {
  // z1 = { real, imag }, z2 = { real, imag }
  const steps = [];
  let result;
  
  // Format complex number for display
  const formatComplex = (z) => {
    if (typeof z === 'number') return z.toString();
    if (z.imag === 0) return `${z.real}`;
    if (z.real === 0) return `${z.imag}i`;
    const sign = z.imag >= 0 ? '+' : '−';
    return `${z.real} ${sign} ${Math.abs(z.imag)}i`;
  };

  // 1. GIVEN
  let givenText = '';
  if (op === 'conjugate' || op === 'magnitude' || op === 'argument') {
    givenText = `Complex number z = ${formatComplex(z1)}`;
  } else if (op === 'power') {
    const powerN = Math.round(z2.real);
    givenText = `Complex number z = ${formatComplex(z1)}, power n = ${powerN}`;
  } else {
    givenText = `Operations on z₁ = ${formatComplex(z1)} and z₂ = ${formatComplex(z2)}`;
  }

  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 Problem Statement:' },
      { type: 'text', text: givenText },
      { type: 'text', text: 'In the complex plane, real parts map to the x-axis and imaginary parts to the y-axis.' },
    ],
  });

  // 2. FORMULA
  let equationText = '';
  let formula = '';
  
  switch(op) {
    case 'add':
      equationText = 'Combine real and imaginary parts independently:';
      formula = '(a + bi) + (c + di) = (a + c) + (b + d)i';
      break;
    case 'subtract':
      equationText = 'Subtract real and imaginary parts independently:';
      formula = '(a + bi) − (c + di) = (a − c) + (b − d)i';
      break;
    case 'multiply':
      equationText = 'Use FOIL expansion, with i² = −1:';
      formula = '(a + bi)(c + di) = (ac − bd) + (ad + bc)i';
      break;
    case 'divide':
      equationText = 'Multiply numerator and denominator by conjugate of denominator:';
      formula = '(a + bi)/(c + di) = [(ac + bd) + (bc − ad)i] / (c² + d²)';
      break;
    case 'conjugate':
      equationText = 'Change the sign of the imaginary component:';
      formula = 'z̄ = a − bi';
      break;
    case 'magnitude':
      equationText = 'Distance from the origin (modulus):';
      formula = '|z| = √(a² + b²)';
      break;
    case 'argument':
      equationText = 'Angle from positive real axis (in radians):';
      formula = 'arg(z) = atan2(b, a)';
      break;
    case 'power':
      equationText = "De Moivre's Theorem for integer powers:";
      formula = '(r(cos θ + i sin θ))ⁿ = rⁿ(cos(nθ) + i sin(nθ))';
      break;
    default:
      equationText = 'Operation not recognized.';
      formula = '';
  }

  if (formula) {
    steps.push({
      step: 'FORMULA',
      badge: 'secondary',
      content: [
        { type: 'text', text: equationText },
        { type: 'formula', text: formula },
      ],
    });
  }

  // 3. CALCULATION
  const calculationContent = [];
  
  switch(op) {
    case 'add':
      result = { real: z1.real + z2.real, imag: z1.imag + z2.imag };
      calculationContent.push(
        { type: 'text', text: 'Step 1: Add real parts' },
        { type: 'text', text: `${z1.real} + ${z2.real} = ${result.real}` },
        { type: 'text', text: 'Step 2: Add imaginary parts' },
        { type: 'text', text: `${z1.imag} + ${z2.imag} = ${result.imag}` },
        { type: 'result', text: `z₁ + z₂ = ${formatComplex(result)}` }
      );
      break;
      
    case 'subtract':
      result = { real: z1.real - z2.real, imag: z1.imag - z2.imag };
      calculationContent.push(
        { type: 'text', text: 'Step 1: Subtract real parts' },
        { type: 'text', text: `${z1.real} − ${z2.real} = ${result.real}` },
        { type: 'text', text: 'Step 2: Subtract imaginary parts' },
        { type: 'text', text: `${z1.imag} − ${z2.imag} = ${result.imag}` },
        { type: 'result', text: `z₁ − z₂ = ${formatComplex(result)}` }
      );
      break;
      
    case 'multiply':
      const ac = z1.real * z2.real;
      const bd = z1.imag * z2.imag;
      const ad = z1.real * z2.imag;
      const bc = z1.imag * z2.real;
      result = { real: ac - bd, imag: ad + bc };
      calculationContent.push(
        { type: 'text', text: 'Step 1: Multiply using FOIL' },
        { type: 'text', text: `(${z1.real} + ${z1.imag}i)(${z2.real} + ${z2.imag}i)` },
        { type: 'text', text: 'Step 2: Calculate real part (ac − bd)' },
        { type: 'text', text: `(${z1.real} × ${z2.real}) − (${z1.imag} × ${z2.imag}) = ${ac} − ${bd} = ${result.real}` },
        { type: 'text', text: 'Step 3: Calculate imaginary part (ad + bc)' },
        { type: 'text', text: `(${z1.real} × ${z2.imag}) + (${z1.imag} × ${z2.real}) = ${ad} + ${bc} = ${result.imag}` },
        { type: 'result', text: `z₁ × z₂ = ${formatComplex(result)}` }
      );
      break;
      
    case 'divide':
      const denominator = z2.real * z2.real + z2.imag * z2.imag;
      if (Math.abs(denominator) < 1e-10) {
        throw new Error('Cannot divide by zero');
      }
      const realPart = (z1.real * z2.real + z1.imag * z2.imag) / denominator;
      const imagPart = (z1.imag * z2.real - z1.real * z2.imag) / denominator;
      result = { real: realPart, imag: imagPart };
      calculationContent.push(
        { type: 'text', text: 'Step 1: Multiply by conjugate of denominator' },
        { type: 'text', text: `z₁/z₂ = (${z1.real} + ${z1.imag}i)(${z2.real} − ${z2.imag}i) / (${z2.real}² + ${z2.imag}²)` },
        { type: 'text', text: 'Step 2: Calculate denominator' },
        { type: 'text', text: `${z2.real}² + ${z2.imag}² = ${denominator}` },
        { type: 'text', text: 'Step 3: Calculate real part' },
        { type: 'text', text: `(${z1.real} × ${z2.real} + ${z1.imag} × ${z2.imag}) / ${denominator} = ${result.real.toFixed(4)}` },
        { type: 'text', text: 'Step 4: Calculate imaginary part' },
        { type: 'text', text: `(${z1.imag} × ${z2.real} − ${z1.real} × ${z2.imag}) / ${denominator} = ${result.imag.toFixed(4)}` },
        { type: 'result', text: `z₁ ÷ z₂ = ${formatComplex(result)}` }
      );
      break;
      
    case 'conjugate':
      result = { real: z1.real, imag: -z1.imag };
      calculationContent.push(
        { type: 'text', text: 'Step 1: Negate the imaginary part' },
        { type: 'text', text: `Imaginary: ${z1.imag} → ${-z1.imag}` },
        { type: 'text', text: 'Step 2: Keep the real part unchanged' },
        { type: 'text', text: `Real: ${z1.real} → ${z1.real}` },
        { type: 'result', text: `z̄ = ${formatComplex(result)}` }
      );
      break;
      
    case 'magnitude':
      const magSq = z1.real * z1.real + z1.imag * z1.imag;
      const magnitude = Math.sqrt(magSq);
      result = magnitude;
      calculationContent.push(
        { type: 'text', text: 'Step 1: Square real and imaginary parts' },
        { type: 'text', text: `(${z1.real})² = ${z1.real * z1.real}` },
        { type: 'text', text: `(${z1.imag})² = ${z1.imag * z1.imag}` },
        { type: 'text', text: 'Step 2: Sum the squares' },
        { type: 'text', text: `${z1.real * z1.real} + ${z1.imag * z1.imag} = ${magSq}` },
        { type: 'text', text: 'Step 3: Take square root' },
        { type: 'result', text: `|z| = √${magSq} ≈ ${magnitude.toFixed(4)}` }
      );
      break;
      
    case 'argument':
      const theta = Math.atan2(z1.imag, z1.real);
      const thetaDeg = (theta * 180) / Math.PI;
      result = theta;
      calculationContent.push(
        { type: 'text', text: 'Step 1: Calculate angle using atan2(b, a)' },
        { type: 'text', text: `θ = atan2(${z1.imag}, ${z1.real})` },
        { type: 'result', text: `θ = ${theta.toFixed(4)} radians` },
        { type: 'result', text: `θ = ${thetaDeg.toFixed(2)}°` }
      );
      break;
      
    case 'power': {
      const n = Math.round(z2.real); // Use real part of z2 as the power
      if (n < 0) {
        throw new Error('Power must be a non-negative integer for this solver');
      }
      if (n !== z2.real) {
        throw new Error('Power must be an integer');
      }
      
      const r = Math.sqrt(z1.real * z1.real + z1.imag * z1.imag);
      const angle = Math.atan2(z1.imag, z1.real);
      const rPower = Math.pow(r, n);
      const newAngle = n * angle;
      
      result = {
        real: rPower * Math.cos(newAngle),
        imag: rPower * Math.sin(newAngle)
      };
      
      calculationContent.push(
        { type: 'text', text: `Calculating z^${n} using De Moivre's Theorem` },
        { type: 'text', text: 'Step 1: Convert to polar form' },
        { type: 'text', text: `r = √(${z1.real}² + ${z1.imag}²) = ${r.toFixed(4)}` },
        { type: 'text', text: `θ = atan2(${z1.imag}, ${z1.real}) = ${angle.toFixed(4)} rad` },
        { type: 'text', text: '' },
        { type: 'text', text: 'Step 2: Apply De Moivre\'s Theorem' },
        { type: 'text', text: `r^${n} = ${r.toFixed(4)}^${n} = ${rPower.toFixed(4)}` },
        { type: 'text', text: `${n}θ = ${n} × ${angle.toFixed(4)} = ${newAngle.toFixed(4)} rad` },
        { type: 'text', text: '' },
        { type: 'text', text: 'Step 3: Convert back to rectangular form' },
        { type: 'text', text: `Real = ${rPower.toFixed(4)} × cos(${newAngle.toFixed(4)}) = ${result.real.toFixed(4)}` },
        { type: 'text', text: `Imag = ${rPower.toFixed(4)} × sin(${newAngle.toFixed(4)}) = ${result.imag.toFixed(4)}` },
        { type: 'result', text: `z^${n} = ${formatComplex(result)}` }
      );
      break;
    }
      
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
  
  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: calculationContent,
  });

  // 4. ANALYSIS
  const insightContent = [];
  
  switch(op) {
    case 'add':
      insightContent.push(
        { type: 'text', text: '💡 Geometric Interpretation:' },
        { type: 'text', text: 'Complex addition behaves like 2D vector addition (parallelogram rule).' },
        { type: 'text', text: `Result: ${formatComplex(result)}` }
      );
      break;
    case 'subtract':
      insightContent.push(
        { type: 'text', text: '💡 Geometric Interpretation:' },
        { type: 'text', text: 'Complex subtraction gives the vector from z₂ to z₁.' },
        { type: 'text', text: `Result: ${formatComplex(result)}` }
      );
      break;
    case 'multiply':
      insightContent.push(
        { type: 'text', text: '💡 Geometric Interpretation:' },
        { type: 'text', text: 'Multiplication multiplies magnitudes and adds angles.' },
        { type: 'text', text: `Result: ${formatComplex(result)}` }
      );
      break;
    case 'divide':
      insightContent.push(
        { type: 'text', text: '💡 Geometric Interpretation:' },
        { type: 'text', text: 'Division divides magnitudes and subtracts angles.' },
        { type: 'text', text: `Result: ${formatComplex(result)}` }
      );
      break;
    case 'conjugate':
      insightContent.push(
        { type: 'text', text: '💡 Geometric Interpretation:' },
        { type: 'text', text: 'The conjugate is a reflection across the real axis.' },
        { type: 'text', text: `z · z̄ = |z|² = ${z1.real * z1.real + z1.imag * z1.imag}` }
      );
      break;
    case 'magnitude':
      insightContent.push(
        { type: 'text', text: '💡 Geometric Interpretation:' },
        { type: 'text', text: `The point (${z1.real}, ${z1.imag}) is ${result.toFixed(4)} units from the origin.` },
        { type: 'text', text: 'The magnitude is always non-negative.' }
      );
      break;
    case 'argument':
      insightContent.push(
        { type: 'text', text: '💡 Geometric Interpretation:' },
        { type: 'text', text: 'The argument is the angle measured counterclockwise from the positive real axis.' },
        { type: 'text', text: 'Range: (−π, π] or (−180°, 180°]' }
      );
      break;
    case 'power': {
      const n = Math.round(z2.real);
      insightContent.push(
        { type: 'text', text: '💡 Geometric Interpretation:' },
        { type: 'text', text: `De Moivre's Theorem: (r∠θ)^${n} = r^${n}∠${n}θ` },
        { type: 'text', text: `The magnitude is raised to power ${n}, and the angle is multiplied by ${n}.` }
      );
      break;
    }
  }

  // Add polar form for applicable operations
  if (op !== 'argument' && op !== 'power') {
    const z = typeof result === 'object' ? result : { real: result, imag: 0 };
    if (Math.abs(z.real) > 1e-10 || Math.abs(z.imag) > 1e-10) {
      const r = Math.sqrt(z.real * z.real + z.imag * z.imag);
      const angle = Math.atan2(z.imag, z.real);
      const angleDeg = (angle * 180) / Math.PI;
      insightContent.push(
        { type: 'text', text: '' },
        { type: 'text', text: '🔄 Polar Form:' },
        { type: 'result', text: `${r.toFixed(4)} (cos ${angleDeg.toFixed(1)}° + i sin ${angleDeg.toFixed(1)}°)` }
      );
    }
  }

  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: insightContent,
  });

  return { result, steps };
}