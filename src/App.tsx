import "./App.css";

import { useEffect, useState } from "react";
import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { notification as antNotification } from "antd";

import { LoadSpinner } from "./components/common/load-spinner/load-spinner";
import StartPage from "./components/start-page/start-page";
import ProfilePage from "./components/profile-page/profile-page";
import PrivacyPage from "./components/privacy-page/privacy-page";

import { showErrorNotification } from "./common/notification";

import { APIContext } from "./api/api-context";

function App() {
  const api = useContext(APIContext);
  const [loading, setLoading] = useState(true);
  const [notification, notificationContextHolder] =
    antNotification.useNotification();

  useEffect(() => {
    api
      .getSession()
      .then(() => {
        setLoading(false);
      })
      .catch((error: any) => {
        setLoading(false);
        showErrorNotification(error, notification);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      {notificationContextHolder}
      {loading ? (
        <LoadSpinner />
      ) : (
        <Routes>
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<StartPage />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
