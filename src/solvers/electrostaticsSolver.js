// src/solvers/electrostaticsSolver.js - Pedagogical electrostatics tutor

export function solveElectrostatics(mode, params) {
  const { q1, q2, r, F, q } = params;
  const steps = [];
  let result;
  const k = 8.99e9; // Coulomb's constant

  switch (mode) {
    case 'coulomb': {
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Coulomb\'s Law Analysis:' },
          { type: 'text', text: `• Charge 1 (q₁): ${q1} C` },
          { type: 'text', text: `• Charge 2 (q₂): ${q2} C` },
          { type: 'text', text: `• Separation Distance (r): ${r} m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Coulomb\'s Law describes the electrostatic force between two stationary point charges.' },
          { type: 'text', text: 'The force can be attractive (opposite charges) or repulsive (same charges).' },
        ],
      });

      // 2. FORMULA
      const rSquared = r * r;
      const productCharges = Math.abs(q1 * q2);
      
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Coulomb\'s Law for the magnitude of electrostatic force:' },
          { type: 'formula', text: 'F = k · |q₁ · q₂| / r²' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• F = Electrostatic force (N)' },
          { type: 'text', text: '• k = Coulomb constant = 8.99 × 10⁹ N·m²/C²' },
          { type: 'text', text: '• q₁, q₂ = Point charges (C)' },
          { type: 'text', text: '• r = Distance between charges (m)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Direction: Like charges repel (+/+) or (−/−), unlike charges attract (+/−).' },
        ],
      });

      // 3. CALCULATION
      const force = (k * productCharges) / rSquared;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate |q₁ × q₂|' },
          { type: 'text', text: `|q₁ × q₂| = |${q1} × ${q2}|` },
          { type: 'text', text: `|q₁ × q₂| = ${productCharges.toExponential(3)} C²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate r²' },
          { type: 'text', text: `r² = (${r} m)² = ${rSquared.toFixed(4)} m²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Apply Coulomb\'s Law' },
          { type: 'text', text: `F = k × |q₁q₂| / r²` },
          { type: 'text', text: `F = (${k.toExponential(2)}) × (${productCharges.toExponential(3)}) / ${rSquared.toFixed(4)}` },
          { type: 'text', text: `F = ${(k * productCharges).toExponential(4)} / ${rSquared.toFixed(4)}` },
          { type: 'result', text: `F = ${force.toExponential(4)} N` },
        ],
      });

      // 4. ANALYSIS
      const forceAtDoubleDistance = (k * productCharges) / (4 * rSquared);
      const forceAtHalfDistance = (k * productCharges) / (0.25 * rSquared);
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: q1 * q2 > 0
            ? '⚠️ REPULSIVE FORCE: Both charges have the same sign, they push away from each other.'
            : '🧲 ATTRACTIVE FORCE: Charges have opposite signs, they pull toward each other.'
          },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 INVERSE-SQUARE LAW DEMONSTRATION:' },
          { type: 'text', text: `• At distance r = ${r}m: F = ${force.toExponential(3)} N` },
          { type: 'text', text: `• At distance 2r = ${(2*r).toFixed(2)}m: F = ${forceAtDoubleDistance.toExponential(3)} N (÷4)` },
          { type: 'text', text: `• At distance r/2 = ${(r/2).toFixed(2)}m: F = ${forceAtHalfDistance.toExponential(3)} N (×4)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY PRINCIPLES:' },
          { type: 'text', text: '• Force follows an inverse-square law: F ∝ 1/r²' },
          { type: 'text', text: '• Doubling distance → Force becomes 1/4 as strong' },
          { type: 'text', text: '• Halving distance → Force becomes 4× stronger' },
          { type: 'text', text: '• Similar to gravitational force (both are inverse-square)' },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 REAL-WORLD APPLICATIONS:' },
          { type: 'text', text: '• Laser printers use electrostatic attraction to place toner' },
          { type: 'text', text: '• Photocopiers use static electricity to attract ink particles' },
          { type: 'text', text: '• Electrostatic precipitators remove particles from industrial exhaust' },
        ],
      });
      result = `${force.toExponential(3)} N`;
      break;
    }

    case 'efield': {
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Electric Field Strength Analysis:' },
          { type: 'text', text: `• Force on test charge (F): ${F} N` },
          { type: 'text', text: `• Test Charge (q): ${q} C` },
          { type: 'text', text: '' },
          { type: 'text', text: 'An electric field exists in the space around charged objects.' },
          { type: 'text', text: 'It exerts a force on any other charge placed within the field.' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Electric Field Strength (E) is the force per unit charge:' },
          { type: 'formula', text: 'E = F / q' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• E = Electric field strength (N/C or V/m)' },
          { type: 'text', text: '• F = Force on test charge (N)' },
          { type: 'text', text: '• q = Test charge magnitude (C)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Alternative formulas:' },
          { type: 'formula', text: 'E = k · Q / r²  (field from point charge Q)' },
          { type: 'formula', text: 'F = q · E  (force on charge in field)' },
        ],
      });

      // 3. CALCULATION
      const field = F / q;
      const forceAtDoubleField = 2 * field * q;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Apply the electric field formula' },
          { type: 'text', text: `E = F / q` },
          { type: 'text', text: `E = ${F} N / ${q} C` },
          { type: 'text', text: `E = ${field.toFixed(4)}...` },
          { type: 'result', text: `E = ${field.toExponential(4)} N/C` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Verify using alternative formula F = qE' },
          { type: 'text', text: `F_check = q × E = ${q} × ${field.toExponential(4)}` },
          { type: 'text', text: `F_check = ${(q * field).toExponential(4)} ≈ ${F} ✓` },
        ],
      });

      // 4. ANALYSIS
      const electronForce = field * 1.602e-19;
      const protonForce = field * 1.602e-19;
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The electric field strength at this point is ${field.toExponential(2)} N/C.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 FIELD EFFECTS ON FUNDAMENTAL CHARGES:' },
          { type: 'text', text: `• Force on an electron (e = 1.602×10⁻¹⁹ C): F = ${Math.abs(electronForce).toExponential(3)} N` },
          { type: 'text', text: `• Force on a proton (e = 1.602×10⁻¹⁹ C): F = ${Math.abs(protonForce).toExponential(3)} N` },
          { type: 'text', text: `• If field strength doubled: F = ${Math.abs(forceAtDoubleField).toExponential(3)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY CONCEPTS:' },
          { type: 'text', text: '• Electric field is a VECTOR - it has both magnitude and direction' },
          { type: 'text', text: '• Field lines point away from positive charges, toward negative charges' },
          { type: 'text', text: '• The field exists even without a test charge present' },
          { type: 'text', text: '• Stronger field = closer field lines on diagrams' },
          { type: 'text', text: '' },
          { type: 'text', text: '⚡ PRACTICAL APPLICATIONS:' },
          { type: 'text', text: '• Lightning rods use high E-fields to safely discharge storms' },
          { type: 'text', text: '• Capacitors store energy in electric fields between plates' },
          { type: 'text', text: '• CRT monitors use E-fields to steer electron beams' },
          { type: 'text', text: '• Touchscreens detect changes in E-field from your finger' },
        ],
      });
      result = `${field.toExponential(3)} N/C`;
      break;
    }
  }
  return { result, steps };
}