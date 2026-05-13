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
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 UNDERSTANDING THE EQUATION' },
      { type: 'highlight', text: `${func}(x) = ${value}` },
      { type: 'text', text: '' },
      { type: 'text', text: `The ${func} function gives the ${getFunctionDescription(func)}.` },
      { type: 'text', text: `We need to find all angles x where ${func}(x) equals ${value}.` },
    ],
  });

  // STEP 2: Check if it's a special angle
  const isSpecialAngle = Object.entries(specialAngles).find(
    ([key, data]) => Math.abs(parseFloat(key) - value) < 1e-10
  );

  if (isSpecialAngle) {
    steps.push({
      step: 'STEP 2',
      badge: 'secondary',
      content: [
        { type: 'text', text: '⭐ SPECIAL ANGLE DETECTED!' },
        { type: 'text', text: `${value} is a well-known trigonometric value.` },
        ...getSpecialAngleInfo(func, value, isSpecialAngle[1]),
      ],
    });
  }

  // STEP 3: Find principal value
  steps.push({
    step: isSpecialAngle ? 'STEP 3' : 'STEP 2',
    badge: 'primary',
    content: [
      { type: 'text', text: '🔍 FINDING THE PRINCIPAL VALUE' },
      { type: 'text', text: `Using the inverse ${func} function (arc${func} or ${func}⁻¹):` },
      { type: 'text', text: `x = arc${func}(${value})` },
      { type: 'text', text: '' },
      { type: 'text', text: `The principal value range for arc${func} is:` },
      { type: 'highlight', text: getPrincipalRange(func) },
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
    step: isSpecialAngle ? 'STEP 4' : 'STEP 3',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📊 PRINCIPAL SOLUTION' },
      { type: 'result', text: `x₁ = ${principal.toFixed(6)} radians` },
      { type: 'result', text: `x₁ = ${principalDeg.toFixed(4)}°` },
      ...(isSpecialAngle ? [
        { type: 'text', text: '' },
        { type: 'highlight', text: `In terms of π: ${isSpecialAngle[1].frac}` },
      ] : []),
    ],
  });

  // STEP 4/5: Quadrant analysis and second solution
  if (func === 'sin' || func === 'cos') {
    const quadrantStep = isSpecialAngle ? 'STEP 5' : 'STEP 4';
    
    steps.push({
      step: quadrantStep,
      badge: 'primary',
      content: [
        { type: 'text', text: '🎯 QUADRANT ANALYSIS' },
        { type: 'text', text: `The ${func} function is positive in quadrants ${getPositiveQuadrants(func)}` },
        { type: 'text', text: `and negative in quadrants ${getNegativeQuadrants(func)}.` },
        { type: 'text', text: '' },
        { type: 'text', text: `Since ${func}(x) = ${value} is ${value >= 0 ? 'positive' : 'negative'}:` },
        { type: 'text', text: getQuadrantExplanation(func, value) },
      ],
    });

    if (func === 'sin') {
      secondary = Math.PI - principal;
      const secondaryDeg = (secondary * 180) / Math.PI;
      
      steps.push({
        step: isSpecialAngle ? 'STEP 6' : 'STEP 5',
        badge: 'secondary',
        content: [
          { type: 'text', text: '🔄 SECOND SOLUTION IN [0, 2π)' },
          { type: 'text', text: 'For sine, the second solution in [0, 2π) is:' },
          { type: 'text', text: 'x₂ = π - arcsin(value)' },
          { type: 'text', text: `x₂ = π - ${principal.toFixed(6)}` },
          { type: 'text', text: `x₂ = ${secondary.toFixed(6)} radians` },
          { type: 'text', text: `x₂ = ${secondaryDeg.toFixed(4)}°` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Why? Because sin(π - θ) = sin(θ)' },
          { type: 'text', text: 'This comes from the symmetry of the sine curve.' },
        ],
      });

    } else if (func === 'cos') {
      secondary = 2 * Math.PI - principal;
      const secondaryDeg = (secondary * 180) / Math.PI;
      
      steps.push({
        step: isSpecialAngle ? 'STEP 6' : 'STEP 5',
        badge: 'secondary',
        content: [
          { type: 'text', text: '🔄 SECOND SOLUTION IN [0, 2π)' },
          { type: 'text', text: 'For cosine, the second solution in [0, 2π) is:' },
          { type: 'text', text: 'x₂ = 2π - arccos(value)' },
          { type: 'text', text: `x₂ = 2π - ${principal.toFixed(6)}` },
          { type: 'text', text: `x₂ = ${secondary.toFixed(6)} radians` },
          { type: 'text', text: `x₂ = ${secondaryDeg.toFixed(4)}°` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Why? Because cos(2π - θ) = cos(θ)' },
          { type: 'text', text: 'This comes from the symmetry of the cosine curve.' },
        ],
      });
    }

    // General solution
    steps.push({
      step: isSpecialAngle ? 'STEP 7' : 'STEP 6',
      badge: 'primary',
      content: [
        { type: 'text', text: '♾️ GENERAL SOLUTION (ALL SOLUTIONS)' },
        { type: 'text', text: `Since ${func} has period 2π, we add 2πk to each solution:` },
        { type: 'text', text: `where k is any integer (k ∈ ℤ)` },
        { type: 'text', text: '' },
      ],
    });

    if (func === 'sin') {
      general = `x = ${principal.toFixed(4)} + 2πk  OR  x = ${secondary.toFixed(4)} + 2πk`;
      steps[steps.length - 1].content.push(
        { type: 'highlight', text: `Solution Set:` },
        { type: 'result', text: `x₁ = ${principal.toFixed(4)} + 2πk` },
        { type: 'result', text: `x₂ = ${secondary.toFixed(4)} + 2πk` },
        { type: 'text', text: `where k ∈ ℤ (any integer)` },
      );
    } else {
      // For cosine, we can write more elegantly as ±
      general = `x = ±${principal.toFixed(4)} + 2πk`;
      steps[steps.length - 1].content.push(
        { type: 'highlight', text: `Compact Form:` },
        { type: 'result', text: `x = ±${principal.toFixed(4)} + 2πk` },
        { type: 'text', text: `where k ∈ ℤ (any integer)` },
        { type: 'text', text: '' },
        { type: 'text', text: 'This compact form includes both solutions:' },
        { type: 'text', text: `When +: x = ${principal.toFixed(4)} + 2πk` },
        { type: 'text', text: `When -: x = ${-principal.toFixed(4)} + 2πk = ${(2*Math.PI - principal).toFixed(4)} + 2πk` },
      );
    }

  } else if (func === 'tan') {
    // Tangent has period π
    steps.push({
      step: isSpecialAngle ? 'STEP 5' : 'STEP 4',
      badge: 'primary',
      content: [
        { type: 'text', text: '🎯 UNDERSTANDING TANGENT\'S PERIOD' },
        { type: 'text', text: 'Unlike sine and cosine, tangent has period π (not 2π).' },
        { type: 'text', text: 'This means tan(x + π) = tan(x) for all x.' },
        { type: 'text', text: '' },
        { type: 'text', text: 'Tangent is positive in quadrants I and III (where sin and cos have same sign).' },
        { type: 'text', text: 'Tangent is negative in quadrants II and IV (where sin and cos have opposite signs).' },
      ],
    });

    steps.push({
      step: isSpecialAngle ? 'STEP 6' : 'STEP 5',
      badge: 'secondary',
      content: [
        { type: 'text', text: '♾️ GENERAL SOLUTION' },
        { type: 'text', text: 'Since tan has period π, the general solution is:' },
        { type: 'text', text: `x = arctan(${value}) + πk` },
        { type: 'text', text: `x = ${principal.toFixed(4)} + πk` },
        { type: 'text', text: '' },
        { type: 'result', text: `x = ${principal.toFixed(4)} + πk` },
        { type: 'text', text: `where k ∈ ℤ (any integer)` },
        { type: 'text', text: '' },
        { type: 'text', text: '💡 This single formula gives ALL solutions!' },
        { type: 'text', text: 'For example:' },
        { type: 'text', text: `k = 0: x = ${principal.toFixed(4)}` },
        { type: 'text', text: `k = 1: x = ${(principal + Math.PI).toFixed(4)}` },
        { type: 'text', text: `k = -1: x = ${(principal - Math.PI).toFixed(4)}` },
        { type: 'text', text: '...and so on for any integer k.' },
      ],
    });

    general = `x = ${principal.toFixed(4)} + πk`;
    secondary = null;
  }

  // Final step: Verification
  steps.push({
    step: 'VERIFICATION',
    badge: 'warning',
    content: [
      { type: 'text', text: '✅ VERIFICATION' },
      { type: 'text', text: `Check: ${func}(${principal.toFixed(4)})` },
      { type: 'text', text: `= ${Math[func](principal).toFixed(6)}` },
      { type: 'text', text: `≈ ${value} ✓` },
      ...(secondary !== null ? [
        { type: 'text', text: '' },
        { type: 'text', text: `Check: ${func}(${secondary.toFixed(4)})` },
        { type: 'text', text: `= ${Math[func](secondary).toFixed(6)}` },
        { type: 'text', text: `≈ ${value} ✓` },
      ] : []),
    ],
  });

  // Unit circle visualization hint
  steps.push({
    step: 'VISUAL',
    badge: 'primary',
    content: [
      { type: 'text', text: '🎨 UNIT CIRCLE VISUALIZATION' },
      { type: 'text', text: 'Imagine the unit circle (radius = 1):' },
      { type: 'text', text: getUnitCircleDescription(func, value, principal, secondary) },
      { type: 'text', text: '' },
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