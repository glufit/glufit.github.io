/// <reference path="../../node_modules/underscore/underscore.browser.d.ts" />
import { Component, OnInit } from '@angular/core';
import {LivongoService} from "../services/livongo.service";
import {LivongoRepository} from "../repo/livongo.repo";
import { CHART_DIRECTIVES, Highcharts } from 'angular2-highcharts';
import {BgReadings} from "../common/user/LivongoReadings";
import * as moment from 'moment/moment';
import {utc} from 'moment/moment';

import {FitbitService} from "../services/fitbit.service";
import {FitbitRepository} from "../repo/fitbit.repo";
import {FitbitIntraDayDataSet, FitbitIntraDayData} from "../common/user/FitbitIntradayData";
import _ = require("underscore");

@Component({
  selector: 'my-app',
  directives: [CHART_DIRECTIVES],
  template: '<chart id = "mainChart"' +
  '                 (window:resize)="onResize($event)"' +
  '                 [options]="options" ' +
  '                 (load)="saveInstance($event.context)"></chart>',
  providers: [
    LivongoService,
    LivongoRepository,
    FitbitService,
    FitbitRepository
  ],
  styles: [`
      chart {
        width: 100%;
        height: 100%;
      }
    `]
})
export class AppComponent {
  constructor(private livongoService: LivongoService, private fitbitService: FitbitService) {
    this.options = {
      chart: {
        type: 'scatter',
        zoomType: 'x'
      },
      title : { text : 'Glufit' },
      dateTimeLabelFormats: { // don't display the dummy year
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
      yAxis: [{ // Primary yAxis
        labels: {
          format: '{value} Steps',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        title: {
          text: 'Steps',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        }
      }, { // Secondary yAxis
        title: {
          text: 'Blood Glucose',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        labels: {
          format: '{value} mg/dl',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        opposite: true
      }],
    };
  }
  chart : HighchartsChartObject;
  options: Object;
  livongoOptions: Object;
  fitbitOptions: Object;
  fitbitHeartOptions: Object;
  saveInstance(chartInstance) {
      this.chart = chartInstance;
  }

  ngOnInit() {
    let date = '2016-06-25'
    this.livongoService.authorize()

    let livongoPromise = this.livongoService.getReadings(date, '2016-06-26').then( (readings: BgReadings) => {
      let onlyValues = readings.readings.map(reading => {
        return [moment(reading.datetime).toDate().getTime(), reading.value]
      })

      if(onlyValues.length == 0)
        onlyValues = [
          [utc("2016-06-25T01:00:00").toDate().getTime(), 49.9],
          [utc("2016-06-25T12:00:00").toDate().getTime(), 71.5],
          [utc("2016-06-25T14:00:00").toDate().getTime(), 89.9],
          [utc("2016-06-25T15:00:00").toDate().getTime(), 100.9],
          [utc("2016-06-25T18:00:00").toDate().getTime(), 150.9],
          [utc("2016-06-25T22:00:00").toDate().getTime(), 145.9],
        ]

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
      }
      this.livongoOptions = options
    })

    let fitbitPromise = this.fitbitService.getIntradayData('steps', date).then( (readings: FitbitIntraDayDataSet) => {

      let x = _.groupBy(readings.set, function(data){
        return moment(data.timestamp).hour()
      });

      let dateObj = new Date(date)
      let dateObjWithSum = _.map(x, function(arr, key){
        let sum = _.reduce(arr, function(memo, data){ return memo + data["value"] }, 0);

        dateObj.setUTCHours(+key)
        return [dateObj.getTime(), sum]
      })

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
      }
      this.fitbitOptions = options
    })

    let fitbitHeartPromise = this.fitbitService.getIntradayData('heart', date).then( (readings: FitbitIntraDayDataSet) => {

      let dateObjWithHeartRate = _.map(readings.set, function(value, key){
        let x: FitbitIntraDayData = value
        let dateStr = x.timestamp
        return [utc(dateStr).toDate().getTime(), x.value]
      })

      let options = {
        name: 'Fitbit HeartRate Data',
        type: 'line',
        yAxis: 1,
        data: dateObjWithHeartRate,
        tooltip: {
          valueSuffix: ' bpm'
        },
        color: '#F90000'
      }
      this.fitbitHeartOptions = options
    })

    Promise.all([fitbitPromise, fitbitHeartPromise, livongoPromise]).then(values => {
      this.chart.addSeries(this.fitbitOptions,      true, true)
      this.chart.addSeries(this.fitbitHeartOptions, true, true)
      this.chart.addSeries(this.livongoOptions,     true, true)
      this.chart.redraw(true)
      document.getElementsByClassName("highcharts-container")[0].classList.add('animated', 'flipInY')


    });


  }

  onResize(event) {
    this.chart.setSize(window.innerWidth, window.innerHeight,true)
  }
}
