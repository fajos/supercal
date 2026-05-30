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
      const timeToPeak = uy / gravity;

      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '🚀 Projectile Initial Conditions:' },
          { type: 'text', text: `• Initial Velocity (u): ${velocity} m/s` },
          { type: 'text', text: `• Launch Angle (θ): ${angle}°` },
          { type: 'text', text: `• Gravity (g): ${gravity} m/s²` },
          { type: 'text', text: `• Launch Height: Ground level (h = 0)` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: '1. Resolve velocity into horizontal and vertical components:' },
          { type: 'formula', text: 'uₓ = u · cos(θ)' },
          { type: 'formula', text: 'uᵧ = u · sin(θ)' },
          { type: 'text', text: '' },
          { type: 'text', text: '2. Time to reach peak height:' },
          { type: 'formula', text: 't_peak = uᵧ / g' },
          { type: 'text', text: '' },
          { type: 'text', text: '3. Total Time of Flight (symmetric trajectory):' },
          { type: 'formula', text: 'T = 2 · uᵧ / g' },
          { type: 'text', text: '' },
          { type: 'text', text: '4. Maximum Height (occurs at t = T/2):' },
          { type: 'formula', text: 'H = uᵧ² / (2 · g)' },
          { type: 'text', text: '' },
          { type: 'text', text: '5. Horizontal Range:' },
          { type: 'formula', text: 'R = uₓ · T = u² · sin(2θ) / g' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate Velocity Components' },
          { type: 'text', text: `cos(${angle}°) = ${Math.cos(angleRad).toFixed(4)}` },
          { type: 'text', text: `sin(${angle}°) = ${Math.sin(angleRad).toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: `uₓ = ${velocity} × cos(${angle}°) = ${velocity} × ${Math.cos(angleRad).toFixed(4)}` },
          { type: 'result', text: `uₓ = ${ux.toFixed(2)} m/s (horizontal)` },
          { type: 'text', text: '' },
          { type: 'text', text: `uᵧ = ${velocity} × sin(${angle}°) = ${velocity} × ${Math.sin(angleRad).toFixed(4)}` },
          { type: 'result', text: `uᵧ = ${uy.toFixed(2)} m/s (vertical)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Time to Peak' },
          { type: 'text', text: `t_peak = ${uy.toFixed(2)} / ${gravity} = ${timeToPeak.toFixed(3)} s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate Total Time of Flight' },
          { type: 'text', text: `T = 2 × ${uy.toFixed(2)} / ${gravity}` },
          { type: 'text', text: `T = ${(2 * uy).toFixed(2)} / ${gravity}` },
          { type: 'result', text: `T = ${timeOfFlight.toFixed(2)} s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Calculate Maximum Height' },
          { type: 'text', text: `H = (${uy.toFixed(2)})² / (2 × ${gravity})` },
          { type: 'text', text: `H = ${(uy * uy).toFixed(2)} / ${(2 * gravity).toFixed(2)}` },
          { type: 'result', text: `H = ${maxHeight.toFixed(2)} m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 5: Calculate Range (2 methods)' },
          { type: 'text', text: `Method 1: R = uₓ × T = ${ux.toFixed(2)} × ${timeOfFlight.toFixed(2)}` },
          { type: 'text', text: `Method 2: R = u² × sin(2θ) / g = ${velocity}² × sin(${2 * angle}°) / ${gravity}` },
          { type: 'result', text: `R = ${range.toFixed(2)} m` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The projectile stayed in the air for ${timeOfFlight.toFixed(2)}s.` },
          { type: 'text', text: `✅ It reached a peak height of ${maxHeight.toFixed(2)}m after ${timeToPeak.toFixed(2)}s.` },
          { type: 'text', text: `✅ The total horizontal distance covered is ${range.toFixed(2)}m.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 TRAJECTORY INSIGHTS:' },
          { type: 'text', text: `• At t = ${(timeOfFlight/4).toFixed(2)}s: Height ≈ ${(uy * timeOfFlight/4 - 0.5 * gravity * (timeOfFlight/4) * (timeOfFlight/4)).toFixed(2)}m (ascending)` },
          { type: 'text', text: `• At t = ${(timeOfFlight/2).toFixed(2)}s: Height = ${maxHeight.toFixed(2)}m (peak)` },
          { type: 'text', text: `• At t = ${(3*timeOfFlight/4).toFixed(2)}s: Height ≈ ${(uy * 3*timeOfFlight/4 - 0.5 * gravity * (3*timeOfFlight/4) * (3*timeOfFlight/4)).toFixed(2)}m (descending)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 OPTIMAL LAUNCH ANGLE:' },
          { type: 'text', text: '• Maximum range on flat ground occurs at exactly 45°' },
          { type: 'text', text: `• At 45°, the range would be ${((velocity * velocity) / gravity).toFixed(2)}m` },
          { type: 'text', text: '• Complementary angles (e.g., 30° and 60°) give the same range but different flight times' },
          { type: 'text', text: '• Higher angles → longer flight time, lower angles → shorter flight time' },
        ],
      });

      result = `${range.toFixed(2)} m`;
      break;
    }

    case 'horizontalLaunch': {
      const timeToHit = Math.sqrt((2 * height) / gravity);
      const range = velocity * timeToHit;
      const finalVerticalVelocity = gravity * timeToHit;
      const impactSpeed = Math.sqrt(velocity * velocity + finalVerticalVelocity * finalVerticalVelocity);
      const impactAngle = Math.atan2(finalVerticalVelocity, velocity) * 180 / Math.PI;

      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 Horizontal Launch Parameters:' },
          { type: 'text', text: `• Horizontal Velocity (vₓ): ${velocity} m/s` },
          { type: 'text', text: `• Initial Height (h): ${height} m` },
          { type: 'text', text: `• Gravity (g): ${gravity} m/s²` },
          { type: 'text', text: `• Initial Vertical Velocity: 0 m/s (purely horizontal)` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'For horizontal launch, vertical motion is free fall from height h:' },
          { type: 'formula', text: 't = √(2 · h / g)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Horizontal range (constant velocity):' },
          { type: 'formula', text: 'R = vₓ · t' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Impact velocity components:' },
          { type: 'formula', text: 'v_impact = √(vₓ² + vᵧ²)' },
          { type: 'formula', text: 'θ_impact = atan(vᵧ / vₓ)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate Time to Hit the Ground' },
          { type: 'text', text: `t = √(2 × ${height} / ${gravity})` },
          { type: 'text', text: `t = √(${(2 * height).toFixed(2)} / ${gravity})` },
          { type: 'text', text: `t = √${(2 * height / gravity).toFixed(4)}` },
          { type: 'result', text: `t = ${timeToHit.toFixed(2)} s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Horizontal Range' },
          { type: 'text', text: `R = vₓ × t = ${velocity} × ${timeToHit.toFixed(2)}` },
          { type: 'result', text: `R = ${range.toFixed(2)} m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate Impact Velocity' },
          { type: 'text', text: `Vertical velocity at impact: vᵧ = g × t = ${gravity} × ${timeToHit.toFixed(2)}` },
          { type: 'result', text: `vᵧ = ${finalVerticalVelocity.toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: `Impact speed: v = √(${velocity}² + ${finalVerticalVelocity.toFixed(2)}²)` },
          { type: 'result', text: `v_impact = ${impactSpeed.toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: `Impact angle: θ = atan(${finalVerticalVelocity.toFixed(2)} / ${velocity})` },
          { type: 'result', text: `θ_impact = ${impactAngle.toFixed(2)}° below horizontal` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The object falls for ${timeToHit.toFixed(2)}s before hitting the ground.` },
          { type: 'text', text: `✅ It travels ${range.toFixed(2)}m horizontally during the fall.` },
          { type: 'text', text: `✅ Impact speed is ${impactSpeed.toFixed(2)} m/s at ${impactAngle.toFixed(1)}° below horizontal.` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY INSIGHTS:' },
          { type: 'text', text: '• Horizontal and vertical motions are completely independent' },
          { type: 'text', text: `• Time of fall depends ONLY on height and gravity (not horizontal speed)` },
          { type: 'text', text: `• Doubling the height to ${height * 2}m would increase fall time to ${Math.sqrt(4 * height / gravity).toFixed(2)}s (√2 times longer)` },
          { type: 'text', text: `• Doubling horizontal speed to ${velocity * 2} m/s would double the range to ${(range * 2).toFixed(2)}m` },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 REAL-WORLD APPLICATIONS:' },
          { type: 'text', text: '• Bomb drops from aircraft' },
          { type: 'text', text: '• Water from a fire hose' },
          { type: 'text', text: '• Ball rolling off a table' },
        ],
      });

      result = `${range.toFixed(2)} m`;
      break;
    }
  }

  return { result, steps };
}