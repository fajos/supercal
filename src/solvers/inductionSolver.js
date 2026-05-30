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
      const powerPrimary = Vp * 10; // Assume 10A primary current
      const currentSecondary = (Vp * 10) / vsVal; // Power conservation

      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Ideal Transformer Analysis:' },
          { type: 'text', text: `• Primary Voltage (Vp): ${Vp} V` },
          { type: 'text', text: `• Primary Turns (Np): ${Np}` },
          { type: 'text', text: `• Secondary Turns (Ns): ${Ns}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'A transformer changes voltage by electromagnetic induction.' },
          { type: 'text', text: 'The voltage ratio equals the turns ratio (for ideal transformers).' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The Transformer Equation:' },
          { type: 'formula', text: 'Vs / Vp = Ns / Np' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• Vs = Secondary voltage (V)' },
          { type: 'text', text: '• Vp = Primary voltage (V)' },
          { type: 'text', text: '• Ns = Number of secondary turns' },
          { type: 'text', text: '• Np = Number of primary turns' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Rearranged to solve for Vs:' },
          { type: 'formula', text: 'Vs = Vp · (Ns / Np)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Power Conservation (ideal):' },
          { type: 'formula', text: 'Vp · Ip = Vs · Is' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate the Turns Ratio' },
          { type: 'text', text: `Turns Ratio = Ns / Np` },
          { type: 'text', text: `Turns Ratio = ${Ns} / ${Np}` },
          { type: 'result', text: `Turns Ratio = ${ratio.toFixed(4)}` },
          { type: 'text', text: ratio > 1 
            ? `This means the secondary has ${ratio.toFixed(1)}× more turns than the primary.`
            : ratio < 1
            ? `This means the secondary has ${(1/ratio).toFixed(1)}× fewer turns than the primary.`
            : 'The primary and secondary have equal turns.'
          },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Secondary Voltage' },
          { type: 'text', text: `Vs = Vp × Turns Ratio` },
          { type: 'text', text: `Vs = ${Vp} × ${ratio.toFixed(4)}` },
          { type: 'result', text: `Vs = ${vsVal.toFixed(2)} V` },
        ],
      });

      // 4. ANALYSIS
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ This is a ${type} transformer.` },
          { type: 'text', text: '' },
          { type: 'text', text: ratio > 1
            ? '📈 STEP-UP: Secondary voltage is HIGHER than primary.'
            : ratio < 1
            ? '📉 STEP-DOWN: Secondary voltage is LOWER than primary.'
            : '⚖️ ISOLATION: Voltage remains the same (safety isolation).'
          },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 VOLTAGE & CURRENT RELATIONSHIP:' },
          { type: 'text', text: `• Voltage changed by factor: ${ratio.toFixed(2)}×` },
          { type: 'text', text: `• Current changed by factor: ${(1/ratio).toFixed(2)}× (inverse)` },
          { type: 'text', text: `• If primary current = 10A, secondary current ≈ ${currentSecondary.toFixed(2)}A` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY PRINCIPLES:' },
          { type: 'text', text: '• Power is CONSERVED: Vp × Ip = Vs × Is (ideal transformer)' },
          { type: 'text', text: '• Step-up: Higher voltage, lower current' },
          { type: 'text', text: '• Step-down: Lower voltage, higher current' },
          { type: 'text', text: '• Real transformers have small losses (~95-99% efficient)' },
          { type: 'text', text: '' },
          { type: 'text', text: '🏠 REAL-WORLD APPLICATIONS:' },
          { type: 'text', text: '• Power grids: Step-up for transmission, step-down for homes' },
          { type: 'text', text: '• Phone chargers: Step-down 120V/240V to 5V' },
          { type: 'text', text: '• Microwave ovens: Step-up for magnetron (~4000V)' },
          { type: 'text', text: '• Isolation transformers: Safety in medical equipment' },
        ],
      });

      result = `${vsVal.toFixed(2)} V`;
      break;
    }

    case 'flux': {
      const flux = B * A;
      const fluxAtAngle = B * A * Math.cos(0); // perpendicular
      const fluxAt45 = B * A * Math.cos(Math.PI / 4);
      const fluxAt60 = B * A * Math.cos(Math.PI / 3);
      
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '🧲 Magnetic Flux Calculation:' },
          { type: 'text', text: `• Magnetic Field Strength (B): ${B} T` },
          { type: 'text', text: `• Surface Area of Loop (A): ${A} m²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Magnetic flux (Φ) measures the total magnetic field passing through a surface.' },
          { type: 'text', text: 'Assumption: Field is perpendicular to the surface (θ = 0°, maximum flux).' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Magnetic flux for a uniform field:' },
          { type: 'formula', text: 'Φ = B · A (perpendicular)' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• Φ (phi) = Magnetic flux (Wb)' },
          { type: 'text', text: '• B = Magnetic flux density (T or Wb/m²)' },
          { type: 'text', text: '• A = Area perpendicular to field (m²)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'General case (with angle θ to normal):' },
          { type: 'formula', text: 'Φ = B · A · cos(θ)' },
          { type: 'text', text: '1 Weber (Wb) = 1 Tesla × 1 m²' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Multiply magnetic field by area (perpendicular case)' },
          { type: 'text', text: `Φ = B × A` },
          { type: 'text', text: `Φ = ${B} T × ${A} m²` },
          { type: 'result', text: `Φ = ${flux.toExponential(4)} Wb` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Flux at different angles' },
          { type: 'text', text: `• θ = 0° (perpendicular): Φ = ${fluxAtAngle.toExponential(4)} Wb (maximum)` },
          { type: 'text', text: `• θ = 45°: Φ = ${fluxAt45.toExponential(4)} Wb (${(fluxAt45/flux*100).toFixed(1)}% of max)` },
          { type: 'text', text: `• θ = 60°: Φ = ${fluxAt60.toExponential(4)} Wb (${(fluxAt60/flux*100).toFixed(1)}% of max)` },
          { type: 'text', text: `• θ = 90° (parallel): Φ = 0 Wb (field parallel to surface)` },
        ],
      });

      // 4. ANALYSIS
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The magnetic flux through the loop is ${flux.toExponential(3)} Weber.` },
          { type: 'text', text: '' },
          { type: 'text', text: '🧲 PHYSICAL ANALOGY:' },
          { type: 'text', text: '• Flux = Number of magnetic field lines passing through the area' },
          { type: 'text', text: '• Like rain through a hoop: larger hoop or heavier rain = more flux' },
          { type: 'text', text: '• Tilting the hoop reduces the effective area (cos θ factor)' },
          { type: 'text', text: '' },
          { type: 'text', text: '⚡ KEY CONNECTION TO INDUCTION:' },
          { type: 'text', text: '• CONSTANT flux → NO induced voltage' },
          { type: 'text', text: '• CHANGING flux → Induced EMF (Faraday\'s Law)' },
          { type: 'text', text: '• Generators work by constantly changing flux through coils' },
          { type: 'text', text: '' },
          { type: 'text', text: '🔧 PRACTICAL APPLICATIONS:' },
          { type: 'text', text: '• MRI machines: Strong magnetic fields (1.5-7 T)' },
          { type: 'text', text: '• Generators: Rotating coils change flux to produce electricity' },
          { type: 'text', text: '• Transformers: Changing flux in core transfers energy between coils' },
          { type: 'text', text: '• Metal detectors: Detect changes in flux from metal objects' },
        ],
      });

      result = `${flux.toExponential(3)} Wb`;
      break;
    }

    case 'faraday': {
      const emf = -(phi / t);
      const absEmf = Math.abs(emf);
      
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Faraday\'s Law of Induction:' },
          { type: 'text', text: `• Change in Magnetic Flux (ΔΦ): ${phi} Wb` },
          { type: 'text', text: `• Time Duration (Δt): ${t} s` },
          { type: 'text', text: '• Number of loops (N): 1 (single loop)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'A changing magnetic flux induces an electromotive force (EMF).' },
          { type: 'text', text: 'This is the principle behind all electrical generators.' },
        ],
      });

      // 2. FORMULA
      const rateOfChange = phi / t;
      
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Faraday\'s Law of Induction:' },
          { type: 'formula', text: 'ε = −N · (ΔΦ / Δt)' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• ε = Induced EMF (V)' },
          { type: 'text', text: '• N = Number of turns in coil' },
          { type: 'text', text: '• ΔΦ = Change in magnetic flux (Wb)' },
          { type: 'text', text: '• Δt = Time interval (s)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'The NEGATIVE sign represents Lenz\'s Law:' },
          { type: 'text', text: 'The induced EMF opposes the change that created it.' },
        ],
      });

      // 3. CALCULATION
      const fluxChangeRate = phi / t;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate rate of flux change' },
          { type: 'text', text: `ΔΦ / Δt = ${phi} Wb / ${t} s` },
          { type: 'result', text: `Rate = ${fluxChangeRate.toExponential(4)} Wb/s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Apply Faraday\'s Law (N = 1)' },
          { type: 'text', text: `ε = −1 × ${fluxChangeRate.toExponential(4)}` },
          { type: 'result', text: `|ε| = ${absEmf.toFixed(3)} V` },
          { type: 'text', text: '' },
          { type: 'text', text: `The induced EMF is ${absEmf.toFixed(3)} Volts.` },
          { type: 'text', text: `The negative sign indicates direction (Lenz's Law).` },
        ],
      });

      // 4. ANALYSIS
      const tenLoopsEmf = Math.abs(10 * phi / t);
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ A flux change of ${phi} Wb in ${t}s induces ${absEmf.toFixed(3)} V.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 SCALING WITH TURNS:' },
          { type: 'text', text: `• Single loop (N=1): |ε| = ${absEmf.toFixed(3)} V` },
          { type: 'text', text: `• 10 loops (N=10): |ε| = ${tenLoopsEmf.toFixed(3)} V` },
          { type: 'text', text: `• 100 loops (N=100): |ε| = ${(100 * phi / t).toFixed(3)} V` },
          { type: 'text', text: '' },
          { type: 'text', text: '⚖️ LENZ\'S LAW EXPLAINED:' },
          { type: 'text', text: '• The induced current creates a magnetic field that OPPOSES the change' },
          { type: 'text', text: '• If flux INCREASES → induced field opposes (tries to decrease)' },
          { type: 'text', text: '• If flux DECREASES → induced field supports (tries to increase)' },
          { type: 'text', text: '• Nature RESISTS changes in magnetic flux!' },
          { type: 'text', text: '' },
          { type: 'text', text: '⚡ PRACTICAL APPLICATIONS:' },
          { type: 'text', text: '• Electric generators: Rotating coils change flux → produce AC electricity' },
          { type: 'text', text: '• Induction cooktops: Changing B-field induces currents in pots' },
          { type: 'text', text: '• Wireless charging: Changing flux transfers power without wires' },
          { type: 'text', text: '• Guitar pickups: String vibrations change flux → electrical signal' },
        ],
      });
      result = `${absEmf.toFixed(3)} V`;
      break;
    }
  }
  return { result, steps };
}