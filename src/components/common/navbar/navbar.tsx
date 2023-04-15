import "./navbar.css";

import { ReactElement, useContext, useEffect, useState } from "react";
import { Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import classnames from "classnames";

import ThemeSwitcher from "../theme-switcher/theme-switcher";
import { APIContext } from "../../../api/api-context";
import SideBar from "../sidebar/sidebar";

const SMALL_SCREEN_WIDTH = 620;

export default function NavBar(props: { mode: "home" | "profile" }) {
  const api = useContext(APIContext);
  const mode = props.mode || "home";
  const [showSidebar, setShowsidebar] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(
    document.body.scrollWidth < SMALL_SCREEN_WIDTH
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsSmallScreen(document.body.scrollWidth < SMALL_SCREEN_WIDTH);
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  const signIn = () => {
    api.signIn();
  };
  const goToHome = () => {
    window.location.href = "/";
  };
  const goToProfile = () => {
    window.location.href = "/profile";
  };

  const goToPrivacy = () => {
    window.location.href = "/privacy";
  };

  const goToSlide = (slideName: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = "/#" + slideName;
      return;
    }

    const url = window.location.origin + "/#" + slideName;
    window.history.replaceState(null, "", url);

    const slide = document.querySelector(`div[data-id="${slideName}"]`);
    slide?.scrollIntoView({ behavior: "smooth" });
  };

  let item: ReactElement = (
    <div data-testid="navbar_loading" className="navbar-item">
      Loading...
    </div>
  );

  const items = [
    {
      label: (
        <span data-testid="navbar_profile_dropdown_home" onClick={goToHome}>
          Go to home
        </span>
      ),
      key: "0",
    },
    {
      label: (
        <span
          data-testid="navbar_profile_dropdown_logout"
          onClick={api.signOut}
        >
          Logout
        </span>
      ),
      key: "1",
    },
  ];

  if (api.isSignedIn()) {
    if (props.mode === "home") {
      item = (
        <div
          data-testid="navbar_profile"
          className="navbar-item"
          onClick={goToProfile}
        >
          {api.getUserProfile().getName()}
        </div>
      );
    } else {
      item = (
        <Dropdown
          data-testid="navbar_profile_dropdown"
          menu={{ items }}
          trigger={["click"]}
          arrow={true}
          placement={"bottomRight"}
        >
          <span className="navbar-item">{api.getUserProfile().getName()}</span>
        </Dropdown>
      );
    }
  } else {
    item = (
      <div data-testid="navbar_login" className="navbar-item" onClick={signIn}>
        Login
      </div>
    );
  }
  return (
    <>
      {isSmallScreen && props.mode === "home" ? (
        <SideBar show={showSidebar}></SideBar>
      ) : (
        <></>
      )}

      <div className="navbar">
        <div className="navbar-group">
          {isSmallScreen && props.mode === "home" ? (
            <MenuOutlined
              data-testid="show_sidebar_icon"
              className={classnames({
                "navbar-item": true,
                "navbar-item-selected": showSidebar,
              })}
              onClick={() => setShowsidebar(!showSidebar)}
            />
          ) : (
            <ThemeSwitcher></ThemeSwitcher>
          )}
        </div>
        <div className="navbar-group">
          {mode === "home" && !isSmallScreen ? (
            <>
              <div
                data-testid="navbar_about"
                className="navbar-item"
                onClick={() => goToSlide("about")}
              >
                About
              </div>

              <div
                data-testid="navbar_donate"
                className="navbar-item"
                onClick={() => goToSlide("donate")}
              >
                Donates
              </div>

              <div
                data-testid="navbar_contacts"
                className="navbar-item"
                onClick={() => goToSlide("contacts")}
              >
                Contacts
              </div>

              <div
                data-testid="navbar_privacy_policy"
                className="navbar-item"
                onClick={goToPrivacy}
              >
                Privacy Policy
              </div>
            </>
          ) : (
            <></>
          )}
          {item}
        </div>
      </div>
    </>
  );
}
