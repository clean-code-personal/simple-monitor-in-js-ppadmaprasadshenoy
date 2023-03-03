function isValueOutOfRange(value, min, max) {
    if (value < min) {
      return { isOutOfRange: true, breachType: 'low' };
    }
    if (value > max) {
      return { isOutOfRange: true, breachType: 'high' };
    }
    return { isOutOfRange: false };
  }
  
  function isTemperatureOutOfRange(temperature) {
    return isValueOutOfRange(temperature, 0, 45);
  }
  
  function isSocOutOfRange(soc) {
    return isValueOutOfRange(soc, 20, 80);
  }
  
  function isChargeRateOutOfRange(charge_rate) {
    return isValueOutOfRange(charge_rate, 0, 0.8);
  }
  
  function batteryIsOk(temperature, soc, charge_rate) {
    let isBatteryOk = true;
  
    const temperatureStatus = isTemperatureOutOfRange(temperature);
    if (temperatureStatus.isOutOfRange) {
      console.log(`Temperature is ${temperatureStatus.breachType} of range!`);
      isBatteryOk = false;
    }
  
    const socStatus = isSocOutOfRange(soc);
    if (socStatus.isOutOfRange) {
      console.log(`State of Charge is ${socStatus.breachType} of range!`);
      isBatteryOk = false;
    }
  
    const chargeRateStatus = isChargeRateOutOfRange(charge_rate);
    if (chargeRateStatus.isOutOfRange) {
      console.log(`Charge rate is ${chargeRateStatus.breachType} of range!`);
      isBatteryOk = false;
    }
  
    if (isBatteryOk) {
      console.log('Battery is OK.');
    }
  
    return isBatteryOk;
  }
  
  module.exports = {batteryIsOk};