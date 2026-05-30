export function solveCircuits(mode, params) {
  const { voltage, current, resistance, resistance2, power } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'ohmsLaw': {
      const calcCurrent = voltage / resistance;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Circuit Parameters:' },
          { type: 'text', text: `• Potential Difference (V): ${voltage} V` },
          { type: 'text', text: `• Total Resistance (R): ${resistance} Ω` },
          { type: 'text', text: '' },
          { type: 'text', text: "Ohm's Law is the fundamental relationship in electrical circuits." },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: "Ohm's Law defines the relationship between voltage, current, and resistance:" },
          { type: 'formula', text: 'V = I · R' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• V = Voltage (volts, V)' },
          { type: 'text', text: '• I = Current (amperes, A)' },
          { type: 'text', text: '• R = Resistance (ohms, Ω)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Rearranging to solve for Current (I):' },
          { type: 'formula', text: 'I = V / R' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Substitute the known values' },
          { type: 'text', text: `I = V / R` },
          { type: 'text', text: `I = ${voltage} V / ${resistance} Ω` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Perform the division' },
          { type: 'text', text: `I = ${calcCurrent.toFixed(4)}...` },
          { type: 'result', text: `I = ${calcCurrent.toFixed(2)} A` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ Current flow: ${calcCurrent.toFixed(2)} Amperes.` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 WATER ANALOGY:' },
          { type: 'text', text: '• Voltage = Water pressure (push)' },
          { type: 'text', text: '• Resistance = Pipe diameter (restriction)' },
          { type: 'text', text: '• Current = Water flow rate' },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 ALTERNATIVE FORMS OF OHM\'S LAW:' },
          { type: 'formula', text: 'V = I · R  (find voltage)' },
          { type: 'formula', text: 'I = V / R  (find current)' },
          { type: 'formula', text: 'R = V / I  (find resistance)' },
        ],
      });
      result = `${calcCurrent.toFixed(2)} A`;
      break;
    }

    case 'series': {
      const R_total_series = resistance + resistance2;
      const I_series = voltage / R_total_series;
      const V1 = I_series * resistance;
      const V2 = I_series * resistance2;
      const P_total = voltage * I_series;

      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Series Circuit Components:' },
          { type: 'text', text: `• Source Voltage (V_total): ${voltage} V` },
          { type: 'text', text: `• Resistor 1 (R₁): ${resistance} Ω` },
          { type: 'text', text: `• Resistor 2 (R₂): ${resistance2} Ω` },
          { type: 'text', text: '' },
          { type: 'text', text: 'In a series circuit, current is the SAME through all components.' },
          { type: 'text', text: 'Voltage divides across each resistor proportional to its resistance.' },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: '1. Total Resistance in Series (additive):' },
          { type: 'formula', text: 'R_total = R₁ + R₂ + ... + R_n' },
          { type: 'text', text: '' },
          { type: 'text', text: '2. Current (same through all components):' },
          { type: 'formula', text: 'I = V / R_total' },
          { type: 'text', text: '' },
          { type: 'text', text: '3. Voltage Divider Rule:' },
          { type: 'formula', text: 'V₁ = I · R₁,  V₂ = I · R₂' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate Total Resistance' },
          { type: 'text', text: `R_total = R₁ + R₂` },
          { type: 'text', text: `R_total = ${resistance} + ${resistance2}` },
          { type: 'result', text: `R_total = ${R_total_series.toFixed(1)} Ω` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Circuit Current' },
          { type: 'text', text: `I = V / R_total` },
          { type: 'text', text: `I = ${voltage} / ${R_total_series.toFixed(1)}` },
          { type: 'result', text: `I = ${I_series.toFixed(3)} A` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate Individual Voltage Drops' },
          { type: 'text', text: `V₁ = I × R₁ = ${I_series.toFixed(3)} × ${resistance} = ${V1.toFixed(2)} V` },
          { type: 'text', text: `V₂ = I × R₂ = ${I_series.toFixed(3)} × ${resistance2} = ${V2.toFixed(2)} V` },
          { type: 'text', text: `Verify: V₁ + V₂ = ${(V1 + V2).toFixed(2)} V ≈ ${voltage} V ✓` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: '✅ SERIES CIRCUIT SUMMARY:' },
          { type: 'text', text: '' },
          { type: 'result', text: `• Total Resistance: ${R_total_series.toFixed(1)} Ω` },
          { type: 'result', text: `• Circuit Current: ${I_series.toFixed(3)} A` },
          { type: 'result', text: `• V₁ = ${V1.toFixed(2)} V (${((V1/voltage)*100).toFixed(1)}% of total)` },
          { type: 'result', text: `• V₂ = ${V2.toFixed(2)} V (${((V2/voltage)*100).toFixed(1)}% of total)` },
          { type: 'result', text: `• Total Power: ${P_total.toFixed(2)} W` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY PROPERTIES OF SERIES CIRCUITS:' },
          { type: 'text', text: '• Current is the SAME through all components' },
          { type: 'text', text: '• Voltage DIVIDES across components' },
          { type: 'text', text: '• Total resistance = SUM of individual resistances' },
          { type: 'text', text: '• If one component fails (open), ALL current stops' },
          { type: 'text', text: '• Old Christmas lights used series (one bulb out = all out!)' },
        ],
      });
      result = `I: ${I_series.toFixed(3)} A, R_total: ${R_total_series.toFixed(1)} Ω`;
      break;
    }

    case 'parallel': {
      const invR1 = 1 / resistance;
      const invR2 = 1 / resistance2;
      const invRTotal = invR1 + invR2;
      const R_total_parallel = 1 / invRTotal;
      const I_total = voltage / R_total_parallel;
      const I1 = voltage / resistance;
      const I2 = voltage / resistance2;
      const P_total = voltage * I_total;

      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parallel Circuit Components:' },
          { type: 'text', text: `• Source Voltage (V): ${voltage} V` },
          { type: 'text', text: `• Resistor 1 (R₁): ${resistance} Ω` },
          { type: 'text', text: `• Resistor 2 (R₂): ${resistance2} Ω` },
          { type: 'text', text: '' },
          { type: 'text', text: 'In a parallel circuit, voltage is the SAME across all branches.' },
          { type: 'text', text: 'Current divides among the parallel paths.' },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: '1. Total Resistance in Parallel (reciprocal sum):' },
          { type: 'formula', text: '1/R_total = 1/R₁ + 1/R₂ + ... + 1/R_n' },
          { type: 'text', text: '' },
          { type: 'text', text: '2. Total Current:' },
          { type: 'formula', text: 'I_total = V / R_total' },
          { type: 'text', text: '' },
          { type: 'text', text: '3. Current Divider Rule:' },
          { type: 'formula', text: 'I₁ = V / R₁,  I₂ = V / R₂' },
          { type: 'text', text: '' },
          { type: 'text', text: 'R_total is ALWAYS less than the smallest individual resistor!' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate reciprocal resistances (conductances)' },
          { type: 'text', text: `1/R₁ = 1/${resistance} = ${invR1.toFixed(4)} S` },
          { type: 'text', text: `1/R₂ = 1/${resistance2} = ${invR2.toFixed(4)} S` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Sum the conductances' },
          { type: 'text', text: `1/R_total = ${invR1.toFixed(4)} + ${invR2.toFixed(4)}` },
          { type: 'text', text: `1/R_total = ${invRTotal.toFixed(4)} S` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Take reciprocal to find R_total' },
          { type: 'text', text: `R_total = 1 / ${invRTotal.toFixed(4)}` },
          { type: 'result', text: `R_total = ${R_total_parallel.toFixed(2)} Ω` },
          { type: 'text', text: `Note: R_total (${R_total_parallel.toFixed(2)}Ω) < smallest R (${Math.min(resistance, resistance2)}Ω) ✓` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Calculate total and branch currents' },
          { type: 'text', text: `I_total = ${voltage} / ${R_total_parallel.toFixed(2)} = ${I_total.toFixed(3)} A` },
          { type: 'text', text: `I₁ = ${voltage} / ${resistance} = ${I1.toFixed(3)} A` },
          { type: 'text', text: `I₂ = ${voltage} / ${resistance2} = ${I2.toFixed(3)} A` },
          { type: 'text', text: `Verify: I₁ + I₂ = ${(I1 + I2).toFixed(3)} A ≈ ${I_total.toFixed(3)} A ✓` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: '✅ PARALLEL CIRCUIT SUMMARY:' },
          { type: 'text', text: '' },
          { type: 'result', text: `• Total Resistance: ${R_total_parallel.toFixed(2)} Ω` },
          { type: 'result', text: `• Total Current: ${I_total.toFixed(3)} A` },
          { type: 'result', text: `• I₁ = ${I1.toFixed(3)} A (through R₁)` },
          { type: 'result', text: `• I₂ = ${I2.toFixed(3)} A (through R₂)` },
          { type: 'result', text: `• Total Power: ${P_total.toFixed(2)} W` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY PROPERTIES OF PARALLEL CIRCUITS:' },
          { type: 'text', text: '• Voltage is the SAME across all branches' },
          { type: 'text', text: '• Current DIVIDES among branches' },
          { type: 'text', text: '• Total resistance is LESS than smallest resistor' },
          { type: 'text', text: '• If one branch fails, others continue working' },
          { type: 'text', text: '• Home wiring uses parallel circuits (each outlet independent)' },
        ],
      });
      result = `I_total: ${I_total.toFixed(2)} A, R_total: ${R_total_parallel.toFixed(2)} Ω`;
      break;
    }

    case 'power': {
      const calcPower = voltage * current;
      const powerFromResistance = (voltage * voltage) / resistance;
      const energyPerHour = calcPower / 1000; // kWh
      const energyPerDay = energyPerHour * 24;
      const monthlyCost = energyPerDay * 30 * 0.12; // Assuming $0.12/kWh
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Power Calculation Parameters:' },
          { type: 'text', text: `• Voltage (V): ${voltage} V` },
          { type: 'text', text: `• Current (I): ${current} A` },
          { type: 'text', text: `• Resistance (R): ${resistance} Ω (for verification)` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Electrical power (P) is the rate of energy transfer:' },
          { type: 'formula', text: 'P = V · I' },
          { type: 'text', text: '' },
          { type: 'text', text: "Alternative forms (using Ohm's Law substitutions):" },
          { type: 'formula', text: 'P = I² · R' },
          { type: 'formula', text: 'P = V² / R' },
          { type: 'text', text: '' },
          { type: 'text', text: 'All three formulas give the same result!' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Method 1: P = V × I' },
          { type: 'text', text: `P = ${voltage} V × ${current} A` },
          { type: 'result', text: `P = ${calcPower.toFixed(2)} W` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Method 2: P = I² × R (verification)' },
          { type: 'text', text: `P = (${current})² × ${resistance}` },
          { type: 'text', text: `P = ${(current * current).toFixed(2)} × ${resistance} = ${powerFromResistance.toFixed(2)} W` },
          { type: 'text', text: '✓ Both methods agree' },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The circuit consumes ${calcPower.toFixed(2)} Watts of power.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 ENERGY CONSUMPTION:' },
          { type: 'text', text: `• Per hour: ${energyPerHour.toFixed(4)} kWh` },
          { type: 'text', text: `• Per day: ${energyPerDay.toFixed(2)} kWh` },
          { type: 'text', text: `• Per month: ${(energyPerDay * 30).toFixed(1)} kWh` },
          { type: 'text', text: `• Est. monthly cost: $${monthlyCost.toFixed(2)} (at $0.12/kWh)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 POWER COMPARISONS:' },
          { type: 'text', text: '• LED bulb: ~10 W' },
          { type: 'text', text: '• Laptop: ~50 W' },
          { type: 'text', text: '• Microwave: ~1000 W' },
          { type: 'text', text: '• Electric heater: ~1500 W' },
        ],
      });
      result = `${calcPower.toFixed(2)} W`;
      break;
    }
  }

  return { result, steps };
}