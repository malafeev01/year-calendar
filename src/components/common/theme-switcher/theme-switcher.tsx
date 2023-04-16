import "./theme-switcher.css";

import { useState } from "react";
import { useStore } from "react-redux";
import { setDark, setLight } from "../../../theme/theme-reducer";
import { getCurrentTheme } from "../../../theme/theme-utils";
import { ThemeStore } from "../../../theme/theme-provider";

export default function ThemeSwitcher() {
  const store = useStore<ThemeStore>();
  let currentTheme = getCurrentTheme();

  let [currentClass, setCurrentClass] = useState(
    currentTheme === "dark" ? "theme-switcher-dark" : "theme-switcher-light"
  );

  const changeTheme = () => {
    const theme = getTheme();
    if (theme === "dark") {
      store.dispatch(setLight());
      setCurrentClass("toggle-light");
    } else {
      store.dispatch(setDark());
      setCurrentClass("toggle-dark");
    }
  };

  function getTheme() {
    const currentState = store.getState();
    return currentState.theme;
  }

  return (
    <div
      data-testid="theme_switcher"
      onClick={() => changeTheme()}
      className="theme-switcher"
    >
      <div data-testid="theme_switcher_icon" className={currentClass}>
      </div>
    </div>
  );
}
