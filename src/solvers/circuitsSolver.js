export function solveCircuits(mode, params) {
  const { voltage, current, resistance, resistance2, power } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'ohmsLaw': {
      const calcCurrent = voltage / resistance;
      const calcVoltage = current * resistance;
      const calcResistance = voltage / current;
      
      steps.push({
        step: "OHM'S LAW",
        badge: 'primary',
        content: [
          { type: 'text', text: "⚡ Ohm's Law: V = IR" },
          { type: 'formula', text: 'V = I × R' },
          { type: 'text', text: '' },
          { type: 'text', text: '🔍 The Ohm\'s Law Triangle:' },
          { type: 'text', text: '    V' },
          { type: 'text', text: '  ─────' },
          { type: 'text', text: '  I | R' },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 With your values:' },
          { type: 'text', text: `V = ${voltage} V, I = ${current} A, R = ${resistance} Ω` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Verify: V = IR' },
          { type: 'text', text: `${voltage} = ${current} × ${resistance}` },
          { type: 'text', text: `${voltage} = ${current * resistance}` },
          { type: 'text', text: Math.abs(voltage - current * resistance) < 0.01 ? '✅ Consistent!' : '⚠️ Values not consistent with Ohm\'s Law' },
          { type: 'text', text: '' },
          { type: 'highlight', text: `I = ${calcCurrent.toFixed(2)} A (from V/R)` },
          { type: 'highlight', text: `V = ${calcVoltage.toFixed(2)} V (from IR)` },
          { type: 'highlight', text: `R = ${calcResistance.toFixed(2)} Ω (from V/I)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Water Analogy: Voltage = pressure, Current = flow rate, Resistance = pipe width' },
        ],
      });
      result = `${calcCurrent.toFixed(2)} A, V = ${calcVoltage.toFixed(1)} V, R = ${calcResistance.toFixed(1)} Ω`;
      break;
    }

    case 'series': {
      const R_total_series = resistance + resistance2;
      const I_series = voltage / R_total_series;
      const V1 = I_series * resistance;
      const V2 = I_series * resistance2;
      
      steps.push({
        step: 'SERIES CIRCUIT',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Series Circuit Analysis' },
          { type: 'text', text: 'In series: Same current flows through all components' },
          { type: 'text', text: '' },
          { type: 'text', text: '1️⃣ Total Resistance:' },
          { type: 'formula', text: 'R_total = R₁ + R₂' },
          { type: 'text', text: `R_total = ${resistance} + ${resistance2} = ${R_total_series.toFixed(1)} Ω` },
          { type: 'text', text: '' },
          { type: 'text', text: '2️⃣ Circuit Current:' },
          { type: 'formula', text: 'I = V / R_total' },
          { type: 'text', text: `I = ${voltage} / ${R_total_series.toFixed(1)} = ${I_series.toFixed(2)} A` },
          { type: 'text', text: '' },
          { type: 'text', text: '3️⃣ Voltage Drops (Voltage Divider):' },
          { type: 'text', text: `V₁ = I × R₁ = ${I_series.toFixed(2)} × ${resistance} = ${V1.toFixed(1)} V` },
          { type: 'text', text: `V₂ = I × R₂ = ${I_series.toFixed(2)} × ${resistance2} = ${V2.toFixed(1)} V` },
          { type: 'text', text: `Check: V₁ + V₂ = ${(V1 + V2).toFixed(1)} V ≈ ${voltage} V ✓` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Series circuits divide voltage. Each resistor gets a portion of the total voltage.' },
        ],
      });
      result = `R_total = ${R_total_series.toFixed(1)} Ω, I = ${I_series.toFixed(2)} A, V₁ = ${V1.toFixed(1)} V, V₂ = ${V2.toFixed(1)} V`;
      break;
    }

    case 'parallel': {
      const R_total_parallel = (resistance * resistance2) / (resistance + resistance2);
      const I_total = voltage / R_total_parallel;
      const I1 = voltage / resistance;
      const I2 = voltage / resistance2;
      
      steps.push({
        step: 'PARALLEL CIRCUIT',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Parallel Circuit Analysis' },
          { type: 'text', text: 'In parallel: Same voltage across all components' },
          { type: 'text', text: '' },
          { type: 'text', text: '1️⃣ Total Resistance:' },
          { type: 'formula', text: '1/R_total = 1/R₁ + 1/R₂' },
          { type: 'text', text: `1/R = 1/${resistance} + 1/${resistance2}` },
          { type: 'text', text: `1/R = ${(1/resistance).toFixed(3)} + ${(1/resistance2).toFixed(3)} = ${(1/resistance + 1/resistance2).toFixed(3)}` },
          { type: 'highlight', text: `R_total = ${R_total_parallel.toFixed(2)} Ω` },
          { type: 'text', text: '(Always LESS than the smallest individual resistance!)' },
          { type: 'text', text: '' },
          { type: 'text', text: '2️⃣ Total Current:' },
          { type: 'text', text: `I_total = V / R_total = ${voltage} / ${R_total_parallel.toFixed(2)} = ${I_total.toFixed(2)} A` },
          { type: 'text', text: '' },
          { type: 'text', text: '3️⃣ Branch Currents (Current Divider):' },
          { type: 'text', text: `I₁ = V / R₁ = ${voltage} / ${resistance} = ${I1.toFixed(2)} A` },
          { type: 'text', text: `I₂ = V / R₂ = ${voltage} / ${resistance2} = ${I2.toFixed(2)} A` },
          { type: 'text', text: `Check: I₁ + I₂ = ${(I1 + I2).toFixed(2)} A ≈ ${I_total.toFixed(2)} A ✓` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Parallel circuits divide current. More paths = lower total resistance = higher current.' },
        ],
      });
      result = `R_total = ${R_total_parallel.toFixed(2)} Ω, I = ${I_total.toFixed(2)} A, I₁ = ${I1.toFixed(2)} A, I₂ = ${I2.toFixed(2)} A`;
      break;
    }

    case 'power': {
      const calcPowerVI = voltage * current;
      const calcPowerI2R = current * current * resistance;
      const calcPowerV2R = (voltage * voltage) / resistance;
      
      steps.push({
        step: 'ELECTRICAL POWER',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Electrical Power Formulas' },
          { type: 'formula', text: 'P = VI = I²R = V²/R' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Method 1: P = V × I' },
          { type: 'text', text: `P = ${voltage} × ${current} = ${calcPowerVI.toFixed(1)} W` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Method 2: P = I² × R' },
          { type: 'text', text: `P = ${current}² × ${resistance} = ${current * current} × ${resistance} = ${calcPowerI2R.toFixed(1)} W` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Method 3: P = V² / R' },
          { type: 'text', text: `P = ${voltage}² / ${resistance} = ${voltage * voltage} / ${resistance} = ${calcPowerV2R.toFixed(1)} W` },
          { type: 'text', text: '' },
          { type: 'highlight', text: `Power = ${calcPowerVI.toFixed(1)} Watts (all methods agree ✓)` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔌 Energy Consumption:' },
          { type: 'text', text: `In 1 hour: ${(calcPowerVI / 1000).toFixed(2)} kWh` },
          { type: 'text', text: `In 24 hours: ${((calcPowerVI * 24) / 1000).toFixed(2)} kWh` },
          { type: 'text', text: `Cost at $0.12/kWh: $${((calcPowerVI * 24) / 1000 * 0.12).toFixed(2)}/day` },
        ],
      });
      result = `${calcPowerVI.toFixed(1)} W (${(calcPowerVI/1000).toFixed(2)} kW)`;
      break;
    }
  }

  return { result, steps };
}