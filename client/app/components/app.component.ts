import { Component, OnInit } from '@angular/core';
import {LivongoService} from "../services/livongo.service";
import {LivongoRepository} from "../repo/livongo.repo";
import { CHART_DIRECTIVES } from 'angular2-highcharts';

@Component({
  selector: 'my-app',
  directives: [CHART_DIRECTIVES],
  template: '<chart [options]="options"></chart>',
  providers: [
    LivongoService,
    LivongoRepository
  ],
  styles: [`
      chart {
        display: block;
      }
    `]
})
export class AppComponent {
  constructor(private livongoService: LivongoService) {
    this.options = {
      title : { text : 'simple chart' },
      series: [{
        data: [29.9, 71.5, 106.4, 129.2],
      }]
    };
  }

  options: Object;

  ngOnInit() {
    this.livongoService.authorize()
    this.livongoService.getReadings('2016-01-01', '2016-09-01')

  }
}
