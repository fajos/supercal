// src/solvers/opticsSolver.js - Pedagogical optics tutor

export function solveOptics(mode, params) {
  const { focalLength, objectDistance, imageDistance, n1, n2, theta1 } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'lens': {
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '🔍 Thin Lens Analysis:' },
          { type: 'text', text: `• Focal Length (f): ${focalLength || '?'} cm` },
          { type: 'text', text: `• Object Distance (u): ${objectDistance || '?'} cm` },
          { type: 'text', text: `• Image Distance (v): ${imageDistance || '?'} cm` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Sign Convention (Cartesian):' },
          { type: 'text', text: '• u is negative for real objects (in front of lens)' },
          { type: 'text', text: '• f is positive for converging (convex) lenses' },
          { type: 'text', text: '• f is negative for diverging (concave) lenses' },
          { type: 'text', text: '• v is positive for real images, negative for virtual images' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The Thin Lens Equation relates object distance, image distance, and focal length:' },
          { type: 'formula', text: '1/f = 1/u + 1/v' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Magnification (M) tells us the size and orientation of the image:' },
          { type: 'formula', text: 'M = −v / u = h_i / h_o' },
          { type: 'text', text: 'Where h_i = image height, h_o = object height' },
        ],
      });

      if (objectDistance && focalLength) {
        // 3. CALCULATION
        const invU = 1 / objectDistance;
        const invF = 1 / focalLength;
        const invV = invF - invU;
        const v = 1 / invV;
        const m = -v / objectDistance;

        steps.push({
          step: 'CALCULATION',
          badge: 'primary',
          content: [
            { type: 'text', text: 'Step 1: Rearrange the lens equation to solve for 1/v' },
            { type: 'formula', text: '1/v = 1/f − 1/u' },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 2: Calculate reciprocals' },
            { type: 'text', text: `1/f = 1/${focalLength} = ${invF.toFixed(4)}` },
            { type: 'text', text: `1/u = 1/${objectDistance} = ${invU.toFixed(4)}` },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 3: Subtract to find 1/v' },
            { type: 'text', text: `1/v = ${invF.toFixed(4)} − ${invU.toFixed(4)}` },
            { type: 'text', text: `1/v = ${invV.toFixed(4)}` },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 4: Take reciprocal to find v' },
            { type: 'text', text: `v = 1 / ${invV.toFixed(4)}` },
            { type: 'result', text: `v = ${v.toFixed(2)} cm` },
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 5: Calculate Magnification (M)' },
            { type: 'text', text: `M = −v / u` },
            { type: 'text', text: `M = −(${v.toFixed(2)}) / ${objectDistance}` },
            { type: 'result', text: `M = ${m.toFixed(2)}` },
          ],
        });

        // 4. ANALYSIS
        const imageType = v > 0 ? 'REAL' : 'VIRTUAL';
        const orientation = m < 0 ? 'INVERTED' : 'UPRIGHT';
        const size = Math.abs(m) > 1 ? 'ENLARGED' : Math.abs(m) < 1 ? 'DIMINISHED' : 'SAME SIZE';
        const lensType = focalLength > 0 ? 'converging (convex)' : 'diverging (concave)';
        
        steps.push({
          step: 'ANALYSIS',
          badge: 'secondary',
          content: [
            { type: 'text', text: '✅ IMAGE CHARACTERISTICS:' },
            { type: 'text', text: '' },
            { type: 'result', text: `• Image Distance: ${Math.abs(v).toFixed(2)} cm from lens` },
            { type: 'result', text: `• Nature: ${imageType} image (${v > 0 ? 'can' : 'cannot'} be projected)` },
            { type: 'result', text: `• Orientation: ${orientation}` },
            { type: 'result', text: `• Size: ${size} (×${Math.abs(m).toFixed(2)})` },
            { type: 'result', text: `• Lens Type: ${lensType}` },
            { type: 'text', text: '' },
            { type: 'text', text: '💡 OPTICS RULES:' },
            { type: 'text', text: '• REAL images are always INVERTED (negative M)' },
            { type: 'text', text: '• VIRTUAL images are always UPRIGHT (positive M)' },
            { type: 'text', text: '• |M| > 1: Image is larger than object' },
            { type: 'text', text: '• |M| < 1: Image is smaller than object' },
            { type: 'text', text: '' },
            { type: 'text', text: '🔬 APPLICATIONS:' },
            { type: 'text', text: focalLength > 0 
              ? '• Converging lenses: Magnifying glasses, cameras, telescopes, microscopes'
              : '• Diverging lenses: Peepholes in doors, correcting nearsightedness'
            },
          ],
        });
        result = `v = ${v.toFixed(2)} cm, M = ${m.toFixed(2)}`;
      }
      break;
    }

    case 'refraction': {
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '🌈 Refraction Analysis (Snell\'s Law):' },
          { type: 'text', text: `• n₁ (Incident Medium): ${n1}` },
          { type: 'text', text: `• n₂ (Refractive Medium): ${n2}` },
          { type: 'text', text: `• θ₁ (Angle of Incidence): ${theta1}°` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Light changes speed and direction when crossing between different media.' },
          { type: 'text', text: 'Common refractive indices:' },
          { type: 'text', text: '• Air: n ≈ 1.00' },
          { type: 'text', text: '• Water: n ≈ 1.33' },
          { type: 'text', text: '• Glass: n ≈ 1.50' },
          { type: 'text', text: '• Diamond: n ≈ 2.42' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: "Snell's Law describes how light bends when changing speed between media:" },
          { type: 'formula', text: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• n₁, n₂ = refractive indices of the two media' },
          { type: 'text', text: '• θ₁ = angle of incidence (from normal)' },
          { type: 'text', text: '• θ₂ = angle of refraction (from normal)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Critical Angle (for Total Internal Reflection):' },
          { type: 'formula', text: 'θc = arcsin(n₂ / n₁)  [when n₁ > n₂]' },
        ],
      });

      if (n1 && n2 && theta1) {
        // 3. CALCULATION
        const r1 = (theta1 * Math.PI) / 180;
        const sinTheta1 = Math.sin(r1);
        const sinTheta2 = (n1 * sinTheta1) / n2;

        const calculationContent = [
          { type: 'text', text: 'Step 1: Calculate sin(θ₁)' },
          { type: 'text', text: `sin(${theta1}°) = ${sinTheta1.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Apply Snell\'s Law to find sin(θ₂)' },
          { type: 'text', text: `n₁ × sin(θ₁) = n₂ × sin(θ₂)` },
          { type: 'text', text: `${n1} × ${sinTheta1.toFixed(4)} = ${n2} × sin(θ₂)` },
          { type: 'text', text: `${(n1 * sinTheta1).toFixed(4)} = ${n2} × sin(θ₂)` },
          { type: 'text', text: `sin(θ₂) = ${(n1 * sinTheta1).toFixed(4)} / ${n2}` },
          { type: 'result', text: `sin(θ₂) = ${sinTheta2.toFixed(4)}` },
        ];

        if (sinTheta2 > 1) {
          const criticalAngle = Math.asin(n2 / n1) * 180 / Math.PI;
          
          steps.push({
            step: 'CALCULATION',
            badge: 'primary',
            content: calculationContent,
          });
          
          steps.push({
            step: 'ANALYSIS',
            badge: 'secondary',
            content: [
              { type: 'text', text: '⚠️ TOTAL INTERNAL REFLECTION (TIR)!' },
              { type: 'text', text: '' },
              { type: 'text', text: `Since sin(θ₂) = ${sinTheta2.toFixed(4)} > 1, refraction is impossible.` },
              { type: 'text', text: 'Instead, ALL light reflects back into the first medium.' },
              { type: 'text', text: '' },
              { type: 'text', text: '🔍 TIR CONDITIONS:' },
              { type: 'text', text: `• n₁ > n₂: ${n1} > ${n2} ✓ (light must go from denser to rarer medium)` },
              { type: 'text', text: `• θ₁ > θc: ${theta1}° > ${criticalAngle.toFixed(2)}° ✓ (incident angle exceeds critical angle)` },
              { type: 'text', text: `• Critical angle: θc = arcsin(${n2}/${n1}) = ${criticalAngle.toFixed(2)}°` },
              { type: 'text', text: '' },
              { type: 'text', text: '🌍 APPLICATIONS OF TIR:' },
              { type: 'text', text: '• Fiber optics: Light travels through cables via total internal reflection' },
              { type: 'text', text: '• Diamond sparkle: High refractive index creates brilliant internal reflections' },
              { type: 'text', text: '• Rain sensors: Detect water on windshields using TIR principles' },
              { type: 'text', text: '• Endoscopes: Medical imaging using fiber optic cables' },
            ],
          });
          result = "Total Internal Reflection";
        } else {
          const r2 = Math.asin(sinTheta2);
          const t2 = (r2 * 180) / Math.PI;
          
          calculationContent.push(
            { type: 'text', text: '' },
            { type: 'text', text: 'Step 3: Calculate θ₂ using arcsin' },
            { type: 'text', text: `θ₂ = arcsin(${sinTheta2.toFixed(4)})` },
            { type: 'result', text: `θ₂ = ${t2.toFixed(2)}°` },
          );

          steps.push({
            step: 'CALCULATION',
            badge: 'primary',
            content: calculationContent,
          });

          // 4. ANALYSIS
          const bending = n2 > n1 ? 'TOWARD' : 'AWAY FROM';
          const speedChange = n2 > n1 ? 'slows down' : 'speeds up';
          const criticalAngle = n1 > n2 ? (Math.asin(n2 / n1) * 180 / Math.PI) : null;
          
          steps.push({
            step: 'ANALYSIS',
            badge: 'secondary',
            content: [
              { type: 'text', text: '✅ REFRACTION RESULT:' },
              { type: 'text', text: '' },
              { type: 'result', text: `• Angle of Refraction: θ₂ = ${t2.toFixed(2)}°` },
              { type: 'result', text: `• Bending: ${bending} the normal` },
              { type: 'text', text: '' },
              { type: 'text', text: '💡 PHYSICAL EXPLANATION:' },
              { type: 'text', text: `• Light ${speedChange} in the ${n2 > n1 ? 'denser' : 'rarer'} medium (n₂ = ${n2})` },
              { type: 'text', text: n2 > n1
                ? '• Like a car wheel hitting mud - it turns toward the normal'
                : '• Like a car wheel leaving mud - it turns away from the normal'
              },
              ...(criticalAngle ? [
                { type: 'text', text: '' },
                { type: 'text', text: `⚠️ Critical Angle: ${criticalAngle.toFixed(2)}° (TIR occurs above this)` },
              ] : []),
              { type: 'text', text: '' },
              { type: 'text', text: '🌈 EVERYDAY EXAMPLES:' },
              { type: 'text', text: '• Straws look "broken" in a glass of water' },
              { type: 'text', text: '• Fish appear shallower than they really are' },
              { type: 'text', text: '• Mirages on hot roads (light bending through hot air)' },
              { type: 'text', text: '• Rainbows (refraction + dispersion in water droplets)' },
            ],
          });
          result = `θ₂ = ${t2.toFixed(2)}°`;
        }
      }
      break;
    }
  }

  return { result, steps };
}