import { Injectable,Inject, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {LivongoRepository} from "../repo/livongo.repo";
import {LivongoAuth} from '../common/user/LivongoAuth'
import {BgReadings} from "../common/user/LivongoReadings";


@Injectable()
export class LivongoService {
  constructor(private http: Http, @Inject(LivongoRepository) private livongoRepository: LivongoRepository) { }

  bgReadings: BgReadings

  authorize() {
    this.livongoRepository.authorize("barevalo@livongo.com","CAMera14").then(
      auth => {
        return auth
      });
  }

  getReadings(start, end) {
    this.livongoRepository.getReadings(start, end).then(
      readings  => {

        this.bgReadings = readings
        
        return readings
      });
  }

}
