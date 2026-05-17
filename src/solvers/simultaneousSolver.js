// simultaneousSolver.js
export function solveSimultaneous3x3(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3) {
  const steps = [];
  
  // GIVEN VALUES
  steps.push({
    step: 'GIVEN VALUES',
    badge: 'input',
    content: [
      { type: 'text', text: 'We have a system of three linear equations with three variables (x, y, and z):' },
      { type: 'highlight', text: `Eq ①: ${a1}x + ${b1}y + ${c1}z = ${d1}` },
      { type: 'highlight', text: `Eq ②: ${a2}x + ${b2}y + ${c2}z = ${d2}` },
      { type: 'highlight', text: `Eq ③: ${a3}x + ${b3}y + ${c3}z = ${d3}` },
    ],
  });

  // EQUATIONS
  steps.push({
    step: 'EQUATIONS',
    badge: 'formula',
    content: [
      { type: 'text', text: 'We use Cramer\'s Rule for a 3x3 system:' },
      { type: 'highlight', text: 'x = Dx/D, y = Dy/D, z = Dz/D' },
      { type: 'text', text: 'Where D is the determinant of the coefficient matrix, and Dx, Dy, Dz are determinants with the respective columns replaced by constants.' },
    ],
  });
  
  // Main determinant
  const D = a1 * (b2 * c3 - b3 * c2) - b1 * (a2 * c3 - a3 * c2) + c1 * (a2 * b3 - a3 * b2);
  
  if (Math.abs(D) < 1e-10) {
    steps.push({
      step: 'INTERPRETATION/ANALYSIS',
      badge: 'insight',
      content: [
        { type: 'text', text: '⚠️ The determinant D is zero.' },
        { type: 'highlight', text: 'The system does not have a unique solution.' },
        { type: 'text', text: 'This means the planes represented by these equations are either parallel or intersect along a line or plane.' },
      ],
    });
    return { steps, x: null, y: null, z: null, error: 'No unique solution' };
  }
  
  // Dx, Dy, Dz
  const Dx = d1 * (b2 * c3 - b3 * c2) - b1 * (d2 * c3 - d3 * c2) + c1 * (d2 * b3 - d3 * b2);
  const Dy = a1 * (d2 * c3 - d3 * c2) - d1 * (a2 * c3 - a3 * c2) + c1 * (a2 * d3 - a3 * d2);
  const Dz = a1 * (b2 * d3 - b3 * d2) - b1 * (a2 * d3 - a3 * d2) + d1 * (a2 * b3 - a3 * b2);
  
  const x = Dx / D;
  const y = Dy / D;
  const z = Dz / D;

  // CALCULATION
  steps.push({
    step: 'CALCULATION',
    badge: 'math',
    content: [
      { type: 'text', text: '1. Calculate the Main Determinant (D):' },
      { type: 'highlight', text: `D = ${D.toFixed(4)}` },
      { type: 'text', text: '2. Calculate column-replaced determinants:' },
      { type: 'text', text: `Dx = ${Dx.toFixed(4)}` },
      { type: 'text', text: `Dy = ${Dy.toFixed(4)}` },
      { type: 'text', text: `Dz = ${Dz.toFixed(4)}` },
      { type: 'text', text: '3. Solve for variables:' },
      { type: 'result', text: `x = Dx / D = ${x.toFixed(6)}` },
      { type: 'result', text: `y = Dy / D = ${y.toFixed(6)}` },
      { type: 'result', text: `z = Dz / D = ${z.toFixed(6)}` },
    ],
  });

  // INTERPRETATION/ANALYSIS
  steps.push({
    step: 'INTERPRETATION/ANALYSIS',
    badge: 'insight',
    content: [
      { type: 'text', text: 'In 3D space, each equation represents a flat plane.' },
      { type: 'highlight', text: `The three planes intersect at a single point: (${x.toFixed(4)}, ${y.toFixed(4)}, ${z.toFixed(4)})` },
    ],
  });
  
  return { x, y, z, steps };
}