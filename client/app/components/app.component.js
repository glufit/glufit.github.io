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
const core_1 = require('@angular/core');
const livongo_service_1 = require("../services/livongo.service");
const livongo_repo_1 = require("../repo/livongo.repo");
const angular2_highcharts_1 = require('angular2-highcharts');
const moment = require('moment/moment');
let AppComponent = class AppComponent {
    constructor(livongoService) {
        this.livongoService = livongoService;
        this.options = {
            chart: { type: 'scatter' },
            title: { text: 'simple chart' },
            dateTimeLabelFormats: {
                month: '%e. %b',
                year: '%b'
            },
            series: [
                {
                    tooltip: {
                        pointFormat: '{point.x: %b %e %H:%M}: {point.y:.2f} m',
                        valueSuffix: ' mm'
                    },
                    name: 's1',
                    data: [23, 44, 55],
                    allowPointSelect: true
                }
            ],
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            }
        };
    }
    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }
    ngOnInit() {
        this.livongoService.authorize();
        this.livongoService.getReadings('2016-01-01', '2016-09-01').then((readings) => {
            console.log(readings);
            let onlyValues = readings.readings.map(reading => {
                return [moment(reading.datetime).toDate().getTime(), reading.value];
            });
            console.log(onlyValues);
            this.chart["series"][0].setData(onlyValues);
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
            livongo_repo_1.LivongoRepository
        ],
        styles: [`
      chart {
        width: 100%;
        height: 100%;
      }
    `]
    }), 
    __metadata('design:paramtypes', [livongo_service_1.LivongoService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map