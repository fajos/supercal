// src/solvers/quantumSolver.js - Pedagogical quantum physics tutor

export function solveQuantum(mode, params) {
  const { f, lambda, mass, v } = params;
  const steps = [];
  let result;
  const h = 6.626e-34; // Planck's constant
  const c = 3e8; // Speed of light

  switch (mode) {
    case 'photon_e':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the properties of the photon:' },
          { type: 'text', text: `• Frequency (f): ${f} Hz` },
          { type: 'text', text: `• Planck's Constant (h): ${h.toExponential(3)} J·s` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The energy of a single photon is directly proportional to its frequency (Planck-Einstein Relation):' },
          { type: 'highlight', text: 'E = h · f' },
        ],
      });

      // 3. CALCULATION
      const energy = h * f;
      const energyEV = energy / 1.602e-19;
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `E = (${h.toExponential(3)}) × (${f})` },
          { type: 'highlight', text: `E = ${energy.toExponential(4)} Joules` },
          { type: 'text', text: 'Converting to electron-volts (1 eV = 1.602 × 10⁻¹⁹ J):' },
          { type: 'highlight', text: `E ≈ ${energyEV.toFixed(4)} eV` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `This photon carries ${energyEV.toFixed(2)} eV of energy.` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 QUANTUM INSIGHT: Energy is quantized! Light is not just a continuous wave but a stream of discrete "packets" called photons. Higher frequency means each individual packet packs more punch (energy).' },
        ],
      });
      result = `${energy.toExponential(3)} J (${energyEV.toFixed(2)} eV)`;
      break;

    case 'de_broglie':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the particle\'s mass and velocity:' },
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Velocity (v): ${v} m/s` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The de Broglie hypothesis states that matter has wave-like properties:' },
          { type: 'highlight', text: 'λ = h / p = h / (m · v)' },
        ],
      });

      // 3. CALCULATION
      const momentum = mass * v;
      const wavelength = h / momentum;
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Momentum (p) = ${mass} × ${v} = ${momentum.toExponential(3)} kg·m/s` },
          { type: 'text', text: `2. Wavelength (λ) = ${h.toExponential(3)} / ${momentum.toExponential(3)}` },
          { type: 'highlight', text: `λ = ${wavelength.toExponential(4)} meters` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The particle has a de Broglie wavelength of ${wavelength.toExponential(2)} meters.` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 WAVE-PARTICLE DUALITY: Everything in the universe exhibits both wave and particle properties. For large objects (like humans), the wavelength is so small it is undetectable. For subatomic particles like electrons, this "waviness" is fundamental to their behavior in atoms.' },
        ],
      });
      result = `${wavelength.toExponential(3)} m`;
      break;
  }
  return { result, steps };
}
