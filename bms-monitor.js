const MEASUREMENT_LIMITS = {
  temperature: { limit: { min: 0, max: 45 }, tolerance: 0.05, unit: 'Celsius' },
  soc: { limit: { min: 20, max: 80 }, tolerance: 0.05, unit: '%' },
  charge_rate: { limit: { min: 0, max: 0.8 }, tolerance: 0.05, unit: 'per hour' }
};

function convertTemperatureUnit(temperature, fromUnit, toUnit) {
  const conversionFactors = {
    'Celsius-Fahrenheit': (temperature) => (temperature * 9 / 5) + 32,
    'Fahrenheit-Celsius': (temperature) => (temperature - 32) * 5 / 9
  };
  const conversionKey = `${fromUnit}-${toUnit}`;

  if (fromUnit === toUnit) {
    return temperature;
  }

  if (!conversionFactors[conversionKey]) {
    throw new Error(`Invalid temperature units: ${fromUnit}, ${toUnit}`);
  }

  return conversionFactors[conversionKey](temperature);
}

function checkValueInRange(value, limit, tolerance) {
  const upperLimit = limit.max;
  const lowerLimit = limit.min;
  const upperWarningLimit = upperLimit - (upperLimit * tolerance);
  const lowerWarningLimit = lowerLimit + (upperLimit * tolerance);

  if (value < lowerLimit) return 'LOW';
  if (value > upperLimit) return 'HIGH';
  if (value >= lowerWarningLimit && value <= lowerLimit) return 'WARNING: Approaching discharge';
  if (value >= upperLimit && value <= upperWarningLimit) return 'WARNING: Approaching charge-peak';
  return 'NORMAL';
}

function batteryIsOk(temperature, soc, charge_rate, temperatureUnit = 'Celsius') {
  const temperatureInCelsius = convertTemperatureUnit(temperature, temperatureUnit, 'Celsius');
  const statuses = [
    checkValueInRange(temperatureInCelsius, MEASUREMENT_LIMITS.temperature.limit, MEASUREMENT_LIMITS.temperature.tolerance),
    checkValueInRange(soc, MEASUREMENT_LIMITS.soc.limit, MEASUREMENT_LIMITS.soc.tolerance),
    checkValueInRange(charge_rate, MEASUREMENT_LIMITS.charge_rate.limit, MEASUREMENT_LIMITS.charge_rate.tolerance)
  ];

  console.log(`Temperature is ${temperature} ${temperatureUnit}. Status: ${statuses[0]}`);
  console.log(`State of Charge is ${soc}${MEASUREMENT_LIMITS.soc.unit}. Status: ${statuses[1]}`);
  console.log(`Charge Rate is ${charge_rate}${MEASUREMENT_LIMITS.charge_rate.unit}. Status: ${statuses[2]}`);

  return statuses.every((status) => status === 'NORMAL');
}

module.exports = { batteryIsOk };
