export function solveFinance(mode, params) {
  const { principal, rate, time, compoundFreq, payment } = params;
  const r = rate / 100; // Convert percentage to decimal
  const steps = [];
  let result;

  switch (mode) {
    case 'compound': {
      // A = P(1 + r/n)^(nt)
      const amount = principal * Math.pow(1 + r / compoundFreq, compoundFreq * time);
      const interestEarned = amount - principal;
      
      steps.push({
        step: 'COMPOUND INTEREST',
        badge: 'primary',
        content: [
          { type: 'text', text: '💰 Compound Interest Formula' },
          { type: 'text', text: 'A = P(1 + r/n)^(nt)' },
          { type: 'text', text: `P = $${principal} (principal)` },
          { type: 'text', text: `r = ${rate}% = ${r} (annual rate)` },
          { type: 'text', text: `n = ${compoundFreq} (compounds per year)` },
          { type: 'text', text: `t = ${time} years` },
          { type: 'text', text: '' },
          { type: 'text', text: `Step 1: r/n = ${r}/${compoundFreq} = ${(r / compoundFreq).toFixed(6)}` },
          { type: 'text', text: `Step 2: nt = ${compoundFreq} × ${time} = ${compoundFreq * time}` },
          { type: 'text', text: `Step 3: (1 + r/n)^(nt) = (${(1 + r / compoundFreq).toFixed(6)})^${compoundFreq * time} = ${Math.pow(1 + r / compoundFreq, compoundFreq * time).toFixed(4)}` },
          { type: 'text', text: `Step 4: A = ${principal} × ${Math.pow(1 + r / compoundFreq, compoundFreq * time).toFixed(4)}` },
          { type: 'highlight', text: `A = $${amount.toFixed(2)}` },
          { type: 'text', text: `Interest earned: $${interestEarned.toFixed(2)}` },
        ],
      });
      result = amount;
      break;
    }

    case 'simple': {
      // I = Prt, A = P + I
      const simpleInterest = principal * r * time;
      const totalSimple = principal + simpleInterest;
      
      steps.push({
        step: 'SIMPLE INTEREST',
        badge: 'primary',
        content: [
          { type: 'text', text: '💰 Simple Interest Formula' },
          { type: 'text', text: 'I = Prt, A = P + I' },
          { type: 'text', text: `P = $${principal}` },
          { type: 'text', text: `r = ${rate}% = ${r}` },
          { type: 'text', text: `t = ${time} years` },
          { type: 'text', text: '' },
          { type: 'text', text: `Interest: I = ${principal} × ${r} × ${time}` },
          { type: 'highlight', text: `I = $${simpleInterest.toFixed(2)}` },
          { type: 'text', text: `Total: A = ${principal} + ${simpleInterest.toFixed(2)}` },
          { type: 'highlight', text: `A = $${totalSimple.toFixed(2)}` },
        ],
      });
      result = totalSimple;
      break;
    }

    case 'loan': {
      // PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
      const monthlyRate = r / 12;
      const numPayments = time * 12;
      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                            (Math.pow(1 + monthlyRate, numPayments) - 1);
      const totalPaid = monthlyPayment * numPayments;
      const totalInterest = totalPaid - principal;
      
      steps.push({
        step: 'LOAN AMORTIZATION',
        badge: 'primary',
        content: [
          { type: 'text', text: '💰 Loan Payment Formula' },
          { type: 'text', text: 'PMT = P × [r(1+r)^n] / [(1+r)^n - 1]' },
          { type: 'text', text: `Loan amount: $${principal}` },
          { type: 'text', text: `Annual rate: ${rate}%` },
          { type: 'text', text: `Monthly rate: ${rate}%/12 = ${(monthlyRate * 100).toFixed(4)}%` },
          { type: 'text', text: `Number of payments: ${time} × 12 = ${numPayments}` },
          { type: 'highlight', text: `Monthly Payment: $${monthlyPayment.toFixed(2)}` },
          { type: 'text', text: `Total paid: $${totalPaid.toFixed(2)}` },
          { type: 'text', text: `Total interest: $${totalInterest.toFixed(2)}` },
          { type: 'text', text: '' },
          { type: 'text', text: '💡 Tip: Making extra payments reduces total interest!' },
        ],
      });
      result = monthlyPayment;
      break;
    }

    case 'savings': {
      // FV = P(1+r/n)^(nt) + PMT[((1+r/n)^(nt) - 1)/(r/n)]
      const ratePerPeriod = r / compoundFreq;
      const totalPeriods = compoundFreq * time;
      const compoundFactor = Math.pow(1 + ratePerPeriod, totalPeriods);
      const futureValue = principal * compoundFactor +
                         payment * ((compoundFactor - 1) / ratePerPeriod);
      const totalContributions = principal + payment * totalPeriods;
      const totalInterestEarned = futureValue - totalContributions;
      
      steps.push({
        step: 'SAVINGS GOAL',
        badge: 'primary',
        content: [
          { type: 'text', text: '💰 Future Value with Regular Contributions' },
          { type: 'text', text: 'FV = P(1+r/n)^(nt) + PMT[((1+r/n)^(nt) - 1)/(r/n)]' },
          { type: 'text', text: `Initial deposit: $${principal}` },
          { type: 'text', text: `Regular contribution: $${payment}` },
          { type: 'text', text: `Annual rate: ${rate}%` },
          { type: 'text', text: `Compounds per year: ${compoundFreq}` },
          { type: 'text', text: `Time: ${time} years (${totalPeriods} periods)` },
          { type: 'text', text: '' },
          { type: 'text', text: `Growth factor: (1 + ${ratePerPeriod.toFixed(6)})^${totalPeriods} = ${compoundFactor.toFixed(4)}` },
          { type: 'highlight', text: `Future Value: $${futureValue.toFixed(2)}` },
          { type: 'text', text: `Total contributions: $${totalContributions.toFixed(2)}` },
          { type: 'text', text: `Interest earned: $${totalInterestEarned.toFixed(2)}` },
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