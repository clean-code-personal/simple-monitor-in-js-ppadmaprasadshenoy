//To take effective action, we need to know the abnormal measure and the breach - whether high or low. Add this capability.
function isValueOutOfRange(value, min, max) {
    if (value < min) {
        return { isisOutRange: true, breachType: false };
    } 
    if (value > max) {
        return { isOutOfRange: true, breachType: true };
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

    const temperatureRange = isTemperatureOutOfRange(temperature);
    if (temperatureRange.isOutOfRange) {
        console.log(`Temperature is ${temperatureRange.breachType} of range!`);
        isBatteryOk = false;
    }

    const socRange = isSocOutOfRange(soc);
    if (socRange.isOutOfRange) {
        console.log(`State of Charge is ${socRange.breachType} of range!'}`);
        isBatteryOk = false;
    }

    const chargeRateRange = isChargeRateOutOfRange(charge_rate);
    if (chargeRateRange.isOutOfRange) {
        console.log(`Charge rate is ${chargeRateRange.breachType} of range!'}`);
        isBatteryOk = false;
    }

    if (isBatteryOk) {
        console.log("Battery is OK");
    }

    return isBatteryOk;
}

// 1: All parameters are within the range
console.assert(batteryIsOk(25, 50, 0.5) === true, "Test case 1 failed");

// 2: Temperature is high
console.assert(batteryIsOk(50, 50, 0.5) === false, "Test case 2 failed");

// 3: Temperature is low
console.assert(batteryIsOk(-10, 50, 0.5) === false, "Test case 3 failed");

// 4: State of Charge is low
console.assert(batteryIsOk(25, 10, 0.5) === false, "Test case 4 failed");

// 5: State of Charge is high
console.assert(batteryIsOk(25, 90, 0.5) === false, "Test case 5 failed");

// 6: Charge rate is too low
console.assert(batteryIsOk(25, 50, -0.1) === false, "Test case 6 failed");

// 7: Charge rate is too high
console.assert(batteryIsOk(25, 50, 0.9) === false, "Test case 7 failed");

// 8: All parameters at minimum value
console.assert(batteryIsOk(0, 20, 0) === true, "Test case 8 failed");

// 9: All parameters at maximum value
console.assert(batteryIsOk(45, 80, 0.8) === true, "Test case 9 failed");