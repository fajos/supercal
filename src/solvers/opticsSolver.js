// src/solvers/opticsSolver.js - Pedagogical optics tutor

export function solveOptics(mode, params) {
  const { focalLength, objectDistance, imageDistance, n1, n2, theta1 } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'lens':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the positions and focal properties (measured in cm):' },
          { type: 'text', text: `• Focal Length (f): ${focalLength || '?'} cm` },
          { type: 'text', text: `• Object Distance (u): ${objectDistance || '?'} cm` },
          { type: 'text', text: `• Image Distance (v): ${imageDistance || '?'} cm` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'We use the Thin Lens Equation and Magnification Formula:' },
          { type: 'highlight', text: '1/f = 1/u + 1/v' },
          { type: 'highlight', text: 'M = -v / u' },
          { type: 'text', text: 'Remember the sign convention: Real objects have negative u, converging lenses have positive f.' },
        ],
      });

      if (objectDistance && focalLength) {
        // 3. CALCULATION
        const v = 1 / (1 / focalLength - 1 / objectDistance);
        const m = -v / objectDistance;

        steps.push({
          step: 'CALCULATION',
          badge: 'math',
          content: [
            { type: 'text', text: '1. Solving for Image Distance (v):' },
            { type: 'text', text: `1/v = 1/${focalLength} - 1/${objectDistance}` },
            { type: 'text', text: `1/v = ${(1/v).toFixed(4)}` },
            { type: 'highlight', text: `v = ${v.toFixed(2)} cm` },
            { type: 'text', text: '' },
            { type: 'text', text: '2. Solving for Magnification (M):' },
            { type: 'text', text: `M = -(${v.toFixed(2)}) / ${objectDistance}` },
            { type: 'highlight', text: `M = ${m.toFixed(2)}` },
          ],
        });

        // 4. INTERPRETATION / ANALYSIS
        steps.push({
          step: 'INTERPRETATION / ANALYSIS',
          badge: 'insight',
          content: [
            { type: 'text', text: `The image is formed ${Math.abs(v).toFixed(2)} cm from the lens.` },
            { type: 'text', text: `• Nature: ${v > 0 ? 'REAL' : 'VIRTUAL'} image (can ${v > 0 ? '' : 'not '}be projected on a screen).` },
            { type: 'text', text: `• Orientation: ${m < 0 ? 'INVERTED' : 'UPRIGHT'}` },
            { type: 'text', text: `• Size: ${Math.abs(m) > 1 ? 'ENLARGED' : 'DIMINISHED'} (by a factor of ${Math.abs(m).toFixed(2)})` },
            { type: 'text', text: '' },
            { type: 'text', text: '💡 OPTICS TIP: A real image is always inverted, while a virtual image is always upright!' }
          ],
        });
        result = `v = ${v.toFixed(2)} cm, M = ${m.toFixed(2)}`;
      }
      break;

    case 'refraction':
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'Parameters for light passing between two media:' },
          { type: 'text', text: `• n₁ (Incident Medium): ${n1}` },
          { type: 'text', text: `• n₂ (Refractive Medium): ${n2}` },
          { type: 'text', text: `• θ₁ (Angle of Incidence): ${theta1}°` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Snell\'s Law describes how light bends when changing speed between media:' },
          { type: 'highlight', text: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)' },
        ],
      });

      if (n1 && n2 && theta1) {
        // 3. CALCULATION
        const r1 = (theta1 * Math.PI) / 180;
        const sinTheta1 = Math.sin(r1);
        const sinTheta2 = (n1 * sinTheta1) / n2;

        const calculationContent = [
          { type: 'text', text: `sin(${theta1}°) = ${sinTheta1.toFixed(4)}` },
          { type: 'text', text: `sin(θ₂) = (${n1} × ${sinTheta1.toFixed(4)}) / ${n2}` },
          { type: 'highlight', text: `sin(θ₂) = ${sinTheta2.toFixed(4)}` }
        ];

        if (sinTheta2 > 1) {
          steps.push({
            step: 'CALCULATION',
            badge: 'math',
            content: calculationContent,
          });
          steps.push({
            step: 'INTERPRETATION / ANALYSIS',
            badge: 'insight',
            content: [
              { type: 'text', text: '⚠️ TOTAL INTERNAL REFLECTION (TIR)' },
              { type: 'text', text: `Since sin(θ₂) > 1, light cannot pass into the second medium. Instead, it reflects entirely back into the first medium.` },
              { type: 'text', text: `This occurs when the incident angle exceeds the critical angle: θc = arcsin(${n2}/${n1}) = ${(Math.asin(n2/n1) * 180/Math.PI).toFixed(2)}°.` }
            ],
          });
          result = "Total Internal Reflection";
        } else {
          const r2 = Math.asin(sinTheta2);
          const t2 = (r2 * 180) / Math.PI;
          calculationContent.push({ type: 'highlight', text: `θ₂ = ${t2.toFixed(2)}°` });

          steps.push({
            step: 'CALCULATION',
            badge: 'math',
            content: calculationContent,
          });

          // 4. INTERPRETATION / ANALYSIS
          steps.push({
            step: 'INTERPRETATION / ANALYSIS',
            badge: 'insight',
            content: [
              { type: 'text', text: `The light ray enters the second medium at an angle of ${t2.toFixed(2)}° relative to the normal.` },
              { type: 'text', text: n2 > n1
                ? 'Because it entered a denser medium (higher n), the light bent TOWARD the normal.'
                : 'Because it entered a rarer medium (lower n), the light bent AWAY from the normal.'
              },
              { type: 'text', text: '' },
              { type: 'text', text: '💡 DID YOU KNOW? This bending of light is what makes straws look broken in a glass of water and creates mirages on hot roads!' }
            ],
          });
          result = `θ₂ = ${t2.toFixed(2)}°`;
        }
      }
      break;
  }

  return { result, steps };
}
