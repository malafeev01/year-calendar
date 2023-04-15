import { render, waitFor } from "@testing-library/react";
import { ApiMock } from "../../api/google-api.mock";
import { mockLocation, mockMatchMedia } from "../../common/mocks/window-mocks";
import { IndexMock } from "../../index.mock";
import ProfilePage from "./profile-page";

beforeEach(() => {
  mockMatchMedia();
  mockLocation();
});

test("Profile page will redirect to '/' in case of not logged in", async () => {
  window.location.href = "/profile";
  render(
    <IndexMock>
      <ProfilePage />
    </IndexMock>
  );

  await waitFor(() => {
    expect(window.location.href).toBe("/");
  });
});

test("Profile page renders and ready to work", async () => {
  const api = new ApiMock();
  api.session = { name: "test" };

  window.location.href = "/profile";

  const { container } = render(
    <IndexMock api={api}>
      <ProfilePage />
    </IndexMock>
  );

  await waitFor(() => {
    expect(window.location.href).toBe("/profile");
    expect(api.isSignedIn).toHaveBeenCalled();
    expect(container.getElementsByClassName("navbar").length).not.toBe(0);
  });
});
