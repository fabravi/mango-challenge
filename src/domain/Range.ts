export default class Range {
  private _min: number;
  private _max: number;
  private _value: { min: number; max: number };
  private _steps: number[];
  private _activeThumb: "min" | "max" | null = null;

  constructor(
    min: number,
    max: number,
    value: { min: number; max: number },
    steps: number[],
  ) {
    this._min = min;
    this._max = max;
    this._value = value;
    this._steps = steps || [];
  }

  private _clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  private _getNextStep(
    step: number,
    thumb: "min" | "max",
    direction: "up" | "down",
  ) {
    const index = this._steps.indexOf(step);
    const value =
      direction === "up"
        ? this._steps[index + 1] || this._max
        : this._steps[index - 1] || this._min;
    if (thumb === "min") {
      return this._clamp(value, this._min, this._value.max);
    }
    if (thumb === "max") {
      return this._clamp(value, this._value.min, this._max);
    }
    return value;
  }

  private _getNextPosition(thumb: "min" | "max", direction: "up" | "down") {
    let value =
      direction === "up" ? this._value[thumb] + 1 : this._value[thumb] - 1;
    if (thumb === "min") {
      value = this._clamp(value, this._min, this._value.max);
    }
    if (thumb === "max") {
      value = this._clamp(value, this._value.min, this._max);
    }
    return value;
  }

  getCloserThumb(x: number) {
    const { min, max } = this._value;
    const distanceToMin = Math.abs(x - min);
    const distanceToMax = Math.abs(x - max);
    if (distanceToMin === distanceToMax) {
      return x < min ? "min" : "max";
    }
    return distanceToMin < distanceToMax ? "min" : "max";
  }

  setCloserThumbActive(x: number) {
    const thumb = this.getCloserThumb(x);
    this._activeThumb = thumb;
  }

  getCloserStep(x: number) {
    const distances = this._steps.map((step) => Math.abs(x - step));
    const minDistance = Math.min(...distances);
    return this._steps[distances.indexOf(minDistance)];
  }

  nudgeThumbValueUp() {
    if (!this._activeThumb) return;
    const thumb = this._activeThumb;
    if (!this._steps.length) {
      this._value[thumb] = this._getNextPosition(thumb, "up");
      return;
    }
    this._value[thumb] = this._getNextStep(this.value[thumb], thumb, "up");
  }

  nudgeThumbValueDown() {
    if (!this._activeThumb) return;
    const thumb = this._activeThumb;
    if (!this._steps.length) {
      this._value[thumb] = this._getNextPosition(thumb, "down");
      return;
    }
    this._value[thumb] = this._getNextStep(this.value[thumb], thumb, "down");
  }

  setThumbValue(x: number) {
    if (!this._activeThumb) return;
    const thumb = this._activeThumb;
    let step;
    if (this._steps.length) {
      step = this.getCloserStep(x);
    }
    let value = step || x;
    if (thumb === "min") {
      value = this._clamp(value, this._min, this._value.max);
    }
    if (thumb === "max") {
      value = this._clamp(value, this._value.min, this._max);
    }
    this._value[thumb] = step ? step : Math.round(value);
  }

  get activeThumb() {
    return this._activeThumb;
  }

  set activeThumb(thumb: "min" | "max" | null) {
    this._activeThumb = thumb;
  }

  get value() {
    return this._value;
  }
}
