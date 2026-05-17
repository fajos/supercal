export function solveThermal(mode, params) {
  const { mass, specificHeat, deltaTemp, heat, latentHeat, initialPressure, initialVolume, initialTemp, finalPressure, finalVolume, finalTemp } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'specificHeat': {
      const Q = mass * specificHeat * deltaTemp;
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Specific Heat Capacity (c): ${specificHeat} J/kg·K` },
          { type: 'text', text: `• Temperature Change (ΔT): ${deltaTemp} K` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'To find the heat energy (Q) required to change the temperature of a substance:' },
          { type: 'formula', text: 'Q = m · c · ΔT' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `Q = ${mass} × ${specificHeat} × ${deltaTemp}` },
          { type: 'highlight', text: `Q = ${Q.toFixed(2)} J` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `It takes ${Q.toFixed(2)} Joules of energy to change the temperature by ${deltaTemp} units.` },
          { type: 'text', text: '💡 Specific heat is a material property. Water has a very high specific heat (~4186 J/kg·K), which is why it\'s so good at regulating temperatures.' },
        ],
      });
      result = `${Q.toFixed(2)} J`;
      break;
    }

    case 'latentHeat': {
      const Q = mass * latentHeat;
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Specific Latent Heat (L): ${latentHeat} J/kg` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'During a phase change (like melting or boiling), heat is absorbed or released without changing the temperature:' },
          { type: 'formula', text: 'Q = m · L' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `Q = ${mass} × ${latentHeat}` },
          { type: 'highlight', text: `Q = ${Q.toFixed(2)} J` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `Total heat for phase change: ${Q.toFixed(2)} Joules.` },
          { type: 'text', text: '💡 This is called "latent" (hidden) heat because it doesn\'t cause a temperature rise; instead, it goes into breaking or forming intermolecular bonds.' },
        ],
      });
      result = `${Q.toFixed(2)} J`;
      break;
    }

    case 'gasLaws': {
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• P₁: ${initialPressure}, V₁: ${initialVolume}, T₁: ${initialTemp}K` },
          { type: 'text', text: `• P₂: ${finalPressure ?? '?'}, V₂: ${finalVolume ?? '?'}, T₂: ${finalTemp ?? '?'}K` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The Combined Gas Law relates pressure, volume, and temperature for a fixed amount of gas:' },
          { type: 'formula', text: '(P₁ · V₁) / T₁ = (P₂ · V₂) / T₂' },
          { type: 'text', text: '⚠️ Temperature must be in Kelvin!' },
        ],
      });

      if (!finalVolume) {
        const v2 = (initialPressure * initialVolume * finalTemp) / (finalPressure * initialTemp);
        steps.push({
          step: 'CALCULATION',
          badge: 'math',
          content: [
            { type: 'text', text: 'Solving for V₂:' },
            { type: 'formula', text: 'V₂ = (P₁ · V₁ · T₂) / (P₂ · T₁)' },
            { type: 'text', text: `V₂ = (${initialPressure} × ${initialVolume} × ${finalTemp}) / (${finalPressure} × ${initialTemp})` },
            { type: 'highlight', text: `V₂ = ${v2.toFixed(3)} units³` },
          ],
        });
        result = `V₂ = ${v2.toFixed(3)}`;
      } else if (!finalPressure) {
        const p2 = (initialPressure * initialVolume * finalTemp) / (finalVolume * initialTemp);
        steps.push({
          step: 'CALCULATION',
          badge: 'math',
          content: [
            { type: 'text', text: 'Solving for P₂:' },
            { type: 'formula', text: 'P₂ = (P₁ · V₁ · T₂) / (V₂ · T₁)' },
            { type: 'text', text: `P₂ = (${initialPressure} × ${initialVolume} × ${finalTemp}) / (${finalVolume} × ${initialTemp})` },
            { type: 'highlight', text: `P₂ = ${p2.toFixed(3)} units` },
          ],
        });
        result = `P₂ = ${p2.toFixed(3)}`;
      }

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: 'This relationship shows how gases behave under compression or heating.' },
          { type: 'text', text: '💡 Boyle\'s Law: P ∝ 1/V (at const T). Charles\'s Law: V ∝ T (at const P).' },
        ],
      });
      break;
    }
  }

  return { result, steps };
}

