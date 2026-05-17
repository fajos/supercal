// src/solvers/fluidsSolver.js - Pedagogical fluids tutor

export function solveFluids(mode, params) {
  const { F, A, rho, h } = params;
  const steps = [];
  let result;
  const G = 9.81; // standard gravity

  switch (mode) {
    case 'pressure_solid':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the force applied and the area over which it is distributed:' },
          { type: 'text', text: `• Applied Force (F): ${F} N` },
          { type: 'text', text: `• Surface Area (A): ${A} m²` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Pressure (P) is defined as the force applied perpendicular to a surface per unit area:' },
          { type: 'highlight', text: 'P = F / A' },
        ],
      });

      // 3. CALCULATION
      const pressureS = F / A;
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `P = ${F} N / ${A} m²` },
          { type: 'highlight', text: `P = ${pressureS.toFixed(2)} Pa` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The surface experiences a pressure of ${pressureS.toFixed(2)} Pascals (Newtons per square meter).` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 CONCEPTUAL TIP: If you want to reduce pressure without changing the force, you must increase the area. This is why snowshoes have a large surface area—to keep you from sinking into the snow!' },
        ],
      });
      result = `${pressureS.toFixed(2)} Pa`;
      break;

    case 'pressure_liquid':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the properties of the fluid and the depth of interest:' },
          { type: 'text', text: `• Fluid Density (ρ): ${rho} kg/m³` },
          { type: 'text', text: `• Depth (h): ${h} m` },
          { type: 'text', text: `• Gravitational Acceleration (g): ${G} m/s²` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The hydrostatic pressure at a certain depth in a static fluid is given by:' },
          { type: 'highlight', text: 'P = ρ · g · h' },
        ],
      });

      // 3. CALCULATION
      const pressureL = rho * G * h;
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `P = ${rho} × ${G} × ${h}` },
          { type: 'highlight', text: `P = ${pressureL.toFixed(2)} Pa` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `At a depth of ${h} meters, the fluid exerts a pressure of ${pressureL.toFixed(2)} Pa.` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔍 KEY OBSERVATIONS:' },
          { type: 'text', text: '• Pressure increases linearly with depth (h). The deeper you go, the more fluid weight is above you.' },
          { type: 'text', text: '• This calculation gives the "gauge pressure". To find "absolute pressure", you would add the atmospheric pressure (approx. 101,325 Pa) at the surface.' },
        ],
      });
      result = `${pressureL.toFixed(2)} Pa`;
      break;
  }
  return { result, steps };
}
