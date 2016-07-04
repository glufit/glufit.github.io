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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const core_1 = require('@angular/core');
const http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
const fitbit_repo_1 = require("../repo/fitbit.repo");
let FitbitService = class FitbitService {
    constructor(http, fitbitRepository) {
        this.http = http;
        this.fitbitRepository = fitbitRepository;
    }
    authorize() {
        this.fitbitRepository.authorize("barevalo@livongo.com", "CAMera14").then(auth => {
            return auth;
        });
    }
    getIntradayData(type, date) {
        return this.fitbitRepository.getIntradayData(type, date).then(readings => {
            return readings;
        });
    }
};
FitbitService = __decorate([
    core_1.Injectable(),
    __param(1, core_1.Inject(fitbit_repo_1.FitbitRepository)), 
    __metadata('design:paramtypes', [http_1.Http, fitbit_repo_1.FitbitRepository])
], FitbitService);
exports.FitbitService = FitbitService;
//# sourceMappingURL=fitbit.service.js.map