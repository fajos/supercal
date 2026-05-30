export function solveMagnetic(mode, params) {
  const { charge, velocity, field, length, current, angle = 90 } = params;
  const steps = [];
  let result;

  const angleRad = (angle * Math.PI) / 180;

  switch (mode) {
    case 'chargeForce': {
      // F = qvB sin(θ)
      const sinTheta = Math.sin(angleRad);
      const cosTheta = Math.cos(angleRad);
      const force = charge * velocity * field * sinTheta;
      const perpendicularComponent = force;
      const parallelComponent = charge * velocity * field * cosTheta;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Magnetic Force on a Moving Charge (Lorentz Force):' },
          { type: 'text', text: `• Magnitude of Charge (q): ${charge} C` },
          { type: 'text', text: `• Particle Velocity (v): ${velocity} m/s` },
          { type: 'text', text: `• External Magnetic Field (B): ${field} T` },
          { type: 'text', text: `• Angle between v and B (θ): ${angle}°` },
          { type: 'text', text: '' },
          { type: 'text', text: 'A magnetic field exerts a force on moving charged particles.' },
          { type: 'text', text: 'The force is perpendicular to both the velocity and the magnetic field.' },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The magnetic force (Lorentz Force) on a point charge in motion:' },
          { type: 'formula', text: 'F = q · v · B · sin(θ)' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• F = magnetic force (N)' },
          { type: 'text', text: '• q = charge (C)' },
          { type: 'text', text: '• v = velocity (m/s)' },
          { type: 'text', text: '• B = magnetic field strength (T)' },
          { type: 'text', text: '• θ = angle between v and B' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Special Cases:' },
          { type: 'text', text: '• θ = 90° (v ⊥ B): Maximum force, sin(90°) = 1' },
          { type: 'text', text: '• θ = 0° (v ∥ B): Zero force, sin(0°) = 0' },
          { type: 'text', text: '• θ = 180° (v anti-parallel to B): Zero force' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate sin(θ) and cos(θ)' },
          { type: 'text', text: `sin(${angle}°) = ${sinTheta.toFixed(4)}` },
          { type: 'text', text: `cos(${angle}°) = ${cosTheta.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate the maximum possible force (if θ = 90°)' },
          { type: 'text', text: `F_max = q × v × B = ${charge} × ${velocity} × ${field}` },
          { type: 'text', text: `F_max = ${(charge * velocity * field).toExponential(3)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Apply the angle factor sin(θ)' },
          { type: 'text', text: `F = F_max × sin(${angle}°)` },
          { type: 'text', text: `F = ${(charge * velocity * field).toExponential(3)} × ${sinTheta.toFixed(4)}` },
          { type: 'result', text: `F = ${force.toExponential(3)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: `The force is ${(sinTheta * 100).toFixed(1)}% of the maximum possible force.` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The charge experiences a force of ${force.toExponential(3)} Newtons.` },
          { type: 'text', text: '' },
          { type: 'text', text: '🧭 DIRECTION (Right-Hand Rule for positive charge):' },
          { type: 'text', text: '1. Point fingers in direction of velocity (v)' },
          { type: 'text', text: '2. Curl fingers toward magnetic field (B)' },
          { type: 'text', text: '3. Thumb points in direction of force (F)' },
          { type: 'text', text: '⚠️ For NEGATIVE charges, reverse the force direction!' },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 APPLICATIONS:' },
          { type: 'text', text: '• CRT TVs: Magnetic fields steer electron beams to create images' },
          { type: 'text', text: '• Mass Spectrometers: Separate ions by mass using magnetic deflection' },
          { type: 'text', text: '• Aurora Borealis: Solar wind particles spiral along Earth\'s magnetic field' },
          { type: 'text', text: '• Cyclotrons: Magnetic fields keep particles in circular paths for acceleration' },
        ],
      });
      result = `${force.toExponential(3)} N`;
      break;
    }

    case 'wireForce': {
      // F = BIL sin(θ)
      const sinTheta = Math.sin(angleRad);
      const force = field * current * length * sinTheta;
      const maxForce = field * current * length;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Magnetic Force on a Current-Carrying Wire:' },
          { type: 'text', text: `• Magnetic Flux Density (B): ${field} T` },
          { type: 'text', text: `• Electric Current (I): ${current} A` },
          { type: 'text', text: `• Length of Wire in Field (L): ${length} m` },
          { type: 'text', text: `• Angle between wire and field (θ): ${angle}°` },
          { type: 'text', text: '' },
          { type: 'text', text: 'When current flows through a wire in a magnetic field, a force acts on the wire.' },
          { type: 'text', text: 'This is the principle behind electric motors and loudspeakers.' },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The force on a straight conductor carrying current in a uniform magnetic field:' },
          { type: 'formula', text: 'F = B · I · L · sin(θ)' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• F = force on wire (N)' },
          { type: 'text', text: '• B = magnetic flux density (T)' },
          { type: 'text', text: '• I = current (A)' },
          { type: 'text', text: '• L = length of wire in field (m)' },
          { type: 'text', text: '• θ = angle between wire and magnetic field' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Also known as the "BIL" formula: F = BIL (when θ = 90°)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate sin(θ)' },
          { type: 'text', text: `sin(${angle}°) = ${sinTheta.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate the maximum force (θ = 90°)' },
          { type: 'text', text: `F_max = B × I × L = ${field} × ${current} × ${length}` },
          { type: 'text', text: `F_max = ${maxForce.toFixed(4)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Apply the angle factor sin(θ)' },
          { type: 'text', text: `F = F_max × sin(${angle}°)` },
          { type: 'text', text: `F = ${maxForce.toFixed(4)} × ${sinTheta.toFixed(4)}` },
          { type: 'result', text: `F = ${force.toFixed(4)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: `The force is ${(sinTheta * 100).toFixed(1)}% of maximum (when θ = 90°).` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The magnetic field exerts a force of ${force.toFixed(4)} Newtons on the wire.` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔍 FORCE ANALYSIS:' },
          angle === 90 
            ? { type: 'text', text: '• Maximum force: Wire is perpendicular to field (optimal orientation)' }
            : angle === 0 
              ? { type: 'text', text: '• Zero force: Wire is parallel to field (no interaction)' }
              : { type: 'text', text: `• Partial force: Wire at ${angle}° to field (${(sinTheta * 100).toFixed(1)}% of maximum)` },
          { type: 'text', text: '' },
          { type: 'text', text: '🧭 DIRECTION (Fleming\'s Left-Hand Rule):' },
          { type: 'text', text: '• ThuMb: Motion/Force (F)' },
          { type: 'text', text: '• First Finger: Field (B) - North to South' },
          { type: 'text', text: '• SeCond Finger: Current (I) - positive to negative' },
          { type: 'text', text: '' },
          { type: 'text', text: '⚡ PRACTICAL APPLICATIONS:' },
          { type: 'text', text: '• Electric Motors: Force on current-carrying coils creates rotation' },
          { type: 'text', text: '• Loudspeakers: Varying current in coil creates vibrations in magnetic field' },
          { type: 'text', text: '• Railguns: Extreme currents create massive forces to launch projectiles' },
          { type: 'text', text: '• MHD Generators: Moving conductive fluid through magnetic field generates electricity' },
        ],
      });
      result = `${force.toFixed(4)} N`;
      break;
    }
  }

  return { result, steps };
}