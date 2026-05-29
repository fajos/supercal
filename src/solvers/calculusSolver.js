// calculusSolver.js - Complete educational calculus solver

export function solveDerivative(expression, variable = 'x') {
  const steps = [];
  
  // STEP 1: Introduction
  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 DIFFERENTIATION SETUP' },
      { type: 'text', text: `Function: f(${variable}) = ${expression}` },
      { type: 'text', text: `Finding: f'(${variable}) = d/d${variable}[f(${variable})]` },
      { type: 'text', text: '' },
      { type: 'text', text: 'The derivative tells us the instantaneous rate of change:' },
      { type: 'text', text: `f'(x) = lim[h→0] (f(x+h) - f(x))/h` },
    ],
  });

  // STEP 2: Parse the expression
  const terms = parseExpression(expression, variable);
  
  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🔍 IDENTIFYING TERMS' },
      { type: 'text', text: 'Break down the function into individual terms:' },
      ...terms.map(term => ({ type: 'text', text: `  • ${term.original}` })),
      { type: 'text', text: '' },
      { type: 'text', text: 'We\'ll differentiate each term separately using the Sum Rule:' },
      { type: 'highlight', text: 'd/dx[f(x) + g(x)] = f\'(x) + g\'(x)' },
    ],
  });

  // STEP 3: Differentiate each term with explanations
  const differentiated = terms.map((term, idx) => {
    const result = differentiateTerm(term, variable);
    
    steps.push({
      step: `TERM ${idx + 1}`,
      badge: 'primary',
      content: [
        { type: 'text', text: `Differentiating: ${term.original}` },
        ...result.explanation,
        { type: 'highlight', text: `d/d${variable}[${term.original}] = ${result.derivative}` },
      ],
    });
    
    return result;
  });

  // STEP 4: Combine results
  const nonZeroTerms = differentiated.filter(t => t.derivative !== '0');
  let finalDerivative;
  
  if (nonZeroTerms.length === 0) {
    finalDerivative = '0';
  } else {
    finalDerivative = nonZeroTerms
      .map(t => t.derivative)
      .join(' + ')
      .replace(/\+\s*-/g, '- ');
  }

  steps.push({
    step: 'STEP 4',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📝 COMBINING RESULTS' },
      { type: 'text', text: 'Add all the individual derivatives together:' },
      ...differentiated.map(t => 
        ({ type: 'text', text: `  d/dx[${t.original}] = ${t.derivative}` })
      ),
      { type: 'text', text: '' },
      { type: 'highlight', text: `f'(${variable}) = ${finalDerivative}` },
    ],
  });

  // STEP 5: Simplify
  const simplified = simplifyExpression(finalDerivative);
  
  if (simplified !== finalDerivative) {
    steps.push({
      step: 'STEP 5',
      badge: 'warning',
      content: [
        { type: 'text', text: '✨ SIMPLIFYING' },
        { type: 'text', text: 'Combine like terms and simplify:' },
        { type: 'highlight', text: `f'(${variable}) = ${simplified}` },
      ],
    });
    finalDerivative = simplified;
  }

  // STEP 6: Understanding the result
  steps.push({
    step: 'INTERPRETATION',
    badge: 'primary',
    content: [
      { type: 'text', text: '💡 INTERPRETING THE DERIVATIVE' },
      { type: 'text', text: `f'(${variable}) = ${finalDerivative} tells us:` },
      { type: 'text', text: '• The slope of the tangent line at any point x' },
      { type: 'text', text: '• The instantaneous rate of change' },
      { type: 'text', text: '• Positive f\'(x) → f(x) is increasing' },
      { type: 'text', text: '• Negative f\'(x) → f(x) is decreasing' },
      { type: 'text', text: '• f\'(x) = 0 → possible maximum, minimum, or inflection point' },
    ],
  });

  return {
    derivative: finalDerivative,
    steps,
    rawTerms: terms,
    differentiatedTerms: differentiated,
  };
}

function parseExpression(expr, variable) {
  // Remove spaces
  let processed = expr.replace(/\s+/g, '');
  
  // Handle implied multiplication (e.g., "2x" → "2*x")
  processed = processed.replace(/(\d)([a-zA-Z])/g, '$1*$2');
  processed = processed.replace(/([a-zA-Z])(\d)/g, '$1*$2');
  
  const terms = [];
  let currentTerm = '';
  let depth = 0;
  
  for (let i = 0; i < processed.length; i++) {
    const ch = processed[i];
    
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    
    if ((ch === '+' || ch === '-') && depth === 0 && currentTerm.length > 0) {
      terms.push({
        original: currentTerm,
        coefficient: extractCoefficient(currentTerm, variable),
        exponent: extractExponent(currentTerm, variable),
        type: classifyTerm(currentTerm, variable),
      });
      currentTerm = ch === '-' ? '-' : '';
    } else {
      currentTerm += ch;
    }
  }
  
  if (currentTerm) {
    terms.push({
      original: currentTerm,
      coefficient: extractCoefficient(currentTerm, variable),
      exponent: extractExponent(currentTerm, variable),
      type: classifyTerm(currentTerm, variable),
    });
  }
  
  return terms;
}

function extractCoefficient(term, variable) {
  // Handle trigonometric, exponential, logarithmic functions
  if (term.includes('sin(') || term.includes('cos(') || term.includes('tan(') ||
      term.includes('log(') || term.includes('ln(') || term.includes('e^')) {
    const match = term.match(/^(-?\d*\.?\d*)\*/);
    return match ? parseFloat(match[1]) : 1;
  }
  
  // For polynomial terms: ax^n
  const withoutVar = term.replace(new RegExp(variable + '(\\^\\d+)?', 'g'), '');
  if (withoutVar === '' || withoutVar === '-') {
    return withoutVar === '-' ? -1 : 1;
  }
  const cleaned = withoutVar.replace(/\*$/, '');
  return parseFloat(cleaned) || (cleaned === '-' ? -1 : 1);
}

function extractExponent(term, variable) {
  if (!term.includes(variable)) return 0;
  
  // Handle special functions
  if (term.includes('sin(') || term.includes('cos(') || term.includes('tan(') ||
      term.includes('log(') || term.includes('ln(') || term.includes('e^')) {
    return 'special';
  }
  
  const match = term.match(new RegExp(variable + '\\^(\\d+(?:\\.\\d+)?)'));
  return match ? parseFloat(match[1]) : 1;
}

function classifyTerm(term, variable) {
  if (!term.includes(variable)) return 'constant';
  if (term.includes('sin(')) return 'sine';
  if (term.includes('cos(')) return 'cosine';
  if (term.includes('tan(')) return 'tangent';
  if (term.includes('ln(')) return 'natural_log';
  if (term.includes('log(')) return 'logarithm';
  if (term.includes('e^')) return 'exponential';
  if (term.match(new RegExp(variable + '(\\^\\d+)?$'))) return 'power';
  return 'other';
}

function differentiateTerm(term, variable) {
  const explanation = [];
  
  switch (term.type) {
    case 'constant': {
      explanation.push({ type: 'text', text: 'The derivative of a constant is always 0.' });
      explanation.push({ type: 'text', text: 'This is because a constant function has zero rate of change.' });
      return { ...term, derivative: '0', explanation };
    }
    
    case 'power': {
      const coef = term.coefficient;
      const exp = term.exponent;
      const newCoef = coef * exp;
      const newExp = exp - 1;
      
      explanation.push({ type: 'text', text: 'Using the Power Rule: d/dx[x^n] = n·x^(n-1)' });
      explanation.push({ type: 'text', text: `Coefficient: ${coef}` });
      explanation.push({ type: 'text', text: `Exponent: ${exp}` });
      explanation.push({ type: 'text', text: `Step 1: Multiply by exponent: ${coef} × ${exp} = ${newCoef}` });
      explanation.push({ type: 'text', text: `Step 2: Subtract 1 from exponent: ${exp} - 1 = ${newExp}` });
      
      let result;
      if (newExp === 0) {
        result = `${newCoef}`;
        explanation.push({ type: 'text', text: 'x^0 = 1, so the variable disappears.' });
      } else if (newExp === 1) {
        result = `${newCoef}${variable}`;
      } else {
        result = `${newCoef}${variable}^${newExp}`;
      }
      
      return { ...term, derivative: result, explanation };
    }
    
    case 'sine': {
      const innerMatch = term.original.match(/sin\(([^)]+)\)/);
      const inner = innerMatch ? innerMatch[1] : variable;
      const coef = term.coefficient;
      
      explanation.push({ type: 'text', text: 'Using the derivative rule: d/dx[sin(u)] = cos(u) · u\'' });
      explanation.push({ type: 'text', text: `Inner function: u = ${inner}` });
      
      if (inner !== variable) {
        const innerDeriv = differentiateTerm(
          { original: inner, coefficient: 1, exponent: 1, type: 'power' },
          variable
        );
        explanation.push({ type: 'text', text: 'Applying the Chain Rule...' });
        explanation.push({ type: 'text', text: `u' = ${innerDeriv.derivative}` });
        
        let result = `${coef}*cos(${inner})*${innerDeriv.derivative}`;
        return { ...term, derivative: result, explanation };
      }
      
      const result = coef === 1 ? `cos(${inner})` : `${coef}*cos(${inner})`;
      return { ...term, derivative: result, explanation };
    }
    
    case 'cosine': {
      const innerMatch = term.original.match(/cos\(([^)]+)\)/);
      const inner = innerMatch ? innerMatch[1] : variable;
      const coef = term.coefficient;
      
      explanation.push({ type: 'text', text: 'Using the derivative rule: d/dx[cos(u)] = -sin(u) · u\'' });
      explanation.push({ type: 'text', text: `Inner function: u = ${inner}` });
      
      if (inner !== variable) {
        const innerDeriv = differentiateTerm(
          { original: inner, coefficient: 1, exponent: 1, type: 'power' },
          variable
        );
        explanation.push({ type: 'text', text: 'Applying the Chain Rule...' });
        explanation.push({ type: 'text', text: `u' = ${innerDeriv.derivative}` });
        
        const result = coef === 1 
          ? `-sin(${inner})*${innerDeriv.derivative}`
          : `${-coef}*sin(${inner})*${innerDeriv.derivative}`;
        return { ...term, derivative: result, explanation };
      }
      
      const result = coef === 1 ? `-sin(${inner})` : `${-coef}*sin(${inner})`;
      return { ...term, derivative: result, explanation };
    }
    
    case 'exponential': {
      const match = term.original.match(/e\^\(?([^)]+)\)?/);
      const exponent = match ? match[1] : variable;
      const coef = term.coefficient;
      
      explanation.push({ type: 'text', text: 'Using: d/dx[e^u] = e^u · u\'' });
      
      if (exponent !== variable) {
        const innerDeriv = differentiateTerm(
          { original: exponent, coefficient: 1, exponent: 1, type: 'power' },
          variable
        );
        explanation.push({ type: 'text', text: 'Chain Rule: differentiate the exponent' });
        explanation.push({ type: 'text', text: `d/dx[${exponent}] = ${innerDeriv.derivative}` });
        
        const result = coef === 1
          ? `e^(${exponent})*${innerDeriv.derivative}`
          : `${coef}*e^(${exponent})*${innerDeriv.derivative}`;
        return { ...term, derivative: result, explanation };
      }
      
      const result = coef === 1 ? `e^${variable}` : `${coef}*e^${variable}`;
      return { ...term, derivative: result, explanation };
    }
    
    case 'natural_log': {
      const match = term.original.match(/ln\(([^)]+)\)/);
      const inner = match ? match[1] : variable;
      const coef = term.coefficient;
      
      explanation.push({ type: 'text', text: 'Using: d/dx[ln(u)] = u\'/u' });
      
      if (inner !== variable) {
        const innerDeriv = differentiateTerm(
          { original: inner, coefficient: 1, exponent: 1, type: 'power' },
          variable
        );
        explanation.push({ type: 'text', text: `u' = ${innerDeriv.derivative}` });
        
        const result = coef === 1
          ? `(${innerDeriv.derivative})/(${inner})`
          : `${coef}*(${innerDeriv.derivative})/(${inner})`;
        return { ...term, derivative: result, explanation };
      }
      
      const result = coef === 1 ? `1/${variable}` : `${coef}/${variable}`;
      return { ...term, derivative: result, explanation };
    }
    
    default:
      explanation.push({ type: 'text', text: 'Using the basic differentiation rules.' });
      return { ...term, derivative: `d/dx[${term.original}]`, explanation };
  }
}

function simplifyExpression(expr) {
  // Basic simplification: clean up the expression
  let simplified = expr
    .replace(/\+ -/g, '- ')
    .replace(/1\*/g, '')
    .replace(/\*1/g, '')
    .replace(/\^1(?![0-9])/g, '')
    .replace(/x\^0/g, '1');
  
  return simplified;
}

export function solveIntegral(expression, variable = 'x', lower = 0, upper = 1) {
  const steps = [];
  
  steps.push({
    step: 'STEP 1',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 DEFINITE INTEGRAL SETUP' },
      { type: 'text', text: `Integrand: f(${variable}) = ${expression}` },
      { type: 'text', text: `Bounds: ${variable} from ${lower} to ${upper}` },
      { type: 'highlight', text: `∫[${lower}, ${upper}] (${expression}) d${variable}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'The definite integral represents:' },
      { type: 'text', text: '• The area under the curve (if f(x) ≥ 0)' },
      { type: 'text', text: '• The net signed area between the curve and x-axis' },
    ],
  });

  // STEP 2: Find antiderivative
  const derivResult = solveDerivative(expression, variable);
  // For integration, we need to reverse the derivative process
  const terms = parseExpression(expression, variable);
  
  steps.push({
    step: 'STEP 2',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🔍 FINDING THE ANTIDERIVATIVE' },
      { type: 'text', text: 'Use the Power Rule in reverse: ∫x^n dx = x^(n+1)/(n+1) + C' },
      { type: 'text', text: 'Break into terms and integrate each one:' },
    ],
  });

  const antiderivativeTerms = [];
  let antiderivativeStr = '';
  
  for (const term of terms) {
    const integrated = integrateTerm(term, variable);
    antiderivativeTerms.push(integrated);
    
    steps.push({
      step: `TERM`,
      badge: 'primary',
      content: [
        { type: 'text', text: `∫ ${term.original} d${variable}` },
        ...integrated.explanation,
        { type: 'highlight', text: `= ${integrated.antiderivative}` },
      ],
    });
  }

  // Combine antiderivative
  antiderivativeStr = antiderivativeTerms
    .map(t => t.antiderivative)
    .join(' + ')
    .replace(/\+\s*-/g, '- ');

  steps.push({
    step: 'STEP 3',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📝 ANTIDERIVATIVE (INDEFINITE INTEGRAL)' },
      { type: 'highlight', text: `F(${variable}) = ${antiderivativeStr} + C` },
      { type: 'text', text: 'C is the constant of integration (not needed for definite integrals).' },
    ],
  });

  // STEP 4: Evaluate using FTC
  steps.push({
    step: 'STEP 4',
    badge: 'primary',
    content: [
      { type: 'text', text: '📊 APPLY THE FUNDAMENTAL THEOREM OF CALCULUS' },
      { type: 'text', text: '∫[a,b] f(x)dx = F(b) - F(a)' },
      { type: 'text', text: `where F is the antiderivative and a=${lower}, b=${upper}` },
    ],
  });

  // Numerical evaluation
  const fUpper = evaluateExpression(antiderivativeStr, variable, upper);
  const fLower = evaluateExpression(antiderivativeStr, variable, lower);
  const result = fUpper - fLower;

  steps.push({
    step: 'STEP 5',
    badge: 'secondary',
    content: [
      { type: 'text', text: 'Calculate F(upper) and F(lower):' },
      { type: 'text', text: `F(${upper}) = ${antiderivativeStr} evaluated at ${variable}=${upper}` },
      { type: 'highlight', text: `F(${upper}) = ${fUpper.toFixed(6)}` },
      { type: 'text', text: '' },
      { type: 'text', text: `F(${lower}) = ${antiderivativeStr} evaluated at ${variable}=${lower}` },
      { type: 'highlight', text: `F(${lower}) = ${fLower.toFixed(6)}` },
    ],
  });

  steps.push({
    step: 'FINAL',
    badge: 'warning',
    content: [
      { type: 'text', text: '📊 DEFINITE INTEGRAL RESULT' },
      { type: 'text', text: `∫[${lower}, ${upper}] f(x)dx = F(${upper}) - F(${lower})` },
      { type: 'text', text: `= ${fUpper.toFixed(6)} - ${fLower.toFixed(6)}` },
      { type: 'highlight', text: `= ${result.toFixed(6)}` },
      { type: 'text', text: '' },
      { type: 'text', text: '💡 This value represents the net area between the curve and x-axis.' },
    ],
  });

  return {
    value: result,
    antiderivative: antiderivativeStr,
    steps,
  };
}

function integrateTerm(term, variable) {
  const explanation = [];
  
  switch (term.type) {
    case 'constant': {
      const coef = term.coefficient;
      explanation.push({ type: 'text', text: '∫ k dx = kx + C (constant rule)' });
      const result = coef === 1 ? variable : `${coef}${variable}`;
      return { ...term, antiderivative: result, explanation };
    }
    
    case 'power': {
      const coef = term.coefficient;
      const exp = term.exponent;
      const newExp = exp + 1;
      
      explanation.push({ type: 'text', text: 'Using Power Rule in reverse: ∫ x^n dx = x^(n+1)/(n+1)' });
      explanation.push({ type: 'text', text: `New exponent: ${exp} + 1 = ${newExp}` });
      explanation.push({ type: 'text', text: `New coefficient: ${coef}/${newExp} = ${coef/newExp}` });
      
      const result = `(${coef/newExp})${variable}^${newExp}`;
      return { ...term, antiderivative: result, explanation };
    }
    
    case 'sine': {
      explanation.push({ type: 'text', text: '∫ sin(x) dx = -cos(x) + C' });
      const coef = term.coefficient;
      const result = coef === 1 ? `-cos(${variable})` : `${-coef}*cos(${variable})`;
      return { ...term, antiderivative: result, explanation };
    }
    
    case 'cosine': {
      explanation.push({ type: 'text', text: '∫ cos(x) dx = sin(x) + C' });
      const coef = term.coefficient;
      const result = coef === 1 ? `sin(${variable})` : `${coef}*sin(${variable})`;
      return { ...term, antiderivative: result, explanation };
    }
    
    case 'exponential': {
      explanation.push({ type: 'text', text: '∫ e^x dx = e^x + C' });
      const result = `e^${variable}`;
      return { ...term, antiderivative: result, explanation };
    }
    
    case 'natural_log': {
      explanation.push({ type: 'text', text: '∫ ln(x) dx = x·ln(x) - x + C (integration by parts)' });
      const result = `${variable}*ln(${variable}) - ${variable}`;
      return { ...term, antiderivative: result, explanation };
    }
    
    default:
      explanation.push({ type: 'text', text: 'Standard integration rules applied.' });
      return { ...term, antiderivative: `∫${term.original} d${variable}`, explanation };
  }
}

export function evaluateExpression(expr, variable, value) {
  try {
    // 1. Initial cleanup: remove spaces and handle standard math notation
    let processed = expr.replace(/\s+/g, '');

    // 2. Replace variable with value in parentheses to handle negatives and powers safely
    // We use a RegExp that doesn't use boundaries because variables are often attached to numbers (e.g., 2x)
    processed = processed.replace(new RegExp(variable, 'g'), `(${value})`);

    // 3. Handle implied multiplication (the most common cause of NaN/eval errors)
    // Number followed by parenthesis: 2(3) -> 2*(3)
    processed = processed.replace(/(\d)(\()/g, '$1*$2');
    // Parenthesis followed by number: (2)3 -> (2)*3
    processed = processed.replace(/(\))(\d)/g, '$1*$2');
    // Parenthesis followed by parenthesis: (1)(2) -> (1)*(2)
    processed = processed.replace(/(\))(\()/g, '$1*$2');

    // 4. Mathematical translations to JavaScript Math object
    processed = processed
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/asin|sin⁻¹/g, 'Math.asin')
      .replace(/acos|cos⁻¹/g, 'Math.acos')
      .replace(/atan|tan⁻¹/g, 'Math.atan')
      .replace(/ln/g, 'Math.log')
      .replace(/log/g, 'Math.log10')
      .replace(/exp/g, 'Math.exp')
      .replace(/\be\b/g, 'Math.E')
      .replace(/π/g, 'Math.PI');

    // 5. Final pass for implied multiplication with Math functions
    // e.g. 2Math.sin -> 2*Math.sin
    processed = processed.replace(/(\d)(Math\.)/g, '$1*$2');
    processed = processed.replace(/(\))(Math\.)/g, '$1*$2');

    // eslint-disable-next-line no-eval
    const result = eval(processed);
    return typeof result === 'number' ? result : NaN;
  } catch (err) {
    console.warn('Evaluation failed for:', expr, 'Processed as:', processed, err);
    return NaN;
  }
}   