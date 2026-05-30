export function solveFinance(mode, params) {
  const { principal, rate, time, compoundFreq, payment } = params;
  const r = rate / 100; // Convert percentage to decimal
  const steps = [];
  let result;

  // Helper function for superscripts
  const getSuperscript = (num) => {
    const superscripts = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '.': '·', '-': '⁻'
    };
    return String(num).split('').map(digit => superscripts[digit] || digit).join('');
  };

  switch (mode) {
    case 'compound': {
      const n = compoundFreq;
      const nt = n * time;
      const amount = principal * Math.pow(1 + r / n, nt);
      const interestEarned = amount - principal;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📊 Compound Interest Calculation' },
          { type: 'text', text: `• Principal (P): $${principal.toLocaleString()}` },
          { type: 'text', text: `• Annual Rate (r): ${rate}%` },
          { type: 'text', text: `• Compounding Frequency (n): ${n} times per year` },
          { type: 'text', text: `• Time (t): ${time} years` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Compound Interest Formula:' },
          { type: 'formula', text: 'A = P(1 + r/n)ⁿᵗ' },
          { type: 'text', text: 'Where A = Final Amount, P = Principal' },
        ],
      });

      const ratePerPeriod = (r / n).toFixed(6);
      const growthFactor = (1 + r / n).toFixed(6);
      
      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate rate per period' },
          { type: 'text', text: `r/n = ${r} / ${n} = ${ratePerPeriod}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate growth factor' },
          { type: 'text', text: `(1 + r/n) = 1 + ${ratePerPeriod} = ${growthFactor}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Calculate total periods' },
          { type: 'text', text: `n × t = ${n} × ${time} = ${nt}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Apply compound interest formula' },
          { type: 'text', text: `A = ${principal} × (${growthFactor})^${nt}` },
          { type: 'text', text: `A = ${principal} × ${Math.pow(1 + r / n, nt).toFixed(6)}` },
          { type: 'result', text: `A = $${amount.toFixed(2)}` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `💰 Total Interest Earned: $${interestEarned.toFixed(2)}` },
          { type: 'text', text: `📈 Return on Investment: ${((interestEarned / principal) * 100).toFixed(2)}%` },
          { type: 'text', text: '💡 Compounding more frequently (higher n) increases your yield due to earning interest on interest.' },
        ],
      });
      result = amount;
      break;
    }

    case 'simple': {
      const simpleInterest = principal * r * time;
      const totalSimple = principal + simpleInterest;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📊 Simple Interest Calculation' },
          { type: 'text', text: `• Principal (P): $${principal.toLocaleString()}` },
          { type: 'text', text: `• Rate (r): ${rate}%` },
          { type: 'text', text: `• Time (t): ${time} years` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Simple Interest Formulas:' },
          { type: 'formula', text: 'I = P · r · t' },
          { type: 'formula', text: 'A = P + I' },
          { type: 'text', text: 'Where I = Interest, A = Total Amount' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate the interest' },
          { type: 'text', text: `I = ${principal} × ${r} × ${time}` },
          { type: 'text', text: `I = ${principal} × ${(r * time).toFixed(4)}` },
          { type: 'result', text: `I = $${simpleInterest.toFixed(2)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Add interest to principal' },
          { type: 'text', text: `A = ${principal} + ${simpleInterest.toFixed(2)}` },
          { type: 'result', text: `A = $${totalSimple.toFixed(2)}` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `💰 Total Interest: $${simpleInterest.toFixed(2)}` },
          { type: 'text', text: '💡 Simple interest only earns on the original principal, not on accumulated interest.' },
          { type: 'text', text: '📊 Best for short-term loans or when you want predictable returns.' },
        ],
      });
      result = totalSimple;
      break;
    }

    case 'loan': {
      const monthlyRate = r / 12;
      const numPayments = time * 12;
      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                            (Math.pow(1 + monthlyRate, numPayments) - 1);
      const totalPaid = monthlyPayment * numPayments;
      const totalInterest = totalPaid - principal;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📊 Loan Payment Calculation' },
          { type: 'text', text: `• Loan Amount: $${principal.toLocaleString()}` },
          { type: 'text', text: `• Annual Interest Rate: ${rate}%` },
          { type: 'text', text: `• Loan Term: ${time} years (${numPayments} months)` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Monthly Payment Formula (Amortization):' },
          { type: 'formula', text: 'PMT = P × [r(1 + r)ⁿ] / [(1 + r)ⁿ − 1]' },
          { type: 'text', text: 'Where r = monthly rate, n = number of payments' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate monthly interest rate' },
          { type: 'text', text: `r = ${rate}% / 12 = ${(monthlyRate * 100).toFixed(4)}%` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate number of payments' },
          { type: 'text', text: `n = ${time} × 12 = ${numPayments} months` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Apply loan payment formula' },
          { type: 'text', text: `Monthly Payment = ${principal} × [${monthlyRate.toFixed(6)}(1 + ${monthlyRate.toFixed(6)})^${numPayments}] / [(1 + ${monthlyRate.toFixed(6)})^${numPayments} − 1]` },
          { type: 'result', text: `Monthly Payment = $${monthlyPayment.toFixed(2)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 4: Calculate total cost' },
          { type: 'text', text: `Total Paid = $${monthlyPayment.toFixed(2)} × ${numPayments} = $${totalPaid.toFixed(2)}` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `💰 Total Interest Cost: $${totalInterest.toFixed(2)}` },
          { type: 'text', text: `📊 Interest as % of Principal: ${((totalInterest / principal) * 100).toFixed(1)}%` },
          { type: 'text', text: '💡 Making extra payments or paying bi-weekly can significantly reduce total interest paid.' },
          { type: 'text', text: '💡 Even one extra payment per year can reduce a 30-year mortgage by several years.' },
        ],
      });
      result = monthlyPayment;
      break;
    }

    case 'savings': {
      const n = compoundFreq;
      const ratePerPeriod = r / n;
      const totalPeriods = n * time;
      const compoundFactor = Math.pow(1 + ratePerPeriod, totalPeriods);
      const futureValue = principal * compoundFactor +
                         payment * ((compoundFactor - 1) / ratePerPeriod);
      const totalContributions = principal + payment * totalPeriods;
      const totalInterestEarned = futureValue - totalContributions;
      
      steps.push({
        step: 'GIVEN',
        badge: 'primary',
        content: [
          { type: 'text', text: '📊 Savings Growth Calculation' },
          { type: 'text', text: `• Initial Deposit: $${principal.toLocaleString()}` },
          { type: 'text', text: `• Regular Contribution: $${payment} per period` },
          { type: 'text', text: `• Annual Rate: ${rate}%` },
          { type: 'text', text: `• Compounding: ${n} times per year` },
          { type: 'text', text: `• Time: ${time} years (${totalPeriods} periods)` },
        ],
      });

      steps.push({
        step: 'FORMULA',
        badge: 'secondary',
        content: [
          { type: 'text', text: 'Future Value with Regular Contributions:' },
          { type: 'formula', text: 'FV = P(1 + r/n)ⁿᵗ + PMT[((1 + r/n)ⁿᵗ − 1) / (r/n)]' },
          { type: 'text', text: 'First term: Growth of initial principal' },
          { type: 'text', text: 'Second term: Growth of regular contributions' },
        ],
      });

      steps.push({
        step: 'CALCULATION',
        badge: 'primary',
        content: [
          { type: 'text', text: 'Step 1: Calculate growth of initial principal' },
          { type: 'text', text: `P(1 + r/n)ⁿᵗ = ${principal} × (1 + ${ratePerPeriod.toFixed(6)})^${totalPeriods}` },
          { type: 'text', text: `= ${principal} × ${compoundFactor.toFixed(6)}` },
          { type: 'text', text: `= $${(principal * compoundFactor).toFixed(2)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 2: Calculate growth of contributions' },
          { type: 'text', text: `PMT[((1 + r/n)ⁿᵗ − 1) / (r/n)]` },
          { type: 'text', text: `= ${payment} × (${compoundFactor.toFixed(6)} − 1) / ${ratePerPeriod.toFixed(6)}` },
          { type: 'text', text: `= $${(payment * ((compoundFactor - 1) / ratePerPeriod)).toFixed(2)}` },
          { type: 'text', text: '' },
          { type: 'text', text: 'Step 3: Total future value' },
          { type: 'result', text: `FV = $${futureValue.toFixed(2)}` },
        ],
      });

      steps.push({
        step: 'ANALYSIS',
        badge: 'secondary',
        content: [
          { type: 'text', text: `💰 Total Contributions: $${totalContributions.toFixed(2)}` },
          { type: 'text', text: `📈 Interest Earned: $${totalInterestEarned.toFixed(2)}` },
          { type: 'text', text: `📊 Return: ${((totalInterestEarned / totalContributions) * 100).toFixed(1)}% on contributions` },
          { type: 'text', text: '💡 Starting early and being consistent are the keys to building wealth through compound interest.' },
          { type: 'text', text: '💡 Even small regular contributions can grow significantly over long periods.' },
        ],
      });
      result = futureValue;
      break;
    }
    
    default:
      throw new Error('Unknown finance mode');
  }

  return { result, steps };
}