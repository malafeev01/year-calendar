import { render, screen } from "@testing-library/react";

import Bubbles from "./bubbles";

test("Bubbles renders and ready to work", async () => {
  render(<Bubbles />);

  expect(screen.getByTestId("bubbles_container")).toBeInTheDocument();

  await new Promise<void>((res) =>
    setTimeout(() => {
      expect(document.querySelector(".bubble")).toBeInTheDocument();
      res();
    }, 2000)
  );
});

test("Bubbles renders and ready to work(small screen)", async () => {
  Object.defineProperty(window, "innerWidth", {
    value: 800,
    writable: true,
  });

  render(<Bubbles />);

  expect(screen.getByTestId("bubbles_container")).toBeInTheDocument();

  await new Promise<void>((res) =>
    setTimeout(() => {
      expect(document.querySelector(".bubble")).toBeInTheDocument();
      res();
    }, 2000)
  );
});
