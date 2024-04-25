import { Direction } from "@/types/Direction";
import Range from "./Range";
import { Thumbs } from "@/types/Thumbs";

describe("Range Class", () => {
  test("should create a new instance of Range", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    expect(range).toBeInstanceOf(Range);
  });

  test("should clamp a value between min and max", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    expect(range["_clamp"](50, 0, 100)).toBe(50);
    expect(range["_clamp"](150, 0, 100)).toBe(100);
    expect(range["_clamp"](-50, 0, 100)).toBe(0);
  });

  test("should get a clamped value based on thumb", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    expect(range["_getClampedValue"](50, Thumbs.MIN)).toBe(50);
    expect(range["_getClampedValue"](150, Thumbs.MAX)).toBe(100);
    expect(range["_getClampedValue"](-50, Thumbs.MIN)).toBe(0);
  });

  test("should get the next step based on direction", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, [0, 25, 50, 75, 100]);
    expect(range["_getNextStep"](50, Thumbs.MIN, Direction.UP)).toBe(75);
    expect(range["_getNextStep"](50, Thumbs.MIN, Direction.DOWN)).toBe(25);
  });

  test("should get the next position based on direction", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    expect(range["_getNextPosition"](Thumbs.MIN, Direction.UP)).toBe(1);
    expect(range["_getNextPosition"](Thumbs.MAX, Direction.DOWN)).toBe(99);
  });

  test("should get block the min thumb from going over the max thumb", () => {
    const range = new Range(0, 100, { min: 450, max: 50 }, []);
    expect(range["_getNextStep"](50, Thumbs.MIN, Direction.UP)).toBe(50);
  });

  test("should get block the min thumb from going over the max thumb with steps", () => {
    const range = new Range(0, 100, { min: 0, max: 50 }, [0, 25, 50, 75, 100]);
    expect(range["_getNextStep"](50, Thumbs.MIN, Direction.UP)).toBe(50);
  });

  test("should get block the max thumb from going over the min thumb", () => {
    const range = new Range(0, 100, { min: 50, max: 50 }, []);
    expect(range["_getNextStep"](50, Thumbs.MAX, Direction.DOWN)).toBe(50);
  });

  test("should get block the max thumb from going over the min thumb with steps", () => {
    const range = new Range(0, 100, { min: 50, max: 50 }, [0, 25, 50, 75, 100]);
    expect(range["_getNextStep"](50, Thumbs.MAX, Direction.DOWN)).toBe(50);
  });

  test("should get the closer thumb based on x position", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    expect(range.getCloserThumb(25)).toBe(Thumbs.MIN);
    expect(range.getCloserThumb(75)).toBe(Thumbs.MAX);
  });

  test("should get the closer thumb based on x position when they are equidistant", () => {
    const range = new Range(0, 100, { min: 50, max: 50 }, []);
    expect(range.getCloserThumb(49)).toBe(Thumbs.MIN);
    expect(range.getCloserThumb(51)).toBe(Thumbs.MAX);
  });

  test("should get the closer thumb based on x position when they are equidistant with steps", () => {
    const range = new Range(0, 100, { min: 50, max: 50 }, [0, 25, 50, 75, 100]);
    expect(range.getCloserThumb(49)).toBe(Thumbs.MIN);
    expect(range.getCloserThumb(51)).toBe(Thumbs.MAX);
  });

  test("should set the active thumb", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    range.activeThumb = Thumbs.MIN;
    expect(range.activeThumb).toBe(Thumbs.MIN);
  });

  test("should set the thumb value", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    range.activeThumb = Thumbs.MIN;
    range.setThumbValue(25);
    range.activeThumb = Thumbs.MAX;
    range.setThumbValue(75);
    expect(range.value.min).toBe(25);
    expect(range.value.max).toBe(75);
  });

  test("should set the thumb value with steps", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, [0, 25, 50, 75, 100]);
    range.activeThumb = Thumbs.MIN;
    range.setThumbValue(25);
    range.activeThumb = Thumbs.MAX;
    range.setThumbValue(75);
    expect(range.value.min).toBe(25);
    expect(range.value.max).toBe(75);
  });

  test("should prevent min go beyond max", () => {
    const range = new Range(0, 100, { min: 50, max: 50 }, []);
    range.activeThumb = Thumbs.MIN;
    range.setThumbValue(75);
    expect(range.value.min).toBe(50);
  });

  test("should prevent min go beyond max with steps", () => {
    const range = new Range(0, 100, { min: 50, max: 50 }, [0, 25, 50, 75, 100]);
    range.activeThumb = Thumbs.MIN;
    range.setThumbValue(75);
    expect(range.value.min).toBe(50);
  });

  test("should prevent max go beyond min", () => {
    const range = new Range(0, 100, { min: 50, max: 50 }, []);
    range.activeThumb = Thumbs.MAX;
    range.setThumbValue(25);
    expect(range.value.max).toBe(50);
  });

  test("should prevent max go beyond min with steps", () => {
    const range = new Range(0, 100, { min: 50, max: 50 }, [0, 25, 50, 75, 100]);
    range.activeThumb = Thumbs.MAX;
    range.setThumbValue(25);
    expect(range.value.max).toBe(50);
  });

  test("should nudge the min thumb value up", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    range.activeThumb = Thumbs.MIN;
    range.setThumbValue(25);
    range.nudgeThumbValueUp();
    expect(range.value.min).toBe(26);
  });

  test("should nudge the min thumb value down", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    range.activeThumb = Thumbs.MIN;
    range.setThumbValue(25);
    range.nudgeThumbValueDown();
    expect(range.value.min).toBe(24);
  });

  test("should nudge the min thumb value up with steps", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, [0, 25, 50, 75, 100]);
    range.activeThumb = Thumbs.MIN;
    range.setThumbValue(25);
    range.nudgeThumbValueUp();
    expect(range.value.min).toBe(50);
  });

  test("should nudge the min thumb value down with steps", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, [0, 25, 50, 75, 100]);
    range.activeThumb = Thumbs.MIN;
    range.setThumbValue(50);
    range.nudgeThumbValueDown();
    expect(range.value.min).toBe(25);
  });

  test("should nudge the max thumb value up", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    range.activeThumb = Thumbs.MAX;
    range.setThumbValue(25);
    range.nudgeThumbValueUp();
    expect(range.value.max).toBe(26);
  });

  test("should nudge the max thumb value down", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    range.activeThumb = Thumbs.MAX;
    range.setThumbValue(25);
    range.nudgeThumbValueDown();
    expect(range.value.max).toBe(24);
  });

  test("should nudge the max thumb value up with steps", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, [0, 25, 50, 75, 100]);
    range.activeThumb = Thumbs.MAX;
    range.setThumbValue(75);
    range.nudgeThumbValueUp();
    expect(range.value.max).toBe(100);
  });

  test("should nudge the max thumb value down with steps", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, [0, 25, 50, 75, 100]);
    range.activeThumb = Thumbs.MAX;
    range.setThumbValue(50);
    range.nudgeThumbValueDown();
    expect(range.value.max).toBe(25);
  });

  test("should set the closer thumb active", () => {
    const range = new Range(0, 100, { min: 0, max: 100 }, []);
    range.setCloserThumbActive(25);
    expect(range.activeThumb).toBe(Thumbs.MIN);
    range.setCloserThumbActive(75);
    expect(range.activeThumb).toBe(Thumbs.MAX);
  });
});
