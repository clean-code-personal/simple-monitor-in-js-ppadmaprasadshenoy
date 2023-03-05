function isValueOutOfRange(value, min, max, parameterName) {
    if (value < min) {
      console.log(`${parameterName} is too low!`);
      return true;
    }
    if (value > max) {
      console.log(`${parameterName} is too high!`);
      return true;
    }
    return false;
  }
  
  function batteryIsOk(temperature, soc, charge_rate) {
    let isBatteryOk = true;
  
    if (isValueOutOfRange(temperature, 0, 45, "Temperature")) {
      isBatteryOk = false;
    }
  
    if (isValueOutOfRange(soc, 20, 80, "State of Charge")) {
      isBatteryOk = false;
    }
  
    if (isValueOutOfRange(charge_rate, 0, 0.8, "Charge rate")) {
      isBatteryOk = false;
    }
  
    return isBatteryOk;
  }
  
  module.exports = {batteryIsOk};
  