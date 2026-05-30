// src/solvers/radioactivitySolver.js - Pedagogical radioactivity tutor

export function solveRadioactivity(mode, params) {
  const { initialAmount, time, halfLife } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'halfLife': {
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚛️ Radioactive Decay Analysis:' },
          { type: 'text', text: `• Initial Amount (N₀): ${initialAmount}` },
          { type: 'text', text: `• Half-life (T₁/₂): ${halfLife} time units` },
          { type: 'text', text: `• Elapsed Time (t): ${time} time units` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Radioactive decay is exponential - the amount halves every half-life period.' },
          { type: 'text', text: 'This is a first-order process, meaning the decay rate is proportional to the amount present.' },
        ],
      });

      // 2. FORMULA
      const n_halfLives = time / halfLife;
      
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The exponential decay law based on half-lives:' },
          { type: 'formula', text: 'N = N₀ · (½)^(t / T₁/₂)' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: '• N = Amount remaining after time t' },
          { type: 'text', text: '• N₀ = Initial amount' },
          { type: 'text', text: '• t = Elapsed time' },
          { type: 'text', text: '• T₁/₂ = Half-life (time for half to decay)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Alternative form using number of half-lives (n):' },
          { type: 'formula', text: 'N = N₀ · (½)ⁿ  where n = t / T₁/₂' },
        ],
      });

      // 3. CALCULATION
      const decayFactor = Math.pow(0.5, n_halfLives);
      const remaining = initialAmount * decayFactor;
      const decayed = initialAmount - remaining;
      const percentRemaining = (remaining / initialAmount) * 100;
      const percentDecayed = (decayed / initialAmount) * 100;
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate number of half-lives elapsed' },
          { type: 'text', text: `n = t / T₁/₂` },
          { type: 'text', text: `n = ${time} / ${halfLife}` },
          { type: 'result', text: `n = ${n_halfLives.toFixed(3)} half-lives` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate the decay factor (remaining fraction)' },
          { type: 'text', text: `Decay factor = (½)ⁿ = (½)^${n_halfLives.toFixed(3)}` },
          { type: 'text', text: `Decay factor = ${decayFactor.toFixed(6)}` },
          { type: 'text', text: `This means ${(decayFactor * 100).toFixed(2)}% of the original sample remains.` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate remaining amount' },
          { type: 'text', text: `N = N₀ × decay factor` },
          { type: 'text', text: `N = ${initialAmount} × ${decayFactor.toFixed(6)}` },
          { type: 'result', text: `N = ${remaining.toFixed(4)} units` },
        ],
      });

      // 4. ANALYSIS
      const nextHalfLifeRemaining = remaining * 0.5;
      const timeToNextHalfLife = (n_halfLives + 1) * halfLife - time;
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: '✅ DECAY ANALYSIS SUMMARY:' },
          { type: 'text', text: '' },
          { type: 'result', text: `• Remaining: ${remaining.toFixed(4)} units (${percentRemaining.toFixed(1)}%)` },
          { type: 'result', text: `• Decayed: ${decayed.toFixed(4)} units (${percentDecayed.toFixed(1)}%)` },
          { type: 'result', text: `• Half-lives elapsed: ${n_halfLives.toFixed(3)}` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 FUTURE PREDICTIONS:' },
          { type: 'text', text: `• After one more half-life: ${nextHalfLifeRemaining.toFixed(4)} units will remain` },
          { type: 'text', text: `• Time until next half-life: ${timeToNextHalfLife.toFixed(2)} time units` },
          { type: 'text', text: `• After 5 half-lives: ${(initialAmount * Math.pow(0.5, 5)).toFixed(4)} units (< 3.125% remains)` },
          { type: 'text', text: `• After 10 half-lives: ${(initialAmount * Math.pow(0.5, 10)).toFixed(6)} units (< 0.1% remains)` },
          { type: 'text', text: '' },
          { type: 'text', text: '⚛️ KEY INSIGHTS:' },
          { type: 'text', text: '• Radioactive decay is a random process at the atomic level' },
          { type: 'text', text: '• We can predict bulk behavior with extreme precision' },
          { type: 'text', text: '• Each half-life reduces the amount by exactly 50%' },
          { type: 'text', text: '• The decay rate slows down over time (fewer atoms = fewer decays)' },
          { type: 'text', text: '' },
          { type: 'text', text: '🌍 APPLICATIONS:' },
          { type: 'text', text: '• Carbon-14 dating (T₁/₂ = 5,730 years) - archaeological dating' },
          { type: 'text', text: '• Medical isotopes - targeted radiation therapy' },
          { type: 'text', text: '• Nuclear power - controlled fission reactions' },
          { type: 'text', text: '• Smoke detectors - Americium-241 alpha particles' },
        ],
      });
      result = remaining.toFixed(4);
      break;
    }

    case 'decayConstant': {
      const lambda = Math.LN2 / halfLife;
      const meanLifetime = 1 / lambda;
      const halfLifeCheck = Math.LN2 / lambda;
      
      // 1. GIVEN
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚛️ Decay Constant Calculation:' },
          { type: 'text', text: `• Half-life (T₁/₂): ${halfLife} time units` },
          { type: 'text', text: '' },
          { type: 'text', text: 'The decay constant (λ) is the probability per unit time that a given nucleus will decay.' },
        ],
      });

      // 2. FORMULA
      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'The decay constant is related to half-life by:' },
          { type: 'formula', text: 'λ = ln(2) / T₁/₂' },
          { type: 'text', text: 'Where ln(2) ≈ 0.693147 (natural log of 2)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'Related quantities:' },
          { type: 'formula', text: 'Mean lifetime (τ) = 1 / λ' },
          { type: 'formula', text: 'T₁/₂ = ln(2) / λ = τ · ln(2)' },
          { type: 'text', text: '' },
          { type: 'text', text: 'The complete decay equation:' },
          { type: 'formula', text: 'N(t) = N₀ · e^(-λt)' },
        ],
      });

      // 3. CALCULATION
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Apply the decay constant formula' },
          { type: 'text', text: `λ = ln(2) / T₁/₂` },
          { type: 'text', text: `λ = 0.693147 / ${halfLife}` },
          { type: 'result', text: `λ = ${lambda.toExponential(4)} per time unit` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate mean lifetime' },
          { type: 'text', text: `τ = 1 / λ = 1 / ${lambda.toExponential(4)}` },
          { type: 'result', text: `τ = ${meanLifetime.toFixed(4)} time units` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Verify half-life from decay constant' },
          { type: 'text', text: `T₁/₂ = ln(2) / λ = 0.693147 / ${lambda.toExponential(4)}` },
          { type: 'text', text: `T₁/₂ = ${halfLifeCheck.toFixed(4)} ≈ ${halfLife} ✓` },
        ],
      });

      // 4. ANALYSIS
      const probPerUnit = lambda * 100;
      const probPerThousand = lambda * 1000;
      
      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: '✅ DECAY CONSTANT SUMMARY:' },
          { type: 'text', text: '' },
          { type: 'result', text: `• Decay constant (λ) = ${lambda.toExponential(4)} per time unit` },
          { type: 'result', text: `• Mean lifetime (τ) = ${meanLifetime.toFixed(4)} time units` },
          { type: 'result', text: `• Half-life (T₁/₂) = ${halfLife} time units` },
          { type: 'text', text: '' },
          { type: 'text', text: '📊 PHYSICAL INTERPRETATION:' },
          { type: 'text', text: `• Each nucleus has a ${probPerUnit.toExponential(2)}% chance of decaying per time unit` },
          { type: 'text', text: `• Out of 1,000 nuclei, approximately ${probPerThousand.toFixed(2)} will decay per time unit` },
          { type: 'text', text: `• The mean lifetime (τ) is the average time a nucleus exists before decaying` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 KEY RELATIONSHIPS:' },
          { type: 'text', text: '• Larger λ → Shorter half-life → More radioactive' },
          { type: 'text', text: '• Smaller λ → Longer half-life → Less radioactive' },
          { type: 'text', text: '• T₁/₂ < τ (mean lifetime is always longer than half-life)' },
          { type: 'text', text: '• After one mean lifetime (τ), ~36.8% (1/e) of the original remains' },
        ],
      });
      result = `λ = ${lambda.toExponential(4)}`;
      break;
    }
  }

  return { result, steps };
}