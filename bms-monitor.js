const MEASUREMENT_LIMITS = {
  temperature: { limit: { min: 0, max: 45 }, tolerance: 0.05, unit: 'Celsius' },
  soc: { limit: { min: 20, max: 80 }, tolerance: 0.05, unit: '%' },
  charge_rate: { limit: { min: 0, max: 0.8 }, tolerance: 0.05, unit: 'per hour' }
};

const celsiusInFahrenheit = (temp) => (temp * 9 / 5) + 32;

const checkValueInRange = (value, limit, tolerance) => {
    const { max, min } = limit;
    const upperWarningLimit = max - (max * tolerance);
    const lowerWarningLimit = min + (max * tolerance);
    return (
        value < min && 'LOW' ||
        value > max && 'HIGH' ||
        value >= lowerWarningLimit && value <= min && 'WARNING: Approaching discharge' ||
        value >= max && value <= upperWarningLimit && 'WARNING: Approaching charge-peak' ||
        'NORMAL'
    );
};

const batteryIsOk = (temp, soc, rate, unit = 'Celsius') => {
    const tempInCelsius = unit === 'Celsius' ? temp : celsiusInFahrenheit(temp);
    const tempStatus = checkValueInRange(tempInCelsius, MEASUREMENT_LIMITS.temperature.limit, MEASUREMENT_LIMITS.temperature.tolerance);
    const socStatus = checkValueInRange(soc, MEASUREMENT_LIMITS.soc.limit, MEASUREMENT_LIMITS.soc.tolerance);
    const rateStatus = checkValueInRange(rate, MEASUREMENT_LIMITS.charge_rate.limit, MEASUREMENT_LIMITS.charge_rate.tolerance);
    console.log(`Temperature is ${temp} ${unit}. Status: ${tempStatus}`);
    console.log(`State of Charge is ${soc}${MEASUREMENT_LIMITS.soc.unit}. Status: ${socStatus}`);
    console.log(`Charge Rate is ${rate}${MEASUREMENT_LIMITS.charge_rate.unit}. Status: ${rateStatus}`);
    return tempStatus === 'NORMAL' && socStatus === 'NORMAL' && rateStatus === 'NORMAL';
};

module.exports = { batteryIsOk };