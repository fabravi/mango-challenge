export default class Range {
  min: number;
  max: number;
  value: { min: number; max: number };
  steps: number[];
  range: number;
  activeThumb: "min" | "max" | null = null;

  constructor(
    min: number,
    max: number,
    value: { min: number; max: number },
    steps: number[],
  ) {
    this.min = min;
    this.max = max;
    this.value = value;
    this.steps = steps.length ? [min, ...steps, max] : [];
    this.range = max - min;
  }

  setActiveThumb(thumb: "min" | "max" | null) {
    this.activeThumb = thumb;
  }

  getCloserThumb(x: number) {
    const { min, max } = this.value;
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
    const distances = this.steps.map((step) => Math.abs(x - step));
    const minDistance = Math.min(...distances);
    return this.steps[distances.indexOf(minDistance)];
  }

  setThumbValue(x: number) {
    if (!this.activeThumb) return;
    const thumb = this.activeThumb;
    if (x < this.min) {
      this.value[thumb] = this.min;
      return;
    }
    if (x > this.max) {
      this.value[thumb] = this.max;
      return;
    }
    if (thumb === "min" && x > this.value.max) {
      console.log("min > max");
      this.value[thumb] = this.value.max;
      return;
    }
    if (thumb === "max" && x < this.value.min) {
      console.log("max > min");
      this.value[thumb] = this.value.min;
      return;
    }
    if (this.steps.length) {
      const step = this.getCloserStep(x);
      this.value[thumb] = step;
      return;
    }
    this.value[thumb] = x;
  }
}
