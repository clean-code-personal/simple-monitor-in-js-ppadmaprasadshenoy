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

function checkValueInRange(value, limit, tolerance) {
  const { upperWarningLimit, lowerWarningLimit } = calculateWarningLimits(limit, tolerance);
  const result = calculateResult(value, limit, upperWarningLimit, lowerWarningLimit);
  return result;
}

function calculateResult(value, limit, upperWarningLimit, lowerWarningLimit) {
  const resultMap = new Map([
    [value < limit.min, 'LOW'],
    [value > limit.max, 'HIGH'],
    [(value >= lowerWarningLimit && value <= limit.min) || (value >= limit.max && value <= upperWarningLimit), 'WARNING: Approaching limit']
  ]);
  const defaultResult = 'NORMAL';
  return resultMap.get(true) || defaultResult;
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