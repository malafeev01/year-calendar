import { useContext } from "react";
import YearCalendar from "./year-calendar/year-calendar";
import NavBar from "../common/navbar/navbar";
import { APIContext } from "../../api/api-context";

function ProfilePage() {
  const api = useContext(APIContext);

  if (!api.isSignedIn()) {
    window.location.href = "/";
  }

  return (
    <>
      <NavBar mode="profile"></NavBar>
      <YearCalendar />
    </>
  );
}

export default ProfilePage;
