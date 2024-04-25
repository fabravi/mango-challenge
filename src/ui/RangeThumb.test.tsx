import { render } from "@testing-library/react";
import RangeThumb from "./RangeThumb";

describe("RangeThumb", () => {
  test("should render correctly", () => {
    const { container } = render(
      <RangeThumb left={30} isActive={true} setActive={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });

  test("should render the thumb", () => {
    const { container } = render(
      <RangeThumb left={30} isActive={true} setActive={jest.fn()} />,
    );
    const thumb = container.querySelector("span");
    expect(thumb).toHaveClass("thumb");
  });

  test("should render the thumb with the correct left position", () => {
    const { container } = render(
      <RangeThumb left={30} isActive={true} setActive={jest.fn()} />,
    );
    const thumb = container.querySelector("span");
    expect(thumb).toHaveStyle("left: 30%");
  });

  test("should render the thumb with the active class", () => {
    const { container } = render(
      <RangeThumb left={30} isActive={true} setActive={jest.fn()} />,
    );
    const thumb = container.querySelector("span");
    expect(thumb).toHaveClass("thumb hover");
  });
});
