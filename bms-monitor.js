const MEASUREMENT_LIMITS = {
  temperature: { limit: { min: 0, max: 45 }, tolerance: 0.05, unit: 'Celsius' },
  soc: { limit: { min: 20, max: 80 }, tolerance: 0.05, unit: '%' },
  charge_rate: { limit: { min: 0, max: 0.8 }, tolerance: 0.05, unit: 'per hour' }
};

function convertToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function convertLimitToCelsius(limit, unit) {
  if (unit === 'Fahrenheit') {
    return {
      min: convertToFahrenheit(limit.min),
      max: convertToFahrenheit(limit.max)
    };
  } else {
    return limit;
  }
}

function checkValueInRange(value, limit, tolerance) {
  const { max, min } = limit;
  const upperLimit = max;
  const lowerLimit = min;
  const upperWarningLimit = max - (max * tolerance);
  const lowerWarningLimit = min + (max * tolerance);

  if (value < lowerLimit) {
    return 'LOW';
  } else if (value > upperLimit) {
    return 'HIGH';
  } else if (value >= lowerWarningLimit) {
    if (value <= lowerLimit) {
      return 'WARNING: Approaching discharge';
    } else if (value >= upperLimit - (upperLimit - lowerLimit) * tolerance) {
      return 'WARNING: Approaching charge-peak';
    }
  }
  return 'NORMAL';
}

function batteryIsOk(temperature, soc, charge_rate, temperatureUnit = 'Celsius') {
  const temperatureLimit = convertLimitToCelsius(MEASUREMENT_LIMITS.temperature.limit, temperatureUnit);
  const socLimit = MEASUREMENT_LIMITS.soc.limit;
  const chargeRateLimit = MEASUREMENT_LIMITS.charge_rate.limit;

  if (temperatureUnit !== 'Celsius' && temperatureUnit !== 'Fahrenheit') {
    throw new Error('Unsupported temperature unit');
  }

  const temperatureStatus = checkValueInRange(temperature, temperatureLimit, MEASUREMENT_LIMITS.temperature.tolerance);
  const socStatus = checkValueInRange(soc, socLimit, MEASUREMENT_LIMITS.soc.tolerance);
  const chargeRateStatus = checkValueInRange(charge_rate, chargeRateLimit, MEASUREMENT_LIMITS.charge_rate.tolerance);

  console.log(`Temperature is ${temperature} ${temperatureUnit}. Status: ${temperatureStatus}`);
  console.log(`State of Charge is ${soc}${MEASUREMENT_LIMITS.soc.unit}. Status: ${socStatus}`);
  console.log(`Charge Rate is ${charge_rate}${MEASUREMENT_LIMITS.charge_rate.unit}. Status: ${chargeRateStatus}`);

  return temperatureStatus === 'NORMAL' && socStatus === 'NORMAL' && chargeRateStatus === 'NORMAL';
}

module.exports = { batteryIsOk };
