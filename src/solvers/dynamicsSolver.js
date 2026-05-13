export function solveDynamics(mode, params) {
  const { mass, force, friction, angle, gravity, velocity, time, distance } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'newton2': {
      // F = ma
      const acceleration = force / mass;
      const weight = mass * gravity;
      
      steps.push({
        step: "NEWTON'S SECOND LAW",
        badge: 'primary',
        content: [
          { type: 'text', text: '💪 Newton\'s Second Law: F = ma' },
          { type: 'formula', text: 'a = F / m' },
          { type: 'text', text: `Applied Force: ${force} N` },
          { type: 'text', text: `Mass: ${mass} kg` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 1: Identify the net force' },
          { type: 'text', text: `F_net = ${force} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate acceleration' },
          { type: 'text', text: `a = ${force} / ${mass}` },
          { type: 'highlight', text: `a = ${acceleration.toFixed(2)} m/s²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Additional Info:' },
          { type: 'text', text: `Weight of object: W = mg = ${mass} × ${gravity} = ${weight.toFixed(1)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: `💡 This means the ${mass} kg object accelerates at ${acceleration.toFixed(2)} m/s every second.` },
          { type: 'text', text: `After 3 seconds, velocity would be ${(acceleration * 3).toFixed(1)} m/s (starting from rest).` },
        ],
      });
      result = `a = ${acceleration.toFixed(2)} m/s²`;
      break;
    }

    case 'friction': {
      const normalForce = mass * gravity;
      const frictionForce = friction * normalForce;
      const netForce = force - frictionForce;
      const acceleration = netForce / mass;
      
      steps.push({
        step: 'FRICTION ANALYSIS',
        badge: 'primary',
        content: [
          { type: 'text', text: '💪 Friction Force Analysis' },
          { type: 'formula', text: 'f = μN (friction = coefficient × normal force)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 1: Calculate Normal Force' },
          { type: 'text', text: `N = mg = ${mass} × ${gravity}` },
          { type: 'highlight', text: `N = ${normalForce.toFixed(1)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Friction Force' },
          { type: 'text', text: `f = μN = ${friction} × ${normalForce.toFixed(1)}` },
          { type: 'highlight', text: `f = ${frictionForce.toFixed(1)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Find Net Force' },
          { type: 'text', text: `F_net = Applied Force - Friction` },
          { type: 'text', text: `F_net = ${force} - ${frictionForce.toFixed(1)}` },
          { type: 'highlight', text: `F_net = ${netForce.toFixed(1)} N` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Calculate Acceleration' },
          { type: 'text', text: `a = F_net / m = ${netForce.toFixed(1)} / ${mass}` },
          { type: 'highlight', text: `a = ${acceleration.toFixed(2)} m/s²` },
          { type: 'text', text: '' },
          { type: 'text', text: netForce > 0 
            ? '✅ Net force is positive - object accelerates forward.'
            : netForce < 0 
              ? '⚠️ Friction exceeds applied force - object decelerates or won\'t move.'
              : '⚖️ Forces are balanced - object maintains constant velocity or stays at rest.'
          },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 Types of Friction:' },
          { type: 'text', text: '• Static friction (μs): Prevents motion from starting' },
          { type: 'text', text: '• Kinetic friction (μk): Opposes motion while sliding' },
          { type: 'text', text: '• μs > μk (harder to start moving than keep moving)' },
        ],
      });
      result = `a = ${acceleration.toFixed(2)} m/s² (f = ${frictionForce.toFixed(1)} N)`;
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
      const acceleration = netForce / mass;
      
      steps.push({
        step: 'INCLINED PLANE',
        badge: 'primary',
        content: [
          { type: 'text', text: '⛰️ Inclined Plane Analysis' },
          { type: 'text', text: `Angle: ${angle}°` },
          { type: 'text', text: `Mass: ${mass} kg` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 1: Resolve Weight into Components' },
          { type: 'formula', text: 'Parallel: mg·sin(θ)' },
          { type: 'formula', text: 'Perpendicular: mg·cos(θ)' },
          { type: 'text', text: `sin(${angle}°) = ${sinAngle.toFixed(4)}` },
          { type: 'text', text: `cos(${angle}°) = ${cosAngle.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Forces' },
          { type: 'text', text: `Weight = mg = ${mass} × ${gravity} = ${(mass * gravity).toFixed(1)} N` },
          { type: 'text', text: `Parallel Force = ${(mass * gravity).toFixed(1)} × ${sinAngle.toFixed(4)}` },
          { type: 'highlight', text: `F_parallel = ${parallelForce.toFixed(1)} N (pulling down slope)` },
          { type: 'text', text: `Normal Force = ${(mass * gravity).toFixed(1)} × ${cosAngle.toFixed(4)}` },
          { type: 'highlight', text: `N = ${normalForce.toFixed(1)} N (perpendicular to slope)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Include Friction' },
          { type: 'text', text: `Friction = μN = ${friction} × ${normalForce.toFixed(1)}` },
          { type: 'highlight', text: `f = ${frictionForce.toFixed(1)} N (opposing motion)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Net Force & Acceleration' },
          { type: 'text', text: `F_net = ${parallelForce.toFixed(1)} - ${frictionForce.toFixed(1)}` },
          { type: 'highlight', text: `F_net = ${netForce.toFixed(1)} N` },
          { type: 'text', text: `a = ${netForce.toFixed(1)} / ${mass}` },
          { type: 'highlight', text: `a = ${acceleration.toFixed(2)} m/s²` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Without friction (μ = 0):' },
          { type: 'text', text: `Acceleration would be g·sin(θ) = ${(gravity * sinAngle).toFixed(2)} m/s²` },
          { type: 'text', text: `The steeper the incline (larger θ), the greater the acceleration.` },
        ],
      });
      result = `a = ${acceleration.toFixed(2)} m/s² down the incline`;
      break;
    }

    case 'momentum': {
      const momentum = mass * velocity;
      const impulse = force * time;
      const finalVelocity = (mass * velocity + force * time) / mass;
      
      steps.push({
        step: 'MOMENTUM & IMPULSE',
        badge: 'primary',
        content: [
          { type: 'text', text: '💫 Momentum & Impulse Theorem' },
          { type: 'formula', text: 'p = mv (momentum)' },
          { type: 'formula', text: 'J = Ft = Δp (impulse = change in momentum)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 1: Calculate Initial Momentum' },
          { type: 'text', text: `p_i = m × v = ${mass} × ${velocity}` },
          { type: 'highlight', text: `p_i = ${momentum.toFixed(1)} kg·m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Impulse Applied' },
          { type: 'text', text: `J = F × t = ${force} × ${time}` },
          { type: 'highlight', text: `J = ${impulse.toFixed(1)} N·s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Final Momentum & Velocity' },
          { type: 'text', text: `p_f = p_i + J = ${momentum.toFixed(1)} + ${impulse.toFixed(1)}` },
          { type: 'highlight', text: `p_f = ${(momentum + impulse).toFixed(1)} kg·m/s` },
          { type: 'text', text: `v_f = p_f / m = ${(momentum + impulse).toFixed(1)} / ${mass}` },
          { type: 'highlight', text: `v_f = ${finalVelocity.toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Conservation of Momentum:' },
          { type: 'text', text: 'In collisions, total momentum before = total momentum after.' },
          { type: 'text', text: `Example: A ${mass} kg ball at ${velocity} m/s has enough momentum to...` },
          { type: 'text', text: `...knock over a ${momentum.toFixed(0)} kg object at 1 m/s in a perfectly inelastic collision.` },
        ],
      });
      result = `p = ${momentum.toFixed(1)} kg·m/s, v_f = ${finalVelocity.toFixed(2)} m/s`;
      break;
    }

    case 'weight': {
      const weightOnEarth = mass * 9.81;
      const weightOnMoon = mass * 1.62;
      const weightOnMars = mass * 3.71;
      const weightOnJupiter = mass * 24.79;
      
      steps.push({
        step: 'WEIGHT & GRAVITY',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚖️ Weight vs. Mass' },
          { type: 'formula', text: 'W = mg (Weight = mass × gravitational acceleration)' },
          { type: 'text', text: '' },
          { type: 'text', text: `Mass: ${mass} kg (same everywhere in the universe!)` },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 Weight on Different Celestial Bodies:' },
          { type: 'highlight', text: `Earth: ${weightOnEarth.toFixed(1)} N (g = 9.81 m/s²)` },
          { type: 'text', text: `Moon: ${weightOnMoon.toFixed(1)} N (g = 1.62 m/s²) - ${((weightOnMoon/weightOnEarth)*100).toFixed(0)}% of Earth weight` },
          { type: 'text', text: `Mars: ${weightOnMars.toFixed(1)} N (g = 3.71 m/s²) - ${((weightOnMars/weightOnEarth)*100).toFixed(0)}% of Earth weight` },
          { type: 'text', text: `Jupiter: ${weightOnJupiter.toFixed(1)} N (g = 24.79 m/s²) - ${((weightOnJupiter/weightOnEarth)*100).toFixed(0)}% of Earth weight` },
          { type: 'text', text: '' },
          { type: 'text', text: '⭐ Key Concepts:' },
          { type: 'text', text: '• Mass (kg): Amount of matter - NEVER changes' },
          { type: 'text', text: '• Weight (N): Force due to gravity - DEPENDS on location' },
          { type: 'text', text: '• On the Moon, you weigh 1/6th but your mass is the same!' },
          { type: 'text', text: '• In deep space (no gravity), you\'d be weightless but still have mass.' },
        ],
      });
      result = `${weightOnEarth.toFixed(1)} N on Earth (${(weightOnEarth/9.81).toFixed(1)} kg mass)`;
      break;
    }

    default:
      throw new Error('Unknown dynamics mode');
  }

  return { result, steps };
}