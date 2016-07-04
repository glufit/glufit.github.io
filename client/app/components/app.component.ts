import { Component, OnInit } from '@angular/core';
import {LivongoService} from "../services/livongo.service";
import {LivongoRepository} from "../repo/livongo.repo";
@Component({
  selector: 'my-app',
  template: '<h1>My First Angular 2 App</h1>',
  providers: [
    LivongoService,
    LivongoRepository
  ]
})
export class AppComponent {
  constructor(private livongoService: LivongoService) { }

  ngOnInit() {
    this.livongoService.authorize()
    this.livongoService.getReadings('2016-01-01', '2016-09-01')
  }
}
