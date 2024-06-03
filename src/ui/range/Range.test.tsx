import { act, fireEvent, render } from "@testing-library/react";
import Range from "./Range";

describe("Range", () => {
  test("should render correctly", () => {
    const { container } = render(
      <Range
        min={0}
        max={100}
        value={{ min: 0, max: 100 }}
        onChange={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test("should render the range input", () => {
    const { container } = render(
      <Range
        min={0}
        max={100}
        value={{ min: 0, max: 100 }}
        onChange={jest.fn()}
      />,
    );
    const input = container.querySelectorAll("input");
    expect(input).toHaveLength(2);
  });

  test("should render the range track", () => {
    const { container } = render(
      <Range
        min={0}
        max={100}
        value={{ min: 0, max: 100 }}
        onChange={jest.fn()}
      />,
    );
    const track = container.querySelector("span.track");
    expect(track).toBeInTheDocument();
  });

  test("should render the range track with the correct width", () => {
    jest.useFakeTimers();
    const onChange = jest.fn();

    const { container, getByTestId } = render(
      <Range
        min={0}
        max={100}
        value={{ min: 0, max: 100 }}
        onChange={onChange}
      />,
    );

    const track = container.querySelector("span.track");
    expect(track).toHaveStyle("width: 100%");

    const input = getByTestId("min");

    act(() => {
      fireEvent.change(input, { target: { value: 50 } });
      jest.runAllTimers();
    });

    expect(onChange).toHaveBeenCalledWith({ min: 50, max: 100 });
    expect(track).toHaveStyle("width: 50%");
    expect(track).toHaveStyle("left: 50%");
  });

  test("should render the range marks", () => {
    const { container } = render(
      <Range
        min={0}
        max={100}
        value={{ min: 0, max: 100 }}
        marks={[0, 50, 100]}
        onChange={jest.fn()}
      />,
    );
    const mark = container.querySelectorAll("span.mark");
    expect(mark).toHaveLength(3);
    expect(mark[0]).toHaveStyle("left: 0%");
    expect(mark[1]).toHaveStyle("left: 50%");
    expect(mark[2]).toHaveStyle("left: 100%");
  });

  test("should render the range rail", () => {
    const { container } = render(
      <Range
        min={0}
        max={100}
        value={{ min: 0, max: 100 }}
        onChange={jest.fn()}
      />,
    );
    const rail = container.querySelector("span.rail");
    expect(rail).toBeInTheDocument();
  });

  test("should render the thumbs on the correct positions", () => {
    const { queryAllByRole } = render(
      <Range
        min={0}
        max={1000}
        value={{ min: 250, max: 750 }}
        onChange={jest.fn()}
      />,
    );
    const thumbs = queryAllByRole("slider-thumb");
    expect(thumbs).toHaveLength(2);

    expect(thumbs[0]).toHaveStyle("left: 25%");
    expect(thumbs[1]).toHaveStyle("left: 75%");
  });

  test("should adjust thumbs positions to any value", () => {
    const onChange = jest.fn();
    const randomValues = Array.from(
      { length: 4 },
      () => Math.random() * 100,
    ).sort((a, b) => a - b);

    const min = randomValues[0];
    const max = randomValues[3];
    const value = { min: randomValues[1], max: randomValues[2] };

    const { queryAllByRole } = render(
      <Range min={min} max={max} value={value} onChange={onChange} />,
    );

    const thumbs = queryAllByRole("slider-thumb");
    expect(thumbs).toHaveLength(2);

    expect(thumbs[0]).toHaveStyle(
      `left: ${((value.min - min) / (max - min)) * 100}%`,
    );
    expect(thumbs[1]).toHaveStyle(
      `left: ${((value.max - min) / (max - min)) * 100}%`,
    );
  });
});
