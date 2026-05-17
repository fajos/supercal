export function solveCircuits(mode, params) {
  const { voltage, current, resistance, resistance2, power } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'ohmsLaw': {
      const calcCurrent = voltage / resistance;
      steps.push({
        step: "GIVEN VALUES",
        badge: 'input',
        content: [
          { type: 'text', text: `• Voltage (V): ${voltage} V` },
          { type: 'text', text: `• Resistance (R): ${resistance} Ω` },
        ],
      });

      steps.push({
        step: "EQUATIONS",
        badge: 'formula',
        content: [
          { type: 'text', text: 'Ohm\'s Law defines the relationship between voltage, current, and resistance:' },
          { type: 'formula', text: 'V = I · R' },
          { type: 'text', text: 'To find Current (I):' },
          { type: 'formula', text: 'I = V / R' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `I = ${voltage} V / ${resistance} Ω` },
          { type: 'highlight', text: `I = ${calcCurrent.toFixed(2)} A` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `A current of ${calcCurrent.toFixed(2)} Amperes will flow through the circuit.` },
          { type: 'text', text: '💡 Analogy: Think of voltage as water pressure, current as the flow rate, and resistance as the size of the pipe. Higher pressure (voltage) or a wider pipe (lower resistance) leads to more flow (current).' },
        ],
      });
      result = `${calcCurrent.toFixed(2)} A`;
      break;
    }

    case 'series': {
      const R_total_series = resistance + resistance2;
      const I_series = voltage / R_total_series;

      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Voltage Source: ${voltage} V` },
          { type: 'text', text: `• R₁: ${resistance} Ω` },
          { type: 'text', text: `• R₂: ${resistance2} Ω` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'In a series circuit, components are connected end-to-end:' },
          { type: 'formula', text: 'R_total = R₁ + R₂ + ...' },
          { type: 'formula', text: 'I_total = V / R_total' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Total Resistance: ${resistance} + ${resistance2} = ${R_total_series.toFixed(2)} Ω` },
          { type: 'text', text: `2. Total Current: ${voltage} / ${R_total_series.toFixed(2)}` },
          { type: 'highlight', text: `I = ${I_series.toFixed(3)} A` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: 'In series, the current is the same through every component.' },
          { type: 'text', text: `Voltage Drops: R₁ consumes ${(I_series * resistance).toFixed(1)}V and R₂ consumes ${(I_series * resistance2).toFixed(1)}V.` },
          { type: 'text', text: '💡 If one component fails (opens) in a series circuit, the entire circuit stops working.' },
        ],
      });
      result = `${I_series.toFixed(3)} A`;
      break;
    }

    case 'parallel': {
      const R_total_parallel = 1 / (1 / resistance + 1 / resistance2);
      const I_total = voltage / R_total_parallel;

      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Voltage Source: ${voltage} V` },
          { type: 'text', text: `• R₁: ${resistance} Ω` },
          { type: 'text', text: `• R₂: ${resistance2} Ω` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'In a parallel circuit, components are connected across the same two nodes:' },
          { type: 'formula', text: '1 / R_total = 1 / R₁ + 1 / R₂ + ...' },
          { type: 'formula', text: 'I_total = I₁ + I₂ + ...' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Total Resistance: 1 / (1/${resistance} + 1/${resistance2})` },
          { type: 'highlight', text: `R_total = ${R_total_parallel.toFixed(2)} Ω` },
          { type: 'text', text: `2. Total Current: ${voltage} / ${R_total_parallel.toFixed(2)}` },
          { type: 'highlight', text: `I_total = ${I_total.toFixed(2)} A` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `Notice that the total resistance (${R_total_parallel.toFixed(2)} Ω) is lower than the smallest individual resistor.` },
          { type: 'text', text: `Branch currents: I₁ = ${(voltage/resistance).toFixed(2)}A, I₂ = ${(voltage/resistance2).toFixed(2)}A.` },
          { type: 'text', text: '💡 Parallel circuits are used in houses so that turning off one light doesn\'t turn off everything else.' },
        ],
      });
      result = `${I_total.toFixed(2)} A`;
      break;
    }

    case 'power': {
      const calcPower = voltage * current;
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Voltage (V): ${voltage} V` },
          { type: 'text', text: `• Current (I): ${current} A` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Electrical power (P) is the rate at which energy is transferred:' },
          { type: 'formula', text: 'P = V · I' },
          { type: 'text', text: 'Alternative formulas (using Ohm\'s Law):' },
          { type: 'formula', text: 'P = I² · R  or  P = V² / R' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `P = ${voltage} V × ${current} A` },
          { type: 'highlight', text: `P = ${calcPower.toFixed(2)} W` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The circuit is consuming ${calcPower.toFixed(2)} Watts of power.` },
          { type: 'text', text: `If left on for one hour, it would use ${(calcPower / 1000).toFixed(4)} kWh of energy.` },
        ],
      });
      result = `${calcPower.toFixed(2)} W`;
      break;
    }
  }

  return { result, steps };
}
