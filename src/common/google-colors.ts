export const LIGHT_COLORS: GoogleColors = {
  1: "#a4bdfc",
  2: "#7ae7bf",
  3: "#dbadff",
  4: "#ff887c",
  5: "#fbd75b",
  6: "#ffb878",
  7: "#46d6db",
  8: "#e1e1e1",
  9: "#5484ed",
  10: "#51b749",
  11: "#f6a8ab",
};

export const DARK_COLORS: GoogleColors = {
  1: "#384259",
  2: "#2e5e4d",
  3: "#45384f",
  4: "#5c312d",
  5: "#695b2a",
  6: "#66482d",
  7: "#206466",
  8: "#575757",
  9: "#21345c",
  10: "#214a1e",
  11: "#570f11",
};

type GoogleColors = { [key: number]: string };

/**
 * Getting color by id from Google API.
 */
export function getGoogleColorById(theme: string, colorId: number): string {
  if (theme === "dark") {
    return DARK_COLORS[colorId];
  }
  return LIGHT_COLORS[colorId];
}
