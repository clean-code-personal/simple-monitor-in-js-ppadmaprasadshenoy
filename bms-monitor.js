function printMeasurementStatus(name, value, limit, tolerance, unit) {
  const status = checkValueInRange(value, limit, tolerance);
  console.log(`${name} is ${value}${unit}. Status: ${status}`);
  return status;
}

function batteryIsOk(temperature, soc, charge_rate, temperatureUnit = 'Celsius') {
  if (temperatureUnit !== 'Celsius' && temperatureUnit !== 'Fahrenheit') {
    throw new Error('Unsupported temperature unit');
  }

  const temperatureLimit = convertLimitToCelsius(MEASUREMENT_LIMITS.temperature.limit, temperatureUnit);
  const socLimit = MEASUREMENT_LIMITS.soc.limit;
  const chargeRateLimit = MEASUREMENT_LIMITS.charge_rate.limit;

  const temperatureStatus = printMeasurementStatus('Temperature', temperature, temperatureLimit, MEASUREMENT_LIMITS.temperature.tolerance, temperatureUnit);
  if (temperatureStatus !== 'NORMAL') {
    return false;
  }

  const socStatus = printMeasurementStatus('State of Charge', soc, socLimit, MEASUREMENT_LIMITS.soc.tolerance, MEASUREMENT_LIMITS.soc.unit);
  if (socStatus !== 'NORMAL') {
    return false;
  }

  const chargeRateStatus = printMeasurementStatus('Charge Rate', charge_rate, chargeRateLimit, MEASUREMENT_LIMITS.charge_rate.tolerance, MEASUREMENT_LIMITS.charge_rate.unit);
  if (chargeRateStatus !== 'NORMAL') {
    return false;
  }

  return true;
}
