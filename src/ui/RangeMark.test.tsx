import { render } from "@testing-library/react";
import RangeMark from "./RangeMark";

describe("RangeMark", () => {
  test("should render correctly", () => {
    const { container } = render(<RangeMark left={0} />);
    expect(container).toMatchSnapshot();
  });

  test("should render the mark with the correct left position", () => {
    const { container } = render(<RangeMark left={50} />);
    const mark = container.querySelector("span");
    expect(mark).toHaveStyle("left: 50%");
  });
});
