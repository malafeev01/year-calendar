import React from "react";
import { DarkTheme } from "./dark-theme";
import { LightTheme } from "./light-theme";
import { useStore } from "react-redux";
import { getCurrentTheme } from "./theme-utils";

export let theme = getCurrentTheme() === "dark" ? DarkTheme : LightTheme;

export type ThemeStore = {
  theme: "dark" | "light";
};

type ThemeObject = {
  [prop: string]: string;
};

export default function ThemeProvider() {
  const store = useStore<ThemeStore>();

  store.subscribe(() => {
    const currentState = store.getState();

    if (currentState.theme === "dark") {
      theme = DarkTheme;
    } else if (currentState.theme === "light") {
      theme = LightTheme;
    } else {
      theme = DarkTheme;
    }

    if (theme === DarkTheme) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }

    window.location.reload();
  });

  const setTheme = (themeObject: ThemeObject) => {
    for (const [key, value] of Object.entries(themeObject)) {
      document.body.style.setProperty(key, value);
    }
  };

  setTheme(theme);

  return <></>;
}
