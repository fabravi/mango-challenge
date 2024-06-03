import { render } from "@testing-library/react";
import RangeTrack from "./RangeTrack";

describe("RangeTrack", () => {
  test("should render correctly", () => {
    const { container } = render(<RangeTrack left={0} width={100} />);
    expect(container).toMatchSnapshot();
  });

  test("should render the track with the correct left position and width", () => {
    const { container } = render(<RangeTrack left={50} width={50} />);
    const track = container.querySelector("span");
    expect(track).toHaveStyle("left: 50%");
    expect(track).toHaveStyle("width: 50%");
  });
});
