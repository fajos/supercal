export function solveDynamics(mode, params) {
  const { mass, force, friction, angle, gravity, velocity, time, distance } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'newton2': {
      const acceleration = force / mass;
      const weight = mass * gravity;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: "📝 Parameters for Newton's Second Law:" },
          { type: 'text', text: `• Mass of the object (m): ${mass} kg` },
          { type: 'text', text: `• Net Force applied (F): ${force} N` },
          { type: 'text', text: `• Local Gravitational Field (g): ${gravity} m/s²` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: "Newton's Second Law states that acceleration is directly proportional to net force and inversely proportional to mass:" },
          { type: 'formula', text: 'ΣF = m · a' },
          { type: 'text', text: 'Rearranging to solve for acceleration (a):' },
          { type: 'formula', text: 'a = F / m' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Substitute force and mass into the equation.' },
          { type: 'text', text: `a = ${force} N / ${mass} kg` },
          { type: 'text', text: `a = ${acceleration.toFixed(4)}...` },
          { type: 'result', text: `a = ${acceleration.toFixed(2)} m/s²` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The object will accelerate at ${acceleration.toFixed(2)} m/s² in the direction of the force.` },
          { type: 'text', text: `• Weight Check: On this planet, the object's weight is ${weight.toFixed(1)} N (W = mg).` },
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
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Friction Analysis Parameters:' },
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Applied Pulling Force (F): ${force} N` },
          { type: 'text', text: `• Coefficient of Friction (μ): ${friction}` },
          { type: 'text', text: `• Gravity (g): ${gravity} m/s²` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'We must first determine if the force overcomes friction:' },
          { type: 'text', text: '1. Normal Force (N) on a flat surface:' },
          { type: 'formula', text: 'N = m · g' },
          { type: 'text', text: '2. Frictional Force (f):' },
          { type: 'formula', text: 'f = μ · N' },
          { type: 'text', text: '3. Resultant Acceleration (a):' },
          { type: 'formula', text: 'a = (F_applied − f) / m' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate Normal Force' },
          { type: 'text', text: `N = ${mass} kg × ${gravity} m/s² = ${normalForce.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Frictional Resistance' },
          { type: 'text', text: `f = ${friction} × ${normalForce.toFixed(2)} N = ${frictionForce.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate Net Force' },
          { type: 'text', text: `ΣF = ${force} N − ${frictionForce.toFixed(2)} N = ${netForce.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Determine Acceleration' },
          { type: 'text', text: `a = ${netForce.toFixed(2)} N / ${mass} kg` },
          { type: 'result', text: `a = ${acceleration.toFixed(2)} m/s²` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: netForce > 0 
            ? '✅ The applied force is greater than friction, so the object accelerates.'
            : '❌ The applied force is not enough to overcome friction. The object remains at rest.'
          },
          { type: 'text', text: '💡 Static vs Kinetic: Usually, it takes more force to start an object moving (static friction) than to keep it moving (kinetic friction).' },
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
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters for an object on an inclined plane:' },
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Angle (θ): ${angle}°` },
          { type: 'text', text: `• Coefficient of Friction (μ): ${friction}` },
          { type: 'text', text: `• Gravity (g): ${gravity} m/s²` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'We resolve gravity into components parallel and perpendicular to the slope:' },
          { type: 'formula', text: 'F_parallel = m · g · sin(θ)' },
          { type: 'formula', text: 'F_normal = m · g · cos(θ)' },
          { type: 'text', text: 'Net acceleration down the slope:' },
          { type: 'formula', text: 'a = (F_parallel − f) / m' },
          { type: 'formula', text: 'f = μ · F_normal' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate trigonometric values' },
          { type: 'text', text: `sin(${angle}°) = ${sinAngle.toFixed(4)}` },
          { type: 'text', text: `cos(${angle}°) = ${cosAngle.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Resolve gravity into components' },
          { type: 'text', text: `F_parallel = ${mass} × ${gravity} × ${sinAngle.toFixed(4)} = ${parallelForce.toFixed(2)} N` },
          { type: 'text', text: `F_normal = ${mass} × ${gravity} × ${cosAngle.toFixed(4)} = ${normalForce.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate friction force' },
          { type: 'text', text: `f = ${friction} × ${normalForce.toFixed(2)} = ${frictionForce.toFixed(2)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Calculate net force and acceleration' },
          { type: 'text', text: `ΣF = ${parallelForce.toFixed(2)} − ${frictionForce.toFixed(2)} = ${netForce.toFixed(2)} N` },
          { type: 'result', text: `a = ${netForce.toFixed(2)} / ${mass} = ${acceleration.toFixed(2)} m/s²` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: acceleration > 0
            ? '✅ The component of gravity pulling the object down the slope exceeds friction.'
            : '❌ Friction is strong enough to keep the object from sliding down.'
          },
          { type: 'text', text: '💡 Tilt Tip: As the angle increases, sin(θ) increases (more pull down) and cos(θ) decreases (less normal force/friction).' },
          { type: 'text', text: `💡 At ${angle}°, gravity pulls with ${(sinAngle * 100).toFixed(1)}% of its full force down the slope.` },
        ],
      });
      result = `${acceleration.toFixed(2)} m/s²`;
      break;
    }

    case 'momentum': {
      const momentum = mass * velocity;
      const impulse = force * time;
      const finalVelocity = (momentum + impulse) / mass;
      const initialKE = 0.5 * mass * velocity * velocity;
      const finalKE = 0.5 * mass * finalVelocity * finalVelocity;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Momentum & Impulse Analysis:' },
          { type: 'text', text: `• Mass (m): ${mass} kg` },
          { type: 'text', text: `• Initial Velocity (v): ${velocity} m/s` },
          { type: 'text', text: `• Applied Force (F): ${force} N` },
          { type: 'text', text: `• Time of Application (Δt): ${time} s` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Momentum is the product of mass and velocity:' },
          { type: 'formula', text: 'p = m · v' },
          { type: 'text', text: 'Impulse equals the change in momentum:' },
          { type: 'formula', text: 'J = F · Δt = Δp' },
          { type: 'text', text: 'Final velocity from impulse:' },
          { type: 'formula', text: 'v_final = (p_initial + J) / m' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate initial momentum' },
          { type: 'text', text: `p = ${mass} kg × ${velocity} m/s = ${momentum.toFixed(2)} kg·m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate impulse delivered' },
          { type: 'text', text: `J = ${force} N × ${time} s = ${impulse.toFixed(2)} N·s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate final momentum and velocity' },
          { type: 'text', text: `p_final = ${momentum.toFixed(2)} + ${impulse.toFixed(2)} = ${(momentum + impulse).toFixed(2)} kg·m/s` },
          { type: 'text', text: `v_final = ${(momentum + impulse).toFixed(2)} / ${mass} = ${finalVelocity.toFixed(2)} m/s` },
          { type: 'result', text: `Final Velocity = ${finalVelocity.toFixed(2)} m/s` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The force applied for ${time}s changed the object's velocity from ${velocity} m/s to ${finalVelocity.toFixed(2)} m/s.` },
          { type: 'text', text: `📊 Kinetic Energy changed from ${initialKE.toFixed(1)} J to ${finalKE.toFixed(1)} J` },
          { type: 'text', text: '💡 Impulse is what you feel in a car crash; airbags increase the time (Δt) of impact to reduce the force (F) required to change your momentum.' },
        ],
      });
      result = `${finalVelocity.toFixed(2)} m/s`;
      break;
    }

    case 'weight': {
      const weightOnEarth = mass * 9.81;
      const weightOnMoon = mass * 1.62;
      const weightOnMars = mass * 3.71;
      const weightOnJupiter = mass * 24.79;

      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Weight Calculation:' },
          { type: 'text', text: `• Mass: ${mass} kg` },
          { type: 'text', text: 'Weight varies depending on the gravitational field strength.' },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Weight is the force of gravity acting on a mass:' },
          { type: 'formula', text: 'W = m · g' },
          { type: 'text', text: 'Where g varies by celestial body:' },
          { type: 'text', text: '• Earth: g = 9.81 m/s²' },
          { type: 'text', text: '• Moon: g = 1.62 m/s²' },
          { type: 'text', text: '• Mars: g = 3.71 m/s²' },
          { type: 'text', text: '• Jupiter: g = 24.79 m/s²' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Weight on different celestial bodies:' },
          { type: 'text', text: `Earth: W = ${mass} × 9.81 = ${weightOnEarth.toFixed(1)} N` },
          { type: 'text', text: `Moon: W = ${mass} × 1.62 = ${weightOnMoon.toFixed(1)} N` },
          { type: 'text', text: `Mars: W = ${mass} × 3.71 = ${weightOnMars.toFixed(1)} N` },
          { type: 'text', text: `Jupiter: W = ${mass} × 24.79 = ${weightOnJupiter.toFixed(1)} N` },
          { type: 'result', text: `Earth Weight = ${weightOnEarth.toFixed(1)} N` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ On Earth, this object weighs ${weightOnEarth.toFixed(1)} Newtons.` },
          { type: 'text', text: `🌙 On the Moon, it would weigh only ${weightOnMoon.toFixed(1)} N (${((weightOnMoon/weightOnEarth)*100).toFixed(1)}% of Earth weight).` },
          { type: 'text', text: '⚠️ Remember: Mass is the amount of matter (remains constant everywhere), while Weight is a force (changes with gravity).' },
          { type: 'text', text: '💡 You would weigh about 1/6 of your Earth weight on the Moon!' },
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