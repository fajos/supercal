export function solveRadioactivity(mode, params) {
  const { initialAmount, finalAmount, time, halfLife, decayConstant } = params;
  const steps = [];
  let result;

  switch (mode) {
    case 'halfLife': {
      // N = N0 * (1/2)^(t/T)
      const n = time / halfLife;
      const remaining = initialAmount * Math.pow(0.5, n);
      steps.push({
        step: 'RADIOACTIVE DECAY (Half-life)',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚛️ Calculating remaining nuclei/mass:' },
          { type: 'formula', text: 'N = N₀(½)^(t/T)' },
          { type: 'text', text: `Initial Amount (N₀) = ${initialAmount}` },
          { type: 'text', text: `Elapsed Time (t) = ${time}` },
          { type: 'text', text: `Half-life (T) = ${halfLife}` },
          { type: 'text', text: '' },
          { type: 'text', text: `Number of half-lives (n) = t/T = ${time}/${halfLife} = ${n.toFixed(3)}` },
          { type: 'text', text: `N = ${initialAmount} × (0.5)^${n.toFixed(3)}` },
          { type: 'highlight', text: `Remaining Amount (N) = ${remaining.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Half-life is the time taken for half the radioactive nuclei in a sample to decay.' },
        ],
      });
      result = remaining.toFixed(4);
      break;
    }

    case 'decayConstant': {
      // λ = ln(2) / T
      const lambda = Math.LN2 / halfLife;
      steps.push({
        step: 'DECAY CONSTANT',
        badge: 'primary',
        content: [
          { type: 'text', text: '⚛️ Calculating probability of decay per unit time:' },
          { type: 'formula', text: 'λ = ln(2) / T' },
          { type: 'text', text: `Half-life (T) = ${halfLife}` },
          { type: 'text', text: '' },
          { type: 'text', text: `λ = 0.693 / ${halfLife}` },
          { type: 'highlight', text: `Decay Constant (λ) = ${lambda.toExponential(4)} s⁻¹` },
        ],
      });
      result = lambda.toExponential(4);
      break;
    }
  }

  return { result, steps };
}
