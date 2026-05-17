export function solveProjectile(mode, params) {
  const { velocity, angle, height, gravity = 9.81 } = params;
  const steps = [];
  let result;

  const angleRad = (angle * Math.PI) / 180;
  const ux = velocity * Math.cos(angleRad);
  const uy = velocity * Math.sin(angleRad);

  switch (mode) {
    case 'groundLaunch': {
      const timeOfFlight = (2 * uy) / gravity;
      const maxHeight = (uy * uy) / (2 * gravity);
      const range = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;

      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Launch Velocity (u): ${velocity} m/s` },
          { type: 'text', text: `• Launch Angle (θ): ${angle}°` },
          { type: 'text', text: `• Gravity (g): ${gravity} m/s²` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: '1. Velocity Components:' },
          { type: 'formula', text: 'u_x = u · cos(θ), u_y = u · sin(θ)' },
          { type: 'text', text: '2. Time of Flight (T):' },
          { type: 'formula', text: 'T = (2 · u_y) / g' },
          { type: 'text', text: '3. Max Height (H):' },
          { type: 'formula', text: 'H = (u_y)² / (2 · g)' },
          { type: 'text', text: '4. Range (R):' },
          { type: 'formula', text: 'R = (u² · sin(2θ)) / g' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `• u_x = ${ux.toFixed(2)}, u_y = ${uy.toFixed(2)}` },
          { type: 'text', text: `• T = (2 × ${uy.toFixed(2)}) / ${gravity} = ${timeOfFlight.toFixed(2)}s` },
          { type: 'text', text: `• H = (${uy.toFixed(2)}²) / (2 × ${gravity}) = ${maxHeight.toFixed(2)}m` },
          { type: 'text', text: `• R = (${velocity}² × sin(${2 * angle}°)) / ${gravity} = ${range.toFixed(2)}m` },
          { type: 'highlight', text: `R = ${range.toFixed(2)} m` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The projectile stays in the air for ${timeOfFlight.toFixed(2)}s and reaches a peak of ${maxHeight.toFixed(2)}m.` },
          { type: 'text', text: '💡 Maximum range occurs at 45°. Angles like 30° and 60° (complementary) will result in the same range but different heights!' },
        ],
      });

      result = `${range.toFixed(2)} m`;
      break;
    }

    case 'horizontalLaunch': {
      const timeToHit = Math.sqrt((2 * height) / gravity);
      const range = velocity * timeToHit;

      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Horizontal Velocity (v_x): ${velocity} m/s` },
          { type: 'text', text: `• Initial Height (h): ${height} m` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'For a horizontal launch, u_y = 0:' },
          { type: 'formula', text: 't = √(2h / g) (Time to hit ground)' },
          { type: 'formula', text: 'R = v_x · t (Horizontal Range)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Time: √(2 × ${height} / ${gravity}) = ${timeToHit.toFixed(2)}s` },
          { type: 'text', text: `2. Range: ${velocity} × ${timeToHit.toFixed(2)} = ${range.toFixed(2)}m` },
          { type: 'highlight', text: `R = ${range.toFixed(2)} m` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The object falls for ${timeToHit.toFixed(2)}s while moving forward at a constant ${velocity} m/s.` },
          { type: 'text', text: '💡 Horizontal and vertical motions are independent. The time it takes to fall depends ONLY on height and gravity, not on horizontal speed.' },
        ],
      });

      result = `${range.toFixed(2)} m`;
      break;
    }
  }

  return { result, steps };
}

