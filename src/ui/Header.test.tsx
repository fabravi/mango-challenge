import { render } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  test("should render correctly", () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });

  test("should render links", () => {
    const { container } = render(<Header />);
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(3);
  });
});
