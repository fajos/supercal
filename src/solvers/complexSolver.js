// complexSolver.js
export function solveComplexOperation(op, z1, z2) {
  // z1 = { real, imag }, z2 = { real, imag }
  const steps = [];
  let result;
  
  switch(op) {
    case 'add':
      result = { real: z1.real + z2.real, imag: z1.imag + z2.imag };
      steps.push({
        step: 'ADDITION',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 Complex Number Addition' },
          { type: 'text', text: `(${z1.real} + ${z1.imag}i) + (${z2.real} + ${z2.imag}i)` },
          { type: 'text', text: 'Add real parts and imaginary parts separately:' },
          { type: 'text', text: `Real: ${z1.real} + ${z2.real} = ${result.real}` },
          { type: 'text', text: `Imag: ${z1.imag} + ${z2.imag} = ${result.imag}` },
          { type: 'highlight', text: `= ${result.real} + ${result.imag}i` },
        ],
      });
      break;
      
    case 'multiply':
      result = {
        real: z1.real * z2.real - z1.imag * z2.imag,
        imag: z1.real * z2.imag + z1.imag * z2.real
      };
      steps.push({
        step: 'MULTIPLICATION',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 Complex Number Multiplication' },
          { type: 'text', text: `(${z1.real} + ${z1.imag}i)(${z2.real} + ${z2.imag}i)` },
          { type: 'text', text: 'Use FOIL method: (a+bi)(c+di) = (ac-bd) + (ad+bc)i' },
          { type: 'text', text: `ac = ${z1.real} × ${z2.real} = ${z1.real * z2.real}` },
          { type: 'text', text: `bd = ${z1.imag} × ${z2.imag} = ${z1.imag * z2.imag}` },
          { type: 'text', text: `ad = ${z1.real} × ${z2.imag} = ${z1.real * z2.imag}` },
          { type: 'text', text: `bc = ${z1.imag} × ${z2.real} = ${z1.imag * z2.real}` },
          { type: 'highlight', text: `= ${result.real} + ${result.imag}i` },
        ],
      });
      break;
      
    case 'conjugate':
      result = { real: z1.real, imag: -z1.imag };
      steps.push({
        step: 'CONJUGATE',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 Complex Conjugate' },
          { type: 'text', text: `z = ${z1.real} + ${z1.imag}i` },
          { type: 'text', text: 'The conjugate flips the sign of the imaginary part:' },
          { type: 'highlight', text: `z̄ = ${result.real} + ${result.imag}i` },
          { type: 'text', text: 'Property: z × z̄ = a² + b² (always real!)' },
        ],
      });
      break;
      
    case 'magnitude':
      const magnitude = Math.sqrt(z1.real * z1.real + z1.imag * z1.imag);
      result = magnitude;
      steps.push({
        step: 'MAGNITUDE',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 Magnitude (Modulus)' },
          { type: 'text', text: `|z| = √(a² + b²) for z = ${z1.real} + ${z1.imag}i` },
          { type: 'text', text: `|z| = √((${z1.real})² + (${z1.imag})²)` },
          { type: 'text', text: `|z| = √(${z1.real * z1.real} + ${z1.imag * z1.imag})` },
          { type: 'highlight', text: `|z| = ${magnitude.toFixed(4)}` },
          { type: 'text', text: 'Geometric meaning: Distance from origin in complex plane' },
        ],
      });
      break;
  }
  
  // Polar form
  if (z1.real !== 0 || z1.imag !== 0) {
    const r = Math.sqrt(z1.real * z1.real + z1.imag * z1.imag);
    const theta = Math.atan2(z1.imag, z1.real);
    steps.push({
      step: 'POLAR FORM',
      badge: 'secondary',
      content: [
        { type: 'text', text: '🔄 Polar Form Representation' },
        { type: 'text', text: `z = r(cos θ + i sin θ) = r·e^(iθ)` },
        { type: 'text', text: `r = ${r.toFixed(4)}` },
        { type: 'text', text: `θ = ${theta.toFixed(4)} rad = ${(theta * 180 / Math.PI).toFixed(2)}°` },
      ],
    });
  }
  
  return { result, steps };
}