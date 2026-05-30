// simultaneousSolver.js - 3x3 Linear System Solver with Tutor Model

export function solveSimultaneous3x3(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3) {
  const steps = [];
  
  // 1. GIVEN
  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: '📝 IDENTIFY THE SYSTEM' },
      { type: 'text', text: 'We have three linear equations with three variables (x, y, z):' },
      { type: 'formula', text: `① ${a1}x + ${b1}y + ${c1}z = ${d1}` },
      { type: 'formula', text: `② ${a2}x + ${b2}y + ${c2}z = ${d2}` },
      { type: 'formula', text: `③ ${a3}x + ${b3}y + ${c3}z = ${d3}` },
    ],
  });

  // 2. FORMULA
  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📐 THEORETICAL APPROACH' },
      { type: 'text', text: "We'll use Cramer's Rule, which uses determinants to solve for variables:" },
      { type: 'formula', text: 'x = Dx/D,  y = Dy/D,  z = Dz/D' },
      { type: 'text', text: 'Where D is the determinant of the coefficient matrix.' },
    ],
  });

  // 3. CALCULATION
  const D = a1 * (b2 * c3 - b3 * c2) - b1 * (a2 * c3 - a3 * c2) + c1 * (a2 * b3 - a3 * b2);

  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: '🔍 CALCULATE MAIN DETERMINANT (D)' },
      { type: 'text', text: 'Coefficient Matrix:' },
      { type: 'text', text: `[ ${a1}  ${b1}  ${c1} ]` },
      { type: 'text', text: `[ ${a2}  ${b2}  ${c2} ]` },
      { type: 'text', text: `[ ${a3}  ${b3}  ${c3} ]` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Expanding along the first row (Cofactor Expansion):' },
      { type: 'text', text: `D = ${a1}(${b2}·${c3} - ${b3}·${c2}) - ${b1}(${a2}·${c3} - ${a3}·${c2}) + ${c1}(${a2}·${b3} - ${a3}·${b2})` },
      { type: 'result', text: `D = ${D.toFixed(4)}` },
    ],
  });

  if (Math.abs(D) < 1e-10) {
    steps.push({
      step: 'ANALYSIS',
      badge: 'secondary',
      content: [
        { type: 'text', text: '⚠️ SYSTEM ANALYSIS: D = 0' },
        { type: 'formula', text: 'The system does not have a unique solution.' },
        { type: 'text', text: 'This occurs when the planes are parallel or intersect at infinitely many points.' },
      ],
    });
    return { steps, x: null, y: null, z: null, error: 'No unique solution' };
  }
  
  // Dx, Dy, Dz calculations
  const Dx = d1 * (b2 * c3 - b3 * c2) - b1 * (d2 * c3 - d3 * c2) + c1 * (d2 * b3 - d3 * b2);
  const Dy = a1 * (d2 * c3 - d3 * c2) - d1 * (a2 * c3 - a3 * c2) + c1 * (a2 * d3 - a3 * d2);
  const Dz = a1 * (b2 * d3 - b3 * d2) - b1 * (a2 * d3 - a3 * d2) + d1 * (a2 * b3 - a3 * b2);
  
  const x = Dx / D;
  const y = Dy / D;
  const z = Dz / D;

  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: '🧪 SOLVING FOR VARIABLES' },
      { type: 'text', text: 'Calculate column-replaced determinants (replace x, y, or z column with constants):' },
      { type: 'result', text: `Dx = ${Dx.toFixed(4)}` },
      { type: 'result', text: `Dy = ${Dy.toFixed(4)}` },
      { type: 'result', text: `Dz = ${Dz.toFixed(4)}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'Apply Cramer\'s Rule (Division):' },
      { type: 'text', text: `x = Dx / D = ${Dx.toFixed(4)} / ${D.toFixed(4)}` },
      { type: 'text', text: `y = Dy / D = ${Dy.toFixed(4)} / ${D.toFixed(4)}` },
      { type: 'text', text: `z = Dz / D = ${Dz.toFixed(4)} / ${D.toFixed(4)}` },
    ],
  });

  // 4. ANALYSIS
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: '💡 GEOMETRIC INTERPRETATION' },
      { type: 'text', text: 'In 3D space, each linear equation represents a flat plane.' },
      { type: 'formula', text: 'The three planes intersect at exactly one point:' },
      { type: 'result', text: `Point P = (${x.toFixed(4)}, ${y.toFixed(4)}, ${z.toFixed(4)})` },
    ],
  });
  
  return { x, y, z, steps };
}
