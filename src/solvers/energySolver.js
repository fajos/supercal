export function solveEnergy(mode, params) {
  const { mass, velocity, height, springConstant, springCompression, gravity } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'kinetic': {
      const vSquared = velocity * velocity;
      const KE = 0.5 * mass * vSquared;
      
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters for Kinetic Energy:' },
          { type: 'text', text: `• Mass of the object (m): ${mass} kg` },
          { type: 'text', text: `• Current Velocity (v): ${velocity} m/s` },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Kinetic Energy (KE) represents the energy an object possesses due to its motion:' },
          { type: 'formula', text: 'KE = ½ · m · v²' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• m = mass (kg)' },
          { type: 'text', text: '• v = velocity (m/s)' },
        ],
      });

      // 3. CALCULATION
      const momentum = mass * velocity;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Square the velocity' },
          { type: 'text', text: `v² = (${velocity} m/s)² = ${vSquared.toFixed(2)} m²/s²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Multiply by mass and ½' },
          { type: 'text', text: `KE = ½ × ${mass} kg × ${vSquared.toFixed(2)} m²/s²` },
          { type: 'text', text: `KE = ½ × ${(mass * vSquared).toFixed(2)}` },
          { type: 'result', text: `KE = ${KE.toFixed(2)} J` },
        ],
      });

      // 4. ANALYSIS
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The object possesses ${KE.toFixed(2)} Joules of kinetic energy due to its motion.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 Related Quantities:' },
          { type: 'text', text: `• Momentum: p = m × v = ${mass} × ${velocity} = ${momentum.toFixed(2)} kg·m/s` },
          { type: 'text', text: `• Velocity from KE: v = √(2·KE/m) = √(2 × ${KE.toFixed(2)}/${mass}) = ${Math.sqrt(2 * KE / mass).toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY INSIGHT: Kinetic energy is proportional to the SQUARE of velocity.' },
          { type: 'text', text: `• At ${velocity} m/s: KE = ${KE.toFixed(2)} J` },
          { type: 'text', text: `• At ${velocity * 2} m/s (2× speed): KE = ${(0.5 * mass * velocity * velocity * 4).toFixed(2)} J (4× energy!)` },
          { type: 'text', text: `• At ${velocity * 3} m/s (3× speed): KE = ${(0.5 * mass * velocity * velocity * 9).toFixed(2)} J (9× energy!)` },
          { type: 'text', text: '' },
          { type: 'text', text: '⚠️ This is why high-speed collisions are so much more destructive than low-speed ones.' },
        ],
      });
      result = `${KE.toFixed(2)} J`;
      break;
    }

    case 'potential': {
      const weight = mass * gravity;
      const PE = weight * height;
      
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters for Gravitational Potential Energy:' },
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Height relative to reference (h): ${height} m` },
          { type: 'text', text: `• Gravitational Acceleration (g): ${gravity} m/s²` },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Gravitational Potential Energy (PE) is the energy stored in an object due to its position in a gravitational field:' },
          { type: 'formula', text: 'PE = m · g · h' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• m = mass (kg)' },
          { type: 'text', text: '• g = gravitational acceleration (m/s²)' },
          { type: 'text', text: '• h = height above reference point (m)' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate the weight (force of gravity)' },
          { type: 'text', text: `Fg = m × g = ${mass} kg × ${gravity} m/s² = ${weight.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Multiply weight by height (Work = Force × Distance)' },
          { type: 'text', text: `PE = Fg × h = ${weight.toFixed(2)} N × ${height} m` },
          { type: 'result', text: `PE = ${PE.toFixed(2)} J` },
        ],
      });

      // 4. ANALYSIS
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The object has ${PE.toFixed(2)} Joules of stored gravitational potential energy.` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔄 Energy Conversion:' },
          { type: 'text', text: `• If dropped from ${height}m, all ${PE.toFixed(2)} J converts to kinetic energy` },
          { type: 'text', text: `• Impact velocity (ignoring air resistance): v = √(2gh) = √(2 × ${gravity} × ${height}) = ${Math.sqrt(2 * gravity * height).toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 PRACTICAL EXAMPLES:' },
          { type: 'text', text: `• Lifting ${mass}kg to ${height}m requires ${PE.toFixed(2)} J of work` },
          { type: 'text', text: `• This is equivalent to ~${(PE / 4184).toFixed(4)} food calories` },
          { type: 'text', text: `• Or powering a 60W light bulb for ${(PE / 60).toFixed(2)} seconds` },
        ],
      });
      result = `${PE.toFixed(2)} J`;
      break;
    }

    case 'spring': {
      const springPE = 0.5 * springConstant * springCompression * springCompression;
      const restoringForce = springConstant * springCompression;
      
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters for Elastic Potential Energy:' },
          { type: 'text', text: `• Spring Constant (k): ${springConstant} N/m` },
          { type: 'text', text: `• Compression/Extension (x): ${springCompression} m` },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Elastic Potential Energy (U) stored in a compressed or stretched spring:' },
          { type: 'formula', text: 'U = ½ · k · x²' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• k = spring constant (N/m)' },
          { type: 'text', text: '• x = displacement from equilibrium (m)' },
          { type: 'text', text: '' },
          { type: 'text', text: "Hooke's Law - Restoring Force:" },
          { type: 'formula', text: 'F = −k · x' },
          { type: 'text', text: '(Negative sign indicates force opposes displacement)' },
        ],
      });

      // 3. CALCULATION
      const xSquared = springCompression * springCompression;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Square the displacement' },
          { type: 'text', text: `x² = (${springCompression} m)² = ${xSquared.toFixed(6)} m²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Multiply by spring constant and ½' },
          { type: 'text', text: `U = ½ × ${springConstant} N/m × ${xSquared.toFixed(6)} m²` },
          { type: 'text', text: `U = ½ × ${(springConstant * xSquared).toFixed(4)}` },
          { type: 'result', text: `U = ${springPE.toFixed(2)} J` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate restoring force' },
          { type: 'text', text: `F = k × x = ${springConstant} × ${springCompression}` },
          { type: 'result', text: `F = ${restoringForce.toFixed(2)} N` },
        ],
      });

      // 4. ANALYSIS
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The spring stores ${springPE.toFixed(2)} Joules of elastic potential energy.` },
          { type: 'text', text: `✅ The restoring force at this displacement is ${restoringForce.toFixed(2)} N.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 ENERGY-DISPLACEMENT RELATIONSHIP:' },
          { type: 'text', text: `• At ½ compression (${(springCompression/2).toFixed(3)}m): U = ${(0.5 * springConstant * (springCompression/2) * (springCompression/2)).toFixed(2)} J (¼ energy)` },
          { type: 'text', text: `• At full compression (${springCompression}m): U = ${springPE.toFixed(2)} J` },
          { type: 'text', text: `• At 2× compression (${(springCompression*2).toFixed(3)}m): U = ${(0.5 * springConstant * springCompression * 2 * springCompression * 2).toFixed(2)} J (4× energy)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Like kinetic energy, elastic energy is proportional to the SQUARE of displacement.' },
          { type: 'text', text: '💡 This quadratic relationship means small changes in compression create large changes in stored energy.' },
        ],
      });
      result = `${springPE.toFixed(2)} J`;
      break;
    }

    case 'conservation': {
      const vSquared = velocity * velocity;
      const KE = 0.5 * mass * vSquared;
      const PE = mass * gravity * height;
      const totalEnergy = KE + PE;
      
      // Calculate additional useful values
      const maxHeightIfAllKE = height + (KE / (mass * gravity));
      const maxVelocityIfAllPE = Math.sqrt(2 * totalEnergy / mass);

      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Conservation of Mechanical Energy:' },
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Velocity (v): ${velocity} m/s` },
          { type: 'text', text: `• Height (h): ${height} m` },
          { type: 'text', text: `• Gravity (g): ${gravity} m/s²` },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The Law of Conservation of Energy states that energy cannot be created or destroyed, only converted from one form to another:' },
          { type: 'formula', text: 'E_total = KE + PE = constant' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Where:' },
          { type: 'formula', text: 'KE = ½ · m · v²' },
          { type: 'formula', text: 'PE = m · g · h' },
          { type: 'text', text: '' },
          { type: 'text', text: 'This means: KE_initial + PE_initial = KE_final + PE_final' },
        ],
      });

      // 3. CALCULATION
      const kePercent = (KE / totalEnergy) * 100;
      const pePercent = (PE / totalEnergy) * 100;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate Kinetic Energy (KE)' },
          { type: 'text', text: `KE = ½ × ${mass} × (${velocity})²` },
          { type: 'text', text: `KE = ½ × ${mass} × ${vSquared.toFixed(2)}` },
          { type: 'result', text: `KE = ${KE.toFixed(2)} J (${kePercent.toFixed(1)}% of total)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Potential Energy (PE)' },
          { type: 'text', text: `PE = ${mass} × ${gravity} × ${height}` },
          { type: 'result', text: `PE = ${PE.toFixed(2)} J (${pePercent.toFixed(1)}% of total)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Sum for Total Mechanical Energy' },
          { type: 'text', text: `E_total = ${KE.toFixed(2)} + ${PE.toFixed(2)}` },
          { type: 'result', text: `E_total = ${totalEnergy.toFixed(2)} J` },
        ],
      });

      // 4. ANALYSIS
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The total mechanical energy is ${totalEnergy.toFixed(2)} Joules (conserved in ideal conditions).` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔄 PREDICTIONS (assuming no friction):' },
          { type: 'text', text: `• If all energy converts to PE: Maximum height = ${maxHeightIfAllKE.toFixed(2)} m` },
          { type: 'text', text: `• If all energy converts to KE: Maximum velocity = ${maxVelocityIfAllPE.toFixed(2)} m/s` },
          { type: 'text', text: `• At ground level (h=0): v = √(2·E/m) = ${Math.sqrt(2 * totalEnergy / mass).toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 REALITY CHECK: In practice, some energy is always lost to friction, air resistance, sound, and heat.' },
          { type: 'text', text: '💡 This principle applies to roller coasters, pendulums, and projectile motion - PE and KE constantly exchange while their sum remains constant.' },
        ],
      });
      result = `${totalEnergy.toFixed(2)} J`;
      break;
    }
  }

  return { result, steps };
}