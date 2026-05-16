export function solveCircular(mode, params) {
  const { mass, radius, velocity, omega, period, frequency, gravity = 9.81 } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'centripetal': {
      // Fc = mv²/r = mω²r
      const v = velocity || (omega * radius) || (2 * Math.PI * radius * frequency) || (2 * Math.PI * radius / period);
      const Fc = (mass * v * v) / radius;
      const ac = (v * v) / radius;

      steps.push({
        step: 'CENTRIPETAL FORCE',
        badge: 'primary',
        content: [
          { type: 'text', text: '🎡 Centripetal Force Formula:' },
          { type: 'formula', text: 'F_c = mv² / r' },
          { type: 'text', text: `Mass (m) = ${mass} kg` },
          { type: 'text', text: `Radius (r) = ${radius} m` },
          { type: 'text', text: `Linear Velocity (v) = ${v.toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 1: Calculate Centripetal Acceleration (a_c)' },
          { type: 'text', text: `a_c = v² / r = ${v.toFixed(2)}² / ${radius}` },
          { type: 'highlight', text: `a_c = ${ac.toFixed(2)} m/s²` },
          { type: 'text', text: 'Step 2: Calculate Centripetal Force (F_c)' },
          { type: 'text', text: `F_c = m × a_c = ${mass} × ${ac.toFixed(2)}` },
          { type: 'highlight', text: `F_c = ${Fc.toFixed(2)} Newtons` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Note: Centripetal force always acts towards the center of the circle.' },
        ],
      });
      result = `${Fc.toFixed(2)} N (ac: ${ac.toFixed(1)} m/s²)`;
      break;
    }

    case 'angular': {
      // ω = v/r = 2πf = 2π/T
      const w = omega || (velocity / radius) || (2 * Math.PI * frequency) || (2 * Math.PI / period);
      const f = frequency || (w / (2 * Math.PI)) || (1 / period);
      const T = period || (1 / f) || (2 * Math.PI / w);

      steps.push({
        step: 'ANGULAR VELOCITY & PERIOD',
        badge: 'primary',
        content: [
          { type: 'text', text: '🎡 Rotational Motion Relationships:' },
          { type: 'formula', text: 'ω = 2πf = 2π / T' },
          { type: 'text', text: 'v = ωr' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Calculated Values:' },
          { type: 'highlight', text: `Angular Velocity (ω) = ${w.toFixed(3)} rad/s` },
          { type: 'highlight', text: `Frequency (f) = ${f.toFixed(3)} Hz (cycles/sec)` },
          { type: 'highlight', text: `Period (T) = ${T.toFixed(3)} seconds` },
          { type: 'text', text: '' },
          { type: 'text', text: `This object completes one full revolution every ${T.toFixed(2)} seconds.` },
        ],
      });
      result = `ω: ${w.toFixed(2)}, T: ${T.toFixed(2)}s`;
      break;
    }
  }

  return { result, steps };
}
