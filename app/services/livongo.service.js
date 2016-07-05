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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var livongo_repo_1 = require("../repo/livongo.repo");
var LivongoService = (function () {
    function LivongoService(http, livongoRepository) {
        this.http = http;
        this.livongoRepository = livongoRepository;
    }
    LivongoService.prototype.authorize = function () {
        this.livongoRepository.authorize("barevalo@livongo.com", "CAMera14").then(function (auth) {
            return auth;
        });
    };
    LivongoService.prototype.getReadings = function (start, end) {
        var _this = this;
        return this.livongoRepository.getReadings(start, end).then(function (readings) {
            _this.bgReadings = readings;
            return readings;
        });
    };
    LivongoService = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject(livongo_repo_1.LivongoRepository)), 
        __metadata('design:paramtypes', [http_1.Http, livongo_repo_1.LivongoRepository])
    ], LivongoService);
    return LivongoService;
}());
exports.LivongoService = LivongoService;
//# sourceMappingURL=livongo.service.js.map