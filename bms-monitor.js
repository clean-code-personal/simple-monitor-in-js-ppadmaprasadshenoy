const MEASUREMENT_LIMITS = {
  temperature: { limit: { min: 0, max: 45 }, tolerance: 0.05, unit: 'Celsius' },
  soc: { limit: { min: 20, max: 80 }, tolerance: 0.05, unit: '%' },
  charge_rate: { limit: { min: 0, max: 0.8 }, tolerance: 0.05, unit: 'per hour' }
};

function convertTemperatureUnit(temperature, fromUnit, toUnit) {
  if (fromUnit === toUnit) return temperature;
  if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') return (temperature * 9 / 5) + 32;
  if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') return (temperature - 32) * 5 / 9;
  throw new Error(`Invalid temperature units: ${fromUnit}, ${toUnit}`);
}

function checkValueInRange(value, limit, tolerance) {
  const upperLimit = limit.max;
  const lowerLimit = limit.min;
  const upperWarningLimit = upperLimit - (upperLimit * tolerance);
  const lowerWarningLimit = lowerLimit + (upperLimit * tolerance);
  let status = 'NORMAL';

  if (value < lowerLimit) status = 'LOW';
  else if (value > upperLimit) status = 'HIGH';
  else if (value >= lowerWarningLimit && value <= lowerLimit) status = 'WARNING: Approaching discharge';
  else if (value >= upperLimit && value <= upperWarningLimit) status = 'WARNING: Approaching charge-peak';

  return status;
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