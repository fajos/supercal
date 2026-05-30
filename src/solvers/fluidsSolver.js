// src/solvers/fluidsSolver.js - Pedagogical fluids tutor

export function solveFluids(mode, params) {
  const { F, A, rho, h } = params;
  const steps = [];
  let result;
  const G = 9.81; // standard gravity

  switch (mode) {
    case 'pressure_solid': {
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Pressure on a Solid Surface:' },
          { type: 'text', text: `• Total Normal Force (F): ${F} N` },
          { type: 'text', text: `• Contact Surface Area (A): ${A} m²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Pressure measures how concentrated a force is over a given area.' },
          { type: 'text', text: 'Same force on smaller area = higher pressure.' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Pressure (P) is defined as force per unit area:' },
          { type: 'formula', text: 'P = F / A' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• P = Pressure (Pa or N/m²)' },
          { type: 'text', text: '• F = Force normal to surface (N)' },
          { type: 'text', text: '• A = Surface area (m²)' },
          { type: 'text', text: '' },
          { type: 'text', text: '1 Pascal (Pa) = 1 Newton per square meter (N/m²)' },
        ],
      });

      // 3. CALCULATION
      const pressureS = F / A;
      const sameForceHalfArea = F / (A / 2);
      const sameForceDoubleArea = F / (A * 2);
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Substitute the given values' },
          { type: 'text', text: `P = F / A` },
          { type: 'text', text: `P = ${F} N / ${A} m²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Perform the division' },
          { type: 'text', text: `P = ${pressureS.toFixed(4)}...` },
          { type: 'result', text: `P = ${pressureS.toFixed(2)} Pa` },
        ],
      });

      // 4. ANALYSIS
      const atmEquivalent = pressureS / 101325;
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The surface experiences a pressure of ${pressureS.toFixed(2)} Pascals.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 PRESSURE COMPARISON:' },
          { type: 'text', text: `• ${pressureS.toFixed(2)} Pa = ${(pressureS/1000).toFixed(4)} kPa` },
          { type: 'text', text: `• Equivalent to ${atmEquivalent.toFixed(6)} atmospheres (1 atm = 101,325 Pa)` },
          { type: 'text', text: '' },
          { type: 'text', text: '📐 AREA-PRESSURE RELATIONSHIP:' },
          { type: 'text', text: `• Same force on half the area: P = ${sameForceHalfArea.toFixed(2)} Pa (pressure doubles)` },
          { type: 'text', text: `• Same force on double the area: P = ${sameForceDoubleArea.toFixed(2)} Pa (pressure halves)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 REAL-WORLD APPLICATIONS:' },
          { type: 'text', text: '• Snowshoes: Large area reduces pressure to prevent sinking' },
          { type: 'text', text: '• Sharp knives: Small area creates high pressure for cutting' },
          { type: 'text', text: '• Drawing pins: Force concentrated on tiny point for easy penetration' },
          { type: 'text', text: '• Tank tracks: Distribute weight over large area for soft ground' },
        ],
      });
      result = `${pressureS.toFixed(2)} Pa`;
      break;
    }

    case 'pressure_liquid': {
      // 1. GIVEN
      const pressureGradient = rho * G;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Hydrostatic Pressure (Liquid):' },
          { type: 'text', text: `• Fluid Density (ρ): ${rho} kg/m³` },
          { type: 'text', text: `• Depth below surface (h): ${h} m` },
          { type: 'text', text: `• Gravity (g): ${G} m/s²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Hydrostatic pressure is caused by the weight of the fluid column above.' },
          { type: 'text', text: 'It increases linearly with depth - the deeper you go, the more fluid is above you.' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Hydrostatic pressure at depth h in a fluid of density ρ:' },
          { type: 'formula', text: 'P = ρ · g · h' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• P = Hydrostatic pressure (Pa)' },
          { type: 'text', text: '• ρ (rho) = Fluid density (kg/m³)' },
          { type: 'text', text: '• g = Gravitational acceleration (9.81 m/s²)' },
          { type: 'text', text: '• h = Depth below surface (m)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'This gives GAUGE pressure (excludes atmospheric pressure).' },
          { type: 'formula', text: 'P_absolute = P_gauge + P_atmospheric' },
        ],
      });

      // 3. CALCULATION
      const pressureL = rho * G * h;
      const absolutePressure = pressureL + 101325;
      const pressureAtDoubleDepth = rho * G * (h * 2);
      const pressureAtHalfDepth = rho * G * (h / 2);
      
      // Common fluid densities for comparison
      const waterDensity = 1000;
      const mercuryDensity = 13593;
      const pressureWater = waterDensity * G * h;
      const pressureMercury = mercuryDensity * G * h;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate pressure gradient (pressure per meter of depth)' },
          { type: 'text', text: `ρ × g = ${rho} × ${G}` },
          { type: 'result', text: `Pressure gradient = ${pressureGradient.toFixed(2)} Pa/m` },
          { type: 'text', text: `Every meter of depth adds ${pressureGradient.toFixed(2)} Pa of pressure.` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Multiply by depth to find gauge pressure' },
          { type: 'text', text: `P_gauge = ${pressureGradient.toFixed(2)} Pa/m × ${h} m` },
          { type: 'result', text: `P_gauge = ${pressureL.toFixed(2)} Pa` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate absolute pressure (including atmosphere)' },
          { type: 'text', text: `P_absolute = ${pressureL.toFixed(2)} + 101,325` },
          { type: 'result', text: `P_absolute = ${absolutePressure.toFixed(2)} Pa (${(absolutePressure/101325).toFixed(2)} atm)` },
        ],
      });

      // 4. ANALYSIS
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ At ${h}m depth, gauge pressure = ${pressureL.toFixed(2)} Pa, absolute = ${absolutePressure.toFixed(2)} Pa.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 PRESSURE AT DIFFERENT DEPTHS:' },
          { type: 'text', text: `• At surface (h = 0): P_gauge = 0 Pa` },
          { type: 'text', text: `• At ${h}m: P_gauge = ${pressureL.toFixed(2)} Pa` },
          { type: 'text', text: `• At ${(h*2).toFixed(2)}m: P_gauge = ${pressureAtDoubleDepth.toFixed(2)} Pa (2× deeper = 2× pressure)` },
          { type: 'text', text: `• At ${(h/2).toFixed(2)}m: P_gauge = ${pressureAtHalfDepth.toFixed(2)} Pa (½ depth = ½ pressure)` },
          { type: 'text', text: '' },
          { type: 'text', text: '🌊 COMPARISON WITH COMMON FLUIDS:' },
          { type: 'text', text: `• Water (ρ = 1000 kg/m³): P = ${pressureWater.toFixed(2)} Pa` },
          { type: 'text', text: `• Mercury (ρ = 13593 kg/m³): P = ${pressureMercury.toFixed(2)} Pa` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY PRINCIPLES:' },
          { type: 'text', text: '• Pressure depends ONLY on depth, density, and gravity - NOT on container shape' },
          { type: 'text', text: '• This is why dams are thicker at the bottom (more pressure)' },
          { type: 'text', text: '• Divers experience ~1 atm extra pressure for every 10m of depth' },
          { type: 'text', text: '• Pascal\'s Principle: Pressure applied to enclosed fluid transmits equally' },
        ],
      });
      result = `${pressureL.toFixed(2)} Pa`;
      break;
    }
  }
  return { result, steps };
}