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
    this._steps = steps.length ? [min, ...steps, max] : [];
  }

  setActiveThumb(thumb: "min" | "max" | null) {
    this._activeThumb = thumb;
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
    this.setActiveThumb(thumb);
  }

  getCloserStep(x: number) {
    const distances = this._steps.map((step) => Math.abs(x - step));
    const minDistance = Math.min(...distances);
    return this._steps[distances.indexOf(minDistance)];
  }

  setThumbValue(x: number) {
    if (!this._activeThumb) return;
    const thumb = this._activeThumb;
    if (x < this._min) {
      this._value[thumb] = this._min;
      return;
    }
    if (x > this._max) {
      this._value[thumb] = this._max;
      return;
    }
    if (thumb === "min" && x > this._value.max) {
      this._value[thumb] = this._value.max;
      return;
    }
    if (thumb === "max" && x < this._value.min) {
      this._value[thumb] = this._value.min;
      return;
    }
    if (this._steps.length) {
      const step = this.getCloserStep(x);
      this._value[thumb] = step;
      return;
    }
    this._value[thumb] = x;
  }

  get activeThumb() {
    return this._activeThumb;
  }

  set activeThumb(value) {
    this._activeThumb = value;
  }

  get value() {
    return this._value;
  }
}
