export function solveElasticity(mode, params) {
  const { force, extension, originalLength, area, youngsModulus, energy } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'hookesLaw': {
      const k = force / extension;
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We are examining the relationship between force and extension for an elastic material:' },
          { type: 'text', text: `• Applied Force (F): ${force} N` },
          { type: 'text', text: `• Extension (e): ${extension} m` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: "Hooke's Law states that extension is directly proportional to the applied load:" },
          { type: 'formula', text: 'F = k · e' },
          { type: 'text', text: 'To find the Spring Constant (k):' },
          { type: 'formula', text: 'k = F / e' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `k = ${force} N / ${extension} m` },
          { type: 'highlight', text: `Spring Constant (k) = ${k.toFixed(2)} N/m` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The material has a stiffness of ${k.toFixed(2)} Newtons per meter.` },
          { type: 'text', text: '💡 Stiffer materials (like steel springs) have higher k-values, meaning they require more force to stretch.' },
          { type: 'text', text: "💡 Limit of Proportionality: This linear relationship only holds until the material's elastic limit is reached, after which it may permanently deform." },
        ],
      });
      result = `${k.toFixed(2)} N/m`;
      break;
    }

    case 'youngsModulus': {
      const stress = force / area;
      const strain = extension / originalLength;
      const Y = stress / strain;

      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We are calculating the intrinsic stiffness of the material itself:' },
          { type: 'text', text: `• Force (F): ${force} N` },
          { type: 'text', text: `• Cross-sectional Area (A): ${area} m²` },
          { type: 'text', text: `• Original Length (L): ${originalLength} m` },
          { type: 'text', text: `• Extension (e): ${extension} m` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: "Young's Modulus (E) is the ratio of Tensile Stress to Tensile Strain:" },
          { type: 'formula', text: 'Stress (σ) = F / A' },
          { type: 'formula', text: 'Strain (ε) = e / L' },
          { type: 'formula', text: 'E = σ / ε = (F · L) / (A · e)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `1. Stress = ${force} / ${area} = ${stress.toExponential(2)} Pa` },
          { type: 'text', text: `2. Strain = ${extension} / ${originalLength} = ${strain.toFixed(5)} (unitless)` },
          { type: 'highlight', text: `Young's Modulus = ${Y.toExponential(2)} Pa` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `The Young's Modulus is ${Y.toExponential(2)} Pascals.` },
          { type: 'text', text: "💡 Unlike the spring constant (k), Young's Modulus is a property of the material, not the specific object. A steel wire and a steel beam have the same E, but different k." },
          { type: 'text', text: '💡 High E values (e.g., Diamond, Steel) indicate "stiff" materials, while low E values (e.g., Rubber) indicate "flexible" materials.' },
        ],
      });
      result = `${Y.toExponential(2)} Pa`;
      break;
    }

    case 'workDone': {
      const W = 0.5 * force * extension;
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We are calculating the energy stored in the stretched material:' },
          { type: 'text', text: `• Final Force (F): ${force} N` },
          { type: 'text', text: `• Total Extension (e): ${extension} m` },
        ],
      });

      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The work done (W) is equivalent to the Elastic Potential Energy (EPE):' },
          { type: 'formula', text: 'W = ½ · F · e' },
          { type: 'text', text: 'This represents the area under a Force-Extension graph.' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `W = 0.5 × ${force} N × ${extension} m` },
          { type: 'highlight', text: `Work Done = ${W.toFixed(4)} Joules` },
        ],
      });

      steps.push({
        step: 'INTERPRETATION/ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `A total of ${W.toFixed(4)} Joules of energy is stored in the material.` },
          { type: 'text', text: '💡 Energy Recovery: If the material is perfectly elastic, all this energy is released when the force is removed. If it is plastic, some energy is lost as heat during deformation.' },
        ],
      });
      result = `${W.toFixed(4)} J`;
      break;
    }
  }

  return { result, steps };
}
