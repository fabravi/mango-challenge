import { Direction } from "@/types/Direction";
import { Thumbs } from "@/types/Thumbs";
export default class Range {
  private _min: number;
  private _max: number;
  private _value: { min: number; max: number };
  private _steps: number[];
  private _activeThumb: Thumbs | null = null;

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

  private _getClampedValue(value: number, thumb: Thumbs) {
    let clamped = value;
    if (thumb === Thumbs.MIN) {
      clamped = this._clamp(value, this._min, this._value.max);
    }
    if (thumb === Thumbs.MAX) {
      clamped = this._clamp(value, this._value.min, this._max);
    }
    return clamped;
  }

  private _getNextStep(step: number, thumb: Thumbs, direction: Direction) {
    const index = this._steps.indexOf(step);
    const value =
      direction === "up"
        ? this._steps[index + 1] || this._max
        : this._steps[index - 1] || this._min;
    return this._getClampedValue(value, thumb);
  }

  private _getNextPosition(thumb: Thumbs, direction: Direction) {
    let value =
      direction === Direction.UP
        ? this._value[thumb] + 1
        : this._value[thumb] - 1;
    return this._getClampedValue(value, thumb);
  }

  getCloserThumb(x: number) {
    const { min, max } = this._value;
    const distanceToMin = Math.abs(x - min);
    const distanceToMax = Math.abs(x - max);
    if (distanceToMin === distanceToMax) {
      return x < min ? Thumbs.MIN : Thumbs.MAX;
    }
    return distanceToMin < distanceToMax ? Thumbs.MIN : Thumbs.MAX;
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

  private nudgedValue(thumb: Thumbs, direction: Direction) {
    if (!this._steps.length) {
      this._value[thumb] = this._getNextPosition(thumb, direction)!;
      return;
    }
    this._value[thumb] = this._getNextStep(
      this.value[thumb],
      thumb,
      direction,
    )!;
  }

  nudgeThumbValueUp() {
    if (!this._activeThumb) return;
    const thumb = this._activeThumb;
    this.nudgedValue(thumb, Direction.UP);
  }

  nudgeThumbValueDown() {
    if (!this._activeThumb) return;
    const thumb = this._activeThumb;
    this.nudgedValue(thumb, Direction.DOWN);
  }

  setThumbValue(x: number) {
    if (!this._activeThumb) return;
    const thumb = this._activeThumb;
    let step;
    if (this._steps.length) {
      step = this.getCloserStep(x);
    }
    let value = step || x;
    if (thumb === Thumbs.MIN) {
      value = this._clamp(value, this._min, this._value.max);
    }
    if (thumb === Thumbs.MAX) {
      value = this._clamp(value, this._value.min, this._max);
    }
    this._value[thumb] = step ? value : Math.round(value);
  }

  get activeThumb() {
    return this._activeThumb;
  }

  set activeThumb(thumb: Thumbs | null) {
    this._activeThumb = thumb;
  }

  get value() {
    return this._value;
  }
}
