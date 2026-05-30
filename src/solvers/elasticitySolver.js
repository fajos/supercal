export function solveElasticity(mode, params) {
  const { force, extension, originalLength, area, youngsModulus, energy } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'hookesLaw': {
      const k = force / extension;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: "📝 Parameters for Hooke's Law:" },
          { type: 'text', text: `• Applied Tensile Force (F): ${force} N` },
          { type: 'text', text: `• Resulting Extension (e): ${extension} m` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: "Hooke's Law states that for an elastic body, the extension is directly proportional to the applied force:" },
          { type: 'formula', text: 'F = k · e' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• F = Applied Force (N)' },
          { type: 'text', text: '• k = Spring Constant (N/m)' },
          { type: 'text', text: '• e = Extension (m)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'To find the Spring Constant (k), we rearrange the formula:' },
          { type: 'formula', text: 'k = F / e' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Divide the applied force by the measured extension.' },
          { type: 'text', text: `k = ${force} N / ${extension} m` },
          { type: 'text', text: `k = ${k.toFixed(4)}...` },
          { type: 'result', text: `Spring Constant (k) = ${k.toFixed(2)} N/m` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The material has a stiffness of ${k.toFixed(2)} Newtons per meter.` },
          { type: 'text', text: `💡 This means it takes ${k.toFixed(2)} N of force to stretch the material by 1 meter.` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Stiffness Comparison:' },
          { type: 'text', text: k > 10000 
            ? '• Very stiff material (similar to a car suspension spring)' 
            : k > 1000 
              ? '• Moderately stiff material (similar to a door spring)'
              : '• Flexible material (similar to a rubber band)'
          },
          { type: 'text', text: '' },
          { type: 'text', text: "⚠️ Limit of Proportionality: This linear relationship only holds until the material's elastic limit is reached, after which it may permanently deform." },
          { type: 'text', text: '💡 Beyond the elastic limit, the material enters the plastic region where Hooke\'s Law no longer applies.' },
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
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: "📝 Parameters for Young's Modulus:" },
          { type: 'text', text: `• Applied Force (F): ${force} N` },
          { type: 'text', text: `• Cross-sectional Area (A): ${area} m²` },
          { type: 'text', text: `• Original Length (L₀): ${originalLength} m` },
          { type: 'text', text: `• Extension (ΔL): ${extension} m` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: "Young's Modulus (E) describes the intrinsic stiffness of a material by relating Stress to Strain:" },
          { type: 'text', text: '' },
          { type: 'text', text: '1. Tensile Stress (σ): Force per unit area' },
          { type: 'formula', text: 'σ = F / A' },
          { type: 'text', text: '' },
          { type: 'text', text: '2. Tensile Strain (ε): Extension per unit length' },
          { type: 'formula', text: 'ε = ΔL / L₀' },
          { type: 'text', text: '' },
          { type: 'text', text: "3. Young's Modulus: Stress divided by Strain" },
          { type: 'formula', text: 'E = σ / ε = (F · L₀) / (A · ΔL)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate the Tensile Stress (σ)' },
          { type: 'text', text: `σ = F / A = ${force} / ${area}` },
          { type: 'text', text: `σ = ${stress.toFixed(2)} Pa` },
          { type: 'result', text: `σ = ${stress.toExponential(2)} Pa (N/m²)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate the Tensile Strain (ε)' },
          { type: 'text', text: `ε = ΔL / L₀ = ${extension} / ${originalLength}` },
          { type: 'text', text: `ε = ${strain.toFixed(6)}` },
          { type: 'result', text: `ε = ${strain.toExponential(2)} (dimensionless)` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate Young\'s Modulus' },
          { type: 'text', text: `E = σ / ε = ${stress.toExponential(2)} / ${strain.toExponential(2)}` },
          { type: 'result', text: `E = ${Y.toExponential(2)} Pa` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ The Young's Modulus is ${Y.toExponential(2)} Pascals (${(Y / 1e9).toFixed(2)} GPa).` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 Material Comparison (GPa):' },
          { type: 'text', text: '• Rubber: ~0.01-0.1 GPa' },
          { type: 'text', text: '• Wood: ~10 GPa' },
          { type: 'text', text: '• Aluminum: ~70 GPa' },
          { type: 'text', text: '• Steel: ~200 GPa' },
          { type: 'text', text: '• Diamond: ~1,200 GPa' },
          { type: 'text', text: '' },
          { type: 'text', text: "💡 Unlike the spring constant (k), Young's Modulus is a property of the material, not the specific object." },
          { type: 'text', text: '💡 A steel wire and a steel beam have the same E, but different k values due to their different geometries.' },
          { type: 'text', text: '💡 High E values indicate "stiff" materials that resist deformation, while low E values indicate "flexible" materials.' },
        ],
      });
      result = `${Y.toExponential(2)} Pa`;
      break;
    }

    case 'workDone': {
      const W = 0.5 * force * extension;
      const k = force / extension;
      const W_alt = 0.5 * k * extension * extension;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📝 Parameters for Elastic Energy Storage:' },
          { type: 'text', text: `• Final Force Applied (F): ${force} N` },
          { type: 'text', text: `• Total Resulting Extension (e): ${extension} m` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The energy stored in a stretched elastic material (Elastic Potential Energy) equals the work done to stretch it:' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Method 1: Using Force and Extension' },
          { type: 'formula', text: 'E = ½ · F · e' },
          { type: 'text', text: '(Area under the Force-Extension graph)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Method 2: Using Spring Constant' },
          { type: 'formula', text: 'E = ½ · k · e²' },
          { type: 'text', text: '(where k = F/e is the spring constant)' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate the spring constant' },
          { type: 'text', text: `k = F / e = ${force} / ${extension} = ${k.toFixed(2)} N/m` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate energy using Method 1' },
          { type: 'text', text: `E = ½ × ${force} N × ${extension} m` },
          { type: 'text', text: `E = ½ × ${(force * extension).toFixed(4)}` },
          { type: 'result', text: `E = ${W.toFixed(4)} J` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Verify using Method 2' },
          { type: 'text', text: `E = ½ × ${k.toFixed(2)} × (${extension})²` },
          { type: 'text', text: `E = ½ × ${k.toFixed(2)} × ${(extension * extension).toFixed(6)}` },
          { type: 'result', text: `E = ${W_alt.toFixed(4)} J ✓` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `✅ A total of ${W.toFixed(4)} Joules of elastic potential energy is stored in the material.` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Energy Recovery:' },
          { type: 'text', text: '• Perfectly elastic materials release ALL stored energy when the force is removed.' },
          { type: 'text', text: '• In reality, some energy is always lost as heat due to internal friction (hysteresis).' },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 Practical Applications:' },
          { type: 'text', text: '• Catapults and bows store elastic energy to launch projectiles' },
          { type: 'text', text: '• Vehicle suspensions absorb and dissipate energy from bumps' },
          { type: 'text', text: '• Elastic bands in exercise equipment provide resistance' },
        ],
      });
      result = `${W.toFixed(4)} J`;
      break;
    }
  }

  return { result, steps };
}