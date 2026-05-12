export function solveTrig(func, value) {
  if (func === 'sin' || func === 'cos') {
    if (Math.abs(value) > 1) {
      throw new Error(`${func}(x) must be between -1 and 1. Value ${value} is outside this range.`);
    }
  }

  let principal, secondary = null, general;
  const steps = [
    {
      step: 'STEP 1',
      badge: 'primary',
      content: [
        { type: 'text', text: `Equation: ${func}(x) = ${value}` },
        { type: 'text', text: 'Finding principal solution in [−π/2, π/2] for sin/tan or [0, π] for cos...' },
      ],
    },
  ];

  if (func === 'sin') {
    principal = Math.asin(value);
    const principalDeg = (principal * 180) / Math.PI;
    secondary = Math.PI - principal;
    const secondaryDeg = (secondary * 180) / Math.PI;
    general = `x = ${principal.toFixed(4)} + 2πk  OR  x = ${secondary.toFixed(4)} + 2πk,  k ∈ ℤ`;

    steps.push({
      step: 'STEP 2',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'For sin(x) = value:' },
        { type: 'text', text: `Principal: x = arcsin(${value})` },
        { type: 'highlight', text: `x₁ = ${principal.toFixed(6)} rad` },
        { type: 'text', text: `= ${principalDeg.toFixed(4)}°` },
        { type: 'text', text: '' },
        { type: 'text', text: 'Second solution in [0, 2π):' },
        { type: 'text', text: `x₂ = π − arcsin(${value})` },
        { type: 'text', text: `x₂ = π − ${principal.toFixed(6)}` },
        { type: 'highlight', text: `x₂ = ${secondary.toFixed(6)} rad` },
        { type: 'text', text: `= ${secondaryDeg.toFixed(4)}°` },
      ],
    });

  } else if (func === 'cos') {
    principal = Math.acos(value);
    const principalDeg = (principal * 180) / Math.PI;
    secondary = 2 * Math.PI - principal;
    const secondaryDeg = (secondary * 180) / Math.PI;
    general = `x = ±${principal.toFixed(4)} + 2πk,  k ∈ ℤ`;

    steps.push({
      step: 'STEP 2',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'For cos(x) = value:' },
        { type: 'text', text: `Principal: x = arccos(${value})` },
        { type: 'highlight', text: `x₁ = ${principal.toFixed(6)} rad` },
        { type: 'text', text: `= ${principalDeg.toFixed(4)}°` },
        { type: 'text', text: '' },
        { type: 'text', text: 'Second solution in [0, 2π):' },
        { type: 'text', text: `x₂ = 2π − arccos(${value})` },
        { type: 'highlight', text: `x₂ = ${secondary.toFixed(6)} rad` },
        { type: 'text', text: `= ${secondaryDeg.toFixed(4)}°` },
      ],
    });

  } else if (func === 'tan') {
    principal = Math.atan(value);
    const principalDeg = (principal * 180) / Math.PI;
    general = `x = ${principal.toFixed(4)} + πk,  k ∈ ℤ`;
    secondary = null; // tan has period π, so only one fundamental solution

    steps.push({
      step: 'STEP 2',
      badge: 'secondary',
      content: [
        { type: 'text', text: 'For tan(x) = value:' },
        { type: 'text', text: `Principal: x = arctan(${value})` },
        { type: 'highlight', text: `x = ${principal.toFixed(6)} rad` },
        { type: 'text', text: `= ${principalDeg.toFixed(4)}°` },
        { type: 'text', text: '' },
        { type: 'text', text: 'tan(x) has period π, so general solution:' },
        { type: 'highlight', text: `x = ${principal.toFixed(4)} + πk, k ∈ ℤ` },
      ],
    });
  }

  return {
    steps,
    solutions: {
      principal,
      principalDeg: (principal * 180) / Math.PI,
      secondary,
      secondaryDeg: secondary !== null ? (secondary * 180) / Math.PI : null,
      general,
    },
  };
}