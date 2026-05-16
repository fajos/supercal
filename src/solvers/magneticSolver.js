export function solveMagnetic(mode, params) {
  const { charge, velocity, field, length, current, angle = 90 } = params;
  const steps = [];
  let result;

  const angleRad = (angle * Math.PI) / 180;

  switch (mode) {
    case 'chargeForce': {
      // F = qvB sin(theta)
      const force = charge * velocity * field * Math.sin(angleRad);
      steps.push({
        step: 'MAGNETIC FORCE ON CHARGE',
        badge: 'primary',
        content: [
          { type: 'text', text: '🧲 Force on a moving charge in a magnetic field:' },
          { type: 'formula', text: 'F = qvB sin(θ)' },
          { type: 'text', text: `Charge (q) = ${charge} C` },
          { type: 'text', text: `Velocity (v) = ${velocity} m/s` },
          { type: 'text', text: `Magnetic Field (B) = ${field} T` },
          { type: 'text', text: `Angle (θ) = ${angle}°` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Calculation:' },
          { type: 'text', text: `F = ${charge} × ${velocity} × ${field} × sin(${angle}°)` },
          { type: 'highlight', text: `Magnetic Force = ${force.toExponential(3)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: "💡 Use Fleming's Left Hand Rule to find the direction of the force." },
        ],
      });
      result = `${force.toExponential(3)} N`;
      break;
    }

    case 'wireForce': {
      // F = BIL sin(theta)
      const force = field * current * length * Math.sin(angleRad);
      steps.push({
        step: 'MAGNETIC FORCE ON WIRE',
        badge: 'primary',
        content: [
          { type: 'text', text: '🧲 Force on a current-carrying conductor:' },
          { type: 'formula', text: 'F = BIL sin(θ)' },
          { type: 'text', text: `Magnetic Field (B) = ${field} T` },
          { type: 'text', text: `Current (I) = ${current} A` },
          { type: 'text', text: `Length (L) = ${length} m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Calculation:' },
          { type: 'text', text: `F = ${field} × ${current} × ${length} × sin(${angle}°)` },
          { type: 'highlight', text: `Magnetic Force = ${force.toFixed(4)} N` },
        ],
      });
      result = `${force.toFixed(4)} N`;
      break;
    }
  }

  return { result, steps };
}
