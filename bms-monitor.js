function inRange(val, min, max) {
  return val >= min && val <= max;
}

function checkValueInRange(value, limits, tolerance) {
  const [lowerLimit, upperLimit] = limits;
  const upperWarningLimit = upperLimit - (upperLimit * tolerance);
  const lowerWarningLimit = lowerLimit + (upperLimit * tolerance);

  if (value < lowerLimit) return 'LOW';
  if (value > upperLimit) return 'HIGH';
  if (inRange(value, lowerWarningLimit, lowerLimit)) return 'WARNING: Approaching discharge';
  if (inRange(value, upperLimit, upperWarningLimit)) return 'WARNING: Approaching charge-peak';
  return 'NORMAL';
}

function convertTemperature(temperature, unit) {
  if (unit !== 'Celsius' && unit !== 'Fahrenheit') {
    throw new Error(`Invalid unit of measurement for temperature: ${unit}`);
  }
  return unit === 'Celsius' ? temperature : (temperature - 32) * 5 / 9;
}

function batteryIsOk(temperature, temperatureUnit, soc, socUnit, charge_rate, chargeRateUnit, measurementLimits, temperatureTolerance = 0.05, socTolerance = 0.05, chargeRateTolerance = 0.05) {
  const temperatureInCelsius = convertTemperature(temperature, temperatureUnit);
  const temperatureLimits = [convertTemperature(measurementLimits[0], temperatureUnit), convertTemperature(measurementLimits[1], temperatureUnit)];
  const temperatureStatus = checkValueInRange(temperatureInCelsius, temperatureLimits, temperatureTolerance);
  const [lowerSocLimit, upperSocLimit] = measurementLimits.slice(2, 4);
  const socStatus = checkValueInRange(soc, [lowerSocLimit, upperSocLimit], socTolerance);
  const [lowerChargeRateLimit, upperChargeRateLimit] = measurementLimits.slice(4, 6);
  const chargeRateStatus = checkValueInRange(charge_rate, [lowerChargeRateLimit, upperChargeRateLimit], chargeRateTolerance);

  console.log(`Temperature is ${temperatureStatus} (${temperature} ${temperatureUnit})`);
  console.log(`State of Charge is ${socStatus} (${soc} ${socUnit})`);
  console.log(`Charge Rate is ${chargeRateStatus} (${charge_rate} ${chargeRateUnit})`);

  return temperatureStatus === 'NORMAL' && socStatus === 'NORMAL' && chargeRateStatus === 'NORMAL';
}

module.exports = { batteryIsOk };
