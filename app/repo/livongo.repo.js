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
const LivongoReadings_1 = require("../common/user/LivongoReadings");
const LivongoAuth_1 = require("../common/user/LivongoAuth");
const moment = require('moment/moment');
let LivongoRepository = class LivongoRepository {
    constructor(http) {
        this.http = http;
        this.baseUrl = "http://localhost:1337/";
        this.tokenUrl = "livongo/authorize";
        this.readingsUrl = "livongo/readings";
    }
    authorize(username, password) {
        let url = this.baseUrl + this.tokenUrl;
        let body = { username: username, password: password };
        return this.http.post(url, body)
            .toPromise()
            .then(response => {
            let auth = response.json();
            let authTokens = new LivongoAuth_1.LivongoAuth(auth.access_token, auth.refresh_token);
            return authTokens;
        });
    }
    getReadings(start, end) {
        let url = this.baseUrl + this.readingsUrl;
        let queryParams = "?start=" + start + "&end=" + end;
        return this.http.get(url + queryParams)
            .toPromise()
            .then(response => {
            let bgs = response.json().bgs;
            let bgReadings = bgs.map(jsonEntry => {
                let timeStamp = moment(jsonEntry.timestamp).format("YYYY-MM-DD T HH:MM:SS").toString();
                return new LivongoReadings_1.BgReading(timeStamp, jsonEntry.value);
            });
            return new LivongoReadings_1.BgReadings(bgReadings);
        });
    }
};
LivongoRepository = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [http_1.Http])
], LivongoRepository);
exports.LivongoRepository = LivongoRepository;
//# sourceMappingURL=livongo.repo.js.map