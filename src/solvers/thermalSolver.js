export function solveThermal(mode, params) {
  const { mass, specificHeat, deltaTemp, heat, latentHeat, initialPressure, initialVolume, initialTemp, finalPressure, finalVolume, finalTemp } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'specificHeat': {
      const Q = mass * specificHeat * deltaTemp;
      const intermediateProduct = mass * specificHeat;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters for Heating/Cooling:' },
          { type: 'text', text: `• Mass of substance (m): ${mass} kg` },
          { type: 'text', text: `• Specific Heat Capacity (c): ${specificHeat} J/kg·K` },
          { type: 'text', text: `• Temperature Change (ΔT): ${deltaTemp} K` },
          { type: 'text', text: '' },
          { type: 'text', text: `This substance requires ${specificHeat} Joules to raise 1 kg by 1 Kelvin.` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The energy (Q) absorbed or released during temperature change is:' },
          { type: 'formula', text: 'Q = m · c · ΔT' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• Q = Heat energy (J)' },
          { type: 'text', text: '• m = Mass (kg)' },
          { type: 'text', text: '• c = Specific heat capacity (J/kg·K)' },
          { type: 'text', text: '• ΔT = Temperature change (K or °C)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Multiply mass by specific heat capacity' },
          { type: 'text', text: `m × c = ${mass} kg × ${specificHeat} J/kg·K` },
          { type: 'text', text: `= ${intermediateProduct.toFixed(2)} J/K` },
          { type: 'text', text: 'This means it takes ${intermediateProduct.toFixed(2)} J to raise this mass by 1 K.' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Multiply by temperature change' },
          { type: 'text', text: `Q = ${intermediateProduct.toFixed(2)} J/K × ${deltaTemp} K` },
          { type: 'result', text: `Q = ${Q.toFixed(2)} J` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ It takes ${Q.toFixed(2)} Joules of energy to change the temperature by ${deltaTemp} K.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 ENERGY CONTEXT:' },
          { type: 'text', text: `• This is equivalent to ${(Q / 4184).toFixed(4)} food calories` },
          { type: 'text', text: `• Could power a 60W light bulb for ${(Q / 60).toFixed(2)} seconds` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 SPECIFIC HEAT COMPARISON:' },
          { type: 'text', text: '• Water: 4,186 J/kg·K (very high - excellent coolant)' },
          { type: 'text', text: '• Aluminum: 900 J/kg·K (heats/cools quickly)' },
          { type: 'text', text: '• Iron: 450 J/kg·K' },
          { type: 'text', text: '• Air: ~1,000 J/kg·K' },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Water\'s high specific heat is why coastal areas have milder climates and why we use water in radiators.' },
        ],
      });
      result = `${Q.toFixed(2)} J`;
      break;
    }

    case 'latentHeat': {
      const Q = mass * latentHeat;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters for Phase Change (Latent Heat):' },
          { type: 'text', text: `• Mass of the sample (m): ${mass} kg` },
          { type: 'text', text: `• Specific Latent Heat (L): ${latentHeat} J/kg` },
          { type: 'text', text: '' },
          { type: 'text', text: 'During a phase change, temperature remains constant while energy is absorbed or released.' },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The energy required for a complete phase change (melting, freezing, boiling, condensing):' },
          { type: 'formula', text: 'Q = m · L' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• Q = Heat energy (J)' },
          { type: 'text', text: '• m = Mass (kg)' },
          { type: 'text', text: '• L = Specific latent heat (J/kg)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Types of Latent Heat:' },
          { type: 'text', text: '• L_f = Latent heat of fusion (melting/freezing)' },
          { type: 'text', text: '• L_v = Latent heat of vaporization (boiling/condensing)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Multiply mass by specific latent heat' },
          { type: 'text', text: `Q = ${mass} kg × ${latentHeat} J/kg` },
          { type: 'result', text: `Q = ${Q.toFixed(2)} J` },
          { type: 'text', text: '' },
          { type: 'text', text: `This energy goes entirely into changing the phase, NOT raising the temperature.` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ Total heat required for phase change: ${Q.toFixed(2)} Joules.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 REAL-WORLD VALUES (for water at 1 atm):' },
          { type: 'text', text: '• Latent heat of fusion (ice ↔ water): 334,000 J/kg' },
          { type: 'text', text: '• Latent heat of vaporization (water ↔ steam): 2,260,000 J/kg' },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY INSIGHTS:' },
          { type: 'text', text: '• It takes ~7× more energy to boil water than to melt ice (per kg)' },
          { type: 'text', text: '• This is why steam burns are so severe - steam releases huge energy when condensing on skin' },
          { type: 'text', text: '• "Latent" means "hidden" - the energy goes into breaking/formimg intermolecular bonds, not raising temperature' },
          { type: 'text', text: '• Sweating cools us because evaporating water absorbs latent heat from our skin' },
        ],
      });
      result = `${Q.toFixed(2)} J`;
      break;
    }

    case 'gasLaws': {
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Combined Gas Law Analysis:' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Initial Gas Conditions (State 1):' },
          { type: 'text', text: `• Pressure (P₁): ${initialPressure}` },
          { type: 'text', text: `• Volume (V₁): ${initialVolume}` },
          { type: 'text', text: `• Temperature (T₁): ${initialTemp} K` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Final Gas Conditions (State 2):' },
          { type: 'text', text: `• Pressure (P₂): ${finalPressure ?? '?'}` },
          { type: 'text', text: `• Volume (V₂): ${finalVolume ?? '?'}` },
          { type: 'text', text: `• Temperature (T₂): ${finalTemp ?? '?'} K` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The Combined Gas Law relates pressure, volume, and temperature for a fixed amount of gas:' },
          { type: 'formula', text: '(P₁ · V₁) / T₁ = (P₂ · V₂) / T₂' },
          { type: 'text', text: '' },
          { type: 'text', text: '⚠️ IMPORTANT: Temperatures MUST be in Kelvin (K = °C + 273.15).' },
          { type: 'text', text: 'Using Celsius or Fahrenheit will give WRONG results!' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Special Cases:' },
          { type: 'text', text: '• Boyle\'s Law (constant T): P₁V₁ = P₂V₂' },
          { type: 'text', text: '• Charles\' Law (constant P): V₁/T₁ = V₂/T₂' },
          { type: 'text', text: '• Gay-Lussac\'s Law (constant V): P₁/T₁ = P₂/T₂' },
        ],
      });

      if (!finalVolume && finalPressure && finalTemp) {
        const numerator = initialPressure * initialVolume * finalTemp;
        const denominator = finalPressure * initialTemp;
        const v2 = numerator / denominator;
        
        steps.push({
          step: 'CALCULATION',
          badge: 'primary',
          content: [
            { type: 'text', text: 'Solving for Final Volume (V₂):' },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 1: Rearrange the combined gas law' },
            { type: 'formula', text: 'V₂ = (P₁ · V₁ · T₂) / (P₂ · T₁)' },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 2: Substitute the known values' },
            { type: 'text', text: `V₂ = (${initialPressure} × ${initialVolume} × ${finalTemp}) / (${finalPressure} × ${initialTemp})` },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 3: Calculate numerator and denominator' },
            { type: 'text', text: `Numerator = ${initialPressure} × ${initialVolume} × ${finalTemp} = ${numerator.toFixed(2)}` },
            { type: 'text', text: `Denominator = ${finalPressure} × ${initialTemp} = ${denominator.toFixed(2)}` },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 4: Divide' },
            { type: 'text', text: `V₂ = ${numerator.toFixed(2)} / ${denominator.toFixed(2)}` },
            { type: 'result', text: `V₂ = ${v2.toFixed(3)} units³` },
          ],
        });
        result = `V₂ = ${v2.toFixed(3)}`;
        
      } else if (!finalPressure && finalVolume && finalTemp) {
        const numerator = initialPressure * initialVolume * finalTemp;
        const denominator = finalVolume * initialTemp;
        const p2 = numerator / denominator;
        
        steps.push({
          step: 'CALCULATION',
          badge: 'primary',
          content: [
            { type: 'text', text: 'Solving for Final Pressure (P₂):' },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 1: Rearrange the combined gas law' },
            { type: 'formula', text: 'P₂ = (P₁ · V₁ · T₂) / (V₂ · T₁)' },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 2: Substitute the known values' },
            { type: 'text', text: `P₂ = (${initialPressure} × ${initialVolume} × ${finalTemp}) / (${finalVolume} × ${initialTemp})` },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 3: Calculate numerator and denominator' },
            { type: 'text', text: `Numerator = ${initialPressure} × ${initialVolume} × ${finalTemp} = ${numerator.toFixed(2)}` },
            { type: 'text', text: `Denominator = ${finalVolume} × ${initialTemp} = ${denominator.toFixed(2)}` },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 4: Divide' },
            { type: 'text', text: `P₂ = ${numerator.toFixed(2)} / ${denominator.toFixed(2)}` },
            { type: 'result', text: `P₂ = ${p2.toFixed(3)} units` },
          ],
        });
        result = `P₂ = ${p2.toFixed(3)}`;
        
      } else if (!finalTemp && finalPressure && finalVolume) {
        const numerator = finalPressure * finalVolume * initialTemp;
        const denominator = initialPressure * initialVolume;
        const t2 = numerator / denominator;
        
        steps.push({
          step: 'CALCULATION',
          badge: 'primary',
          content: [
            { type: 'text', text: 'Solving for Final Temperature (T₂):' },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 1: Rearrange the combined gas law' },
            { type: 'formula', text: 'T₂ = (P₂ · V₂ · T₁) / (P₁ · V₁)' },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 2: Substitute the known values' },
            { type: 'text', text: `T₂ = (${finalPressure} × ${finalVolume} × ${initialTemp}) / (${initialPressure} × ${initialVolume})` },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 3: Calculate' },
            { type: 'text', text: `Numerator = ${finalPressure} × ${finalVolume} × ${initialTemp} = ${numerator.toFixed(2)}` },
            { type: 'text', text: `Denominator = ${initialPressure} × ${initialVolume} = ${denominator.toFixed(2)}` },
            { type: 'text', text: '' },
            { type: 'text', text: `T₂ = ${numerator.toFixed(2)} / ${denominator.toFixed(2)}` },
            { type: 'result', text: `T₂ = ${t2.toFixed(2)} K (${(t2 - 273.15).toFixed(2)} °C)` },
          ],
        });
        result = `T₂ = ${t2.toFixed(2)} K`;
      }

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: '✅ The Combined Gas Law predicts how the gas responds to changes in conditions.' },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY RELATIONSHIPS:' },
          { type: 'text', text: '• Pressure ↑ when Volume ↓ (Boyle\'s Law - inverse relationship)' },
          { type: 'text', text: '• Volume ↑ when Temperature ↑ (Charles\' Law - direct relationship)' },
          { type: 'text', text: '• Pressure ↑ when Temperature ↑ (Gay-Lussac\'s Law - direct relationship)' },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 REAL-WORLD EXAMPLES:' },
          { type: 'text', text: '• Aerosol cans warn against heat - pressure increases with temperature' },
          { type: 'text', text: '• Hot air balloons rise because heated air expands (volume increases)' },
          { type: 'text', text: '• Scuba divers must ascend slowly to allow gases to decompress safely' },
        ],
      });
      break;
    }
  }

  return { result, steps };
}