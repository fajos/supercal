export function solveEnergy(mode, params) {
  const { mass, velocity, height, springConstant, springCompression, gravity } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'kinetic': {
      const KE = 0.5 * mass * velocity * velocity;
      steps.push({
        step: 'KINETIC ENERGY',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Kinetic Energy Formula' },
          { type: 'formula', text: 'KE = ½mv²' },
          { type: 'text', text: `m = ${mass} kg (mass)` },
          { type: 'text', text: `v = ${velocity} m/s (velocity)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 1: Calculate v²' },
          { type: 'text', text: `v² = ${velocity}² = ${velocity * velocity}` },
          { type: 'text', text: 'Step 2: Multiply by mass' },
          { type: 'text', text: `mv² = ${mass} × ${velocity * velocity} = ${mass * velocity * velocity}` },
          { type: 'text', text: 'Step 3: Multiply by ½' },
          { type: 'text', text: `KE = ½ × ${mass * velocity * velocity}` },
          { type: 'highlight', text: `KE = ${KE.toFixed(2)} Joules` },
          { type: 'text', text: '' },
          { type: 'text', text: `At ${velocity} m/s, this ${mass} kg object carries ${KE.toFixed(1)} J of kinetic energy.` },
          { type: 'text', text: 'Kinetic energy scales with velocity SQUARED - doubling speed quadruples energy!' },
        ],
      });
      result = `${KE.toFixed(2)} J`;
      break;
    }

    case 'potential': {
      const PE = mass * gravity * height;
      steps.push({
        step: 'POTENTIAL ENERGY',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Gravitational Potential Energy' },
          { type: 'formula', text: 'PE = mgh' },
          { type: 'text', text: `m = ${mass} kg (mass)` },
          { type: 'text', text: `g = ${gravity} m/s² (gravity)` },
          { type: 'text', text: `h = ${height} m (height)` },
          { type: 'text', text: '' },
          { type: 'text', text: `PE = ${mass} × ${gravity} × ${height}` },
          { type: 'highlight', text: `PE = ${PE.toFixed(2)} Joules` },
          { type: 'text', text: '' },
          { type: 'text', text: `At ${height} meters height, this object has ${PE.toFixed(1)} J of stored energy.` },
          { type: 'text', text: 'If dropped, this potential energy converts to kinetic energy (ignoring air resistance).' },
        ],
      });
      result = `${PE.toFixed(2)} J`;
      break;
    }

    case 'spring': {
      const springPE = 0.5 * springConstant * springCompression * springCompression;
      const force = springConstant * springCompression;
      steps.push({
        step: 'SPRING POTENTIAL ENERGY',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Elastic Potential Energy (Hooke\'s Law)' },
          { type: 'formula', text: 'PE_spring = ½kx²' },
          { type: 'formula', text: 'F = kx (Hooke\'s Law)' },
          { type: 'text', text: `k = ${springConstant} N/m (spring constant)` },
          { type: 'text', text: `x = ${springCompression} m (displacement)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Spring Force:' },
          { type: 'text', text: `F = ${springConstant} × ${springCompression} = ${force.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Stored Energy:' },
          { type: 'text', text: `PE = ½ × ${springConstant} × ${springCompression}²` },
          { type: 'text', text: `PE = ½ × ${springConstant} × ${springCompression * springCompression}` },
          { type: 'highlight', text: `PE = ${springPE.toFixed(2)} Joules` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔧 Stiffer springs (higher k) store more energy for the same displacement.' },
        ],
      });
      result = `${springPE.toFixed(2)} J (Force: ${force.toFixed(1)} N)`;
      break;
    }

    case 'conservation': {
      const KE = 0.5 * mass * velocity * velocity;
      const PE = mass * gravity * height;
      const totalEnergy = KE + PE;
      const maxHeight = velocity * velocity / (2 * gravity);
      
      steps.push({
        step: 'CONSERVATION OF ENERGY',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Conservation of Mechanical Energy' },
          { type: 'formula', text: 'E_total = KE + PE = constant' },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 Current State:' },
          { type: 'text', text: `Kinetic Energy = ½(${mass})(${velocity}²) = ${KE.toFixed(2)} J` },
          { type: 'text', text: `Potential Energy = ${mass} × ${gravity} × ${height} = ${PE.toFixed(2)} J` },
          { type: 'highlight', text: `Total Energy = ${totalEnergy.toFixed(2)} J` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔮 Predictions (if energy is conserved):' },
          { type: 'text', text: `Maximum possible height: ${maxHeight.toFixed(2)} m (when all KE converts to PE)` },
          { type: 'text', text: `Maximum possible velocity: ${Math.sqrt(2 * totalEnergy / mass).toFixed(2)} m/s (when all PE converts to KE)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 In a closed system (no friction/air resistance),' },
          { type: 'text', text: 'energy transforms between KE and PE but total remains constant.' },
        ],
      });
      result = `${totalEnergy.toFixed(2)} J total (KE: ${KE.toFixed(1)}, PE: ${PE.toFixed(1)})`;
      break;
    }
  }

  return { result, steps };
}