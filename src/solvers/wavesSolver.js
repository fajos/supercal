export function solveWaves(mode, params) {
  const { frequency, wavelength, speed, period, amplitude } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'waveSpeed': {
      const calcSpeed = frequency * wavelength;
      const calcWavelength = speed / frequency;
      const calcFrequency = speed / wavelength;
      
      steps.push({
        step: 'WAVE SPEED',
        badge: 'primary',
        content: [
          { type: 'text', text: '🌊 Wave Speed Equation' },
          { type: 'formula', text: 'v = f × λ' },
          { type: 'text', text: 'where:' },
          { type: 'text', text: 'v = wave speed (m/s)' },
          { type: 'text', text: 'f = frequency (Hz)' },
          { type: 'text', text: 'λ = wavelength (m)' },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 With your values:' },
          { type: 'text', text: `v = ${frequency} Hz × ${wavelength} m` },
          { type: 'highlight', text: `v = ${calcSpeed.toFixed(2)} m/s` },
          { type: 'text', text: '' },
          { type: 'text', text: '📝 Alternative forms:' },
          { type: 'text', text: `λ = v/f = ${speed}/${frequency} = ${calcWavelength.toFixed(2)} m` },
          { type: 'text', text: `f = v/λ = ${speed}/${wavelength} = ${calcFrequency.toFixed(2)} Hz` },
        ],
      });
      result = `${calcSpeed.toFixed(2)} m/s`;
      break;
    }

    case 'frequency': {
      const calcPeriod = 1 / frequency;
      const calcFreqFromPeriod = 1 / period;
      const angularFreq = 2 * Math.PI * frequency;
      
      steps.push({
        step: 'FREQUENCY & PERIOD',
        badge: 'primary',
        content: [
          { type: 'text', text: '🌊 Frequency & Period Relationship' },
          { type: 'formula', text: 'f = 1/T  and  T = 1/f' },
          { type: 'text', text: `Frequency f = ${frequency} Hz` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Period (T):' },
          { type: 'text', text: `T = 1/f = 1/${frequency} = ${calcPeriod.toFixed(4)} seconds` },
          { type: 'highlight', text: `T = ${calcPeriod.toFixed(4)} s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Verification (from period):' },
          { type: 'text', text: `f = 1/T = 1/${period} = ${calcFreqFromPeriod.toFixed(2)} Hz` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Angular Frequency (ω):' },
          { type: 'text', text: `ω = 2πf = 2π × ${frequency}` },
          { type: 'highlight', text: `ω = ${angularFreq.toFixed(2)} rad/s` },
          { type: 'text', text: '' },
          { type: 'text', text: `💡 ${frequency} Hz means ${frequency} complete wave cycles per second.` },
          { type: 'text', text: `Each cycle takes ${calcPeriod.toFixed(4)} seconds.` },
        ],
      });
      result = `f = ${frequency} Hz, T = ${calcPeriod.toFixed(4)} s, ω = ${angularFreq.toFixed(1)} rad/s`;
      break;
    }

    case 'sound': {
      const soundSpeed = 343; // speed of sound in air at 20°C
      const calcWavelengthSound = soundSpeed / frequency;
      const isAudible = frequency >= 20 && frequency <= 20000;
      
      steps.push({
        step: 'SOUND WAVES',
        badge: 'primary',
        content: [
          { type: 'text', text: '🔊 Sound Wave Analysis' },
          { type: 'text', text: `Frequency: ${frequency} Hz` },
          { type: 'text', text: `Speed of sound in air: ${soundSpeed} m/s (at 20°C)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Wavelength in air:' },
          { type: 'text', text: `λ = v/f = ${soundSpeed}/${frequency}` },
          { type: 'highlight', text: `λ = ${calcWavelengthSound.toFixed(3)} m` },
          { type: 'text', text: '' },
          { type: 'text', text: isAudible 
            ? '👂 This frequency is AUDIBLE to human ears (20 Hz - 20,000 Hz).'
            : frequency < 20 
              ? '📉 This is INFRASOUND (below human hearing range).'
              : '📈 This is ULTRASOUND (above human hearing range).'
          },
          { type: 'text', text: '' },
          { type: 'text', text: '🎵 Musical Note Reference:' },
          { type: 'text', text: frequency === 440 ? 'A4 (440 Hz) - Standard tuning pitch' :
            frequency === 262 ? 'Middle C (262 Hz)' :
            frequency === 330 ? 'E4 (330 Hz)' :
            frequency === 349 ? 'F4 (349 Hz)' :
            frequency === 392 ? 'G4 (392 Hz)' :
            frequency === 494 ? 'B4 (494 Hz)' :
            frequency === 523 ? 'C5 (523 Hz)' :
            `Frequency ${frequency} Hz`
          },
        ],
      });
      result = `λ = ${calcWavelengthSound.toFixed(3)} m (${isAudible ? 'Audible' : frequency < 20 ? 'Infrasound' : 'Ultrasound'})`;
      break;
    }
  }

  return { result, steps };
}