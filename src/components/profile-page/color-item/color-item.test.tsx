import ColorItem from "./color-item";
import { render } from "@testing-library/react";

test("ColorItem component can be rendered", async () => {
  const { container } = render(
    <ColorItem color="white" colorId={1}></ColorItem>
  );
  const element = container.getElementsByTagName("div")[0];

  expect(element.className).toBe("color-item");
  expect(element.style.background).toBe("white");
});
