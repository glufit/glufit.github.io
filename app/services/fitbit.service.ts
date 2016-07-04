import { Injectable,Inject, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {FitbitRepository} from "../repo/fitbit.repo";


@Injectable()
export class FitbitService {
  constructor(private http: Http, @Inject(FitbitRepository) private fitbitRepository: FitbitRepository) { }


  authorize() {
    this.fitbitRepository.authorize("barevalo@livongo.com","CAMera14").then(
      auth => {
        return auth
      });
  }

  getIntradayData(type, date) {
    return this.fitbitRepository.getIntradayData(type, date).then(
      readings  => {
        return readings
      });
  }

}
