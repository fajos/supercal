// src/solvers/gravitationSolver.js - Pedagogical gravitation tutor

export function solveGravitation(mode, params) {
  const { M, m, r } = params;
  const steps = [];
  let result;
  const G_const = 6.674e-11; // Universal Gravitational Constant

  switch (mode) {
    case 'force':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the two masses and the distance between their centers:' },
          { type: 'text', text: `• Mass 1 (M): ${M} kg` },
          { type: 'text', text: `• Mass 2 (m): ${m} kg` },
          { type: 'text', text: `• Distance (r): ${r} m` },
          { type: 'text', text: `• Gravitational Constant (G): ${G_const.toExponential(3)} N·m²/kg²` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Newton\'s Law of Universal Gravitation states that every mass attracts every other mass:' },
          { type: 'highlight', text: 'F = G · M · m / r²' },
        ],
      });

      // 3. CALCULATION
      const force = (G_const * M * m) / (r * r);
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Mass Product: ${M} × ${m} = ${(M * m).toExponential(3)}` },
          { type: 'text', text: `2. Square of Distance: ${r}² = ${(r * r).toExponential(3)}` },
          { type: 'text', text: `3. Force: (${G_const.toExponential(3)} × ${(M * m).toExponential(3)}) / ${(r * r).toExponential(3)}` },
          { type: 'highlight', text: `F = ${force.toExponential(4)} N` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The gravitational attraction between the two bodies is ${force.toExponential(2)} Newtons.` },
          { type: 'text', text: '' },
          { type: 'text', text: '🌌 COSMIC INSIGHTS:' },
          { type: 'text', text: '• MUTUAL ATTRACTION: This force is felt equally by BOTH bodies, regardless of their size (Newton\'s Third Law).' },
          { type: 'text', text: '• INVERSE SQUARE LAW: Gravity weakens rapidly with distance. If you double the distance, the pull is only 1/4 as strong.' },
          { type: 'text', text: '• WHY IT FEELS WEAK: G is a very tiny number, which is why we only feel gravity from massive bodies like planets.' },
        ],
      });
      result = `${force.toExponential(3)} N`;
      break;

    case 'field':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the source mass and the distance from its center:' },
          { type: 'text', text: `• Source Mass (M): ${M} kg` },
          { type: 'text', text: `• Distance (r): ${r} m` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The gravitational field strength (g) is the acceleration an object would feel at that distance:' },
          { type: 'highlight', text: 'g = G · M / r²' },
        ],
      });

      // 3. CALCULATION
      const field = (G_const * M) / (r * r);
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `g = (${G_const.toExponential(3)} × ${M}) / ${r}²` },
          { type: 'highlight', text: `g = ${field.toExponential(4)} m/s²` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `At this location, the gravitational field strength is ${field.toExponential(3)} m/s².` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 PLANETARY SCALE:' },
          { type: 'text', text: `• Earth's Surface: g ≈ 9.81 m/s².` },
          { type: 'text', text: `• Moon's Surface: g ≈ 1.62 m/s².` },
          { type: 'text', text: 'This value also represents the "acceleration due to gravity". Any object dropped at this location will gain speed at this rate.' },
        ],
      });
      result = `${field.toExponential(3)} m/s²`;
      break;
  }
  return { result, steps };
}
