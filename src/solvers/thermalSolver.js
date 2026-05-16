export function solveThermal(mode, params) {
  const { mass, specificHeat, deltaTemp, heat, latentHeat, initialPressure, initialVolume, initialTemp, finalPressure, finalVolume, finalTemp } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'specificHeat': {
      const Q = mass * specificHeat * deltaTemp;
      steps.push({
        step: 'SPECIFIC HEAT CAPACITY',
        badge: 'primary',
        content: [
          { type: 'text', text: '🌡️ Quantity of Heat Formula:' },
          { type: 'formula', text: 'Q = mcΔθ' },
          { type: 'text', text: `Mass (m) = ${mass} kg` },
          { type: 'text', text: `Specific Heat Capacity (c) = ${specificHeat} J/kg·K` },
          { type: 'text', text: `Temperature Change (Δθ) = ${deltaTemp} K` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step-by-step Calculation:' },
          { type: 'text', text: `Q = ${mass} × ${specificHeat} × ${deltaTemp}` },
          { type: 'highlight', text: `Q = ${Q.toFixed(2)} Joules` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Definition: Specific heat capacity is the heat required to raise the temperature of 1kg of a substance by 1 Kelvin (or 1°C).' },
        ],
      });
      result = `${Q.toFixed(2)} J`;
      break;
    }

    case 'latentHeat': {
      const Q = mass * latentHeat;
      steps.push({
        step: 'LATENT HEAT',
        badge: 'primary',
        content: [
          { type: 'text', text: '🌡️ Heat for Phase Change Formula:' },
          { type: 'formula', text: 'Q = mL' },
          { type: 'text', text: `Mass (m) = ${mass} kg` },
          { type: 'text', text: `Specific Latent Heat (L) = ${latentHeat} J/kg` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step-by-step Calculation:' },
          { type: 'text', text: `Q = ${mass} × ${latentHeat}` },
          { type: 'highlight', text: `Q = ${Q.toFixed(2)} Joules` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Note: Latent heat is "hidden" heat used to change state (e.g., melting ice or boiling water) without changing temperature.' },
        ],
      });
      result = `${Q.toFixed(2)} J`;
      break;
    }

    case 'gasLaws': {
      // General Gas Law: P1V1/T1 = P2V2/T2
      // We assume one value is missing (passed as NaN or 0, but logic handles it)
      steps.push({
        step: 'GENERAL GAS LAW',
        badge: 'primary',
        content: [
          { type: 'text', text: '💨 Ideal Gas Relationship:' },
          { type: 'formula', text: 'P₁V₁ / T₁ = P₂V₂ / T₂' },
          { type: 'text', text: '⚠️ Note: Temperatures MUST be in Kelvin (K = °C + 273)' },
          { type: 'text', text: '' },
        ],
      });

      if (!finalVolume) {
        const v2 = (initialPressure * initialVolume * finalTemp) / (finalPressure * initialTemp);
        steps.push({
          step: 'FINDING FINAL VOLUME (V₂)',
          badge: 'secondary',
          content: [
            { type: 'text', text: 'Rearranging for V₂:' },
            { type: 'formula', text: 'V₂ = (P₁V₁T₂) / (P₂T₁)' },
            { type: 'text', text: `V₂ = (${initialPressure} × ${initialVolume} × ${finalTemp}) / (${finalPressure} × ${initialTemp})` },
            { type: 'highlight', text: `V₂ = ${v2.toFixed(3)} units³` },
          ],
        });
        result = `V₂ = ${v2.toFixed(3)}`;
      } else if (!finalPressure) {
        const p2 = (initialPressure * initialVolume * finalTemp) / (finalVolume * initialTemp);
        steps.push({
          step: 'FINDING FINAL PRESSURE (P₂)',
          badge: 'secondary',
          content: [
            { type: 'text', text: 'Rearranging for P₂:' },
            { type: 'formula', text: 'P₂ = (P₁V₁T₂) / (V₂T₁)' },
            { type: 'text', text: `P₂ = (${initialPressure} × ${initialVolume} × ${finalTemp}) / (${finalVolume} × ${initialTemp})` },
            { type: 'highlight', text: `P₂ = ${p2.toFixed(3)} units` },
          ],
        });
        result = `P₂ = ${p2.toFixed(3)}`;
      }
      break;
    }
  }

  return { result, steps };
}
