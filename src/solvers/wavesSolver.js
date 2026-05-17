export function solveWaves(mode, params) {
  const { frequency, wavelength, speed, period, amplitude } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'waveSpeed': {
      const calcSpeed = frequency * wavelength;
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Frequency (f): ${frequency} Hz` },
          { type: 'text', text: `• Wavelength (λ): ${wavelength} m` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The speed of a wave (v) is determined by how many cycles (f) pass a point per second and the length of each cycle (λ):' },
          { type: 'formula', text: 'v = f · λ' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `v = ${frequency} Hz × ${wavelength} m` },
          { type: 'highlight', text: `v = ${calcSpeed.toFixed(2)} m/s` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The wave travels at ${calcSpeed.toFixed(2)} meters per second.` },
          { type: 'text', text: '💡 If the medium doesn\'t change, the wave speed usually stays constant. In that case, if you increase the frequency, the wavelength must decrease.' },
        ],
      });
      result = `${calcSpeed.toFixed(2)} m/s`;
      break;
    }

    case 'frequency': {
      const calcPeriod = 1 / frequency;
      const angularFreq = 2 * Math.PI * frequency;
      
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Frequency (f): ${frequency} Hz` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: '1. Period (T) - the time for one complete cycle:' },
          { type: 'formula', text: 'T = 1 / f' },
          { type: 'text', text: '2. Angular Frequency (ω) - the rate of change of phase:' },
          { type: 'formula', text: 'ω = 2π · f' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `T = 1 / ${frequency} = ${calcPeriod.toFixed(4)} s` },
          { type: 'text', text: `ω = 2 × π × ${frequency} = ${angularFreq.toFixed(2)} rad/s` },
          { type: 'highlight', text: `Period (T) = ${calcPeriod.toFixed(4)} s` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `A frequency of ${frequency} Hz means the wave oscillates ${frequency} times every second.` },
          { type: 'text', text: `Each oscillation takes only ${calcPeriod.toFixed(4)} seconds to complete.` },
        ],
      });
      result = `${calcPeriod.toFixed(4)} s`;
      break;
    }

    case 'sound': {
      const soundSpeed = 343; // speed of sound in air at 20°C
      const calcWavelengthSound = soundSpeed / frequency;
      const isAudible = frequency >= 20 && frequency <= 20000;
      
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Frequency: ${frequency} Hz` },
          { type: 'text', text: `• Speed of sound (v) approx: 343 m/s (at 20°C)` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'To find the wavelength (λ) of sound in air:' },
          { type: 'formula', text: 'λ = v / f' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `λ = 343 m/s / ${frequency} Hz` },
          { type: 'highlight', text: `λ = ${calcWavelengthSound.toFixed(3)} m` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: isAudible 
            ? '✅ This frequency is within the human audible range (20 Hz - 20 kHz).'
            : frequency < 20 
              ? '📉 This is Infrasound (below human hearing).'
              : '📈 This is Ultrasound (above human hearing).'
          },
          { type: 'text', text: `The distance between consecutive compressions (peaks) in the air is ${calcWavelengthSound.toFixed(3)} meters.` },
        ],
      });
      result = `${calcWavelengthSound.toFixed(3)} m`;
      break;
    }
  }

  return { result, steps };
}
