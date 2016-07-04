import { Component, OnInit } from '@angular/core';
import {LivongoService} from "../services/livongo.service";
import {LivongoRepository} from "../repo/livongo.repo";
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {BgReadings} from "../common/user/LivongoReadings";
import * as moment from 'moment/moment';

@Component({
  selector: 'my-app',
  directives: [CHART_DIRECTIVES],
  template: '<chart [options]="options" ' +
  '                 (load)="saveInstance($event.context)"></chart>',
  providers: [
    LivongoService,
    LivongoRepository
  ],
  styles: [`
      chart {
        width: 100%;
        height: 100%;
      }
    `]
})
export class AppComponent {
  constructor(private livongoService: LivongoService) {
    this.options = {
      chart: { type: 'scatter' },
      title : { text : 'simple chart' },
      dateTimeLabelFormats: { // don't display the dummy year
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
  chart : Object;
  options: Object;
  saveInstance(chartInstance) {
      this.chart = chartInstance;
  }

  ngOnInit() {
    this.livongoService.authorize()
    this.livongoService.getReadings('2016-01-01', '2016-09-01').then( (readings: BgReadings) => {
      console.log(readings)
      let onlyValues = readings.readings.map(reading => {
        return [moment(reading.datetime).toDate().getTime(), reading.value]
      })
      console.log(onlyValues)

      this.chart["series"][0].setData(onlyValues);
    })


  }
}
