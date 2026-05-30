// calculusSolver.js - Complete educational calculus solver

export function solveDerivative(expression, variable = 'x') {
  const steps = [];
  
  // 1. GIVEN
  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 DIFFERENTIATION SETUP' },
      { type: 'text', text: `Function: f(${variable}) = ${expression}` },
      { type: 'text', text: `Finding: f′(${variable}) = d/d${variable}[f(${variable})]` },
      { type: 'text', text: '' },
      { type: 'text', text: 'The derivative tells us the instantaneous rate of change:' },
      { type: 'formula', text: "f′(x) = lim(h→0) [f(x+h) − f(x)] / h" },
    ],
  });

  // 2. FORMULA
  const terms = parseExpression(expression, variable);
  
  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🔍 IDENTIFYING TERMS' },
      { type: 'text', text: 'Break down the function into individual terms:' },
      ...terms.map(term => ({ type: 'text', text: `  • ${term.original}` })),
      { type: 'text', text: '' },
      { type: 'text', text: "We'll differentiate each term separately using the Sum Rule:" },
      { type: 'formula', text: "d/dx[f(x) + g(x)] = f′(x) + g′(x)" },
    ],
  });

  // 3. CALCULATION
  const differentiated = terms.map((term, idx) => {
    const result = differentiateTerm(term, variable);
    
    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: `Differentiating: ${term.original}` },
        ...result.explanation,
        { type: 'result', text: `d/d${variable}[${term.original}] = ${result.derivative}` },
      ],
    });
    
    return result;
  });

  // STEP 4: Combine results
  const nonZeroTerms = differentiated.filter(t => t.derivative !== '0');
  let displayDerivative;
  let evalDerivative;
  
  if (nonZeroTerms.length === 0) {
    displayDerivative = '0';
    evalDerivative = '0';
  } else {
    displayDerivative = nonZeroTerms
      .map(t => t.derivative)
      .join(' + ')
      .replace(/\+\s*-/g, '- ');
    
    evalDerivative = nonZeroTerms
      .map(t => t.evalDerivative || t.derivative)
      .join('+')
      .replace(/\+\-/g, '-')
      .replace(/\+\s*-/g, '-');
  }

  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: '📝 COMBINING RESULTS' },
      { type: 'text', text: 'Add all the individual derivatives together:' },
      ...differentiated.map(t => 
        ({ type: 'text', text: `  d/dx[${t.original}] = ${t.derivative}` })
      ),
      { type: 'text', text: '' },
      { type: 'result', text: `f′(${variable}) = ${displayDerivative}` },
    ],
  });

  // STEP 5: Simplify
  const simplified = simplifyExpression(displayDerivative);
  
  if (simplified !== displayDerivative) {
    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: '✨ SIMPLIFYING' },
        { type: 'text', text: 'Combine like terms and simplify:' },
        { type: 'result', text: `f′(${variable}) = ${simplified}` },
      ],
    });
    displayDerivative = simplified;
  }

  // 4. ANALYSIS
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: '💡 INTERPRETING THE DERIVATIVE' },
      { type: 'text', text: `f′(${variable}) = ${displayDerivative} tells us:` },
      { type: 'text', text: '• The slope of the tangent line at any point x' },
      { type: 'text', text: '• The instantaneous rate of change' },
      { type: 'text', text: '• Positive f′(x) → f(x) is increasing' },
      { type: 'text', text: '• Negative f′(x) → f(x) is decreasing' },
      { type: 'text', text: '• f′(x) = 0 → possible maximum, minimum, or inflection point' },
    ],
  });

  return {
    derivative: displayDerivative,
    evalDerivative: evalDerivative,
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
    
    if ((ch === '+' || ch === '−' || ch === '-') && depth === 0 && currentTerm.length > 0) {
      terms.push({
        original: currentTerm,
        coefficient: extractCoefficient(currentTerm, variable),
        exponent: extractExponent(currentTerm, variable),
        type: classifyTerm(currentTerm, variable),
      });
      currentTerm = (ch === '−' || ch === '-') ? '-' : '';
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
    return match ? parseFloat(match[1].replace('−', '-')) : 1;
  }
  
  // For polynomial terms: axⁿ
  const withoutVar = term.replace(new RegExp(variable + '(\\^\\d+)?', 'g'), '');
  if (withoutVar === '' || withoutVar === '−' || withoutVar === '-') {
    return withoutVar === '−' || withoutVar === '-' ? -1 : 1;
  }
  const cleaned = withoutVar.replace(/\*$/, '');
  return parseFloat(cleaned.replace('−', '-')) || (cleaned === '−' || cleaned === '-' ? -1 : 1);
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
      return { ...term, derivative: '0', evalDerivative: '0', explanation };
    }
    
    case 'power': {
      const coef = term.coefficient;
      const exp = term.exponent;
      const newCoef = coef * exp;
      const newExp = exp - 1;
      
      explanation.push({ type: 'text', text: 'Using the Power Rule:' });
      explanation.push({ type: 'formula', text: 'd/dx[xⁿ] = n·xⁿ⁻¹' });
      explanation.push({ type: 'text', text: `Coefficient: ${coef}, Exponent: ${exp}` });
      explanation.push({ type: 'text', text: `Step 1: Multiply coefficient by exponent: ${coef} · ${exp} = ${newCoef}` });
      explanation.push({ type: 'text', text: `Step 2: Subtract 1 from exponent: ${exp} − 1 = ${newExp}` });
      
      let displayResult, evalResult;
      if (newExp === 0) {
        displayResult = `${newCoef}`;
        evalResult = `${newCoef}`;
        explanation.push({ type: 'text', text: 'x⁰ = 1, so the variable disappears.' });
      } else if (newExp === 1) {
        displayResult = `${newCoef}${variable}`;
        evalResult = `${newCoef}*${variable}`;
      } else {
        displayResult = `${newCoef}${variable}^${newExp}`;
        evalResult = `${newCoef}*${variable}^${newExp}`;
      }
      
      return { ...term, derivative: displayResult, evalDerivative: evalResult, explanation };
    }
    
    case 'sine': {
      const innerMatch = term.original.match(/sin\(([^)]+)\)/);
      const inner = innerMatch ? innerMatch[1] : variable;
      const coef = term.coefficient;
      
      explanation.push({ type: 'text', text: 'Using the Trigonometric Rule:' });
      explanation.push({ type: 'formula', text: 'd/dx[sin(u)] = cos(u) · u′' });
      explanation.push({ type: 'text', text: `Inner function: u = ${inner}` });
      
      if (inner !== variable) {
        const innerDeriv = differentiateTerm(
          { original: inner, coefficient: 1, exponent: 1, type: 'power' },
          variable
        );
        explanation.push({ type: 'text', text: 'Applying the Chain Rule...' });
        explanation.push({ type: 'text', text: `u′ = ${innerDeriv.derivative}` });
        
        let displayResult = `${coef}*cos(${inner})*${innerDeriv.derivative}`;
        let evalResult = `${coef}*Math.cos(${inner})*${innerDeriv.evalDerivative}`;
        return { ...term, derivative: displayResult, evalDerivative: evalResult, explanation };
      }
      
      const displayResult = coef === 1 ? `cos(${inner})` : `${coef}*cos(${inner})`;
      const evalResult = coef === 1 ? `Math.cos(${inner})` : `${coef}*Math.cos(${inner})`;
      return { ...term, derivative: displayResult, evalDerivative: evalResult, explanation };
    }
    
    case 'cosine': {
      const innerMatch = term.original.match(/cos\(([^)]+)\)/);
      const inner = innerMatch ? innerMatch[1] : variable;
      const coef = term.coefficient;
      
      explanation.push({ type: 'text', text: 'Using the Trigonometric Rule:' });
      explanation.push({ type: 'formula', text: 'd/dx[cos(u)] = −sin(u) · u′' });
      explanation.push({ type: 'text', text: `Inner function: u = ${inner}` });
      
      if (inner !== variable) {
        const innerDeriv = differentiateTerm(
          { original: inner, coefficient: 1, exponent: 1, type: 'power' },
          variable
        );
        explanation.push({ type: 'text', text: 'Applying the Chain Rule...' });
        explanation.push({ type: 'text', text: `u′ = ${innerDeriv.derivative}` });
        
        const displayResult = coef === 1 
          ? `-sin(${inner})*${innerDeriv.derivative}`
          : `${-coef}*sin(${inner})*${innerDeriv.derivative}`;
        const evalResult = coef === 1 
          ? `-1*Math.sin(${inner})*${innerDeriv.evalDerivative}`
          : `${-coef}*Math.sin(${inner})*${innerDeriv.evalDerivative}`;
        return { ...term, derivative: displayResult, evalDerivative: evalResult, explanation };
      }
      
      const displayResult = coef === 1 ? `-sin(${inner})` : `${-coef}*sin(${inner})`;
      const evalResult = coef === 1 ? `-1*Math.sin(${inner})` : `${-coef}*Math.sin(${inner})`;
      return { ...term, derivative: displayResult, evalDerivative: evalResult, explanation };
    }
    
    case 'exponential': {
      const match = term.original.match(/e\^\(?([^)]+)\)?/);
      const exponent = match ? match[1] : variable;
      const coef = term.coefficient;
      
      explanation.push({ type: 'text', text: 'Using the Exponential Rule:' });
      explanation.push({ type: 'formula', text: 'd/dx[eᵘ] = eᵘ · u′' });
      
      if (exponent !== variable) {
        const innerDeriv = differentiateTerm(
          { original: exponent, coefficient: 1, exponent: 1, type: 'power' },
          variable
        );
        explanation.push({ type: 'text', text: 'Chain Rule: differentiate the exponent' });
        explanation.push({ type: 'text', text: `d/dx[${exponent}] = ${innerDeriv.derivative}` });
        
        const displayResult = coef === 1
          ? `e^(${exponent})*${innerDeriv.derivative}`
          : `${coef}*e^(${exponent})*${innerDeriv.derivative}`;
        const evalResult = coef === 1
          ? `Math.exp(${exponent})*${innerDeriv.evalDerivative}`
          : `${coef}*Math.exp(${exponent})*${innerDeriv.evalDerivative}`;
        return { ...term, derivative: displayResult, evalDerivative: evalResult, explanation };
      }
      
      const displayResult = coef === 1 ? `e^${variable}` : `${coef}*e^${variable}`;
      const evalResult = coef === 1 ? `Math.exp(${variable})` : `${coef}*Math.exp(${variable})`;
      return { ...term, derivative: displayResult, evalDerivative: evalResult, explanation };
    }
    
    case 'natural_log': {
      const match = term.original.match(/ln\(([^)]+)\)/);
      const inner = match ? match[1] : variable;
      const coef = term.coefficient;
      
      explanation.push({ type: 'text', text: 'Using the Logarithmic Rule:' });
      explanation.push({ type: 'formula', text: 'd/dx[ln(u)] = u′/u' });
      
      if (inner !== variable) {
        const innerDeriv = differentiateTerm(
          { original: inner, coefficient: 1, exponent: 1, type: 'power' },
          variable
        );
        explanation.push({ type: 'text', text: `u′ = ${innerDeriv.derivative}` });
        
        const displayResult = coef === 1
          ? `(${innerDeriv.derivative})/(${inner})`
          : `${coef}*(${innerDeriv.derivative})/(${inner})`;
        const evalResult = coef === 1
          ? `(${innerDeriv.evalDerivative})/(${inner})`
          : `${coef}*(${innerDeriv.evalDerivative})/(${inner})`;
        return { ...term, derivative: displayResult, evalDerivative: evalResult, explanation };
      }
      
      const displayResult = coef === 1 ? `1/${variable}` : `${coef}/${variable}`;
      const evalResult = coef === 1 ? `1/${variable}` : `${coef}/${variable}`;
      return { ...term, derivative: displayResult, evalDerivative: evalResult, explanation };
    }
    
    default:
      explanation.push({ type: 'text', text: 'Using the basic differentiation rules.' });
      return { ...term, derivative: `d/dx[${term.original}]`, evalDerivative: '0', explanation };
  }
}

function simplifyExpression(expr) {
  // Basic simplification: clean up the expression
  let simplified = expr
    .replace(/\+ -/g, '- ')
    .replace(/\+\s*-/g, '- ')
    .replace(/1\*/g, '')
    .replace(/\*1(?![0-9])/g, '')
    .replace(/\^1(?![0-9])/g, '')
    .replace(/x\^0/g, '1');
  
  return simplified;
}

export function solveIntegral(expression, variable = 'x', lower = 0, upper = 1) {
  const steps = [];
  
  // 1. GIVEN
  steps.push({
    step: 'GIVEN',
    badge: 'primary',
    content: [
      { type: 'text', text: '📐 DEFINITE INTEGRAL SETUP' },
      { type: 'text', text: `Integrand: f(${variable}) = ${expression}` },
      { type: 'text', text: `Bounds: ${variable} ∈ [${lower}, ${upper}]` },
      { type: 'formula', text: `∫[${lower} to ${upper}] (${expression}) d${variable}` },
      { type: 'text', text: '' },
      { type: 'text', text: 'The definite integral represents:' },
      { type: 'text', text: '• The area under the curve (if f(x) ≥ 0)' },
      { type: 'text', text: '• The net signed area between the curve and x-axis' },
    ],
  });

  // 2. FORMULA
  const terms = parseExpression(expression, variable);
  
  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: '🔍 FINDING THE ANTIDERIVATIVE' },
      { type: 'text', text: 'Use the Power Rule in reverse:' },
      { type: 'formula', text: '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C' },
      { type: 'text', text: 'We break the function into terms and integrate each one:' },
    ],
  });

  // 3. CALCULATION
  const antiderivativeTerms = [];
  let displayAntiderivative = '';
  let evalAntiderivative = '';
  
  for (const term of terms) {
    const integrated = integrateTerm(term, variable);
    antiderivativeTerms.push(integrated);
    
    steps.push({
      step: 'CALCULATION',
      badge: 'primary',
      content: [
        { type: 'text', text: `∫ ${term.original} d${variable}` },
        ...integrated.explanation,
        { type: 'result', text: `= ${integrated.antiderivative}` },
      ],
    });
  }

  // Combine antiderivative for display
  displayAntiderivative = antiderivativeTerms
    .filter(t => t.antiderivative !== '0')
    .map(t => t.antiderivative)
    .join(' + ')
    .replace(/\+\s*-/g, '- ');

  // Combine antiderivative for evaluation
  evalAntiderivative = antiderivativeTerms
    .filter(t => t.antiderivative !== '0')
    .map(t => t.evalAntiderivative || t.antiderivative)
    .join('+')
    .replace(/\+\-/g, '-');

  if (!displayAntiderivative) displayAntiderivative = '0';
  if (!evalAntiderivative) evalAntiderivative = '0';

  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: '📝 ANTIDERIVATIVE (INDEFINITE INTEGRAL)' },
      { type: 'result', text: `F(${variable}) = ${displayAntiderivative} + C` },
      { type: 'text', text: 'C is the constant of integration (not needed for definite integrals).' },
    ],
  });

  // 4. FORMULA
  steps.push({
    step: 'FORMULA',
    badge: 'secondary',
    content: [
      { type: 'text', text: '📊 APPLY THE FUNDAMENTAL THEOREM OF CALCULUS' },
      { type: 'formula', text: '∫[a to b] f(x) dx = F(b) − F(a)' },
      { type: 'text', text: `where F is the antiderivative and a=${lower}, b=${upper}` },
    ],
  });

  // 5. CALCULATION - Use the evaluable expression
  const fUpper = evaluateExpression(evalAntiderivative, variable, upper);
  const fLower = evaluateExpression(evalAntiderivative, variable, lower);
  const result = fUpper - fLower;

  steps.push({
    step: 'CALCULATION',
    badge: 'primary',
    content: [
      { type: 'text', text: 'Calculate F(upper) and F(lower):' },
      { type: 'text', text: `F(${upper}) = ${displayAntiderivative} evaluated at ${variable}=${upper}` },
      { type: 'result', text: `F(${upper}) = ${fUpper.toFixed(6)}` },
      { type: 'text', text: '' },
      { type: 'text', text: `F(${lower}) = ${displayAntiderivative} evaluated at ${variable}=${lower}` },
      { type: 'result', text: `F(${lower}) = ${fLower.toFixed(6)}` },
    ],
  });

  // 6. ANALYSIS
  steps.push({
    step: 'ANALYSIS',
    badge: 'secondary',
    content: [
      { type: 'text', text: '✅ DEFINITE INTEGRAL RESULT' },
      { type: 'text', text: `∫[${lower}, ${upper}] f(x)dx = F(${upper}) − F(${lower})` },
      { type: 'text', text: `= ${fUpper.toFixed(6)} − ${fLower.toFixed(6)}` },
      { type: 'result', text: `= ${result.toFixed(6)}` },
      { type: 'text', text: '' },
      { type: 'text', text: '💡 This value represents the net area between the curve and x-axis.' },
    ],
  });

  return {
    value: result,
    antiderivative: displayAntiderivative,
    steps,
  };
}

function integrateTerm(term, variable) {
  const explanation = [];
  
  switch (term.type) {
    case 'constant': {
      const coef = term.coefficient;
      explanation.push({ type: 'text', text: '∫ k dx = kx + C (constant rule)' });
      const displayResult = coef === 1 ? variable : `${coef}${variable}`;
      const evalResult = coef === 1 ? variable : `${coef}*${variable}`;
      return { ...term, antiderivative: displayResult, evalAntiderivative: evalResult, explanation };
    }
    
    case 'power': {
      const coef = term.coefficient;
      const exp = term.exponent;
      const newExp = exp + 1;
      const newCoef = coef / newExp;
      
      explanation.push({ type: 'text', text: 'Using Power Rule in reverse:' });
      explanation.push({ type: 'formula', text: '∫ xⁿ dx = xⁿ⁺¹/(n+1)' });
      explanation.push({ type: 'text', text: `New exponent: ${exp} + 1 = ${newExp}` });
      explanation.push({ type: 'text', text: `New coefficient: ${coef}/${newExp} = ${newCoef.toFixed(4)}` });
      
      let displayResult, evalResult;
      if (Math.abs(newCoef - 1) < 0.000001) {
        displayResult = `${variable}^${newExp}`;
        evalResult = `${variable}^${newExp}`;
      } else if (Math.abs(newCoef + 1) < 0.000001) {
        displayResult = `-${variable}^${newExp}`;
        evalResult = `-1*${variable}^${newExp}`;
      } else {
        displayResult = `${newCoef.toFixed(4)}${variable}^${newExp}`;
        evalResult = `(${newCoef})*${variable}^${newExp}`;
      }
      
      return { ...term, antiderivative: displayResult, evalAntiderivative: evalResult, explanation };
    }
    
    case 'sine': {
      explanation.push({ type: 'text', text: '∫ sin(x) dx = −cos(x) + C' });
      const coef = term.coefficient;
      const displayResult = coef === 1 ? `-cos(${variable})` : `${-coef}cos(${variable})`;
      const evalResult = coef === 1 ? `-1*Math.cos(${variable})` : `(${-coef})*Math.cos(${variable})`;
      return { ...term, antiderivative: displayResult, evalAntiderivative: evalResult, explanation };
    }
    
    case 'cosine': {
      explanation.push({ type: 'text', text: '∫ cos(x) dx = sin(x) + C' });
      const coef = term.coefficient;
      const displayResult = coef === 1 ? `sin(${variable})` : `${coef}sin(${variable})`;
      const evalResult = coef === 1 ? `Math.sin(${variable})` : `${coef}*Math.sin(${variable})`;
      return { ...term, antiderivative: displayResult, evalAntiderivative: evalResult, explanation };
    }
    
    case 'exponential': {
      explanation.push({ type: 'text', text: '∫ eˣ dx = eˣ + C' });
      const displayResult = `e^${variable}`;
      const evalResult = `Math.exp(${variable})`;
      return { ...term, antiderivative: displayResult, evalAntiderivative: evalResult, explanation };
    }
    
    case 'natural_log': {
      explanation.push({ type: 'text', text: '∫ ln(x) dx = x·ln(x) − x + C (integration by parts)' });
      const displayResult = `${variable}ln(${variable})-${variable}`;
      const evalResult = `${variable}*Math.log(${variable})-${variable}`;
      return { ...term, antiderivative: displayResult, evalAntiderivative: evalResult, explanation };
    }
    
    default:
      explanation.push({ type: 'text', text: 'Standard integration rules applied.' });
      return { ...term, antiderivative: `∫${term.original} d${variable}`, evalAntiderivative: '0', explanation };
  }
}

export function evaluateExpression(expr, variable, value) {
  try {
    console.log('=== EVALUATION START ===');
    console.log('Expression:', expr);
    console.log('Variable:', variable);
    console.log('Value:', value);
    
    let jsExpr = expr;
    
    // Remove spaces
    jsExpr = jsExpr.replace(/\s+/g, '');
    
    // Replace variable with the value
    const varRegex = new RegExp(variable, 'g');
    jsExpr = jsExpr.replace(varRegex, `(${value})`);
    
    // Replace ^ with ** for exponentiation
    jsExpr = jsExpr.replace(/\^/g, '**');
    
    console.log('JavaScript to evaluate:', jsExpr);
    
    // Evaluate
    // eslint-disable-next-line no-eval
    const result = eval(jsExpr);
    console.log('Result:', result);
    console.log('=== EVALUATION END ===');
    
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return result;
    }
    
    return NaN;
  } catch (err) {
    console.warn('Evaluation error:', err.message);
    return NaN;
  }
}