export function solveExponential(type, params) {
  const steps = [];
  let result;

  switch(type) {
    case 'exponential': {
      // aˣ = b → x = ln(b)/ln(a)
      const { base, value } = params;
      
      if (base <= 0 || base === 1) {
        throw new Error('Base must be positive and not equal to 1');
      }
      if (value <= 0) {
        throw new Error('Value must be positive for real solutions');
      }

      const solution = Math.log(value) / Math.log(base);
      
      steps.push({
        step: 'EXPONENTIAL EQUATION',
        badge: 'primary',
        content: [
          { type: 'text', text: '📊 Exponential Equation: aˣ = b' },
          { type: 'highlight', text: `${base}ˣ = ${value}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 1: Take natural log (ln) of both sides' },
          { type: 'formula', text: `ln(${base}ˣ) = ln(${value})` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Use power property: ln(aˣ) = x·ln(a)' },
          { type: 'formula', text: `x·ln(${base}) = ln(${value})` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate the logarithms' },
          { type: 'text', text: `ln(${base}) = ${Math.log(base).toFixed(6)}` },
          { type: 'text', text: `ln(${value}) = ${Math.log(value).toFixed(6)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Solve for x' },
          { type: 'text', text: `x = ln(${value}) / ln(${base})` },
          { type: 'text', text: `x = ${Math.log(value).toFixed(6)} / ${Math.log(base).toFixed(6)}` },
          { type: 'highlight', text: `x = ${solution.toFixed(6)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Verification:' },
          { type: 'text', text: `${base}^${solution.toFixed(4)} = ${Math.pow(base, solution).toFixed(6)} ≈ ${value} ✓` },
        ],
      });
      result = solution;
      break;
    }

    case 'logarithmic': {
      // log_a(x) = b → x = a^b
      const { base: logBase, value: logValue } = params;
      
      if (logBase <= 0 || logBase === 1) {
        throw new Error('Base must be positive and not equal to 1');
      }

      const solution = Math.pow(logBase, logValue);
      
      steps.push({
        step: 'LOGARITHMIC EQUATION',
        badge: 'primary',
        content: [
          { type: 'text', text: '📊 Logarithmic Equation: log_a(x) = b' },
          { type: 'highlight', text: `log${getSubscript(logBase)}(x) = ${logValue}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 1: Convert to exponential form' },
          { type: 'text', text: 'Remember: log_a(x) = b ⟺ aᵇ = x' },
          { type: 'formula', text: `${logBase}^${logValue} = x` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate' },
          { type: 'text', text: `x = ${logBase}^${logValue}` },
          { type: 'highlight', text: `x = ${solution.toFixed(6)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Verification:' },
          { type: 'text', text: `log${getSubscript(logBase)}(${solution.toFixed(4)}) = ${(Math.log(solution) / Math.log(logBase)).toFixed(6)} ≈ ${logValue} ✓` },
        ],
      });
      result = solution;
      break;
    }

    case 'natural': {
      // eˣ = b or ln(x) = b
      const { value: natValue, isExp } = params;
      
      steps.push({
        step: 'NATURAL EXPONENTIAL/LOG',
        badge: 'primary',
        content: [
          { type: 'text', text: '📊 Natural Exponential/Logarithm' },
          { type: 'text', text: 'e ≈ 2.71828 (Euler\'s number)' },
          { type: 'text', text: '' },
        ],
      });

      if (isExp) {
        // eˣ = b
        if (natValue <= 0) {
          throw new Error('eˣ > 0 for all real x. No solution for non-positive values.');
        }
        const solution = Math.log(natValue);
        
        steps[0].content.push(
          { type: 'highlight', text: `eˣ = ${natValue}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Take natural log of both sides:' },
          { type: 'text', text: `ln(eˣ) = ln(${natValue})` },
          { type: 'text', text: `x = ln(${natValue})` },
          { type: 'highlight', text: `x = ${solution.toFixed(6)}` },
        );
        result = solution;
      } else {
        // ln(x) = b
        const solution = Math.exp(natValue);
        
        steps[0].content.push(
          { type: 'highlight', text: `ln(x) = ${natValue}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Convert to exponential form:' },
          { type: 'text', text: `x = e^${natValue}` },
          { type: 'highlight', text: `x = ${solution.toFixed(6)}` },
        );
        result = solution;
      }
      break;
    }

    case 'growth': {
      // Exponential growth/decay: A = P·e^(rt) or A = P(1+r)^t
      const { principal, rate, time, mode: growthMode } = params;
      const r = rate / 100;
      
      steps.push({
        step: 'GROWTH/DECAY',
        badge: 'primary',
        content: [
          { type: 'text', text: '📈 Exponential Growth & Decay' },
          { type: 'formula', text: 'A = P·e^(rt) (continuous)' },
          { type: 'formula', text: 'A = P(1 + r)^t (periodic)' },
          { type: 'text', text: '' },
          { type: 'text', text: `Initial amount (P): ${principal}` },
          { type: 'text', text: `Rate: ${rate}% (${growthMode === 'decay' ? 'decay' : 'growth'})` },
          { type: 'text', text: `Time: ${time} periods` },
        ],
      });

      const actualRate = growthMode === 'decay' ? -r : r;
      const continuous = principal * Math.exp(actualRate * time);
      const periodic = principal * Math.pow(1 + r, time);
      
      steps.push({
        step: 'RESULTS',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Continuous compounding:' },
          { type: 'text', text: `A = ${principal}·e^(${actualRate.toFixed(4)} × ${time})` },
          { type: 'highlight', text: `A = ${continuous.toFixed(2)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Periodic (annual) compounding:' },
          { type: 'text', text: `A = ${principal}(1 + ${r.toFixed(4)})^${time}` },
          { type: 'highlight', text: `A = ${periodic.toFixed(2)}` },
          { type: 'text', text: '' },
          { type: 'text', text: `Change: ${(periodic - principal).toFixed(2)} (${(((periodic/principal - 1) * 100)).toFixed(1)}%)` },
        ],
      });
      result = `Continuous: ${continuous.toFixed(2)}, Periodic: ${periodic.toFixed(2)}`;
      break;
    }
  }

  return { result, steps };
}

// Helper function for subscript numbers
function getSubscript(num) {
  const subscripts = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return String(num).split('').map(digit => subscripts[digit] || digit).join('');
}