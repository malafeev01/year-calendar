export function getCurrentTheme() {
  let currentTheme = localStorage.getItem("theme");
  if (!currentTheme) {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    } else {
      return "light";
    }
  }

  return currentTheme;
}
