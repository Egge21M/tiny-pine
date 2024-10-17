import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";

function RootRoute() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default RootRoute;
