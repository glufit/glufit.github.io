"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/// <reference path="../../node_modules/underscore/underscore.browser.d.ts" />
const core_1 = require('@angular/core');
const livongo_service_1 = require("../services/livongo.service");
const livongo_repo_1 = require("../repo/livongo.repo");
const angular2_highcharts_1 = require('angular2-highcharts');
const moment = require('moment/moment');
const moment_1 = require('moment/moment');
const fitbit_service_1 = require("../services/fitbit.service");
const fitbit_repo_1 = require("../repo/fitbit.repo");
const _ = require("underscore");
let AppComponent = class AppComponent {
    constructor(livongoService, fitbitService) {
        this.livongoService = livongoService;
        this.fitbitService = fitbitService;
        this.options = {
            chart: {
                type: 'scatter',
                zoomType: 'x'
            },
            title: { text: 'Glufit' },
            dateTimeLabelFormats: {
                month: '%e. %b',
                year: '%b'
            },
            series: [],
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            yAxis: [{
                    labels: {
                        format: '{value} Steps',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Steps',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[1]
                        }
                    }
                }, {
                    title: {
                        text: 'Blood Glucose',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} mg/dl',
                        style: {
                            color: angular2_highcharts_1.Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
        };
    }
    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }
    ngOnInit() {
        let date = '2016-06-25';
        this.livongoService.authorize();
        let livongoPromise = this.livongoService.getReadings(date, '2016-06-26').then((readings) => {
            let onlyValues = readings.readings.map(reading => {
                return [moment(reading.datetime).toDate().getTime(), reading.value];
            });
            if (onlyValues.length == 0)
                onlyValues = [
                    [moment_1.utc("2016-06-25T01:00:00").toDate().getTime(), 49.9],
                    [moment_1.utc("2016-06-25T12:00:00").toDate().getTime(), 71.5],
                    [moment_1.utc("2016-06-25T14:00:00").toDate().getTime(), 89.9],
                    [moment_1.utc("2016-06-25T15:00:00").toDate().getTime(), 100.9],
                    [moment_1.utc("2016-06-25T18:00:00").toDate().getTime(), 150.9],
                    [moment_1.utc("2016-06-25T22:00:00").toDate().getTime(), 145.9],
                ];
            let options = {
                marker: {
                    radius: 7
                },
                yAxis: 1,
                tooltip: {
                    pointFormat: '{point.x: %b %e %H:%M}: {point.y:.2f} mg/dl',
                    valueSuffix: ' mg/dl'
                },
                name: 'Livongo Glucose Readings',
                data: onlyValues,
                allowPointSelect: true,
                color: '#0DCC00'
            };
            this.livongoOptions = options;
        });
        let fitbitPromise = this.fitbitService.getIntradayData('steps', date).then((readings) => {
            let x = _.groupBy(readings.set, function (data) {
                return moment(data.timestamp).hour();
            });
            let dateObj = new Date(date);
            let dateObjWithSum = _.map(x, function (arr, key) {
                let sum = _.reduce(arr, function (memo, data) { return memo + data["value"]; }, 0);
                dateObj.setUTCHours(+key);
                return [dateObj.getTime(), sum];
            });
            let options = {
                name: 'Fitbit Steps',
                type: 'column',
                yAxis: 0,
                data: dateObjWithSum,
                tooltip: {
                    valueSuffix: ' steps'
                },
                color: '#247BFF',
                pointWidth: 30
            };
            this.fitbitOptions = options;
        });
        let fitbitHeartPromise = this.fitbitService.getIntradayData('heart', date).then((readings) => {
            let dateObjWithHeartRate = _.map(readings.set, function (value, key) {
                let x = value;
                let dateStr = x.timestamp;
                return [moment_1.utc(dateStr).toDate().getTime(), x.value];
            });
            let options = {
                name: 'Fitbit HeartRate Data',
                type: 'line',
                yAxis: 1,
                data: dateObjWithHeartRate,
                tooltip: {
                    valueSuffix: ' bpm'
                },
                color: '#F90000'
            };
            this.fitbitHeartOptions = options;
        });
        Promise.all([fitbitPromise, fitbitHeartPromise, livongoPromise]).then(values => {
            this.chart.addSeries(this.fitbitOptions, true, true);
            this.chart.addSeries(this.fitbitHeartOptions, true, true);
            this.chart.addSeries(this.livongoOptions, true, true);
            this.chart.redraw(true);
        });
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        directives: [angular2_highcharts_1.CHART_DIRECTIVES],
        template: '<chart [options]="options" ' +
            '                 (load)="saveInstance($event.context)"></chart>',
        providers: [
            livongo_service_1.LivongoService,
            livongo_repo_1.LivongoRepository,
            fitbit_service_1.FitbitService,
            fitbit_repo_1.FitbitRepository
        ],
        styles: [`
      chart {
        width: 100%;
        height: 100%;
      }
    `]
    }), 
    __metadata('design:paramtypes', [livongo_service_1.LivongoService, fitbit_service_1.FitbitService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map