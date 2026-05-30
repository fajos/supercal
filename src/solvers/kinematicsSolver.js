// src/solvers/kinematicsSolver.js
export function solveKinematics(mode, params) {
  const { initialVelocity, finalVelocity, acceleration, time, displacement } = params;
  const steps = [];
  let result;

  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: '📝 Known Variables:' },
      { type: 'text', text: `v₀ = ${initialVelocity} m/s (initial velocity)` },
      { type: 'text', text: `v = ${finalVelocity} m/s (final velocity)` },
      { type: 'text', text: `a = ${acceleration} m/s² (acceleration)` },
      { type: 'text', text: `t = ${time} s (time)` },
      { type: 'text', text: `s = ${displacement} m (displacement)` },
    ],
  });

  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📐 Kinematic Equations (SUVAT):' },
      { type: 'formula', text: '1. v = v₀ + at' },
      { type: 'formula', text: '2. s = v₀t + ½at²' },
      { type: 'formula', text: '3. v² = v₀² + 2as' },
      { type: 'formula', text: '4. s = ½(v₀ + v)t' },
      { type: 'text', text: '' },
      { type: 'text', text: '💡 These equations apply when acceleration is constant!' },
    ],
  });

  switch (mode) {
    case 'velocity':
      // Using v = v₀ + at
      const v = initialVelocity + acceleration * time;
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Choose the correct kinematic equation.' },
          { type: 'text', text: 'Since we have v₀, a, and t, and need v, we use:' },
          { type: 'formula', text: 'v = v₀ + at' },
          { type: 'text', text: 'Step 2: Substitute the known values:' },
          { type: 'text', text: `v = ${initialVelocity} + (${acceleration} × ${time})` },
          { type: 'text', text: `v = ${initialVelocity} + ${acceleration * time}` },
          { type: 'result', text: `v = ${v.toFixed(2)} m/s` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: v > initialVelocity 
            ? `✅ The object SPEEDS UP by ${(v - initialVelocity).toFixed(1)} m/s.`
            : v < initialVelocity
            ? `✅ The object SLOWS DOWN by ${(initialVelocity - v).toFixed(1)} m/s.`
            : 'The object maintains CONSTANT velocity.'
          },
          { type: 'text', text: '💡 The final velocity depends on the direction of acceleration relative to initial motion.' },
        ],
      });
      result = `${v.toFixed(2)} m/s`;
      break;

    case 'displacement':
      // Using s = v₀t + ½at²
      const dx = initialVelocity * time + 0.5 * acceleration * time * time;
      const ut = initialVelocity * time;
      const halfAT2 = 0.5 * acceleration * time * time;
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Choose the correct kinematic equation.' },
          { type: 'text', text: 'To find displacement (s) using v₀, t, and a, we use:' },
          { type: 'formula', text: 's = v₀t + ½at²' },
          { type: 'text', text: 'Step 2: Substitute the known values:' },
          { type: 'text', text: `s = (${initialVelocity} × ${time}) + (½ × ${acceleration} × ${time}²)` },
          { type: 'text', text: `s = ${ut.toFixed(2)} + (0.5 × ${acceleration} × ${Math.pow(time, 2).toFixed(2)})` },
          { type: 'text', text: `s = ${ut.toFixed(2)} + ${halfAT2.toFixed(2)}` },
          { type: 'result', text: `s = ${dx.toFixed(2)} m` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The object travels a total distance of ${Math.abs(dx).toFixed(1)} meters ${dx >= 0 ? 'forward' : 'backward'} from the start.` },
          { type: 'text', text: '💡 Displacement is a vector; it measures the change in position, not necessarily the total path distance.' },
        ],
      });
      result = `${dx.toFixed(2)} meters`;
      break;

    case 'time':
      // Using quadratic formula from s = v₀t + ½at²
      const a_coef = 0.5 * acceleration;
      const b_coef = initialVelocity;
      const c_coef = -displacement;
      const discriminant = b_coef * b_coef - 4 * a_coef * c_coef;
      
      if (discriminant < 0) {
        throw new Error('No real solution. The object never reaches this displacement under these conditions.');
      }
      
      const t1 = (-b_coef + Math.sqrt(discriminant)) / (2 * a_coef);
      const t2 = (-b_coef - Math.sqrt(discriminant)) / (2 * a_coef);
      const t_positive = Math.max(t1, t2);
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Set up the displacement equation in standard quadratic form.' },
          { type: 'text', text: 's = v₀t + ½at²  →  ½at² + v₀t - s = 0' },
          { type: 'text', text: `(${0.5 * acceleration})t² + (${initialVelocity})t - (${displacement}) = 0` },
          { type: 'text', text: 'Step 2: Solve using the Quadratic Formula: t = [-b ± √(b² - 4ac)] / 2a' },
          { type: 'text', text: `a = ${a_coef}, b = ${b_coef}, c = ${c_coef}` },
          { type: 'text', text: `Δ = (${b_coef})² - 4(${a_coef})(${c_coef}) = ${discriminant.toFixed(4)}` },
          { type: 'text', text: `t = [ -${b_coef} ± √${discriminant.toFixed(2)} ] / ${2 * a_coef}` },
          { type: 'text', text: `t₁ = ${t1.toFixed(4)} s, t₂ = ${t2.toFixed(4)} s` },
          { type: 'text', text: 'Step 3: Select the physically meaningful (positive) time.' },
          { type: 'result', text: `t = ${t_positive.toFixed(2)} s` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The object reaches the target displacement at t = ${t_positive.toFixed(2)} seconds.` },
          { type: 'text', text: t1 !== t2 && Math.min(t1, t2) > 0
            ? `💡 There are two points in time where this displacement is reached (e.g., an object thrown up and coming back down).`
            : `💡 Negative time results are mathematically valid but physically rejected for events starting at t=0.`
          },
        ],
      });
      result = `${t_positive.toFixed(2)} seconds`;
      break;
  }

  // 4. ANALYSIS
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🌍 Real-World Application:' },
      { type: 'text', text: '• A car accelerating on a highway.' },
      { type: 'text', text: '• An object falling under gravity (a = -9.81 m/s²).' },
      { type: 'text', text: '• A ball thrown upward.' },
      { type: 'text', text: '⚠️ Assumption: Acceleration must be CONSTANT for these equations to work!' },
    ],
  });

  return { result, steps };
}