//Separate pure functions from I/O
function isTemperatureOutOfRange(temperature) {
    return temperature < 0 || temperature > 45;
}

function isSocOutOfRange(soc) {
    return soc < 20 || soc > 80;
}

function isChargeRateOutOfRange(charge_rate) {
    return charge_rate > 0.8;
}

function batteryIsOk(temperature, soc, charge_rate) {
    if (isTemperatureOutOfRange(temperature)) {
        console.log('Temperature is out of range!');
        return false;
    }
    if (isSocOutOfRange(soc)) {
        console.log('State of Charge is out of range!')
        return false;
    }
    if (isChargeRateOutOfRange(charge_rate)) {
        console.log('Charge rate is out of range!');
        return false;
    }
    return true;
}
