export class FitbitIntraDayData {
  constructor(public type: String, public timestamp: String, public value: number) {}
}

export class FitbitIntraDayDataSet {
  constructor(public set: FitbitIntraDayData[]) {}
}
