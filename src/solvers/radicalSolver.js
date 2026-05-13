export function solveRadicalWithValues(type, a, b, c) {
  const steps = [];
  let result;

  switch(type) {
    case 'simple': {
      // √(ax + b) = c
      if (c < 0) {
        steps.push({
          step: 'NO SOLUTION',
          badge: 'warning',
          content: [
            { type: 'text', text: '⚠️ NO SOLUTION EXISTS' },
            { type: 'text', text: `√(${a}x + ${b}) = ${c}` },
            { type: 'text', text: '' },
            { type: 'text', text: 'The square root of any real number is always ≥ 0.' },
            { type: 'text', text: `Since the right side is ${c} (negative), there is no solution.` },
            { type: 'text', text: '' },
            { type: 'text', text: '💡 Think about it:' },
            { type: 'text', text: '√(any number) can never equal a negative number in the real number system.' },
          ],
        });
        result = 'No solution (principal square root cannot be negative)';
        return { result, steps };
      }
      
      const radicand = c * c;
      const xValue = (radicand - b) / a;
      
      steps.push({
        step: 'STEP 1',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 SOLVING: √(ax + b) = c' },
          { type: 'highlight', text: `√(${a}x + ${b}) = ${c}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Strategy: Square both sides to eliminate the radical.' },
          { type: 'text', text: 'Then solve the linear equation and CHECK the solution.' },
        ],
      });
      
      steps.push({
        step: 'STEP 2',
        badge: 'secondary',
        content: [
          { type: 'text', text: '📝 SQUARE BOTH SIDES' },
          { type: 'text', text: `(√(${a}x + ${b}))² = (${c})²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'The square and square root cancel on the left side:' },
          { type: 'highlight', text: `${a}x + ${b} = ${radicand}` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Why? Because (√u)² = u for any u ≥ 0' },
        ],
      });
      
      steps.push({
        step: 'STEP 3',
        badge: 'primary',
        content: [
          { type: 'text', text: '🔢 SOLVE THE LINEAR EQUATION' },
          { type: 'text', text: `${a}x + ${b} = ${radicand}` },
          { type: 'text', text: '' },
          { type: 'text', text: `Subtract ${b} from both sides:` },
          { type: 'text', text: `${a}x = ${radicand} - ${b}` },
          { type: 'text', text: `${a}x = ${radicand - b}` },
          { type: 'text', text: '' },
          { type: 'text', text: `Divide both sides by ${a}:` },
          { type: 'highlight', text: `x = ${(radicand - b).toFixed(4)} / ${a} = ${xValue.toFixed(4)}` },
        ],
      });
      
      // Check domain
      const domainCheck = a * xValue + b;
      
      steps.push({
        step: 'STEP 4',
        badge: 'warning',
        content: [
          { type: 'text', text: '✅ VERIFY THE SOLUTION' },
          { type: 'text', text: 'We must check two things:' },
          { type: 'text', text: '' },
          { type: 'text', text: '1. DOMAIN CHECK: Is the radicand ≥ 0?' },
          { type: 'text', text: `   ${a}(${xValue.toFixed(4)}) + ${b} = ${domainCheck.toFixed(4)}` },
          { type: 'text', text: `   ${domainCheck >= 0 ? '✅ ' + domainCheck.toFixed(4) + ' ≥ 0 (Valid!)' : '❌ Negative radicand (Invalid!)'}` },
          { type: 'text', text: '' },
          { type: 'text', text: '2. EQUATION CHECK: Does it satisfy the original equation?' },
          { type: 'text', text: `   √(${a}(${xValue.toFixed(4)}) + ${b}) = √(${domainCheck.toFixed(4)})` },
          { type: 'text', text: `   = ${Math.sqrt(Math.max(0, domainCheck)).toFixed(4)}` },
          { type: 'text', text: `   ${Math.abs(Math.sqrt(Math.max(0, domainCheck)) - c) < 0.001 ? '✅ Equals ' + c + ' (Valid!)' : '❌ Does not equal ' + c + ' (Invalid!)'}` },
          { type: 'text', text: '' },
          ...(domainCheck >= 0 && Math.abs(Math.sqrt(domainCheck) - c) < 0.001 
            ? [{ type: 'highlight', text: '🎉 SOLUTION VERIFIED: x = ' + xValue.toFixed(4) }]
            : [{ type: 'highlight', text: '❌ EXTRANEOUS SOLUTION - The solution fails verification' }]
          ),
        ],
      });
      
      result = domainCheck >= 0 && Math.abs(Math.sqrt(domainCheck) - c) < 0.001 
        ? `x = ${xValue.toFixed(4)}` 
        : 'No valid solution (extraneous)';
      break;
    }

    case 'quadratic': {
      // √(ax + b) = cx + d
      // We need 'd' parameter, but we only have a, b, c. Let's use c as the coefficient and add a default d
      const d = 0; // You might want to add a fourth input for this
      
      steps.push({
        step: 'STEP 1',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 SOLVING: √(ax + b) = cx + d' },
          { type: 'highlight', text: `√(${a}x + ${b}) = ${c}x` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Strategy:' },
          { type: 'text', text: '1. Square both sides (creates quadratic)' },
          { type: 'text', text: '2. Solve the quadratic equation' },
          { type: 'text', text: '3. CHECK both solutions (one is often extraneous)' },
          { type: 'text', text: '' },
          { type: 'text', text: '⚠️ CRITICAL: The right side MUST be ≥ 0' },
          { type: 'text', text: `Since √ ≥ 0, we need ${c}x ≥ 0` },
          { type: 'text', text: c > 0 ? '   → x ≥ 0' : c < 0 ? '   → x ≤ 0' : '   → Always true (c = 0)'},
        ],
      });
      
      steps.push({
        step: 'STEP 2',
        badge: 'secondary',
        content: [
          { type: 'text', text: '📝 SQUARE BOTH SIDES' },
          { type: 'text', text: `(√(${a}x + ${b}))² = (${c}x)²` },
          { type: 'highlight', text: `${a}x + ${b} = ${c*c}x²` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Now rearrange to standard quadratic form: ax² + bx + c = 0' },
        ],
      });
      
      // Rearrange: 0 = c²x² - ax - b
      const A = c * c;
      const B = -a;
      const C = -b;
      
      steps.push({
        step: 'STEP 3',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 STANDARD QUADRATIC FORM' },
          { type: 'text', text: `${c*c}x² - ${a}x - ${b} = 0` },
          { type: 'highlight', text: `${A}x² + ${B}x + ${C} = 0` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Where:' },
          { type: 'text', text: `a = ${A}, b = ${B}, c = ${C}` },
        ],
      });
      
      // Solve quadratic
      const discriminant = B * B - 4 * A * C;
      
      if (discriminant < 0) {
        steps.push({
          step: 'RESULT',
          badge: 'warning',
          content: [
            { type: 'text', text: `Discriminant = ${discriminant.toFixed(4)} < 0` },
            { type: 'text', text: 'No real solutions. The quadratic has complex roots.' },
          ],
        });
        result = 'No real solutions';
        return { result, steps };
      }
      
      const sqrtDisc = Math.sqrt(discriminant);
      const x1 = (-B + sqrtDisc) / (2 * A);
      const x2 = (-B - sqrtDisc) / (2 * A);
      
      steps.push({
        step: 'STEP 4',
        badge: 'secondary',
        content: [
          { type: 'text', text: '🔢 SOLVE THE QUADRATIC' },
          { type: 'text', text: 'Using the quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)' },
          { type: 'text', text: '' },
          { type: 'text', text: `Discriminant = ${B}² - 4(${A})(${C})` },
          { type: 'text', text: `= ${B*B} - ${4*A*C}` },
          { type: 'highlight', text: `= ${discriminant.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: `√${discriminant.toFixed(4)} = ${sqrtDisc.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Candidate solutions:' },
          { type: 'highlight', text: `x₁ = (${-B} + ${sqrtDisc.toFixed(4)}) / ${2*A} = ${x1.toFixed(4)}` },
          { type: 'highlight', text: `x₂ = (${-B} - ${sqrtDisc.toFixed(4)}) / ${2*A} = ${x2.toFixed(4)}` },
        ],
      });
      
      // Check both candidates
      steps.push({
        step: 'STEP 5',
        badge: 'warning',
        content: [
          { type: 'text', text: '✅ CHECK BOTH CANDIDATES' },
          { type: 'text', text: 'Must satisfy original equation: √(ax + b) = cx' },
          { type: 'text', text: '' },
        ],
      });
      
      // Check x1
      const checkRadicand1 = a * x1 + b;
      const checkRight1 = c * x1;
      const leftSide1 = checkRadicand1 >= 0 ? Math.sqrt(checkRadicand1) : null;
      const isValid1 = leftSide1 !== null && Math.abs(leftSide1 - checkRight1) < 0.001 && checkRight1 >= 0;
      
      steps[steps.length - 1].content.push(
        { type: 'text', text: `CHECKING x₁ = ${x1.toFixed(4)}:` },
        { type: 'text', text: `Radicand: ${a}(${x1.toFixed(4)}) + ${b} = ${checkRadicand1.toFixed(4)}` },
        { type: 'text', text: checkRadicand1 >= 0 ? '   ✅ Radicand ≥ 0' : '   ❌ Negative radicand - INVALID' },
        { type: 'text', text: `Left side: √(${checkRadicand1.toFixed(4)}) = ${leftSide1?.toFixed(4) || 'undefined'}` },
        { type: 'text', text: `Right side: ${c}(${x1.toFixed(4)}) = ${checkRight1.toFixed(4)}` },
        { type: 'text', text: checkRight1 >= 0 ? '   ✅ Right side ≥ 0' : '   ❌ Right side negative - INVALID (√ must equal non-negative)' },
        { type: 'text', text: isValid1 ? '   ✅ EQUATION SATISFIED!' : '   ❌ Equation NOT satisfied'},
        { type: 'text', text: '' },
      );
      
      // Check x2
      const checkRadicand2 = a * x2 + b;
      const checkRight2 = c * x2;
      const leftSide2 = checkRadicand2 >= 0 ? Math.sqrt(checkRadicand2) : null;
      const isValid2 = leftSide2 !== null && Math.abs(leftSide2 - checkRight2) < 0.001 && checkRight2 >= 0;
      
      steps[steps.length - 1].content.push(
        { type: 'text', text: `CHECKING x₂ = ${x2.toFixed(4)}:` },
        { type: 'text', text: `Radicand: ${a}(${x2.toFixed(4)}) + ${b} = ${checkRadicand2.toFixed(4)}` },
        { type: 'text', text: checkRadicand2 >= 0 ? '   ✅ Radicand ≥ 0' : '   ❌ Negative radicand - INVALID' },
        { type: 'text', text: `Left side: √(${checkRadicand2.toFixed(4)}) = ${leftSide2?.toFixed(4) || 'undefined'}` },
        { type: 'text', text: `Right side: ${c}(${x2.toFixed(4)}) = ${checkRight2.toFixed(4)}` },
        { type: 'text', text: checkRight2 >= 0 ? '   ✅ Right side ≥ 0' : '   ❌ Right side negative - INVALID' },
        { type: 'text', text: isValid2 ? '   ✅ EQUATION SATISFIED!' : '   ❌ Equation NOT satisfied'},
      );
      
      // Final result
      const validSolutions = [];
      if (isValid1) validSolutions.push(x1);
      if (isValid2) validSolutions.push(x2);
      
      steps.push({
        step: 'FINAL RESULT',
        badge: 'primary',
        content: [
          { type: 'text', text: '📊 SUMMARY' },
          ...(validSolutions.length > 0 
            ? [
                { type: 'highlight', text: `Valid solution(s): x = ${validSolutions.map(s => s.toFixed(4)).join(', ')}` },
                { type: 'text', text: '' },
                { type: 'text', text: validSolutions.length === 1 && (isValid1 || isValid2) 
                  ? '💡 One solution was extraneous - this is common with radical equations!'
                  : '✅ Both candidates are valid solutions.'
                },
              ]
            : [
                { type: 'highlight', text: '❌ No valid solutions (both candidates are extraneous)' },
                { type: 'text', text: 'The original equation has no real solutions.' },
              ]
          ),
        ],
      });
      
      result = validSolutions.length > 0 
        ? `x = ${validSolutions.map(s => s.toFixed(4)).join(' or x = ')}`
        : 'No valid real solutions';
      break;
    }

    case 'domain': {
      // Find domain of √(ax + b)
      if (a === 0) {
        const domainCheck = b >= 0;
        steps.push({
          step: 'DOMAIN ANALYSIS',
          badge: 'primary',
          content: [
            { type: 'text', text: '📐 DOMAIN OF √(ax + b)' },
            { type: 'text', text: `Expression: √(${a}x + ${b}) = √(${b})` },
            { type: 'text', text: 'Since a = 0, this is a constant: √(' + b + ')' },
            { type: 'text', text: domainCheck 
              ? `✅ Domain: All real numbers (constant √${b} = ${Math.sqrt(b).toFixed(4)})`
              : `❌ Undefined for all real numbers (cannot take square root of ${b})`
            },
          ],
        });
        result = domainCheck ? 'All real numbers' : 'Undefined (no real domain)';
        return { result, steps };
      }
      
      const boundaryPoint = -b / a;
      
      steps.push({
        step: 'DOMAIN ANALYSIS',
        badge: 'primary',
        content: [
          { type: 'text', text: '📐 FINDING THE DOMAIN OF √(ax + b)' },
          { type: 'highlight', text: `Expression: √(${a}x + ${b})` },
          { type: 'text', text: '' },
          { type: 'text', text: '🔍 RULE: For √(expression) to be real,' },
          { type: 'text', text: 'the radicand must be ≥ 0:' },
          { type: 'highlight', text: `${a}x + ${b} ≥ 0` },
          { type: 'text', text: '' },
          { type: 'text', text: '📝 SOLVE THE INEQUALITY:' },
        ],
      });
      
      steps.push({
        step: 'SOLVING',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Step 1: Isolate the variable term' },
          { type: 'text', text: `${a}x + ${b} ≥ 0` },
          { type: 'text', text: `${a}x ≥ ${-b}` },
          { type: 'text', text: '' },
          { type: 'text', text: `Step 2: Divide by ${a}` },
          { type: 'text', text: a > 0 
            ? `Since ${a} > 0, the inequality sign stays the same.`
            : `⚠️ Since ${a} < 0, the inequality sign FLIPS when dividing.`
          },
          { type: 'text', text: `x ${a > 0 ? '≥' : '≤'} ${boundaryPoint.toFixed(4)}` },
          { type: 'text', text: '' },
          { type: 'highlight', text: `Domain: ${a > 0 ? '[' : '(-∞,'} ${boundaryPoint.toFixed(4)}, ${a > 0 ? '∞)' : ']'}` },
        ],
      });
      
      steps.push({
        step: 'VISUALIZATION',
        badge: 'primary',
        content: [
          { type: 'text', text: '🎨 NUMBER LINE VISUALIZATION' },
          { type: 'text', text: a > 0 
            ? `   ←――――●════════════→\n       ${boundaryPoint.toFixed(2)}\n   Domain: x ≥ ${boundaryPoint.toFixed(2)}`
            : `   ←════════════●――――→\n       ${boundaryPoint.toFixed(2)}\n   Domain: x ≤ ${boundaryPoint.toFixed(2)}`
          },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Test a point:' },
          { type: 'text', text: a > 0
            ? `   x = ${(boundaryPoint + 1).toFixed(1)}: ${a}(${(boundaryPoint + 1).toFixed(1)}) + ${b} = ${(a * (boundaryPoint + 1) + b).toFixed(2)} ≥ 0 ✓`
            : `   x = ${(boundaryPoint - 1).toFixed(1)}: ${a}(${(boundaryPoint - 1).toFixed(1)}) + ${b} = ${(a * (boundaryPoint - 1) + b).toFixed(2)} ≥ 0 ✓`
          },
        ],
      });
      
      result = a > 0 ? `x ≥ ${boundaryPoint.toFixed(4)}` : `x ≤ ${boundaryPoint.toFixed(4)}`;
      break;
    }
  }

  return { result, steps };
}