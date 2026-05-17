export function solveDynamics(mode, params) {
  const { mass, force, friction, angle, gravity, velocity, time, distance } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'newton2': {
      const acceleration = force / mass;
      const weight = mass * gravity;
      
      steps.push({
        step: "GIVEN VALUES",
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Applied Force (F): ${force} N` },
          { type: 'text', text: `• Local Gravity (g): ${gravity} m/s²` },
        ],
      });

      steps.push({
        step: "EQUATIONS",
        badge: 'formula',
        content: [
          { type: 'text', text: 'Newton\'s Second Law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass:' },
          { type: 'formula', text: 'ΣF = m · a' },
          { type: 'text', text: 'Solving for acceleration (a):' },
          { type: 'formula', text: 'a = F / m' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `a = ${force} N / ${mass} kg` },
          { type: 'highlight', text: `a = ${acceleration.toFixed(2)} m/s²` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The object will accelerate at ${acceleration.toFixed(2)} m/s² in the direction of the force.` },
          { type: 'text', text: `Weight Check: On this planet, the object's weight is ${weight.toFixed(1)} N (W = mg).` },
          { type: 'text', text: '💡 Did you know? If you doubled the force, the acceleration would double. If you doubled the mass, the acceleration would be cut in half.' },
        ],
      });
      result = `${acceleration.toFixed(2)} m/s²`;
      break;
    }

    case 'friction': {
      const normalForce = mass * gravity;
      const frictionForce = friction * normalForce;
      const netForce = force - frictionForce;
      const acceleration = Math.max(0, netForce / mass);
      
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Applied Force (F): ${force} N` },
          { type: 'text', text: `• Coefficient of Friction (μ): ${friction}` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: '1. Normal Force (N) on a flat surface:' },
          { type: 'formula', text: 'N = m · g' },
          { type: 'text', text: '2. Friction Force (f):' },
          { type: 'formula', text: 'f = μ · N' },
          { type: 'text', text: '3. Net Force (F_net):' },
          { type: 'formula', text: 'F_net = F_applied - f' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Normal Force: ${mass} × ${gravity} = ${normalForce.toFixed(1)} N` },
          { type: 'text', text: `2. Friction Force: ${friction} × ${normalForce.toFixed(1)} = ${frictionForce.toFixed(1)} N` },
          { type: 'text', text: `3. Net Force: ${force} - ${frictionForce.toFixed(1)} = ${netForce.toFixed(1)} N` },
          { type: 'highlight', text: `a = ${acceleration.toFixed(2)} m/s²` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: netForce > 0 
            ? 'The applied force is greater than friction, so the object accelerates.'
            : 'The applied force is not enough to overcome friction. The object remains at rest.'
          },
          { type: 'text', text: '💡 Static vs Kinetic: Usually, it takes more force to start an object moving (static) than to keep it moving (kinetic).' },
        ],
      });
      result = `${acceleration.toFixed(2)} m/s²`;
      break;
    }

    case 'inclinedPlane': {
      const angleRad = (angle * Math.PI) / 180;
      const sinAngle = Math.sin(angleRad);
      const cosAngle = Math.cos(angleRad);
      const normalForce = mass * gravity * cosAngle;
      const parallelForce = mass * gravity * sinAngle;
      const frictionForce = friction * normalForce;
      const netForce = parallelForce - frictionForce;
      const acceleration = Math.max(0, netForce / mass);
      
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Incline Angle (θ): ${angle}°` },
          { type: 'text', text: `• Coefficient of Friction (μ): ${friction}` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'We resolve the weight (mg) into components:' },
          { type: 'formula', text: 'F_parallel = m · g · sin(θ)' },
          { type: 'formula', text: 'F_perpendicular (Normal) = m · g · cos(θ)' },
          { type: 'text', text: 'Acceleration (a) down the slope:' },
          { type: 'formula', text: 'a = (F_parallel - f) / m' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Parallel Force: ${parallelForce.toFixed(1)} N` },
          { type: 'text', text: `2. Normal Force: ${normalForce.toFixed(1)} N` },
          { type: 'text', text: `3. Friction: ${frictionForce.toFixed(1)} N` },
          { type: 'highlight', text: `a = ${acceleration.toFixed(2)} m/s²` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: acceleration > 0
            ? 'The component of gravity pulling the object down the slope exceeds friction.'
            : 'Friction is strong enough to keep the object from sliding down.'
          },
          { type: 'text', text: '💡 Tilt Tip: As the angle increases, sin(θ) increases (more pull down) and cos(θ) decreases (less normal force/friction).' },
        ],
      });
      result = `${acceleration.toFixed(2)} m/s²`;
      break;
    }

    case 'momentum': {
      const momentum = mass * velocity;
      const impulse = force * time;
      const finalVelocity = (momentum + impulse) / mass;
      
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Initial Velocity (v): ${velocity} m/s` },
          { type: 'text', text: `• Applied Force (F): ${force} N` },
          { type: 'text', text: `• Time Duration (Δt): ${time} s` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'formula', text: 'p = m · v (Momentum)' },
          { type: 'formula', text: 'J = F · Δt (Impulse)' },
          { type: 'formula', text: 'Δp = J (Impulse-Momentum Theorem)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Initial Momentum: ${mass} × ${velocity} = ${momentum.toFixed(1)} kg·m/s` },
          { type: 'text', text: `2. Impulse: ${force} × ${time} = ${impulse.toFixed(1)} N·s` },
          { type: 'highlight', text: `Final Velocity = ${finalVelocity.toFixed(2)} m/s` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The force applied for ${time}s changed the object's velocity from ${velocity} m/s to ${finalVelocity.toFixed(2)} m/s.` },
          { type: 'text', text: '💡 Impulse is what you feel in a car crash; air bags increase the time (Δt) of impact to reduce the force (F) required to change your momentum.' },
        ],
      });
      result = `${finalVelocity.toFixed(2)} m/s`;
      break;
    }

    case 'weight': {
      const weightOnEarth = mass * 9.81;

      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Mass: ${mass} kg` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Weight is the force of gravity acting on a mass:' },
          { type: 'formula', text: 'W = m · g' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `W = ${mass} kg × 9.81 m/s²` },
          { type: 'highlight', text: `Weight = ${weightOnEarth.toFixed(1)} N` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `On Earth, this object weighs ${weightOnEarth.toFixed(1)} Newtons.` },
          { type: 'text', text: '⚠️ Remember: Mass is the amount of matter (remains constant), while Weight is a force (changes with gravity).' },
          { type: 'text', text: `On the Moon, this same ${mass}kg mass would only weigh about ${(mass * 1.62).toFixed(1)} N.` },
        ],
      });
      result = `${weightOnEarth.toFixed(1)} N`;
      break;
    }

    default:
      throw new Error('Unknown dynamics mode');
  }

  return { result, steps };
}
