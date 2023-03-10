const MEASUREMENT_LIMITS = {
  temperature: { limit: { min: 0, max: 45 }, tolerance: 0.05, unit: 'Celsius' },
  soc: { limit: { min: 20, max: 80 }, tolerance: 0.05, unit: '%' },
  charge_rate: { limit: { min: 0, max: 0.8 }, tolerance: 0.05, unit: 'per hour' }
};

function convertTemperatureUnit(temperature, fromUnit, toUnit) {
  if (fromUnit === toUnit) return temperature;

  const conversions = {
    'Celsius-Fahrenheit': (temperature) => (temperature * 9 / 5) + 32,
    'Fahrenheit-Celsius': (temperature) => (temperature - 32) * 5 / 9
  };

  const conversionKey = `${fromUnit}-${toUnit}`;
  const conversionFunction = conversions[conversionKey];

  if (!conversionFunction) {
    throw new Error(`Invalid temperature units: ${fromUnit}, ${toUnit}`);
  }
  return conversionFunction(temperature);
}

function calculateLimits(limit, tolerance) {
  const upperLimit = limit.max;
  const lowerLimit = limit.min;
  const upperWarningLimit = upperLimit - (upperLimit * tolerance);
  const lowerWarningLimit = lowerLimit + (upperLimit * tolerance);
  return { upperWarningLimit, lowerWarningLimit };
}

function checkValueInRange(value, limit, tolerance) {
  const { upperWarningLimit, lowerWarningLimit } = calculateLimits(limit, tolerance);

  const rangeClassifications = [
    { range: value < limit.min, result: 'LOW' },
    { range: value > limit.max, result: 'HIGH' },
    { range: value >= lowerWarningLimit && value <= upperWarningLimit, result: 'WARNING: Approaching limit' },
  ];

  const matchedClassification = rangeClassifications.find(({ range }) => range);

  return matchedClassification ? matchedClassification.result : 'NORMAL';
}

function batteryIsOk(temperature, soc, charge_rate, temperatureUnit = 'Celsius') {
  const temperatureInCelsius = convertTemperatureUnit(temperature, temperatureUnit, 'Celsius');
  const temperatureStatus = checkValueInRange(temperatureInCelsius, MEASUREMENT_LIMITS.temperature.limit, MEASUREMENT_LIMITS.temperature.tolerance);
  const socStatus = checkValueInRange(soc, MEASUREMENT_LIMITS.soc.limit, MEASUREMENT_LIMITS.soc.tolerance);
  const chargeRateStatus = checkValueInRange(charge_rate, MEASUREMENT_LIMITS.charge_rate.limit, MEASUREMENT_LIMITS.charge_rate.tolerance);

  console.log(`Temperature is ${temperature} ${temperatureUnit}. Status: ${temperatureStatus}`);
  console.log(`State of Charge is ${soc}${MEASUREMENT_LIMITS.soc.unit}. Status: ${socStatus}`);
  console.log(`Charge Rate is ${charge_rate}${MEASUREMENT_LIMITS.charge_rate.unit}. Status: ${chargeRateStatus}`);

  return temperatureStatus === 'NORMAL' && socStatus === 'NORMAL' && chargeRateStatus === 'NORMAL';
}

module.exports = { batteryIsOk };