const MEASUREMENT_LIMITS = {
  temperature: { limit: { min: 0, max: 45 }, tolerance: 0.05, unit: 'Celsius' },
  soc: { limit: { min: 20, max: 80 }, tolerance: 0.05, unit: '%' },
  charge_rate: { limit: { min: 0, max: 0.8 }, tolerance: 0.05, unit: 'per hour' }
};

function convertToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function checkValueInRange(value, limit, tolerance, unit) {
  const limitInCelsius = {
    min: limit.min,
    max: limit.max
  };

  if (unit === 'Fahrenheit') {
    limitInCelsius.min = convertToFahrenheit(limit.min);
    limitInCelsius.max = convertToFahrenheit(limit.max);
  }

  const upperLimit = limitInCelsius.max;
  const lowerLimit = limitInCelsius.min;
  const upperWarningLimit = upperLimit - (upperLimit * tolerance);
  const lowerWarningLimit = lowerLimit + (upperLimit * tolerance);

  if (value < lowerLimit) {
    return 'LOW';
  } else if (value > upperLimit) {
    return 'HIGH';
  } else if (value >= lowerWarningLimit && value <= lowerLimit) {
    return 'WARNING: Approaching discharge';
  } else if (value >= upperLimit && value <= upperWarningLimit) {
    return 'WARNING: Approaching charge-peak';
  } else {
    return 'NORMAL';
  }
}

function batteryIsOk(temperature, soc, charge_rate, temperatureUnit = 'Celsius') {
  const temperatureStatus = checkValueInRange(temperature, MEASUREMENT_LIMITS.temperature.limit, MEASUREMENT_LIMITS.temperature.tolerance, temperatureUnit);
  const socStatus = checkValueInRange(soc, MEASUREMENT_LIMITS.soc.limit, MEASUREMENT_LIMITS.soc.tolerance, MEASUREMENT_LIMITS.soc.unit);
  const chargeRateStatus = checkValueInRange(charge_rate, MEASUREMENT_LIMITS.charge_rate.limit, MEASUREMENT_LIMITS.charge_rate.tolerance, MEASUREMENT_LIMITS.charge_rate.unit);

  console.log(`Temperature is ${temperature} ${temperatureUnit}. Status: ${temperatureStatus}`);
  console.log(`State of Charge is ${soc}${MEASUREMENT_LIMITS.soc.unit}. Status: ${socStatus}`);
  console.log(`Charge Rate is ${charge_rate}${MEASUREMENT_LIMITS.charge_rate.unit}. Status: ${chargeRateStatus}`);

  return temperatureStatus === 'NORMAL' && socStatus === 'NORMAL' && chargeRateStatus === 'NORMAL';
}

module.exports = { batteryIsOk };
