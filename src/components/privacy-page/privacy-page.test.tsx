import { render, screen, waitFor } from "@testing-library/react";
import { IndexMock } from "../../index.mock";
import PrivacyPage from "./privacy-page";

test("Privacy renders and ready to work", async () => {
  render(
    <IndexMock>
      <PrivacyPage />
    </IndexMock>
  );

  await waitFor(() => {
    expect(screen.getAllByText(/Privacy Policy/)[0]).toBeInTheDocument();
  });
});
