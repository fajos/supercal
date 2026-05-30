export function solveTrig(func, value) {
  // Input validation
  if (func === 'sin' || func === 'cos') {
    if (Math.abs(value) > 1) {
      throw new Error(
        `The ${func} function only outputs values between -1 and 1. ` +
        `${value} is outside this range, so ${func}(x) = ${value} has no real solutions.`
      );
    }
  }

  // Special angle detection
  const specialAngles = {
    0: { rad: 0, deg: 0, frac: '0' },
    0.5: { rad: Math.PI / 6, deg: 30, frac: 'π/6' },
    [Math.sqrt(2) / 2]: { rad: Math.PI / 4, deg: 45, frac: 'π/4' },
    [Math.sqrt(3) / 2]: { rad: Math.PI / 3, deg: 60, frac: 'π/3' },
    1: { rad: Math.PI / 2, deg: 90, frac: 'π/2' },
    [-0.5]: { rad: -Math.PI / 6, deg: -30, frac: '-π/6' },
    [-Math.sqrt(2) / 2]: { rad: -Math.PI / 4, deg: -45, frac: '-π/4' },
    [-Math.sqrt(3) / 2]: { rad: -Math.PI / 3, deg: -60, frac: '-π/3' },
    [-1]: { rad: -Math.PI / 2, deg: -90, frac: '-π/2' },
  };

  let principal, secondary = null, general;
  const steps = [];

  // STEP 1: Understanding the equation
  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 Problem Statement:' },
      { type: 'formula', text: `${func}(x) = ${value}` },
      { type: 'text', text: '' },
      { type: 'text', text: `The ${func} function represents the ${getFunctionDescription(func)}.` },
      { type: 'text', text: `Goal: Find all angles x that satisfy this equality.` },
    ],
  });

  // STEP 2: Check if it's a special angle
  const isSpecialAngle = Object.entries(specialAngles).find(
    ([key, data]) => Math.abs(parseFloat(key) - value) < 1e-10
  );

  if (isSpecialAngle) {
    steps.push({
      step: 'FORMULA',
      badge: 'secondary',
      content: [
        { type: 'text', text: '⭐ Special Angle Detected!' },
        { type: 'text', text: `${value} corresponds to a known standard angle.` },
        ...getSpecialAngleInfo(func, value, isSpecialAngle[1]),
      ],
    });
  }

  // STEP 3: Find principal value
  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Step 1: Determine the principal value using the inverse function.' },
      { type: 'text', text: `We need to find x such that ${func}(x) = ${value}.` },
      { type: 'text', text: `x₁ = ${func}⁻¹(${value})` },
      { type: 'text', text: `Principal range for ${func}⁻¹ is ${getPrincipalRange(func)}.` },
    ],
  });

  // Calculate principal value
  if (func === 'sin') {
    principal = Math.asin(value);
  } else if (func === 'cos') {
    principal = Math.acos(value);
  } else if (func === 'tan') {
    principal = Math.atan(value);
  }

  const principalDeg = (principal * 180) / Math.PI;

  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Step 2: Evaluate the inverse function.' },
      { type: 'result', text: `x₁ ≈ ${principal.toFixed(6)} rad` },
      { type: 'text', text: 'Step 3: Convert radians to degrees.' },
      { type: 'text', text: `x₁ (deg) = ${principal.toFixed(6)} × (180/π)` },
      { type: 'result', text: `x₁ ≈ ${principalDeg.toFixed(4)}°` },
      ...(isSpecialAngle ? [
        { type: 'text', text: 'Step 4: Express in exact radical/fractional form.' },
        { type: 'text', text: `Exact x₁ = ${isSpecialAngle[1].frac}` },
      ] : []),
    ],
  });

  // STEP 4/5: Quadrant analysis and second solution
  if (func === 'sin' || func === 'cos') {
    steps.push({
      step: 'ANALYSIS',
      badge: 'secondary',
      content: [
        { type: 'text', text: '🎯 Quadrant & Symmetry' },
        { type: 'text', text: getQuadrantExplanation(func, value) },
      ],
    });

    if (func === 'sin') {
      secondary = Math.PI - principal;
      const secondaryDeg = (secondary * 180) / Math.PI;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Use symmetry for sine (x₂ = π - x₁).' },
          { type: 'text', text: `x₂ = 3.14159 - ${principal.toFixed(6)}` },
          { type: 'result', text: `x₂ ≈ ${secondary.toFixed(6)} rad` },
          { type: 'text', text: 'Step 2: Convert x₂ to degrees.' },
          { type: 'text', text: `x₂ (deg) = ${secondary.toFixed(6)} × (180/π)` },
          { type: 'result', text: `x₂ ≈ ${secondaryDeg.toFixed(4)}°` },
        ],
      });

    } else if (func === 'cos') {
      secondary = 2 * Math.PI - principal;
      const secondaryDeg = (secondary * 180) / Math.PI;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Use symmetry for cosine (x₂ = 2π - x₁).' },
          { type: 'text', text: `x₂ = 6.28318 - ${principal.toFixed(6)}` },
          { type: 'result', text: `x₂ ≈ ${secondary.toFixed(6)} rad` },
          { type: 'text', text: 'Step 2: Convert x₂ to degrees.' },
          { type: 'text', text: `x₂ (deg) = ${secondary.toFixed(6)} × (180/π)` },
          { type: 'result', text: `x₂ ≈ ${secondaryDeg.toFixed(4)}°` },
        ],
      });
    }

    // General solution
    steps.push({
      step: 'ANALYSIS',
      badge: 'secondary',
      content: [
        { type: 'text', text: `Periodic nature (T = 2π):` },
        ...(func === 'sin' ? [
          { type: 'result', text: `x = ${principal.toFixed(4)} + 2πk` },
          { type: 'result', text: `x = ${secondary.toFixed(4)} + 2πk` },
          { type: 'text', text: `(k ∈ ℤ)` }
        ] : [
          { type: 'result', text: `x = ±${principal.toFixed(4)} + 2πk` },
          { type: 'text', text: `(k ∈ ℤ)` }
        ])
      ],
    });

    if (func === 'sin') {
      general = `x = ${principal.toFixed(4)} + 2πk  OR  x = ${secondary.toFixed(4)} + 2πk`;
    } else {
      general = `x = ±${principal.toFixed(4)} + 2πk`;
    }

  } else if (func === 'tan') {
    steps.push({
      step: 'ANALYSIS',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'Tangent has period π. General solution:' },
        { type: 'result', text: `x = ${principal.toFixed(4)} + πk` },
        { type: 'text', text: '(k ∈ ℤ)' },
      ],
    });

    general = `x = ${principal.toFixed(4)} + πk`;
    secondary = null;
  }

  // Final step: Verification
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: '✅ VERIFICATION' },
      { type: 'text', text: `Check: ${func}(${principal.toFixed(4)})` },
      { type: 'result', text: `≈ ${Math[func](principal).toFixed(6)}` },
      ...(secondary !== null ? [
        { type: 'text', text: `Check: ${func}(${secondary.toFixed(4)})` },
        { type: 'result', text: `≈ ${Math[func](secondary).toFixed(6)}` },
      ] : []),
    ],
  });

  // Unit circle visualization hint
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🎨 UNIT CIRCLE VISUALIZATION' },
      { type: 'text', text: getUnitCircleDescription(func, value, principal, secondary) },
      { type: 'text', text: '💡 TIP: Draw the unit circle and mark these angles to understand better!' },
    ],
  });

  return {
    steps,
    solutions: {
      principal,
      principalDeg,
      secondary,
      secondaryDeg: secondary !== null ? (secondary * 180) / Math.PI : null,
      general,
    },
  };
}

// Helper functions for educational content
function getFunctionDescription(func) {
  const descriptions = {
    sin: 'y-coordinate of a point on the unit circle',
    cos: 'x-coordinate of a point on the unit circle',
    tan: 'ratio of y/x (slope) of a point on the unit circle',
  };
  return descriptions[func] || 'trigonometric ratio';
}

function getPrincipalRange(func) {
  const ranges = {
    sin: '[-π/2, π/2] or [-90°, 90°]',
    cos: '[0, π] or [0°, 180°]',
    tan: '(-π/2, π/2) or (-90°, 90°)',
  };
  return ranges[func] || '';
}

function getPositiveQuadrants(func) {
  const quadrants = {
    sin: 'I and II',
    cos: 'I and IV',
    tan: 'I and III',
  };
  return quadrants[func] || '';
}

function getNegativeQuadrants(func) {
  const quadrants = {
    sin: 'III and IV',
    cos: 'II and III',
    tan: 'II and IV',
  };
  return quadrants[func] || '';
}

function getQuadrantExplanation(func, value) {
  if (func === 'sin') {
    if (value >= 0) {
      return 'Solutions exist in Quadrants I and II (above the x-axis).';
    } else {
      return 'Solutions exist in Quadrants III and IV (below the x-axis).';
    }
  } else if (func === 'cos') {
    if (value >= 0) {
      return 'Solutions exist in Quadrants I and IV (right of the y-axis).';
    } else {
      return 'Solutions exist in Quadrants II and III (left of the y-axis).';
    }
  } else if (func === 'tan') {
    if (value >= 0) {
      return 'Solutions exist in Quadrants I and III.';
    } else {
      return 'Solutions exist in Quadrants II and IV.';
    }
  }
  return '';
}

function getSpecialAngleInfo(func, value, specialData) {
  const info = [
    { type: 'text', text: `This is a standard angle: ${specialData.deg}° = ${specialData.frac} radians` },
  ];

  if (func === 'sin') {
    if (value === 0) {
      info.push({ type: 'text', text: 'sin(0) = 0, sin(π) = 0 (x-axis intersections)' });
    } else if (value === 1) {
      info.push({ type: 'text', text: 'sin(π/2) = 1 (top of the unit circle)' });
    } else if (value === -1) {
      info.push({ type: 'text', text: 'sin(3π/2) = -1 (bottom of the unit circle)' });
    } else if (value === 0.5) {
      info.push({ type: 'text', text: 'From the 30-60-90 triangle' });
    } else if (value === Math.sqrt(3) / 2) {
      info.push({ type: 'text', text: 'From the 30-60-90 triangle' });
    }
  } else if (func === 'cos') {
    if (value === 0) {
      info.push({ type: 'text', text: 'cos(π/2) = 0, cos(3π/2) = 0 (y-axis intersections)' });
    } else if (value === 1) {
      info.push({ type: 'text', text: 'cos(0) = 1 (rightmost point on unit circle)' });
    } else if (value === -1) {
      info.push({ type: 'text', text: 'cos(π) = -1 (leftmost point on unit circle)' });
    }
  }

  return info;
}

function getUnitCircleDescription(func, value, principal, secondary) {
  if (func === 'sin') {
    return `Draw a horizontal line at y = ${value}. Where it intersects the unit circle, the angles from the positive x-axis give the solutions.`;
  } else if (func === 'cos') {
    return `Draw a vertical line at x = ${value}. Where it intersects the unit circle, the angles from the positive x-axis give the solutions.`;
  } else if (func === 'tan') {
    return `Draw a line from the origin with slope = ${value}. Where it intersects the unit circle, the angle gives the solution. Due to period π, this happens at ${principal.toFixed(4)} + πk.`;
  }
  return '';
}