export function solveWaves(mode, params) {
  const { frequency, wavelength, speed, period, amplitude } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'waveSpeed': {
      const calcSpeed = frequency * wavelength;
      
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Wave Properties:' },
          { type: 'text', text: `• Frequency (f): ${frequency} Hz` },
          { type: 'text', text: `• Wavelength (λ): ${wavelength} m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Frequency = number of complete waves passing a point per second.' },
          { type: 'text', text: 'Wavelength = distance between two consecutive crests or troughs.' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Wave speed (v) is the distance a wave crest travels per unit time:' },
          { type: 'formula', text: 'v = f · λ' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• v = wave speed (m/s)' },
          { type: 'text', text: '• f = frequency (Hz)' },
          { type: 'text', text: '• λ = wavelength (m)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'This formula applies to ALL types of waves: sound, light, water, seismic, etc.' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Substitute the known values' },
          { type: 'text', text: `v = f × λ` },
          { type: 'text', text: `v = ${frequency} Hz × ${wavelength} m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Multiply' },
          { type: 'text', text: `v = ${(frequency * wavelength).toFixed(4)}` },
          { type: 'result', text: `v = ${calcSpeed.toFixed(2)} m/s` },
        ],
      });

      // 4. ANALYSIS
      const timeForOneWavelength = 1 / frequency;
      const wavesPer100m = 100 / wavelength;
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The wave travels at ${calcSpeed.toFixed(2)} m/s.` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 WAVE CHARACTERISTICS:' },
          { type: 'text', text: `• Time for one complete wave to pass: ${timeForOneWavelength.toFixed(4)} s` },
          { type: 'text', text: `• Number of complete waves in 100m: ${wavesPer100m.toFixed(1)}` },
          { type: 'text', text: `• In 1 second, the wave travels ${calcSpeed.toFixed(2)}m (${(calcSpeed/wavelength).toFixed(1)} wavelengths)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY RELATIONSHIPS:' },
          { type: 'text', text: '• If frequency doubles, wavelength halves (speed constant in same medium)' },
          { type: 'text', text: '• Higher frequency = shorter wavelength = more energy' },
          { type: 'text', text: '• Wave speed depends on the MEDIUM, not on frequency or wavelength' },
        ],
      });
      result = `${calcSpeed.toFixed(2)} m/s`;
      break;
    }

    case 'frequency': {
      const calcPeriod = 1 / frequency;
      const angularFreq = 2 * Math.PI * frequency;
      const degreesPerSecond = 360 * frequency;
      
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Frequency Analysis:' },
          { type: 'text', text: `• Linear Frequency (f): ${frequency} Hz` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Frequency tells us how many complete cycles occur per second.' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: '1. Period (T): Time for one complete oscillation' },
          { type: 'formula', text: 'T = 1 / f' },
          { type: 'text', text: '' },
          { type: 'text', text: '2. Angular Frequency (ω): Rate of phase change in radians per second' },
          { type: 'formula', text: 'ω = 2π · f' },
          { type: 'text', text: '' },
          { type: 'text', text: 'One complete cycle = 2π radians = 360°' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate the Period (T)' },
          { type: 'text', text: `T = 1 / f = 1 / ${frequency}` },
          { type: 'result', text: `T = ${calcPeriod.toFixed(4)} s` },
          { type: 'text', text: `Each complete cycle takes ${calcPeriod.toFixed(4)} seconds.` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate Angular Frequency (ω)' },
          { type: 'text', text: `ω = 2π × f = 2 × 3.14159 × ${frequency}` },
          { type: 'text', text: `ω = ${(2 * Math.PI).toFixed(4)} × ${frequency}` },
          { type: 'result', text: `ω = ${angularFreq.toFixed(2)} rad/s` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Convert to degrees per second' },
          { type: 'text', text: `360° × f = 360° × ${frequency}` },
          { type: 'result', text: `${degreesPerSecond.toFixed(1)} degrees/s` },
        ],
      });

      // 4. ANALYSIS
      const cyclesInOneMinute = frequency * 60;
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: '✅ FREQUENCY ANALYSIS SUMMARY:' },
          { type: 'text', text: '' },
          { type: 'result', text: `• Period (T) = ${calcPeriod.toFixed(4)} s` },
          { type: 'result', text: `• Angular Frequency (ω) = ${angularFreq.toFixed(2)} rad/s` },
          { type: 'result', text: `• ${degreesPerSecond.toFixed(1)} degrees/s` },
          { type: 'result', text: `• ${cyclesInOneMinute.toFixed(0)} cycles per minute` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 PRACTICAL EXAMPLES:' },
          { type: 'text', text: `• ${frequency} Hz means ${frequency} complete cycles every second` },
          { type: 'text', text: `• Mains electricity: 50/60 Hz (region dependent)` },
          { type: 'text', text: `• Human hearing: 20 Hz - 20,000 Hz` },
          { type: 'text', text: `• Middle C note: ~261.6 Hz` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Angular frequency (ω) is preferred in physics equations because it simplifies calculus with sine/cosine functions.' },
        ],
      });
      result = `T: ${calcPeriod.toFixed(4)} s, ω: ${angularFreq.toFixed(2)} rad/s`;
      break;
    }

    case 'sound': {
      const soundSpeed = 343; // speed of sound in air at 20°C
      const calcWavelengthSound = soundSpeed / frequency;
      const isAudible = frequency >= 20 && frequency <= 20000;
      
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Sound Wave Analysis (in Air at 20°C):' },
          { type: 'text', text: `• Frequency (f): ${frequency} Hz` },
          { type: 'text', text: '• Speed of Sound (v): 343 m/s (at 20°C)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'The speed of sound varies with temperature and medium:' },
          { type: 'text', text: '• Air at 0°C: 331 m/s' },
          { type: 'text', text: '• Air at 20°C: 343 m/s' },
          { type: 'text', text: '• Water: ~1,500 m/s' },
          { type: 'text', text: '• Steel: ~5,000 m/s' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The wavelength (λ) is the spatial period of the wave - the distance between consecutive compressions or rarefactions:' },
          { type: 'formula', text: 'λ = v / f' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• λ = wavelength (m)' },
          { type: 'text', text: '• v = speed of sound (343 m/s)' },
          { type: 'text', text: '• f = frequency (Hz)' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Divide speed of sound by frequency' },
          { type: 'text', text: `λ = v / f` },
          { type: 'text', text: `λ = 343 / ${frequency}` },
          { type: 'result', text: `λ = ${calcWavelengthSound.toFixed(3)} m` },
          { type: 'text', text: '' },
          { type: 'text', text: `This means one complete sound wave spans ${calcWavelengthSound.toFixed(3)} meters.` },
        ],
      });

      // 4. ANALYSIS
      const halfWavelength = calcWavelengthSound / 2;
      const quarterWavelength = calcWavelengthSound / 4;
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: isAudible 
            ? '✅ This frequency is AUDIBLE to humans (20 Hz - 20,000 Hz).'
            : frequency < 20 
              ? '📉 This is INFRASOUND (below human hearing range).'
              : '📈 This is ULTRASOUND (above human hearing range).'
          },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 WAVELENGTH DETAILS:' },
          { type: 'result', text: `• Wavelength = ${calcWavelengthSound.toFixed(3)} m` },
          { type: 'text', text: `• Half-wavelength = ${halfWavelength.toFixed(3)} m (for interference)` },
          { type: 'text', text: `• Quarter-wavelength = ${quarterWavelength.toFixed(3)} m (for resonance tubes)` },
          { type: 'text', text: '' },
          { type: 'text', text: '🎵 MUSICAL CONTEXT:' },
          { type: 'text', text: `• A${frequency >= 440 ? 'bove' : 't or below'} concert A (440 Hz)` },
          { type: 'text', text: `• This is ${frequency < 261.6 ? 'lower' : frequency > 261.6 ? 'higher' : ''} than middle C (261.6 Hz)` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 APPLICATIONS:' },
          { type: 'text', text: '• Ultrasound (>20 kHz): Medical imaging, sonar, cleaning' },
          { type: 'text', text: '• Infrasound (<20 Hz): Earthquake detection, elephant communication' },
          { type: 'text', text: '• Audible range: Speech (85-255 Hz), music, environmental sounds' },
        ],
      });
      result = `${calcWavelengthSound.toFixed(3)} m`;
      break;
    }
  }

  return { result, steps };
}