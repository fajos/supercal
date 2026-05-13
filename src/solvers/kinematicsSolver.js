// src/solvers/kinematicsSolver.js
export function solveKinematics(mode, params) {
  const { initialVelocity, finalVelocity, acceleration, time, displacement } = params;
  const steps = [];
  let result;

  steps.push({
    step: 'GIVEN VALUES',
    badge: 'primary',
    content: [
      { type: 'text', text: '📝 Known Variables:' },
      { type: 'text', text: `v₀ = ${initialVelocity} m/s (initial velocity)` },
      { type: 'text', text: `v = ${finalVelocity} m/s (final velocity)` },
      { type: 'text', text: `a = ${acceleration} m/s² (acceleration)` },
      { type: 'text', text: `t = ${time} s (time)` },
      { type: 'text', text: `Δx = ${displacement} m (displacement)` },
    ],
  });

  steps.push({
    step: 'EQUATIONS',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📐 Kinematic Equations (SUVAT):' },
      { type: 'formula', text: '1. v = v₀ + at' },
      { type: 'formula', text: '2. Δx = v₀t + ½at²' },
      { type: 'formula', text: '3. v² = v₀² + 2aΔx' },
      { type: 'formula', text: '4. Δx = ½(v₀ + v)t' },
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
          { type: 'text', text: '🎯 Finding Final Velocity' },
          { type: 'text', text: 'Using equation: v = v₀ + at' },
          { type: 'text', text: `v = ${initialVelocity} + (${acceleration} × ${time})` },
          { type: 'text', text: `v = ${initialVelocity} + ${acceleration * time}` },
          { type: 'highlight', text: `v = ${v.toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 Interpretation:' },
          { type: 'text', text: v > initialVelocity 
            ? `The object SPEEDS UP by ${(v - initialVelocity).toFixed(1)} m/s`
            : v < initialVelocity
            ? `The object SLOWS DOWN by ${(initialVelocity - v).toFixed(1)} m/s`
            : 'The object maintains CONSTANT velocity'
          },
        ],
      });
      result = `${v.toFixed(2)} m/s`;
      break;

    case 'displacement':
      // Using Δx = v₀t + ½at²
      const dx = initialVelocity * time + 0.5 * acceleration * time * time;
      const halfAT2 = 0.5 * acceleration * time * time;
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: '🎯 Finding Displacement' },
          { type: 'text', text: 'Using equation: Δx = v₀t + ½at²' },
          { type: 'text', text: 'Step 1: v₀t = ' + initialVelocity + ' × ' + time + ' = ' + (initialVelocity * time) },
          { type: 'text', text: 'Step 2: ½at² = ½ × ' + acceleration + ' × ' + time + '² = ' + halfAT2.toFixed(2) },
          { type: 'text', text: `Δx = ${(initialVelocity * time).toFixed(2)} + ${halfAT2.toFixed(2)}` },
          { type: 'highlight', text: `Δx = ${dx.toFixed(2)} meters` },
          { type: 'text', text: '' },
          { type: 'text', text: `The object travels ${Math.abs(dx).toFixed(1)} meters ${dx >= 0 ? 'forward' : 'backward'}.` },
        ],
      });
      result = `${dx.toFixed(2)} meters`;
      break;

    case 'time':
      // Using quadratic formula from Δx = v₀t + ½at²
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
          { type: 'text', text: '🎯 Finding Time' },
          { type: 'text', text: `Using quadratic: ${a_coef}t² + ${b_coef}t + ${c_coef} = 0` },
          { type: 'text', text: `Discriminant = ${discriminant.toFixed(4)}` },
          { type: 'text', text: t1 > 0 ? `t₁ = ${t1.toFixed(2)} s` : `t₁ = ${t1.toFixed(2)} s (rejected - negative time)` },
          { type: 'text', text: t2 > 0 ? `t₂ = ${t2.toFixed(2)} s` : `t₂ = ${t2.toFixed(2)} s (rejected - negative time)` },
          { type: 'highlight', text: `t = ${t_positive.toFixed(2)} seconds` },
        ],
      });
      result = `${t_positive.toFixed(2)} seconds`;
      break;
  }

  // Real-world example
  steps.push({
    step: 'REAL WORLD',
    badge: 'warning',
    content: [
      { type: 'text', text: '🌍 Real-World Application:' },
      { type: 'text', text: 'These equations describe:' },
      { type: 'text', text: '• A car accelerating on a highway' },
      { type: 'text', text: '• An object falling under gravity (a = -9.81 m/s²)' },
      { type: 'text', text: '• A ball thrown upward' },
      { type: 'text', text: '• A train coming to a stop' },
      { type: 'text', text: '' },
      { type: 'text', text: '⚠️ Assumption: Acceleration must be CONSTANT for these equations to work!' },
    ],
  });

  return { result, steps };
}