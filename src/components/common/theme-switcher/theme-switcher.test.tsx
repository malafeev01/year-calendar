import { act, render, screen, waitFor } from "@testing-library/react";
import { mockLocation } from "../../../common/mocks/window-mocks";

import { IndexMock } from "../../../index.mock";

import ThemeSwitcher from "./theme-switcher";

test("Theme swithcher renders and ready to work", async () => {
  mockLocation();

  render(
    <IndexMock>
      <ThemeSwitcher />
    </IndexMock>
  );

  expect(screen.getByTestId("theme_switcher_icon").textContent).toBe("🌞");

  act(() => screen.getByTestId("theme_switcher").click());
  expect(screen.getByTestId("theme_switcher_icon").textContent).toBe("🌚");

  act(() => screen.getByTestId("theme_switcher").click());
  expect(screen.getByTestId("theme_switcher_icon").textContent).toBe("🌞");
});
