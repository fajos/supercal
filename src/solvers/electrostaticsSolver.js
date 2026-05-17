// src/solvers/electrostaticsSolver.js - Pedagogical electrostatics tutor

export function solveElectrostatics(mode, params) {
  const { q1, q2, r, F, q } = params;
  const steps = [];
  let result;
  const k = 8.99e9; // Coulomb's constant

  switch (mode) {
    case 'coulomb':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the magnitude of the two charges and the distance separating them:' },
          { type: 'text', text: `• Charge 1 (q₁): ${q1} C` },
          { type: 'text', text: `• Charge 2 (q₂): ${q2} C` },
          { type: 'text', text: `• Distance (r): ${r} m` },
          { type: 'text', text: `• Coulomb Constant (k): ${k.toExponential(2)} N·m²/C²` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Coulomb\'s Law describes the electrostatic force between two stationary point charges:' },
          { type: 'highlight', text: 'F = k · |q₁ · q₂| / r²' },
        ],
      });

      // 3. CALCULATION
      const force = (k * Math.abs(q1 * q2)) / (r * r);
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Product of charges: |${q1} × ${q2}| = ${Math.abs(q1 * q2).toExponential(3)}` },
          { type: 'text', text: `2. Square of distance: ${r}² = ${(r * r).toFixed(4)}` },
          { type: 'text', text: `3. Force: (${k.toExponential(2)} × ${Math.abs(q1 * q2).toExponential(3)}) / ${(r * r).toFixed(4)}` },
          { type: 'highlight', text: `F = ${force.toExponential(4)} N` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The electrostatic force between the charges is ${force.toExponential(2)} Newtons.` },
          { type: 'text', text: q1 * q2 > 0
            ? '⚠️ REPULSIVE FORCE: Since both charges have the same sign, they push away from each other.'
            : '🧲 ATTRACTIVE FORCE: Since the charges have opposite signs, they pull toward each other.'
          },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY PRINCIPLE: The force follows an "inverse-square law." If you double the distance between the charges, the force becomes four times weaker (1/2² = 1/4).' },
        ],
      });
      result = `${force.toExponential(3)} N`;
      break;

    case 'efield':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the force experienced by a test charge in the electric field:' },
          { type: 'text', text: `• Force (F): ${F} N` },
          { type: 'text', text: `• Test Charge (q): ${q} C` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The Electric Field Strength (E) at a point is the force per unit charge:' },
          { type: 'highlight', text: 'E = F / q' },
        ],
      });

      // 3. CALCULATION
      const field = F / q;
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `E = ${F} N / ${q} C` },
          { type: 'highlight', text: `E = ${field.toExponential(4)} N/C` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The electric field strength at this point is ${field.toExponential(2)} Newtons per Coulomb (N/C).` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 CONCEPT: An electric field is like a "map" that tells any charge how much force it will feel if placed there. By convention, the direction of the field is the direction a POSITIVE charge would move.' },
        ],
      });
      result = `${field.toExponential(3)} N/C`;
      break;
  }
  return { result, steps };
}
