export function solveEquilibrium(mode, params) {
  const { force, distance, angle = 90, mass, pivotDistance } = params;
  const steps = [];
  let result;

  const angleRad = (angle * Math.PI) / 180;

  switch (mode) {
    case 'moment': {
      // M = F * d * sin(theta)
      const moment = force * distance * Math.sin(angleRad);
      steps.push({
        step: 'MOMENT OF A FORCE',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚖️ Calculating the turning effect (Moment):' },
          { type: 'formula', text: 'M = F × d × sin(θ)' },
          { type: 'text', text: `Force (F) = ${force} N` },
          { type: 'text', text: `Distance from pivot (d) = ${distance} m` },
          { type: 'text', text: `Angle (θ) = ${angle}°` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Calculation:' },
          { type: 'text', text: `M = ${force} × ${distance} × sin(${angle}°)` },
          { type: 'highlight', text: `Moment = ${moment.toFixed(2)} Nm` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Principle of Moments: For a body in equilibrium, the sum of clockwise moments about a point equals the sum of anticlockwise moments about the same point.' },
        ],
      });
      result = `${moment.toFixed(2)} Nm`;
      break;
    }

    case 'lever': {
      // F1 * d1 = F2 * d2 (Assuming equilibrium)
      // Find missing force or distance. Let's assume params has force1, dist1, dist2, find force2
      const { force1, dist1, dist2 } = params;
      const force2 = (force1 * dist1) / dist2;

      steps.push({
        step: 'PRINCIPLE OF MOMENTS',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚖️ Using the Lever Principle:' },
          { type: 'formula', text: 'F₁ × d₁ = F₂ × d₂' },
          { type: 'text', text: `Effort/Load 1 = ${force1} N` },
          { type: 'text', text: `Distance 1 = ${dist1} m` },
          { type: 'text', text: `Distance 2 = ${dist2} m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Rearranging for F₂:' },
          { type: 'formula', text: 'F₂ = (F₁ × d₁) / d₂' },
          { type: 'text', text: `F₂ = (${force1} × ${dist1}) / ${dist2}` },
          { type: 'highlight', text: `Required Force (F₂) = ${force2.toFixed(2)} N` },
        ],
      });
      result = `${force2.toFixed(2)} N`;
      break;
    }
  }

  return { result, steps };
}
