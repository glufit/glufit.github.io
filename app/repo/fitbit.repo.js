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
const http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
const FitbitAuth_1 = require("../common/user/FitbitAuth");
const FitbitIntradayData_1 = require("../common/user/FitbitIntradayData");
let FitbitRepository = class FitbitRepository {
    constructor(http) {
        this.http = http;
        this.baseUrl = "http://localhost:1337/";
        this.tokenUrl = "fitbit/authorize";
        this.intraDayDataUrl = "fitbit/intradayData";
    }
    authorize(username, password) {
        let url = this.baseUrl + this.tokenUrl;
        let body = { username: username, password: password };
        return this.http.post(url, body)
            .toPromise()
            .then(response => {
            let auth = response.json();
            let authTokens = new FitbitAuth_1.FitbitAuth(auth.access_token, auth.refresh_token);
            return authTokens;
        });
    }
    getIntradayData(type, date) {
        let url = this.baseUrl + this.intraDayDataUrl;
        let queryParams = "?type=" + type + "&date=" + date;
        return this.http.get(url + queryParams)
            .toPromise()
            .then(response => {
            let json = response.json();
            let intradayData = json.map(data => {
                return new FitbitIntradayData_1.FitbitIntraDayData(type, date + "T" + data.time, data.value);
            });
            return new FitbitIntradayData_1.FitbitIntraDayDataSet(intradayData);
        });
    }
};
FitbitRepository = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [http_1.Http])
], FitbitRepository);
exports.FitbitRepository = FitbitRepository;
//# sourceMappingURL=fitbit.repo.js.map