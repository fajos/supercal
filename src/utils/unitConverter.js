const CONVERSIONS = {
  Length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34,
  },
  Mass: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
  },
  Pressure: {
    Pa: 1,
    atm: 101325,
    bar: 100000,
    psi: 6894.76,
  },
  Energy: {
    J: 1,
    cal: 4.184,
    eV: 1.60218e-19,
    kWh: 3600000,
  },
};

export const convertUnit = (value, fromUnit, toUnit, category) => {
  if (category === 'Temperature') {
    let kelvin;
    if (fromUnit === '°C') kelvin = value + 273.15;
    else if (fromUnit === '°F') kelvin = (value - 32) * (5 / 9) + 273.15;
    else kelvin = value;

    if (toUnit === '°C') return kelvin - 273.15;
    if (toUnit === '°F') return (kelvin - 273.15) * (9 / 5) + 32;
    return kelvin;
  }

  const rates = CONVERSIONS[category];
  if (!rates) return value;

  const inBase = value * rates[fromUnit];
  return inBase / rates[toUnit];
};
