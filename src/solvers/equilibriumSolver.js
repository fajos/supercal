export function solveEquilibrium(mode, params) {
  const { force, distance, angle = 90, mass, pivotDistance, force1, dist1, dist2 } = params;
  const steps = [];
  let result;

  const angleRad = (angle * Math.PI) / 180;

  switch (mode) {
    case 'moment': {
      const moment = force * distance * Math.sin(angleRad);

      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We are analyzing the rotational effect of a force applied at a distance from a pivot:' },
          { type: 'text', text: `• Applied Force (F): ${force} N` },
          { type: 'text', text: `• Distance from Pivot (d): ${distance} m` },
          { type: 'text', text: `• Angle of Application (θ): ${angle}°` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The Moment (or Torque) is determined by the force component acting perpendicular to the lever arm:' },
          { type: 'formula', text: 'M = F × d × sin(θ)' },
          { type: 'text', text: 'Where θ is the angle between the force and the distance vector.' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `M = ${force} N × ${distance} m × sin(${angle}°)` },
          { type: 'highlight', text: `Moment = ${moment.toFixed(2)} Nm` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The force generates a turning effect of ${moment.toFixed(2)} Newton-meters.` },
          { type: 'text', text: '💡 Leverage: The same force creates a larger moment if applied further from the pivot (greater d) or more perpendicularly (θ closer to 90°).' },
          { type: 'text', text: '💡 Principle of Moments: For total equilibrium, the sum of clockwise moments must exactly cancel the sum of anticlockwise moments.' },
        ],
      });

      result = `${moment.toFixed(2)} Nm`;
      break;
    }

    case 'lever': {
      const force2 = (force1 * dist1) / dist2;

      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We are balancing a lever (like a see-saw) in static equilibrium:' },
          { type: 'text', text: `• Side 1: Force = ${force1} N, Distance = ${dist1} m` },
          { type: 'text', text: `• Side 2: Distance = ${dist2} m, Force = ?` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'For equilibrium (no rotation), the moments on both sides must be equal:' },
          { type: 'formula', text: 'F₁ × d₁ = F₂ × d₂' },
          { type: 'text', text: 'Solving for the unknown force (F₂):' },
          { type: 'formula', text: 'F₂ = (F₁ × d₁) / d₂' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `F₂ = (${force1} N × ${dist1} m) / ${dist2} m` },
          { type: 'highlight', text: `Required Force (F₂) = ${force2.toFixed(2)} N` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `To balance the lever, a force of ${force2.toFixed(2)} N must be applied on the second side.` },
          { type: 'text', text: `💡 Mechanical Advantage: If d₂ > d₁, then F₂ < F₁. This is how levers allow us to lift heavy loads with relatively small efforts.` },
          { type: 'text', text: '💡 Think of a playground see-saw: a lighter person must sit further from the center to balance a heavier person.' },
        ],
      });

      result = `${force2.toFixed(2)} N`;
      break;
    }
  }

  return { result, steps };
}
