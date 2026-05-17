// src/solvers/radioactivitySolver.js - Pedagogical radioactivity tutor

export function solveRadioactivity(mode, params) {
  const { initialAmount, time, halfLife } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'halfLife': {
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: 'We identify the initial state of the radioactive sample and the time elapsed:' },
          { type: 'text', text: `• Initial Amount (N₀): ${initialAmount}` },
          { type: 'text', text: `• Half-life (T₁/₂): ${halfLife}` },
          { type: 'text', text: `• Elapsed Time (t): ${time}` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'Radioactive decay follows an exponential model based on the number of half-lives that have passed:' },
          { type: 'highlight', text: 'N = N₀ · (1/2)^(t / T₁/₂)' },
        ],
      });

      // 3. CALCULATION
      const n = time / halfLife;
      const remaining = initialAmount * Math.pow(0.5, n);
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: 'Step 1: Determine the number of half-lives (n)' },
          { type: 'text', text: `n = ${time} / ${halfLife} = ${n.toFixed(3)} half-lives` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate the remaining amount (N)' },
          { type: 'text', text: `N = ${initialAmount} × (0.5)^${n.toFixed(3)}` },
          { type: 'highlight', text: `Remaining Amount: ${remaining.toFixed(4)}` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: `After ${time} units of time, ${remaining.toFixed(4)} of the original ${initialAmount} remains.` },
          { type: 'text', text: `This means ${(initialAmount - remaining).toFixed(4)} (${((initialAmount - remaining)/initialAmount * 100).toFixed(1)}%) has decayed into more stable daughter isotopes.` },
          { type: 'text', text: '' },
          { type: 'text', text: '⚛️ RADIOACTIVE INSIGHT: Radioactive decay is a purely statistical process. We cannot predict when a specific atom will decay, but we can predict with incredible accuracy how much of a large sample will decay over time.' },
        ],
      });
      result = remaining.toFixed(4);
      break;
    }

    case 'decayConstant': {
      const lambda = Math.LN2 / halfLife;
      // 1. GIVEN VALUES
      steps.push({
        step: 'GIVEN VALUES',
        badge: 'input',
        content: [
          { type: 'text', text: `• Half-life (T₁/₂): ${halfLife}` },
        ],
      });

      // 2. EQUATIONS
      steps.push({
        step: 'EQUATIONS',
        badge: 'formula',
        content: [
          { type: 'text', text: 'The decay constant (λ) represents the probability of a single nucleus decaying per unit of time:' },
          { type: 'highlight', text: 'λ = ln(2) / T₁/₂' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'math',
        content: [
          { type: 'text', text: `λ = 0.6931 / ${halfLife}` },
          { type: 'highlight', text: `λ ≈ ${lambda.toExponential(4)} per time unit` },
        ],
      });

      // 4. INTERPRETATION / ANALYSIS
      steps.push({
        step: 'INTERPRETATION / ANALYSIS',
        badge: 'insight',
        content: [
          { type: 'text', text: 'The decay constant is a fundamental property of the isotope. A larger constant means the material is more radioactive (decays more rapidly).' },
          { type: 'text', text: `Statistically, each nucleus has a ${ (lambda * 100).toExponential(2) }% chance of decaying in one unit of time.` },
        ],
      });
      result = lambda.toExponential(4);
      break;
    }
  }

  return { result, steps };
}
