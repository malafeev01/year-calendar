import { render, screen, waitFor } from "@testing-library/react";
import { ApiMock } from "./api/google-api.mock";
import App from "./App";
import { IndexMock } from "./index.mock";

test("Home screen renders and ready to work", async () => {
  render(
    <IndexMock>
      <App />
    </IndexMock>
  );

  await waitFor(() => {
    expect(screen.getByText(/Why you may like it/)).toBeInTheDocument();
  });
});

test("Show unknown error when getting session", async () => {
  const apiMock = new ApiMock();
  apiMock.getSession = jest.fn(() =>
    Promise.reject("error during getting session")
  );

  render(
    <IndexMock api={apiMock}>
      <App />
    </IndexMock>
  );

  await waitFor(() => {
    expect(
      screen.getByText(/error during getting session/)
    ).toBeInTheDocument();
  });
});

test("Show error when getting session", async () => {
  const apiMock = new ApiMock();
  apiMock.getSession = jest.fn(() =>
    Promise.reject({
      result: {
        error: {
          code: 500,
          message: "known error during getting session",
        },
      },
    })
  );

  render(
    <IndexMock api={apiMock}>
      <App />
    </IndexMock>
  );

  await waitFor(() => {
    expect(
      screen.getByText(/known error during getting session/)
    ).toBeInTheDocument();
  });
});
