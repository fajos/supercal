// src/solvers/circularSolver.js - Pedagogical circular motion tutor

export function solveCircular(mode, params) {
  const { mass, radius, velocity, omega, period, frequency } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'centripetal': {
      // Calculate missing velocity components if possible
      const v = velocity || (omega * radius) || (2 * Math.PI * radius * frequency) || (2 * Math.PI * radius / period);
      const ac = (v * v) / radius;
      const Fc = mass * ac;

      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the mass of the object and the geometry of its circular path:' },
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Radius (r): ${radius} m` },
          { type: 'text', text: `• Tangential Velocity (v): ${v.toFixed(2)} m/s` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'To maintain a circular path, an object must experience a centripetal acceleration (ac) and a corresponding net force (Fc):' },
          { type: 'highlight', text: 'ac = v² / r' },
          { type: 'highlight', text: 'Fc = m · ac' },
          { type: 'text', text: 'This force always points toward the center of the circle.' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: 'Step 1: Calculate Centripetal Acceleration' },
          { type: 'text', text: `ac = (${v.toFixed(2)})² / ${radius}` },
          { type: 'highlight', text: `ac = ${ac.toFixed(2)} m/s²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Centripetal Force' },
          { type: 'text', text: `Fc = ${mass} kg × ${ac.toFixed(2)} m/s²` },
          { type: 'highlight', text: `Fc = ${Fc.toFixed(2)} N` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `A net force of ${Fc.toFixed(2)} Newtons is required to keep this object on its circular path.` },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 COMMON SOURCES OF THIS FORCE:' },
          { type: 'text', text: '• FRICTION: Tires on a road during a turn.' },
          { type: 'text', text: '• TENSION: A string pulling a ball in a circle.' },
          { type: 'text', text: '• GRAVITY: A satellite orbiting the Earth.' },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 PHYSICS TIP: "Centripetal" is not a new type of force; it is just a label for the role that a real force (like gravity or friction) is playing in that moment.' },
        ],
      });
      result = `${Fc.toFixed(2)} N`;
      break;
    }

    case 'angular': {
      const w = omega || (velocity / radius) || (2 * Math.PI * frequency) || (2 * Math.PI / period);
      const f = frequency || (w / (2 * Math.PI)) || (1 / period);
      const T = period || (1 / f) || (2 * Math.PI / w);

      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We analyze the rate of rotation using the provided parameters:' },
          omega ? { type: 'text', text: `• Angular Velocity (ω): ${omega} rad/s` } : null,
          velocity ? { type: 'text', text: `• Linear Velocity (v): ${velocity} m/s` } : null,
          period ? { type: 'text', text: `• Period (T): ${period} s` } : null,
          frequency ? { type: 'text', text: `• Frequency (f): ${frequency} Hz` } : null,
        ].filter(Boolean),
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Rotational parameters are mathematically linked by the geometry of a circle:' },
          { type: 'highlight', text: 'ω = 2π / T = 2πf' },
          { type: 'highlight', text: 'v = ω · r' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `Angular Velocity (ω) = ${w.toFixed(4)} rad/s` },
          { type: 'text', text: `Frequency (f) = ${f.toFixed(4)} Hz` },
          { type: 'text', text: `Period (T) = ${T.toFixed(4)} s` },
          { type: 'text', text: '' },
          { type: 'highlight', text: `The object completes one revolution every ${T.toFixed(2)} seconds.` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `At an angular speed of ${w.toFixed(2)} rad/s, the object is sweeping through about ${(w * 180 / Math.PI).toFixed(1)} degrees per second.` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 CONCEPT: Angular velocity (ω) tells you how fast the angle is changing, regardless of the radius. Linear velocity (v) tells you the actual speed through space, which increases as you move further from the center.' },
        ],
      });
      result = `ω: ${w.toFixed(2)} rad/s, T: ${T.toFixed(2)}s`;
      break;
    }
  }

  return { result, steps };
}
