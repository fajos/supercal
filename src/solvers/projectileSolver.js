export function solveProjectile(mode, params) {
  const { velocity, angle, height, gravity = 9.81 } = params;
  const steps = [];
  let result;

  const angleRad = (angle * Math.PI) / 180;
  const ux = velocity * Math.cos(angleRad);
  const uy = velocity * Math.sin(angleRad);

  switch (mode) {
    case 'groundLaunch': {
      // launched from ground (h=0)
      const timeOfFlight = (2 * uy) / gravity;
      const maxHeight = (uy * uy) / (2 * gravity);
      const range = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;

      steps.push({
        step: 'INITIAL COMPONENTS',
        badge: 'secondary',
        content: [
          { type: 'text', text: '🎯 Resolving initial velocity into components:' },
          { type: 'formula', text: `u_x = u cos(θ) = ${velocity} cos(${angle}°)` },
          { type: 'formula', text: `u_y = u sin(θ) = ${velocity} sin(${angle}°)` },
          { type: 'text', text: `u_x = ${ux.toFixed(2)} m/s (Horizontal)` },
          { type: 'text', text: `u_y = ${uy.toFixed(2)} m/s (Vertical)` },
        ],
      });

      steps.push({
        step: 'TIME OF FLIGHT',
        badge: 'primary',
        content: [
          { type: 'text', text: '⏱️ Time taken to return to ground level:' },
          { type: 'formula', text: 'T = (2 × u_y) / g' },
          { type: 'text', text: `T = (2 × ${uy.toFixed(2)}) / ${gravity}` },
          { type: 'highlight', text: `T = ${timeOfFlight.toFixed(2)} seconds` },
        ],
      });

      steps.push({
        step: 'MAXIMUM HEIGHT',
        badge: 'primary',
        content: [
          { type: 'text', text: '⛰️ Highest point reached:' },
          { type: 'formula', text: 'H = (u_y)² / (2g)' },
          { type: 'text', text: `H = (${uy.toFixed(2)})² / (2 × ${gravity})` },
          { type: 'text', text: `H = ${Math.pow(uy, 2).toFixed(2)} / ${(2 * gravity).toFixed(2)}` },
          { type: 'highlight', text: `H = ${maxHeight.toFixed(2)} meters` },
        ],
      });

      steps.push({
        step: 'HORIZONTAL RANGE',
        badge: 'primary',
        content: [
          { type: 'text', text: '📏 Total horizontal distance covered:' },
          { type: 'formula', text: 'R = (u² sin(2θ)) / g' },
          { type: 'text', text: `R = (${velocity}² × sin(${2 * angle}°)) / ${gravity}` },
          { type: 'highlight', text: `R = ${range.toFixed(2)} meters` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Fun Fact: Maximum range is achieved at 45° launch angle.' },
        ],
      });

      result = `T: ${timeOfFlight.toFixed(2)}s, H: ${maxHeight.toFixed(2)}m, R: ${range.toFixed(2)}m`;
      break;
    }

    case 'horizontalLaunch': {
      // launched horizontally from height h
      const timeToHit = Math.sqrt((2 * height) / gravity);
      const range = velocity * timeToHit;

      steps.push({
        step: 'VERTICAL ANALYSIS',
        badge: 'primary',
        content: [
          { type: 'text', text: '⏱️ Finding time to hit the ground:' },
          { type: 'text', text: 'In horizontal launch, initial vertical velocity (u_y) = 0.' },
          { type: 'formula', text: 'h = ½gt²  =>  t = √(2h/g)' },
          { type: 'text', text: `t = √(2 × ${height} / ${gravity})` },
          { type: 'text', text: `t = √(${(2 * height / gravity).toFixed(4)})` },
          { type: 'highlight', text: `t = ${timeToHit.toFixed(2)} seconds` },
        ],
      });

      steps.push({
        step: 'HORIZONTAL ANALYSIS',
        badge: 'primary',
        content: [
          { type: 'text', text: '📏 Finding horizontal distance (Range):' },
          { type: 'formula', text: 'R = u_x × t' },
          { type: 'text', text: `R = ${velocity} × ${timeToHit.toFixed(2)}` },
          { type: 'highlight', text: `R = ${range.toFixed(2)} meters` },
        ],
      });

      steps.push({
        step: 'FINAL VELOCITY',
        badge: 'secondary',
        content: [
          { type: 'text', text: '🎯 Impact Velocity:' },
          { type: 'text', text: `v_x = ${velocity} m/s` },
          { type: 'text', text: `v_y = g × t = ${gravity} × ${timeToHit.toFixed(2)} = ${(gravity * timeToHit).toFixed(2)} m/s` },
          { type: 'formula', text: 'v = √(v_x² + v_y²)' },
          { type: 'highlight', text: `v = ${Math.sqrt(velocity * velocity + Math.pow(gravity * timeToHit, 2)).toFixed(2)} m/s` },
        ],
      });

      result = `Time: ${timeToHit.toFixed(2)}s, Range: ${range.toFixed(2)}m`;
      break;
    }
  }

  return { result, steps };
}
