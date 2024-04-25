import { render } from "@testing-library/react";
import RangeRail from "./RangeRail";

describe("RangeRail", () => {
  test("should render correctly", () => {
    const { container } = render(<RangeRail />);
    expect(container).toMatchSnapshot();
  });

  test("should render the rail", () => {
    const { container } = render(<RangeRail />);
    const rail = container.querySelector("span");
    expect(rail).toHaveClass("rail");
  });
});
