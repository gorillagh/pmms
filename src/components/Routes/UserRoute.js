import React from "react";
import { useSelector } from "react-redux";
import DashboardNavbar from "../Navbars/DashboardNavbar";
import AddMoneyGeneral from "../PopUps/AddMoneyGeneral";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ children }) => {
  const { user, addMoney } = useSelector((state) => ({ ...state }));
  return user && user.token ? (
    <div>
      <DashboardNavbar />
      {children}
      <AddMoneyGeneral open={addMoney} />
    </div>
  ) : (
    <LoadingToRedirect message="You are not logged in." />
  );
};

export default UserRoute;
