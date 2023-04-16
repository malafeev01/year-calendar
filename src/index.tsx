import App from "./App";
import { ConfigProvider, theme } from "antd";
import en_US from "antd/locale/en_US";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./theme/theme-reducer";
import ThemeProvider from "./theme/theme-provider";
import Api from "./api/google-api";
import { APIContext } from "./api/api-context";
import { getCurrentTheme } from "./theme/theme-utils";
import * as ReactDOMClient from "react-dom/client";

const { defaultAlgorithm, darkAlgorithm } = theme;

const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

const api = new Api();
const container = document.getElementById("root") || document.body;
const root = ReactDOMClient.createRoot(container);

root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        algorithm:
          getCurrentTheme() === "dark" ? darkAlgorithm : defaultAlgorithm,
      }}
      locale={en_US}
    >
      <APIContext.Provider value={api}>
        <ThemeProvider></ThemeProvider>

        <App />
      </APIContext.Provider>
    </ConfigProvider>
  </Provider>
);
