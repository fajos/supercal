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
        step: 'GIVEN VALUES',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters:' },
          { type: 'text', text: `Charge (q) = ${charge} C` },
          { type: 'text', text: `Velocity (v) = ${velocity} m/s` },
          { type: 'text', text: `Magnetic Field (B) = ${field} T (Tesla)` },
          { type: 'text', text: `Angle (θ) = ${angle}°` },
        ],
      });

      steps.push({
        step: 'EQUATION',
        badge: 'secondary',
        content: [
          { type: 'text', text: '🧲 Lorentz Force (Magnetic Component):' },
          { type: 'formula', text: 'F = qvB sin(θ)' },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Concept:' },
          { type: 'text', text: 'A moving charge experiences a force perpendicular to both its velocity and the magnetic field.' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: `sin(${angle}°) = ${Math.sin(angleRad).toFixed(4)}` },
          { type: 'text', text: `F = ${charge} × ${velocity} × ${field} × ${Math.sin(angleRad).toFixed(4)}` },
          { type: 'highlight', text: `F = ${force.toExponential(3)} Newtons` },
          { type: 'text', text: '' },
          { type: 'text', text: "✋ Direction: Use Fleming's Left Hand Rule (for positive charge):" },
          { type: 'text', text: '• Thumb: Force (F)' },
          { type: 'text', text: '• First Finger: Field (B)' },
          { type: 'text', text: '• Second Finger: Velocity (v)' },
        ],
      });
      result = `${force.toExponential(3)} N`;
      break;
    }

    case 'wireForce': {
      // F = BIL sin(theta)
      const force = field * current * length * Math.sin(angleRad);
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters:' },
          { type: 'text', text: `Magnetic Field (B) = ${field} T` },
          { type: 'text', text: `Current (I) = ${current} A` },
          { type: 'text', text: `Length (L) = ${length} m` },
          { type: 'text', text: `Angle (θ) = ${angle}°` },
        ],
      });

      steps.push({
        step: 'EQUATION',
        badge: 'secondary',
        content: [
          { type: 'text', text: '🧲 Force on a Current-Carrying Wire:' },
          { type: 'formula', text: 'F = BIL sin(θ)' },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Concept:' },
          { type: 'text', text: 'When a wire carrying electricity is placed in a magnetic field, the collective force on the moving electrons results in a force on the wire itself.' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: `sin(${angle}°) = ${Math.sin(angleRad).toFixed(4)}` },
          { type: 'text', text: `F = ${field} × ${current} × ${length} × ${Math.sin(angleRad).toFixed(4)}` },
          { type: 'highlight', text: `F = ${force.toFixed(4)} Newtons` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔍 Observation:' },
          { type: 'text', text: angle == 90 ? '• Max force occurs at 90° (perpendicular).' : angle == 0 ? '• Zero force occurs at 0° (parallel).' : '• Force is reduced due to the angle.' },
        ],
      });
      result = `${force.toFixed(4)} N`;
      break;
    }
  }

  return { result, steps };
}
