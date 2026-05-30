// src/utils/unitConverter.js

const CONVERSIONS = {
  Length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    μm: 0.000001,
    nm: 0.000000001,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  },
  Mass: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    μg: 0.000000001,
    lb: 0.45359237,
    oz: 0.028349523125,
    ton: 1000,
  },
  Temperature: {
    // Handled separately
  },
  Pressure: {
    Pa: 1,
    kPa: 1000,
    atm: 101325,
    bar: 100000,
    psi: 6894.757293168,
    mmHg: 133.322387415,
  },
  Energy: {
    J: 1,
    kJ: 1000,
    cal: 4.184,
    kcal: 4184,
    eV: 1.602176634e-19,
    kWh: 3600000,
  },
  Time: {
    s: 1,
    min: 60,
    hr: 3600,
    day: 86400,
    yr: 31536000,
  },
  Speed: {
    'm/s': 1,
    'km/h': 0.277777777777778,
    'mph': 0.44704,
    'knot': 0.514444444444444,
  },
  Area: {
    'm²': 1,
    'km²': 1000000,
    'cm²': 0.0001,
    'ha': 10000,
    'acre': 4046.8564224,
    'ft²': 0.09290304,
  },
};

export const convertUnit = (value, fromUnit, toUnit, category) => {
  // Handle same unit
  if (fromUnit === toUnit) return value;

  // Handle Temperature separately (not multiplicative)
  if (category === 'Temperature') {
    let kelvin;
    if (fromUnit === '°C') kelvin = value + 273.15;
    else if (fromUnit === '°F') kelvin = (value - 32) * (5 / 9) + 273.15;
    else kelvin = value; // Already Kelvin

    if (toUnit === '°C') return kelvin - 273.15;
    if (toUnit === '°F') return (kelvin - 273.15) * (9 / 5) + 32;
    return kelvin; // To Kelvin
  }

  const rates = CONVERSIONS[category];
  if (!rates) return value;

  const fromRate = rates[fromUnit];
  const toRate = rates[toUnit];
  
  if (!fromRate || !toRate) return value;

  // Convert to base unit, then to target unit
  const inBase = value * fromRate;
  return inBase / toRate;
};