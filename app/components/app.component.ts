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
  templateUrl: 'app/html/app.component.html',
  providers: [
    LivongoService,
    LivongoRepository,
    FitbitService,
    FitbitRepository
  ],
  styles: [`
      chart {
        position:relative;
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
      title : { text : '' },
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
  startDate: String = '2016-06-25'
  currDate:  String = this.startDate



  onResize(event) {
    var th = document.getElementById('buttons').offsetHeight
    var bh = document.getElementById('title').offsetHeight
    this.chart.setSize(window.innerWidth, window.innerHeight - th - bh,true)
  }

  previousDay(){
    while(this.chart.series.length > 0)
      this.chart.series[0].remove(true);
    let previousDay = utc(this.currDate + 'T00:00:00').subtract(1, 'day').format('YYYY-MM-DD')
    this.currDate = previousDay
    this.setDay(previousDay)
  }

  nextDay(){
    while(this.chart.series.length > 0)
      this.chart.series[0].remove(true);
    let nextDate = utc(this.currDate + 'T00:00:00').add(1, 'day').format('YYYY-MM-DD')
    this.currDate = nextDate
    this.setDay(nextDate)
  }

  setDay(date) {
    let livongoPromise = this.livongoService.getReadings(date, utc(date+'T00:00:00').add(1, 'day').format('YYYY-MM-DD') ).then( (readings: BgReadings) => {
      let onlyValues = readings.readings.map(reading => {
        return [moment(reading.datetime).toDate().getTime(), reading.value]
      })

      if(onlyValues.length == 0)
        onlyValues = [
          [utc(date + "T01:00:00").toDate().getTime(), 49.9],
          [utc(date + "T12:00:00").toDate().getTime(), 71.5],
          [utc(date + "T14:00:00").toDate().getTime(), 89.9],
          [utc(date + "T15:00:00").toDate().getTime(), 100.9],
          [utc(date + "T18:00:00").toDate().getTime(), 150.9],
          [utc(date + "T22:00:00").toDate().getTime(), 145.9],
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
      this.onResize(null)
      this.chart.redraw(true)
      document.getElementsByClassName("highcharts-container")[0].classList.add('animated', 'flipInY')
    });
  }

  ngOnInit() {
    this.livongoService.authorize()

    this.setDay(this.startDate)

  }
}
