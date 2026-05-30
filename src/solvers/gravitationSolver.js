// src/solvers/gravitationSolver.js - Pedagogical gravitation tutor

export function solveGravitation(mode, params) {
  const { M, m, r } = params;
  const steps = [];
  let result;
  const G_const = 6.674e-11; // Universal Gravitational Constant

  switch (mode) {
    case 'force': {
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '🌌 Newton\'s Law of Universal Gravitation:' },
          { type: 'text', text: `• Mass 1 (M): ${M} kg` },
          { type: 'text', text: `• Mass 2 (m): ${m} kg` },
          { type: 'text', text: `• Distance between centers (r): ${r} m` },
          { type: 'text', text: `• Gravitational Constant (G): ${G_const.toExponential(3)} N·m²/kg²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Every mass in the universe attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them.' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Newton\'s Law of Universal Gravitation:' },
          { type: 'formula', text: 'F = G · M · m / r²' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• F = Gravitational force (N)' },
          { type: 'text', text: '• G = Universal gravitational constant' },
          { type: 'text', text: '• M, m = Masses of the two bodies (kg)' },
          { type: 'text', text: '• r = Distance between centers (m)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'This is an INVERSE-SQUARE LAW: F ∝ 1/r²' },
        ],
      });

      // 3. CALCULATION
      const massProduct = M * m;
      const rSquared = r * r;
      const force = (G_const * massProduct) / rSquared;
      
      // Comparison values
      const forceAtDoubleR = (G_const * massProduct) / (4 * rSquared);
      const forceAtHalfR = (G_const * massProduct) / (0.25 * rSquared);
      const earthForce = (G_const * 5.97e24 * m) / (6.371e6 * 6.371e6);

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate the product of the masses' },
          { type: 'text', text: `M × m = ${M} × ${m}` },
          { type: 'result', text: `M × m = ${massProduct.toExponential(3)} kg²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate the square of the distance' },
          { type: 'text', text: `r² = (${r} m)²` },
          { type: 'result', text: `r² = ${rSquared.toExponential(3)} m²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Apply Newton\'s Law of Gravitation' },
          { type: 'text', text: `F = G × (M × m) / r²` },
          { type: 'text', text: `F = (${G_const.toExponential(3)}) × (${massProduct.toExponential(3)}) / (${rSquared.toExponential(3)})` },
          { type: 'text', text: `F = ${(G_const * massProduct).toExponential(4)} / ${rSquared.toExponential(3)}` },
          { type: 'result', text: `F = ${force.toExponential(4)} N` },
        ],
      });

      // 4. ANALYSIS
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The gravitational attraction between the bodies is ${force.toExponential(2)} Newtons.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 INVERSE-SQUARE DEMONSTRATION:' },
          { type: 'text', text: `• At distance r = ${r}m: F = ${force.toExponential(3)} N` },
          { type: 'text', text: `• At distance 2r = ${(2*r).toExponential(3)}m: F = ${forceAtDoubleR.toExponential(3)} N (÷4)` },
          { type: 'text', text: `• At distance r/2 = ${(r/2).toExponential(3)}m: F = ${forceAtHalfR.toExponential(3)} N (×4)` },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 EARTH COMPARISON:' },
          { type: 'text', text: `• If m = ${m} kg were on Earth's surface: F ≈ ${earthForce.toExponential(3)} N` },
          { type: 'text', text: `• This gravitational force is ${(force/earthForce).toExponential(3)}× the weight on Earth` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY INSIGHTS:' },
          { type: 'text', text: '• MUTUAL: Both bodies feel the SAME force (Newton\'s 3rd Law)' },
          { type: 'text', text: '• UNIVERSAL: This law applies everywhere - from atoms to galaxies' },
          { type: 'text', text: '• WEAK: Gravity is the weakest fundamental force (G is tiny)' },
          { type: 'text', text: '• INFINITE RANGE: Gravity never becomes zero, just extremely small' },
        ],
      });
      result = `${force.toExponential(3)} N`;
      break;
    }

    case 'field': {
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '🌍 Gravitational Field Strength:' },
          { type: 'text', text: `• Source Mass (M): ${M} kg` },
          { type: 'text', text: `• Distance from center (r): ${r} m` },
          { type: 'text', text: `• Gravitational Constant (G): ${G_const.toExponential(3)} N·m²/kg²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Gravitational field strength (g) is the force per unit mass experienced by a test mass at that point.' },
          { type: 'text', text: 'It equals the acceleration due to gravity at that location.' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Gravitational field strength at distance r from a point mass M:' },
          { type: 'formula', text: 'g = G · M / r²' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• g = Gravitational field strength (N/kg or m/s²)' },
          { type: 'text', text: '• G = Universal gravitational constant' },
          { type: 'text', text: '• M = Mass of source body (kg)' },
          { type: 'text', text: '• r = Distance from center (m)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Also called "acceleration due to gravity" at that location.' },
        ],
      });

      // 3. CALCULATION
      const rSquaredField = r * r;
      const field = (G_const * M) / rSquaredField;
      
      // Earth and other celestial comparisons
      const earthG = 9.81;
      const earthR = 6.371e6;
      const earthM = 5.97e24;
      const fieldAtEarthSurface = (G_const * earthM) / (earthR * earthR);
      const moonG = 1.62;
      const sunG = 274;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate the square of the distance' },
          { type: 'text', text: `r² = (${r} m)²` },
          { type: 'result', text: `r² = ${rSquaredField.toExponential(3)} m²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate M/r² (mass per unit area)' },
          { type: 'text', text: `M / r² = ${M} / ${rSquaredField.toExponential(3)}` },
          { type: 'result', text: `M/r² = ${(M / rSquaredField).toExponential(3)} kg/m²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Multiply by G to find field strength' },
          { type: 'text', text: `g = G × (M/r²)` },
          { type: 'text', text: `g = ${G_const.toExponential(3)} × ${(M / rSquaredField).toExponential(3)}` },
          { type: 'result', text: `g = ${field.toExponential(4)} m/s²` },
        ],
      });

      // 4. ANALYSIS
      const gForce = field / 9.81;
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The gravitational field strength is ${field.toExponential(3)} m/s².` },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 CELESTIAL COMPARISONS:' },
          { type: 'text', text: `• This location: g = ${field.toExponential(2)} m/s²` },
          { type: 'text', text: `• Earth's surface: g = 9.81 m/s²` },
          { type: 'text', text: `• Moon's surface: g = 1.62 m/s²` },
          { type: 'text', text: `• Sun's surface: g = 274 m/s²` },
          { type: 'text', text: `• This is ${gForce.toExponential(2)}× Earth's gravity (${(gForce*100).toFixed(2)}% of g)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 PRACTICAL IMPLICATIONS:' },
          { type: 'text', text: `• A ${70} kg person would weigh ${(70 * field).toFixed(2)} N here` },
          { type: 'text', text: `• Objects fall with acceleration = ${field.toExponential(2)} m/s²` },
          { type: 'text', text: `• Escape velocity = √(2·g·r) = ${Math.sqrt(2 * field * r).toExponential(3)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔭 ASTRONOMY TIP: By measuring g at different distances, astronomers can calculate the mass of planets, stars, and even galaxies!' },
        ],
      });
      result = `${field.toExponential(3)} m/s²`;
      break;
    }
  }
  return { result, steps };
}