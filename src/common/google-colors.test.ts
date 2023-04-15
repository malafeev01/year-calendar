import { getGoogleColorById } from "./google-colors";

test("Can get colors", () => {
  expect(getGoogleColorById("dark", 1)).toBe("#384259");
  expect(getGoogleColorById("light", 3)).toBe("#dbadff");
});
