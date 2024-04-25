import { render } from "@testing-library/react";
import Exercise1 from "./Exercise1";

describe("Exercise1", () => {
  test("should render correctly", () => {
    const { container } = render(<Exercise1 min={0} max={100} />);
    expect(container).toMatchSnapshot();
  });
});
