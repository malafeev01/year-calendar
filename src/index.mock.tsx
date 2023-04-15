import { AnyAction, configureStore, Store } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { ConfigProvider, theme } from "antd";
import en_US from "antd/locale/en_US";
import ThemeProvider from "./theme/theme-provider";
import themeReducer from "./theme/theme-reducer";
import { getCurrentTheme } from "./theme/theme-utils";
import { ApiMock } from "./api/google-api.mock";
import { APIContext } from "./api/api-context";
import { ReactElement } from "react";

const { defaultAlgorithm, darkAlgorithm } = theme;

export function IndexMock(props: {
  store?: Store<{ theme: string }, AnyAction>;
  api?: ApiMock;
  children?: ReactElement;
}) {
  const apiMock = new ApiMock();
  const storeMock = configureStore({
    reducer: {
      theme: themeReducer,
    },
  });

  const store = props.store ? props.store : storeMock;
  const api = props.api ? props.api : apiMock;
  return (
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

          {props.children}
        </APIContext.Provider>
      </ConfigProvider>
    </Provider>
  );
}
