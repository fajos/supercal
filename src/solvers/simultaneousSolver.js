// simultaneousSolver.js
export function solveSimultaneous3x3(a1,b1,c1,d1, a2,b2,c2,d2, a3,b3,c3,d3) {
  // Using Cramer's Rule for 3×3 system
  const steps = [];
  
  // Augmented matrix display
  steps.push({
    step: 'SYSTEM',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 System of 3 Equations:' },
      { type: 'text', text: `${a1}x + ${b1}y + ${c1}z = ${d1}` },
      { type: 'text', text: `${a2}x + ${b2}y + ${c2}z = ${d2}` },
      { type: 'text', text: `${a3}x + ${b3}y + ${c3}z = ${d3}` },
    ],
  });
  
  // Main determinant
  const D = a1*(b2*c3 - b3*c2) - b1*(a2*c3 - a3*c2) + c1*(a2*b3 - a3*b2);
  
  if (Math.abs(D) < 1e-10) {
    throw new Error('Determinant is 0. No unique solution.');
  }
  
  // Dx, Dy, Dz
  const Dx = d1*(b2*c3 - b3*c2) - b1*(d2*c3 - d3*c2) + c1*(d2*b3 - d3*b2);
  const Dy = a1*(d2*c3 - d3*c2) - d1*(a2*c3 - a3*c2) + c1*(a2*d3 - a3*d2);
  const Dz = a1*(b2*d3 - b3*d2) - b1*(a2*d3 - a3*d2) + d1*(a2*b3 - a3*b2);
  
  steps.push({
    step: 'CRAMER\'S RULE',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Using Cramer\'s Rule for 3×3:' },
      { type: 'text', text: `Main determinant D = ${D.toFixed(4)}` },
      { type: 'text', text: `Dx = ${Dx.toFixed(4)}` },
      { type: 'text', text: `Dy = ${Dy.toFixed(4)}` },
      { type: 'text', text: `Dz = ${Dz.toFixed(4)}` },
    ],
  });
  
  const x = Dx / D;
  const y = Dy / D;
  const z = Dz / D;
  
  steps.push({
    step: 'SOLUTION',
    badge: 'warning',
    content: [
      { type: 'highlight', text: `x = ${x.toFixed(6)}` },
      { type: 'highlight', text: `y = ${y.toFixed(6)}` },
      { type: 'highlight', text: `z = ${z.toFixed(6)}` },
    ],
  });
  
  return { x, y, z, steps };
}