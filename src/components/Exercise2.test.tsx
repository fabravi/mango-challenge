import { render } from "@testing-library/react";
import Exercise2 from "./Exercise2";

describe("Exercise2", () => {
  const marks = [10, 20, 30, 40, 50];

  test("should render correctly", () => {
    const { container } = render(<Exercise2 marks={marks} />);
    expect(container).toMatchSnapshot();
  });

  test("should render the range input", () => {
    const { container } = render(<Exercise2 marks={marks} />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "number");
  });

  test("should render the range track", () => {
    const { container } = render(<Exercise2 marks={marks} />);
    const track = container.querySelector("span.track");
    expect(track).toBeInTheDocument();
  });

  test("should render the range mark", () => {
    const { container } = render(<Exercise2 marks={marks} />);
    const mark = container.querySelectorAll("span.mark");
    expect(mark).toHaveLength(5);
  });

  test("should render the range rail", () => {
    const { container } = render(<Exercise2 marks={marks} />);
    const rail = container.querySelector("span.rail");
    expect(rail).toBeInTheDocument();
  });

  test("should render the thumbs", () => {
    const { queryAllByRole } = render(<Exercise2 marks={marks} />);
    const thumbs = queryAllByRole("slider-thumb");
    expect(thumbs).toHaveLength(2);
  });
});
