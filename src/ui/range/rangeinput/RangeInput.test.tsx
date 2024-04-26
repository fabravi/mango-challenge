import { render, fireEvent, act } from "@testing-library/react";
import RangeInput from "./RangeInput";

describe("RangeInput", () => {
  jest.useFakeTimers();
  test("renders without errors", () => {
    render(
      <RangeInput
        name="test"
        value={0}
        min={0}
        max={100}
        onChange={() => {}}
        readOnly={false}
      />,
    );
  });

  test("debounces input change", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <RangeInput
        name="test"
        value={0}
        min={0}
        max={100}
        onChange={onChange}
        readOnly={false}
      />,
    );
    const input = getByTestId("test") as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: "50" } });
    });

    expect(onChange).not.toHaveBeenCalledWith(50);
  });

  test("updates value on input change", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <RangeInput
        name="test"
        value={0}
        min={0}
        max={100}
        onChange={onChange}
        readOnly={false}
      />,
    );
    const input = getByTestId("test") as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: "50" } });
      jest.runAllTimers();
    });

    expect(input.value).toBe("50");
    expect(onChange).toHaveBeenCalledWith(50);
  });

  test("resets value on blur if empty", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <RangeInput
        name="test"
        value={20}
        min={0}
        max={100}
        onChange={onChange}
        readOnly={false}
      />,
    );
    const input = getByTestId("test") as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: "" } });
      fireEvent.blur(input);
      jest.runAllTimers();
    });

    expect(input.value).toBe("20.00");
    expect(onChange).not.toHaveBeenCalled();
  });

  test("does not update value if invalid", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <RangeInput
        name="test"
        value={0}
        min={0}
        max={50}
        onChange={onChange}
        readOnly={false}
      />,
    );
    const input = getByTestId("test") as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: "60" } });
      jest.runAllTimers();
    });

    expect(input.value).toBe("60");
    expect(onChange).not.toHaveBeenCalled();

    expect(input.className).toContain("error");
  });
});
