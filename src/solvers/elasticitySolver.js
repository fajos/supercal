export function solveElasticity(mode, params) {
  const { force, extension, originalLength, area, youngsModulus, energy } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'hookesLaw': {
      // F = ke => k = F/e
      const k = force / extension;
      steps.push({
        step: "HOOKE'S LAW",
        badge: 'primary',
        content: [
          { type: 'text', text: '📏 Calculating Force Constant (k):' },
          { type: 'formula', text: 'F = ke' },
          { type: 'text', text: `Applied Force (F) = ${force} N` },
          { type: 'text', text: `Extension (e) = ${extension} m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Rearranging for k:' },
          { type: 'formula', text: 'k = F / e' },
          { type: 'text', text: `k = ${force} / ${extension}` },
          { type: 'highlight', text: `Spring Constant (k) = ${k.toFixed(2)} N/m` },
          { type: 'text', text: '' },
          { type: 'text', text: "💡 Hooke's Law states that the extension of an elastic material is directly proportional to the applied force, provided the elastic limit is not exceeded." },
        ],
      });
      result = `${k.toFixed(2)} N/m`;
      break;
    }

    case 'youngsModulus': {
      // Y = Stress / Strain = (F/A) / (e/L) = (F * L) / (A * e)
      const stress = force / area;
      const strain = extension / originalLength;
      const Y = stress / strain;

      steps.push({
        step: "YOUNG'S MODULUS",
        badge: 'primary',
        content: [
          { type: 'text', text: '🏗️ Calculating Elastic Modulus:' },
          { type: 'formula', text: 'E = Stress / Strain' },
          { type: 'text', text: `Stress = F/A = ${force} / ${area} = ${stress.toFixed(2)} Pa` },
          { type: 'text', text: `Strain = e/L = ${extension} / ${originalLength} = ${strain.toFixed(5)}` },
          { type: 'text', text: '' },
          { type: 'formula', text: 'E = (F × L) / (A × e)' },
          { type: 'highlight', text: `Young's Modulus = ${Y.toExponential(2)} Pa` },
        ],
      });
      result = `${Y.toExponential(2)} Pa`;
      break;
    }

    case 'workDone': {
      // W = 1/2 * F * e = 1/2 * k * e^2
      const W = 0.5 * force * extension;
      steps.push({
        step: 'ELASTIC POTENTIAL ENERGY',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚡ Calculating work done in stretching:' },
          { type: 'formula', text: 'W = ½Fe' },
          { type: 'text', text: `W = 0.5 × ${force} × ${extension}` },
          { type: 'highlight', text: `Work Done = ${W.toFixed(4)} Joules` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 This work is stored as Elastic Potential Energy in the material.' },
        ],
      });
      result = `${W.toFixed(4)} J`;
      break;
    }
  }

  return { result, steps };
}
