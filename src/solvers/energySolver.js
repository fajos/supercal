export function solveEnergy(mode, params) {
  const { mass, velocity, height, springConstant, springCompression, gravity } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'kinetic': {
      const KE = 0.5 * mass * velocity * velocity;
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Velocity (v): ${velocity} m/s` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Kinetic energy (KE) is the energy of motion:' },
          { type: 'formula', text: 'KE = ½ · m · v²' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `KE = 0.5 × ${mass} × ${velocity}²` },
          { type: 'text', text: `KE = 0.5 × ${mass} × ${velocity * velocity}` },
          { type: 'highlight', text: `KE = ${KE.toFixed(2)} J` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The object possesses ${KE.toFixed(2)} Joules of energy due to its motion.` },
          { type: 'text', text: '💡 Important: Kinetic energy is directly proportional to the mass, but proportional to the SQUARE of the velocity. If you double the speed, you quadruple the energy!' },
        ],
      });
      result = `${KE.toFixed(2)} J`;
      break;
    }

    case 'potential': {
      const PE = mass * gravity * height;
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Height (h): ${height} m` },
          { type: 'text', text: `• Gravity (g): ${gravity} m/s²` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Gravitational potential energy (PE) is energy stored due to an object\'s position in a gravitational field:' },
          { type: 'formula', text: 'PE = m · g · h' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `PE = ${mass} × ${gravity} × ${height}` },
          { type: 'highlight', text: `PE = ${PE.toFixed(2)} J` },
        ],
      });

      steps.push({ step: 'INTERPRETATION/ANALYSIS', badge: 'insight', content: [
        { type: 'text', text: `The object has ${PE.toFixed(2)} Joules of stored energy relative to the reference height (0m).` },
        { type: 'text', text: '💡 If the object is released, this energy will convert into kinetic energy as it falls.' },
      ]});
      result = `${PE.toFixed(2)} J`;
      break;
    }

    case 'spring': {
      const springPE = 0.5 * springConstant * springCompression * springCompression;
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Spring Constant (k): ${springConstant} N/m` },
          { type: 'text', text: `• Displacement/Compression (x): ${springCompression} m` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Elastic potential energy (U) is stored in a spring when it is compressed or stretched:' },
          { type: 'formula', text: 'U = ½ · k · x²' },
          { type: 'text', text: '(Based on Hooke\'s Law)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `U = 0.5 × ${springConstant} × ${springCompression}²` },
          { type: 'highlight', text: `U = ${springPE.toFixed(2)} J` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The spring stores ${springPE.toFixed(2)} Joules of energy.` },
          { type: 'text', text: `The force required to hold it at this displacement is F = kx = ${(springConstant * springCompression).toFixed(1)} N.` },
        ],
      });
      result = `${springPE.toFixed(2)} J`;
      break;
    }

    case 'conservation': {
      const KE = 0.5 * mass * velocity * velocity;
      const PE = mass * gravity * height;
      const totalEnergy = KE + PE;

      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Velocity (v): ${velocity} m/s` },
          { type: 'text', text: `• Height (h): ${height} m` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The Law of Conservation of Energy states that in an isolated system, the total mechanical energy remains constant:' },
          { type: 'formula', text: 'E_total = KE + PE' },
          { type: 'formula', text: 'E_total = ½mv² + mgh' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Kinetic Energy: ${KE.toFixed(2)} J` },
          { type: 'text', text: `2. Potential Energy: ${PE.toFixed(2)} J` },
          { type: 'highlight', text: `Total Energy = ${totalEnergy.toFixed(2)} J` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The total mechanical energy of the object is ${totalEnergy.toFixed(2)} Joules.` },
          { type: 'text', text: '💡 Assuming no friction or air resistance, this value will remain the same throughout the motion.' },
          { type: 'text', text: `If it falls to height 0, its velocity will reach ${Math.sqrt(2 * totalEnergy / mass).toFixed(2)} m/s.` },
        ],
      });
      result = `${totalEnergy.toFixed(2)} J`;
      break;
    }
  }

  return { result, steps };
}
