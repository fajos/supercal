// probabilitySolver.js
export function solveProbability(type, params) {
  const steps = [];
  let result;
  
  switch(type) {
    case 'permutation':
      const { n: nP, r: rP } = params;
      result = factorial(nP) / factorial(nP - rP);
      
      steps.push({
        step: 'PERMUTATION',
        badge: 'primary',
        content: [
          { type: 'text', text: '🎲 Permutation: P(n,r) = n!/(n-r)!' },
          { type: 'text', text: `P(${nP},${rP}) = ${nP}!/(${nP}-${rP})!` },
          { type: 'text', text: `= ${nP}!/${nP - rP}!` },
          { type: 'text', text: `${nP}! = ${Array.from({length: nP}, (_,i) => nP-i).join(' × ')} = ${factorial(nP)}` },
          { type: 'text', text: `(${nP}-${rP})! = ${factorial(nP - rP)}` },
          { type: 'highlight', text: `P(${nP},${rP}) = ${result}` },
          { type: 'text', text: 'Order matters in permutations!' },
        ],
      });
      break;
      
    case 'combination':
      const { n: nC, r: rC } = params;
      result = factorial(nC) / (factorial(rC) * factorial(nC - rC));
      
      steps.push({
        step: 'COMBINATION',
        badge: 'primary',
        content: [
          { type: 'text', text: '🎲 Combination: C(n,r) = n!/(r!(n-r)!)' },
          { type: 'text', text: `C(${nC},${rC}) = ${nC}!/(${rC}! × (${nC}-${rC})!)` },
          { type: 'text', text: `= ${factorial(nC)}/(${factorial(rC)} × ${factorial(nC - rC)})` },
          { type: 'highlight', text: `C(${nC},${rC}) = ${result}` },
          { type: 'text', text: 'Order does NOT matter in combinations!' },
        ],
      });
      break;
      
    case 'binomial':
      const { n: nB, k: kB, p } = params;
      const comb = factorial(nB) / (factorial(kB) * factorial(nB - kB));
      result = comb * Math.pow(p, kB) * Math.pow(1 - p, nB - kB);
      
      steps.push({
        step: 'BINOMIAL PROBABILITY',
        badge: 'primary',
        content: [
          { type: 'text', text: '🎲 Binomial: P(X=k) = C(n,k) × p^k × (1-p)^(n-k)' },
          { type: 'text', text: `n=${nB} trials, k=${kB} successes, p=${p}` },
          { type: 'text', text: `C(${nB},${kB}) = ${comb}` },
          { type: 'text', text: `p^k = ${p}^${kB} = ${Math.pow(p, kB).toFixed(6)}` },
          { type: 'text', text: `(1-p)^(n-k) = ${1-p}^${nB-kB} = ${Math.pow(1-p, nB-kB).toFixed(6)}` },
          { type: 'highlight', text: `P(X=${kB}) = ${result.toFixed(6)}` },
        ],
      });
      break;
  }
  
  return { result, steps };
}

function factorial(n) {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}