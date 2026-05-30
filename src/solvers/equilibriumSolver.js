export function solveEquilibrium(mode, params) {
  const { force, distance, angle = 90, mass, pivotDistance, force1, dist1, dist2 } = params;
  const steps = [];
  let result;

  const angleRad = (angle * Math.PI) / 180;

  switch (mode) {
    case 'moment': {
      const sinTheta = Math.sin(angleRad);
      const cosTheta = Math.cos(angleRad);
      const moment = force * distance * sinTheta;
      const perpendicularComponent = force * sinTheta;
      const parallelComponent = force * cosTheta;

      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters for Rotational Moment (Torque):' },
          { type: 'text', text: `• Magnitude of Applied Force (F): ${force} N` },
          { type: 'text', text: `• Moment Arm Distance (d): ${distance} m` },
          { type: 'text', text: `• Angle of Application (θ): ${angle}°` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The Moment (M) is the turning effect of a force. Only the component of force perpendicular to the distance arm creates rotation:' },
          { type: 'formula', text: 'M = F · d · sin(θ)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Force Resolution:' },
          { type: 'formula', text: 'F_perpendicular = F · sin(θ)' },
          { type: 'formula', text: 'F_parallel = F · cos(θ)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Resolve the force into components' },
          { type: 'text', text: `sin(${angle}°) = ${sinTheta.toFixed(4)}` },
          { type: 'text', text: `cos(${angle}°) = ${cosTheta.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate perpendicular component' },
          { type: 'text', text: `F⊥ = ${force} × sin(${angle}°) = ${force} × ${sinTheta.toFixed(4)} = ${perpendicularComponent.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate parallel component (does not create rotation)' },
          { type: 'text', text: `F∥ = ${force} × cos(${angle}°) = ${force} × ${cosTheta.toFixed(4)} = ${parallelComponent.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Calculate the moment' },
          { type: 'text', text: `M = F⊥ × d = ${perpendicularComponent.toFixed(2)} × ${distance}` },
          { type: 'result', text: `Moment (M) = ${moment.toFixed(2)} N·m` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The force generates a turning effect of ${moment.toFixed(2)} N·m.` },
          { type: 'text', text: `📊 Efficiency: ${(sinTheta * 100).toFixed(1)}% of the applied force contributes to rotation (perpendicular component).` },
          { type: 'text', text: angle === 90 
            ? '💡 Maximum Moment: At 90°, sin(θ) = 1, giving the maximum possible moment for this force and distance.' 
            : angle === 0 
              ? '⚠️ Zero Moment: At 0°, the force is entirely parallel, creating no rotation.'
              : `💡 To maximize the moment, apply the force at 90° to the lever arm (sin(90°) = 1).`
          },
          { type: 'text', text: '💡 The same force creates a larger moment if applied further from the pivot or more perpendicularly.' },
        ],
      });

      result = `${moment.toFixed(2)} N·m`;
      break;
    }

    case 'lever': {
      const moment1 = force1 * dist1;
      const force2 = moment1 / dist2;
      const mechanicalAdvantage = dist2 / dist1;

      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters for Lever Equilibrium:' },
          { type: 'text', text: `• Effort/Load 1 Force (F₁): ${force1} N` },
          { type: 'text', text: `• Distance from Pivot 1 (d₁): ${dist1} m` },
          { type: 'text', text: `• Distance from Pivot 2 (d₂): ${dist2} m` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The Principle of Moments states that for a body in rotational equilibrium, the sum of clockwise moments must equal the sum of anticlockwise moments:' },
          { type: 'formula', text: 'ΣM_clockwise = ΣM_anticlockwise' },
          { type: 'text', text: '' },
          { type: 'text', text: 'For a simple lever with two forces:' },
          { type: 'formula', text: 'F₁ · d₁ = F₂ · d₂' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Solving for the unknown force (F₂):' },
          { type: 'formula', text: 'F₂ = (F₁ · d₁) / d₂' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Mechanical Advantage (MA):' },
          { type: 'formula', text: 'MA = d₂ / d₁' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate the moment generated on Side 1 (M₁)' },
          { type: 'text', text: `M₁ = F₁ × d₁` },
          { type: 'text', text: `M₁ = ${force1} N × ${dist1} m` },
          { type: 'result', text: `M₁ = ${moment1.toFixed(2)} N·m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: For equilibrium, M₂ must equal M₁' },
          { type: 'text', text: `M₂ = M₁ = ${moment1.toFixed(2)} N·m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Solve for the required force F₂' },
          { type: 'text', text: `F₂ = M₂ / d₂` },
          { type: 'text', text: `F₂ = ${moment1.toFixed(2)} N·m / ${dist2} m` },
          { type: 'result', text: `Required Force (F₂) = ${force2.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Calculate Mechanical Advantage' },
          { type: 'text', text: `MA = d₂ / d₁ = ${dist2} / ${dist1}` },
          { type: 'result', text: `MA = ${mechanicalAdvantage.toFixed(2)}` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ To balance the lever, a force of ${force2.toFixed(2)} N must be applied on the second side.` },
          { type: 'text', text: '' },
          { type: 'text', text: mechanicalAdvantage > 1 
            ? `💪 Mechanical Advantage > 1: This lever amplifies force! You only need ${force2.toFixed(2)} N to balance ${force1} N.` 
            : mechanicalAdvantage < 1 
              ? `🏃 Mechanical Advantage < 1: This lever amplifies speed/distance. You need more force but get more movement.`
              : `⚖️ Mechanical Advantage = 1: This lever changes direction but doesn't amplify force.`
          },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Types of Levers:' },
          { type: 'text', text: '• Class 1: Fulcrum between effort and load (seesaw, crowbar)' },
          { type: 'text', text: '• Class 2: Load between fulcrum and effort (wheelbarrow, nutcracker)' },
          { type: 'text', text: '• Class 3: Effort between fulcrum and load (tweezers, fishing rod)' },
        ],
      });

      result = `${force2.toFixed(2)} N`;
      break;
    }
  }

  return { result, steps };
}