import "./sidebar.css";

import ThemeSwitcher from "../theme-switcher/theme-switcher";
import classnames from "classnames";
import { useEffect, useState } from "react";

export default function SideBar(props: { show: boolean }) {
  const [show, setShow] = useState(props.show);

  useEffect(() => {
    setShow(props.show);
  }, [props]);

  const goToPrivacy = () => {
    window.location.href = "/privacy";
  };

  const goToSlide = (slideName: string) => {
    const url = window.location.origin + "/#" + slideName;
    window.history.replaceState(null, "", url);

    const slide = document.querySelector(`div[name="${slideName}"]`);
    slide?.scrollIntoView({ behavior: "smooth" });
    setShow(false);
  };

  return (
    <div
      data-testid="sidebar"
      className={classnames({
        sidebar: true,
        "sidebar-show": show,
        "sidebar-hide": !show,
      })}
    >
      <div className="sidebar-item">
        <ThemeSwitcher></ThemeSwitcher>
      </div>

      <div
        data-testid="about"
        className="sidebar-item"
        onClick={() => goToSlide("about")}
      >
        About
      </div>

      <div
        data-testid="donates"
        className="sidebar-item"
        onClick={() => goToSlide("donate")}
      >
        Donates
      </div>

      <div
        data-testid="contacts"
        className="sidebar-item"
        onClick={() => goToSlide("contacts")}
      >
        Contacts
      </div>

      <div
        data-testid="privacy-policy"
        className="sidebar-item"
        onClick={goToPrivacy}
      >
        Privacy Policy
      </div>
    </div>
  );
}
