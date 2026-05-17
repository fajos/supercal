// src/solvers/inductionSolver.js - Pedagogical induction tutor

export function solveInduction(mode, params) {
  const { Vp, Np, Ns, B, A, t, phi } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'transformer_v': {
      const vsVal = Vp * (Ns / Np);
      const ratio = Ns / Np;
      const type = ratio > 1 ? 'Step-Up' : ratio < 1 ? 'Step-Down' : 'Isolation';

      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We are analyzing a transformer with the following parameters:' },
          { type: 'text', text: `• Primary Voltage (Vp): ${Vp} V` },
          { type: 'text', text: `• Primary Turns (Np): ${Np}` },
          { type: 'text', text: `• Secondary Turns (Ns): ${Ns}` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The relationship between voltage and turn count is governed by Faraday\'s Law of Induction:' },
          { type: 'highlight', text: 'Vs / Vp = Ns / Np' },
          { type: 'text', text: 'Solving for Secondary Voltage (Vs):' },
          { type: 'highlight', text: 'Vs = Vp · (Ns / Np)' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Turns Ratio: ${Ns} / ${Np} = ${ratio.toFixed(4)}` },
          { type: 'text', text: `2. Secondary Voltage: ${Vp} × ${ratio.toFixed(4)}` },
          { type: 'highlight', text: `Vs = ${vsVal.toFixed(2)} V` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `This is a **${type}** transformer.` },
          { type: 'text', text: ratio > 1
            ? 'Since the secondary has more turns than the primary, the voltage is increased (stepped up).'
            : ratio < 1
            ? 'Since the secondary has fewer turns than the primary, the voltage is decreased (stepped down).'
            : 'The number of turns is equal, meaning the voltage remains the same (often used for safety isolation).'
          },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 POWER CONSERVATION: In an ideal transformer, power (P = V · I) is conserved. This means if the voltage is doubled (Step-Up), the current is halved! You don\'t get "free" energy.' },
        ],
      });

      result = `${vsVal.toFixed(2)} V`;
      break;
    }

    case 'flux': {
      const flux = B * A;
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'To find the magnetic flux (Φ), we look at the field strength and the loop geometry:' },
          { type: 'text', text: `• Magnetic Field Strength (B): ${B} T` },
          { type: 'text', text: `• Surface Area (A): ${A} m²` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Magnetic flux represents the total magnetic field "piercing" a given area:' },
          { type: 'highlight', text: 'Φ = B · A · cos(θ)' },
          { type: 'text', text: '(We assume θ = 0° for maximum flux perpendicular to the surface)' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `Φ = ${B} T × ${A} m²` },
          { type: 'highlight', text: `Φ = ${flux.toExponential(4)} Weber (Wb)` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The calculated flux is ${flux.toExponential(3)} Weber (Wb).` },
          { type: 'text', text: '' },
          { type: 'text', text: '🧲 PHYSICAL ANALOGY: Magnetic flux is like the amount of rain falling through a hoop. If the hoop is larger (Area) or the rain is heavier (Field), more flux passes through.' },
          { type: 'text', text: '💡 IMPORTANT: A constant flux induces NO voltage. Only a *changing* flux (ΔΦ) creates electricity!' },
        ],
      });

      result = `${flux.toExponential(3)} Wb`;
      break;
    }

    case 'faraday': {
      const emf = - (phi / t);
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the change in magnetic flux over a specific time interval:' },
          { type: 'text', text: `• Change in Flux (ΔΦ): ${phi} Wb` },
          { type: 'text', text: `• Time Duration (Δt): ${t} s` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Faraday\'s Law states that a changing magnetic flux induces an electromotive force (EMF):' },
          { type: 'highlight', text: 'ε = -N · (ΔΦ / Δt)' },
          { type: 'text', text: '(Calculating for N = 1 turn; the negative sign indicates Lenz\'s Law)' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `ε = -(${phi} / ${t})` },
          { type: 'highlight', text: `|ε| = ${Math.abs(emf).toFixed(3)} Volts` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The rapid change in flux induces a potential difference of ${Math.abs(emf).toFixed(3)} Volts.` },
          { type: 'text', text: '' },
          { type: 'text', text: '⚖️ LENZ\'S LAW: The negative sign is crucial. It means the induced current will create its OWN magnetic field that tries to CANCEL OUT the change you just made. Nature resists changes in magnetic flux!' },
        ],
      });
      result = `${Math.abs(emf).toFixed(3)} V`;
      break;
    }
  }
  return { result, steps };
}
