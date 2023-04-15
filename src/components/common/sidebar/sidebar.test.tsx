import { act, render, screen, waitFor } from "@testing-library/react";
import {
  mockLocation,
  mockWindowHistory,
} from "../../../common/mocks/window-mocks";

import { IndexMock } from "../../../index.mock";
import SideBar from "./sidebar";

test("Sidebar renders and ready to work", async () => {
  mockLocation();
  mockWindowHistory();

  render(
    <IndexMock>
      <SideBar show={true} />
    </IndexMock>
  );

  act(() => screen.getByTestId("about").click());
  expect(window.history.replaceState).toHaveBeenCalledWith(null, "", "/#about");

  act(() => screen.getByTestId("donates").click());
  expect(window.history.replaceState).toHaveBeenCalledWith(
    null,
    "",
    "/#donate"
  );

  act(() => screen.getByTestId("contacts").click());
  expect(window.history.replaceState).toHaveBeenCalledWith(
    null,
    "",
    "/#contacts"
  );

  act(() => screen.getByTestId("privacy-policy").click());
  expect(window.location.href).toBe("/privacy");
});

test("Sidebar is not shown", async () => {
  mockLocation();

  render(
    <IndexMock>
      <SideBar show={false} />
    </IndexMock>
  );

  expect(screen.getByTestId("sidebar").className).toBe("sidebar sidebar-hide");
});
