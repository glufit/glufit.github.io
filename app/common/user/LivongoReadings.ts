export class BgReading {
  constructor(public datetime: string, public value: number) {}
}

export class BgReadings {
  constructor(public readings: BgReading[]) {}
}
