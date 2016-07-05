"use strict";
var BgReading = (function () {
    function BgReading(datetime, value) {
        this.datetime = datetime;
        this.value = value;
    }
    return BgReading;
}());
exports.BgReading = BgReading;
var BgReadings = (function () {
    function BgReadings(readings) {
        this.readings = readings;
    }
    return BgReadings;
}());
exports.BgReadings = BgReadings;
//# sourceMappingURL=LivongoReadings.js.map