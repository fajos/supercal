// src/solvers/circularSolver.js - Pedagogical circular motion tutor

export function solveCircular(mode, params) {
  const { mass, radius, velocity, omega, period, frequency } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'centripetal': {
      // Calculate missing velocity components if possible
      const v = velocity || (omega * radius) || (2 * Math.PI * radius * frequency) || (2 * Math.PI * radius / period);
      const vSquared = v * v;
      const ac = vSquared / radius;
      const Fc = mass * ac;

      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 Centripetal Force Analysis:' },
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Radius of circular path (r): ${radius} m` },
          { type: 'text', text: `• Tangential Velocity (v): ${v.toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'For an object to move in a circle, a net force must constantly pull it toward the center.' },
          { type: 'text', text: 'This center-directed force is called the centripetal force.' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Step 1: Centripetal Acceleration' },
          { type: 'text', text: 'The acceleration needed to constantly change the direction of velocity toward the center:' },
          { type: 'formula', text: 'a_c = v² / r' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• a_c = centripetal acceleration (m/s²)' },
          { type: 'text', text: '• v = tangential velocity (m/s)' },
          { type: 'text', text: '• r = radius of circular path (m)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Centripetal Force (Newton\'s 2nd Law)' },
          { type: 'formula', text: 'F_c = m · a_c = m · v² / r' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Square the tangential velocity' },
          { type: 'text', text: `v² = (${v.toFixed(2)} m/s)² = ${vSquared.toFixed(2)} m²/s²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Divide by radius to find centripetal acceleration' },
          { type: 'text', text: `a_c = ${vSquared.toFixed(2)} / ${radius}` },
          { type: 'result', text: `a_c = ${ac.toFixed(2)} m/s²` },
          { type: 'text', text: '' },
          { type: 'text', text: `This means the velocity vector is changing at ${ac.toFixed(2)} m/s every second.` },
          { type: 'text', text: 'The speed stays constant, but the direction changes continuously.' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Multiply mass by centripetal acceleration' },
          { type: 'text', text: `F_c = ${mass} kg × ${ac.toFixed(2)} m/s²` },
          { type: 'result', text: `F_c = ${Fc.toFixed(2)} N` },
        ],
      });

      // 4. ANALYSIS
      const gForce = Fc / (mass * 9.81);
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ A net force of ${Fc.toFixed(2)} Newtons must act toward the center to maintain this circular path.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 FORCE CONTEXT:' },
          { type: 'text', text: `• This is equivalent to ${(Fc / 9.81).toFixed(2)} kg of weight on Earth` },
          { type: 'text', text: `• The object experiences ${gForce.toFixed(2)} g's of centripetal acceleration` },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 REAL-WORLD SOURCES OF CENTRIPETAL FORCE:' },
          { type: 'text', text: '• FRICTION: Car tires gripping the road during a turn' },
          { type: 'text', text: '• TENSION: String pulling a ball in a horizontal circle' },
          { type: 'text', text: '• GRAVITY: Moon orbiting the Earth' },
          { type: 'text', text: '• NORMAL FORCE: Wall of Death motorcycle stunt' },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY INSIGHT: "Centripetal" is a direction label (toward center), not a new type of force.' },
          { type: 'text', text: 'Any force (gravity, tension, friction, etc.) can serve as the centripetal force.' },
        ],
      });
      result = `${Fc.toFixed(2)} N`;
      break;
    }

    case 'angular': {
      const w = omega || (velocity / radius) || (2 * Math.PI * frequency) || (2 * Math.PI / period);
      const f = frequency || (w / (2 * Math.PI)) || (1 / period);
      const T = period || (1 / f) || (2 * Math.PI / w);
      const linearV = w * radius;
      const degreesPerSecond = w * 180 / Math.PI;
      const rpm = f * 60;

      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '🔄 Angular Motion Analysis:' },
          { type: 'text', text: `• Radius of circular path (r): ${radius} m` },
          omega ? { type: 'text', text: `• Angular Velocity (ω): ${omega} rad/s` } : null,
          velocity ? { type: 'text', text: `• Linear/Tangential Velocity (v): ${velocity} m/s` } : null,
          period ? { type: 'text', text: `• Period (T): ${period} s (time for one revolution)` } : null,
          frequency ? { type: 'text', text: `• Frequency (f): ${frequency} Hz (revolutions per second)` } : null,
        ].filter(Boolean),
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Angular motion parameters are mathematically linked:' },
          { type: 'text', text: '' },
          { type: 'text', text: '1. Angular Velocity (ω):' },
          { type: 'formula', text: 'ω = 2π / T = 2πf' },
          { type: 'text', text: '' },
          { type: 'text', text: '2. Relationship between Linear and Angular Velocity:' },
          { type: 'formula', text: 'v = ω · r' },
          { type: 'text', text: '' },
          { type: 'text', text: '3. Period and Frequency:' },
          { type: 'formula', text: 'T = 1 / f' },
          { type: 'formula', text: 'f = 1 / T' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Determine Angular Velocity (ω)' },
          { type: 'text', text: `ω = ${w.toFixed(4)} rad/s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Frequency (f)' },
          { type: 'text', text: `f = ω / 2π = ${w.toFixed(4)} / ${(2 * Math.PI).toFixed(4)}` },
          { type: 'result', text: `f = ${f.toFixed(4)} Hz` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate Period (T)' },
          { type: 'text', text: `T = 1 / f = 1 / ${f.toFixed(4)}` },
          { type: 'result', text: `T = ${T.toFixed(4)} s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Calculate Linear Velocity (v)' },
          { type: 'text', text: `v = ω · r = ${w.toFixed(4)} × ${radius}` },
          { type: 'result', text: `v = ${linearV.toFixed(2)} m/s` },
        ],
      });

      // 4. ANALYSIS
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: '✅ COMPLETE ANGULAR MOTION SUMMARY:' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Angular Measurements:' },
          { type: 'result', text: `• Angular Velocity (ω) = ${w.toFixed(2)} rad/s` },
          { type: 'result', text: `• Angular Speed = ${degreesPerSecond.toFixed(1)} degrees/s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Time Measurements:' },
          { type: 'result', text: `• Period (T) = ${T.toFixed(3)} s per revolution` },
          { type: 'result', text: `• Frequency (f) = ${f.toFixed(3)} Hz (rev/s)` },
          { type: 'result', text: `• RPM = ${rpm.toFixed(1)} rev/min` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Linear Measurement:' },
          { type: 'result', text: `• Linear Velocity (v) = ${linearV.toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY CONCEPTS:' },
          { type: 'text', text: `• One complete revolution = 2π radians = 360°` },
          { type: 'text', text: `• At this angular speed, the object sweeps ${degreesPerSecond.toFixed(1)}° each second` },
          { type: 'text', text: `• Angular velocity (ω) is INDEPENDENT of radius - all points on a rotating disk have the same ω` },
          { type: 'text', text: `• Linear velocity (v) DEPENDS on radius - points farther from center move faster through space` },
        ],
      });
      result = `ω: ${w.toFixed(2)} rad/s, T: ${T.toFixed(2)}s, f: ${f.toFixed(2)} Hz`;
      break;
    }
  }

  return { result, steps };
}