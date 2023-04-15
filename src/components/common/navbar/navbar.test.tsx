import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ApiMock } from "../../../api/google-api.mock";
import {
  mockLocation,
  mockWindowHistory,
} from "../../../common/mocks/window-mocks";

import { IndexMock } from "../../../index.mock";
import NavBar from "./navbar";

beforeAll(() => {
  mockLocation();
  mockWindowHistory();
});

test("Navbars renders and ready to work(home)", async () => {
  Object.defineProperty(document.body, "scrollWidth", {
    value: 900,
    writable: true,
  });

  render(
    <IndexMock>
      <NavBar mode="home" />
    </IndexMock>
  );
  act(() => screen.getByTestId("navbar_about").click());
  expect(window.history.replaceState).toHaveBeenCalledWith(null, "", "/#about");

  act(() => screen.getByTestId("navbar_donate").click());
  expect(window.history.replaceState).toHaveBeenCalledWith(
    null,
    "",
    "/#donate"
  );

  act(() => screen.getByTestId("navbar_contacts").click());
  expect(window.history.replaceState).toHaveBeenCalledWith(
    null,
    "",
    "/#contacts"
  );

  act(() => screen.getByTestId("navbar_privacy_policy").click());
  expect(window.location.href).toBe("/privacy");
});

test("Navbars renders and ready to work(small screen)", async () => {
  Object.defineProperty(document.body, "scrollWidth", {
    value: 500,
    writable: true,
  });

  fireEvent.resize(window);

  render(
    <IndexMock>
      <NavBar mode="home" />
    </IndexMock>
  );
  const sidebarIcon = screen.getByTestId("show_sidebar_icon");
  expect(sidebarIcon).toBeInTheDocument();

  act(() => sidebarIcon.click());

  expect(screen.getByTestId("sidebar").className).toBe("sidebar sidebar-show");
});

test("User can login using navbar", async () => {
  const apiMock = new ApiMock();
  render(
    <IndexMock api={apiMock}>
      <NavBar mode="home" />
    </IndexMock>
  );

  act(() => screen.getByTestId("navbar_login").click());
  expect(apiMock.signIn).toHaveBeenCalled();
});

test("User can go to profile", async () => {
  const apiMock = new ApiMock();
  apiMock.isSignedIn = jest.fn(() => true);

  render(
    <IndexMock api={apiMock}>
      <NavBar mode="home" />
    </IndexMock>
  );

  act(() => screen.getByTestId("navbar_profile").click());
  expect(window.location.href).toBe("/profile");
});

test("User can go to home", async () => {
  const apiMock = new ApiMock();
  apiMock.isSignedIn = jest.fn(() => true);

  render(
    <IndexMock api={apiMock}>
      <NavBar mode="profile" />
    </IndexMock>
  );

  act(() => screen.getByText(/test/).click());
  waitFor(() =>
    expect(
      screen.getByTestId("navbar_profile_dropdown_home")
    ).toBeInTheDocument()
  );

  act(() => screen.getByTestId("navbar_profile_dropdown_home").click());
  expect(window.location.href).toBe("/");
});

test("Can go to slide from any location", async () => {
  Object.defineProperty(document.body, "scrollWidth", {
    value: 900,
    writable: true,
  });

  Object.defineProperty(window.location, "pathname", {
    value: "/test",
    writable: true,
  });

  render(
    <IndexMock>
      <NavBar mode="home" />
    </IndexMock>
  );
  act(() => screen.getByTestId("navbar_about").click());
  expect(window.history.replaceState).not.toHaveBeenCalled();
  expect(window.location.href).toBe("/#about");
});
