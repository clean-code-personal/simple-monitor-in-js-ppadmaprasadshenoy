function isValueOutOfRange(value, min, max) {
    if (value < min) {
      return { isOutOfRange: true, breachType: 'low' };
    }
    if (value > max) {
      return { isOutOfRange: true, breachType: 'high' };
    }
    return { isOutOfRange: false };
  }
  
  function isParameterOutOfRange(parameterType, value) {
    switch(parameterType) {
      case 'temperature':
        return isValueOutOfRange(value, 0, 45);
      case 'soc':
        return isValueOutOfRange(value, 20, 80);
      case 'charge_rate':
        return isValueOutOfRange(value, 0, 0.8);
      default:
        return { isOutOfRange: false };
    }
  }
  
  function batteryIsOk(temperature, soc, charge_rate) {
    const parameterTypes = ['temperature', 'soc', 'charge_rate'];
    let isBatteryOk = true;
  
    for (const parameterType of parameterTypes) {
      const parameterStatus = isParameterOutOfRange(parameterType, eval(parameterType));
      if (parameterStatus.isOutOfRange) {
        console.log(`${parameterType} is ${parameterStatus.breachType} of range!`);
        isBatteryOk = false;
      }
    }
    return isBatteryOk;
  }
  
  module.exports = {batteryIsOk};  