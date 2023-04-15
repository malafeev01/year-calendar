import { render, screen, waitFor } from "@testing-library/react";

import { ApiMock } from "../../api/google-api.mock";
import StartPage from "./start-page";
import { IndexMock } from "../../index.mock";
import { mockLocation } from "../../common/mocks/window-mocks";

test("Start page renders as not logged in", async () => {
  const api = new ApiMock();
  render(
    <IndexMock api={api}>
      <StartPage />
    </IndexMock>
  );

  await waitFor(() => {
    const loginBtn = screen.getByText(/Sign up with Google/);
    expect(loginBtn).toBeInTheDocument();
    loginBtn.click();
    expect(api.signIn).toHaveBeenCalled();
  });
});

test("Start page renders with logged in user", async () => {
  mockLocation();

  const api = new ApiMock();
  api.session = { name: "test" };
  render(
    <IndexMock api={api}>
      <StartPage />
    </IndexMock>
  );

  await waitFor(() => {
    const profileBtn = screen.getByText(/Go to Profile/);
    expect(profileBtn).toBeInTheDocument();
    profileBtn.click();
    expect(window.location.href).toBe("/profile");
  });
});
