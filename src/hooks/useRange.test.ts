import { renderHook, act, fireEvent } from "@testing-library/react";
import useRange from "./useRange";
import { Thumbs } from "@/types/Thumbs";

describe("useRange Hook", () => {
  test("should return an object with the expected properties", () => {
    const { result } = renderHook(() =>
      useRange({ min: 0, max: 100 }, 0, 100, [], jest.fn()),
    );

    expect(result.current).toHaveProperty("rangeRef");
    expect(result.current).toHaveProperty("value");
    expect(result.current).toHaveProperty("activeThumb");
    expect(result.current).toHaveProperty("onInputChange");
    expect(result.current).toHaveProperty("setActive");
    expect(result.current).toHaveProperty("getPosition");
  });

  test("should update the value when calling onInputChange", () => {
    const { result } = renderHook(() =>
      useRange({ min: 0, max: 100 }, 0, 100, [], jest.fn()),
    );

    act(() => {
      result.current.onInputChange(Thumbs.MAX, 50);
      result.current.onInputChange(Thumbs.MIN, 30);
    });

    expect(result.current.value).toEqual({ min: 30, max: 50 });
  });

  test("should return the correct position when calling getPosition", () => {
    const { result } = renderHook(() =>
      useRange({ min: 0, max: 30 }, 0, 30, [], jest.fn()),
    );

    expect(result.current.getPosition(15)).toBe(50);
  });

  describe("events", () => {
    const rangeDiv = document.createElement("div");

    test("should handle mousedown event", () => {
      const { result } = renderHook(() =>
        useRange({ min: 0, max: 100 }, 0, 100, [0, 25, 50, 75, 100], jest.fn()),
      );

      jest.spyOn(result.current.rangeInstanceRef, "setThumbValue");
      jest.spyOn(result.current, "updateValue").mockImplementation(jest.fn());
      jest
        .spyOn(result.current, "switchTransitionStyles")
        .mockImplementation(jest.fn());

      expect(result.current.rangeInstanceRef.activeThumb).toBe(null);

      act(() => {
        const { mousedown } = result.current.getHandlers(
          0,
          400,
          rangeDiv,
          result.current.updateValue,
          result.current.switchTransitionStyles,
        ).range;
        mousedown({
          clientX: 100,
          preventDefault: jest.fn(),
        } as unknown as MouseEvent);
      });

      expect(
        result.current.rangeInstanceRef.setThumbValue,
      ).toHaveBeenCalledWith(25);

      expect(result.current.updateValue).toHaveBeenCalledWith({
        min: 25,
        max: 100,
      });

      expect(result.current.switchTransitionStyles).toHaveBeenCalledWith("add");
    });

    test("should handle mousemove event", () => {
      const { result } = renderHook(() =>
        useRange({ min: 0, max: 100 }, 0, 100, [0, 25, 50, 75, 100], jest.fn()),
      );

      expect(result.current.rangeInstanceRef.activeThumb).toBe(null);

      jest.spyOn(result.current.rangeInstanceRef, "getCloserThumb");

      act(() => {
        const { mousemove } = result.current.getHandlers(
          0,
          400,
          rangeDiv,
          result.current.updateValue,
        ).range;
        mousemove({
          clientX: 100,
          preventDefault: jest.fn(),
        } as unknown as MouseEvent);
      });

      expect(
        result.current.rangeInstanceRef.getCloserThumb,
      ).toHaveBeenCalledWith(25);
    });

    test("should handle mouseleave event", () => {
      const { result } = renderHook(() =>
        useRange({ min: 0, max: 100 }, 0, 100, [0, 25, 50, 75, 100], jest.fn()),
      );

      jest.spyOn(result.current.rangeInstanceRef, "getCloserThumb");

      expect(result.current.rangeInstanceRef.activeThumb).toBe(null);

      act(() => {
        const { mouseleave } = result.current.getHandlers(
          0,
          400,
          rangeDiv,
          result.current.updateValue,
        ).range;
        mouseleave({
          preventDefault: jest.fn(),
        } as unknown as MouseEvent);
      });

      expect(result.current.activeThumb).toBe(null);
    });

    test("should handle document mousemove event", () => {
      const { result } = renderHook(() =>
        useRange({ min: 0, max: 100 }, 0, 100, [0, 25, 50, 75, 100], jest.fn()),
      );

      jest.spyOn(result.current.rangeInstanceRef, "setThumbValue");
      jest.spyOn(result.current, "updateValue").mockImplementation(jest.fn());

      act(() => {
        result.current.rangeInstanceRef.setCloserThumbActive(25);
        const { mousemove } = result.current.getHandlers(
          0,
          400,
          rangeDiv,
          result.current.updateValue,
        ).document;
        mousemove({
          clientX: 100,
          preventDefault: jest.fn(),
        } as unknown as MouseEvent);
      });

      expect(
        result.current.rangeInstanceRef.setThumbValue,
      ).toHaveBeenCalledWith(25);

      expect(result.current.updateValue).toHaveBeenCalledWith({
        min: 25,
        max: 100,
      });
    });

    test("should handle document keydown:ArrowRight event", () => {
      const { result } = renderHook(() =>
        useRange({ min: 0, max: 100 }, 0, 100, [0, 25, 50, 75, 100], jest.fn()),
      );

      act(() => {
        result.current.rangeInstanceRef.setCloserThumbActive(25);

        jest.spyOn(result.current.rangeInstanceRef, "nudgeThumbValueUp");
        jest.spyOn(result.current, "updateValue").mockImplementation(jest.fn());

        const { keydown } = result.current.getHandlers(
          0,
          400,
          rangeDiv,
          result.current.updateValue,
        ).document;
        keydown({
          key: "ArrowRight",
        } as KeyboardEvent);
      });

      expect(
        result.current.rangeInstanceRef.nudgeThumbValueUp,
      ).toHaveBeenCalledTimes(1);

      expect(result.current.updateValue).toHaveBeenCalledWith({
        min: 25,
        max: 100,
      });
    });

    test("should handle document keydown:ArrowLeft event", () => {
      const { result } = renderHook(() =>
        useRange({ min: 0, max: 100 }, 0, 100, [0, 25, 50, 75, 100], jest.fn()),
      );

      act(() => {
        result.current.rangeInstanceRef.setCloserThumbActive(75);

        jest.spyOn(result.current.rangeInstanceRef, "nudgeThumbValueDown");
        jest.spyOn(result.current, "updateValue").mockImplementation(jest.fn());

        const { keydown } = result.current.getHandlers(
          0,
          400,
          rangeDiv,
          result.current.updateValue,
        ).document;
        keydown({
          key: "ArrowLeft",
        } as KeyboardEvent);
      });

      expect(
        result.current.rangeInstanceRef.nudgeThumbValueDown,
      ).toHaveBeenCalledTimes(1);

      expect(result.current.updateValue).toHaveBeenCalledWith({
        min: 0,
        max: 75,
      });
    });
  });
});
