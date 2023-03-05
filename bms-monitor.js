function inRange(val, min, max) {
  if(val<min || val>max){
    return false;
  } else{
    return true;
  }
}

function checkTemperatureRange(temperature) {
  return inRange(temperature, 0, 45);
}
function checkSocRange(soc) {
  return inRange(soc, 20, 80);
}
function checkChargeRateRange(charge_rate) {
  return inRange(charge_rate, 0, 0.8);
}

function check(parameters){
  return parameters;
}

function batteryIsOk(temperature, soc, charge_rate) {
  let temperatureValue = checkTemperatureRange(temperature);
  let socValue = checkSocRange(soc);
  let chargeRateValue = checkChargeRateRange(charge_rate);
  const parameters = [temperatureValue, socValue, chargeRateValue];
  let isBatteryOk = parameters.every(check);
  return isBatteryOk;
}

module.exports = { batteryIsOk };
