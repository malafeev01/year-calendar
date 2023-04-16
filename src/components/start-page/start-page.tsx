import "./start-page.css";

import { ReactElement, useEffect } from "react";
import { Button } from "antd";
import { useContext } from "react";
import dayjs from "dayjs";

import NavBar from "../common/navbar/navbar";
import { APIContext } from "../../api/api-context";
import Bubbles from "../common/bubbles/bubbles";

function StartPage() {
  const api = useContext(APIContext);

  useEffect(() => {
    if (window.location.hash) {
      const slideName = window.location.hash.substring(1);
      const slide = document.querySelector(`div[data-id="${slideName}"]`);
      slide?.scrollIntoView();
    }
  }, []);

  const signIn = () => {
    api.signIn();
  };

  const goToProfile = () => {
    window.location.href = "/profile";
  };

  let button: ReactElement;

  if (api.isSignedIn()) {
    button = (
      <Button
        onClick={goToProfile}
        className="start-page-btn"
        type="ghost"
        size="large"
        shape="round"
      >
        Go to Profile
      </Button>
    );
  } else {
    button = (
      <button onClick={signIn} className="start-page-btn">
        <svg
          aria-hidden="true"
          className="native svg-icon iconGoogle"
          viewBox="0 0 18 18"
        >
          <path
            d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"
            fill="#4285F4"
          ></path>
          <path
            d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"
            fill="#34A853"
          ></path>
          <path
            d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z"
            fill="#FBBC05"
          ></path>
          <path
            d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z"
            fill="#EA4335"
          ></path>
        </svg>
        Sign up with Google
      </button>
    );
  }

  return (
    <div className="start-page">
      <NavBar mode="home"></NavBar>

      <div className="start-page-slide start-page-start-box">
        <Bubbles />
        <h1 className="start-page-menu-header">Yearplan.app</h1>
        <h3 className="start-page-menu-pitch">
          For those who like long-term plans
        </h3>
        {button}
      </div>

      <div data-id="about" className="start-page-slide">
        <h1 className="start-page-header">Why you may like it</h1>

        <h3 className="start-page-label">
          <b>Planning</b>. A year calendar provides a comprehensive overview of
          the entire year, making it easier to plan ahead and schedule important
          events and activities.
        </h3>
        <h3 className="start-page-label">
          <b>Organization</b>. A year calendar helps to keep track of important
          dates, deadlines, and appointments, ensuring that nothing is missed or
          forgotten.
        </h3>
        <h3 className="start-page-label">
          <b> Visualization</b>. A year calendar allows for a visual
          representation of the year, making it easier to see how different
          events and activities fit together and how they impact each other.
        </h3>
        <h3 className="start-page-label">
          <b> Memory aid</b>. A year calendar can serve as a memory aid, helping
          to remember important dates and events that might otherwise be
          forgotten.
        </h3>
      </div>

      <div data-id="donate" className="start-page-slide">
        <h1 className="start-page-header">Helping to the project</h1>
        <div className="start-page-donate-container">
          <blockquote>
            Hi, I have been looking for such a calendar app where on year view I
            can see all my planned events. Then I got the idea to create this
            application. You can use this app for free without any trial periods
            or annoying ads. At the same time, I'll be happy to get any kind of
            your support.
            <span>Alexey Malafeev (author of the project)</span>
          </blockquote>
        </div>

        <div className="start-page-donate-box">
          <div className="start-page-donate-qr-code"></div>
          <div className="start-page-donate-currency">Binance USDT</div>
        </div>
      </div>

      <div
        data-id="contacts"
        className="start-page-slide start-page-last-slide"
      >
        <div>
        <h1 className="start-page-header">Contacts</h1>
        <h3 className="start-page-label">
          You are welcome to send any feedback. Please contact me.
        </h3>
        <div className="start-page-email-container">
          <a
            className="start-page-app-link"
            href="mailto:malafeev.alexey@gmail.com"
          >
            malafeev.alexey@gmail.com
          </a>
        </div>
        <div className="start-page-social-container">
          <a
            className="start-page-app-link"
            href="https://github.com/malafeev01"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>

        <div className="start-page-social-container">
          <a
            className="start-page-app-link"
            href="https://vk.com/malafeev_alexey"
            target="_blank"
            rel="noreferrer"
          >
            VKontakte
          </a>
        </div>

        <div className="start-page-social-container">
          <a
            className="start-page-app-link"
            href="https://www.facebook.com/alexey.malafeev"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
        </div>

        <div className="start-page-social-container">
          <a
            className="start-page-app-link"
            href="https://www.instagram.com/malafeev_alexey/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
        </div>
        <div className="start-page-footer">
          <div className="start-page-footer-label">
            Alexey Malafeev @ {dayjs().year()}
          </div>
        </div>
        
      </div>

    </div>
  );
}

export default StartPage;
