// probabilitySolver.js

export function solveProbability(type, params) {
  const steps = [];
  let result;
  
  switch(type) {
    case 'permutation': {
      const { n: nP, r: rP } = params;
      result = factorial(nP) / factorial(nP - rP);
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: `Total objects (n): ${nP}` },
          { type: 'text', text: `Objects to select (r): ${rP}` },
          { type: 'text', text: 'Scenario: Selecting objects where the order of selection matters.' },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Permutation Formula (Order Matters):' },
          { type: 'formula', text: 'P(n, r) = n! / (n - r)!' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: `1. Calculate n! (${nP}!): ${factorial(nP)}` },
          { type: 'text', text: `2. Calculate (n - r)! (${nP - rP}!): ${factorial(nP - rP)}` },
          { type: 'result', text: `P(${nP}, ${rP}) = ${result}` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `There are ${result} different ways to arrange ${rP} objects chosen from a set of ${nP}.` },
          { type: 'text', text: '💡 Order is significant.' },
          { type: 'text', text: 'Example: 1st, 2nd, and 3rd place in a race.' },
        ],
      });
      break;
    }

    case 'combination': {
      const { n: nC, r: rC } = params;
      result = factorial(nC) / (factorial(rC) * factorial(nC - rC));
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: `Total objects (n): ${nC}` },
          { type: 'text', text: `Objects to select (r): ${rC}` },
          { type: 'text', text: 'Scenario: Selecting objects where the order of selection does NOT matter.' },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Combination Formula (Order Doesn\'t Matter):' },
          { type: 'formula', text: 'C(n, r) = n! / [r! * (n - r)!]' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: `1. Numerator (n!): ${factorial(nC)}` },
          { type: 'text', text: `2. Denominator (r! * (n-r)!): ${factorial(rC)} * ${factorial(nC - rC)} = ${factorial(rC) * factorial(nC - rC)}` },
          { type: 'result', text: `C(${nC}, ${rC}) = ${result}` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `There are ${result} different ways to choose a group of ${rC} objects from a set of ${nC}.` },
          { type: 'text', text: '💡 Order is NOT significant.' },
          { type: 'text', text: 'Example: Choosing a committee or a hand of cards.' },
        ],
      });
      break;
    }

    case 'binomial': {
      const { n: nB, k: kB, p } = params;
      const comb = factorial(nB) / (factorial(kB) * factorial(nB - kB));
      result = comb * Math.pow(p, kB) * Math.pow(1 - p, nB - kB);
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: `Number of trials (n): ${nB}` },
          { type: 'text', text: `Number of successes (k): ${kB}` },
          { type: 'text', text: `Probability of success (p): ${p}` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Binomial Probability Formula:' },
          { type: 'formula', text: 'P(X = k) = C(n, k) * p^k * (1-p)^(n-k)' },
          { type: 'text', text: 'This calculates the probability of exactly k successes in n independent trials.' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: `1. Combinations C(${nB}, ${kB}) = ${comb}` },
          { type: 'text', text: `2. Probability part: ${p}^${kB} * (1-${p})^(${nB}-${kB})` },
          { type: 'result', text: `P(X = ${kB}) = ${result.toFixed(6)}` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `The probability of getting exactly ${kB} successes is ${ (result * 100).toFixed(2) }%.` },
          { type: 'text', text: '💡 Bernoulli Trials' },
          { type: 'text', text: 'Conditions: Fixed number of trials, only two outcomes (success/failure), and constant probability.' },
        ],
      });
      break;
    }

    default:
        result = 0;
  }
  
  return { result, steps };
}

function factorial(n) {
  if (n < 0) return 0;
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}