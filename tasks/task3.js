//Avoid duplication - functions that do nearly the same thing
function isValueOutOfRange(value, min, max) {
    return value < min || value > max;
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
