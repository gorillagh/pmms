import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import UserRoute from "./components/Routes/UserRoute";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SignupComplete from "./pages/auth/SignupComplete";

import IdleTimerContainer from "./components/PopUps/IdleTimerContainer";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import { currentUser } from "./serverFunctions/auth";
import AdminRoute from "./components/Routes/AdminRoute";
import Account from "./pages/user/Account";
import Profile from "./pages/user/Profile";
import EmailChange from "./pages/user/EmailChange";
import Pocket from "./pages/user/Pocket";
import AdminAccount from "./pages/admin/AdminAccount";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminPockets from "./pages/admin/AdminPockets";
import PocketSettings from "./pages/user/PocketSettings";
import Station from "./pages/user/Station";
import TipsAndUpdates from "./pages/user/TipsAndUpdates";
import Transactions from "./pages/user/Transactions";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#757ce8",
      // main: "#336c4c",
      dark: "#000000",
      main: "#292929",
      // dark: "#495e51",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    error: {
      main: "#ce0018",
      light: "#ff0220",
      dark: "#a50013",
      contrastText: "#fff",
    },
    info: {
      main: "#726f55",
      light: "#8f8b6a",
      dark: "#5b5944",
      contrastText: "#fff",
    },
    shape: {
      borderRadius: 14,
    },
  },
});

const App = () => {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user);
        setLoggedIn(true);
        const idTokenResult = await user.getIdTokenResult();

        currentUser(idTokenResult.token)
          .then((res) => {
            console.log(res);
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                email: res.data.email,
                role: res.data.role,
                name: res.data.name,
                token: idTokenResult.token,
                phoneNumber: res.data.phoneNumber ? res.data.phoneNumber : "",
                _id: res.data._id,
              },
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // User is signed out
        setLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      {loggedIn && <IdleTimerContainer></IdleTimerContainer>}
      <ToastContainer style={{ fontSize: "12px", fontWeight: "bold" }} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup/complete" element={<SignupComplete />} />

        <Route
          exact
          path="/my/dashboard"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />
        <Route
          exact
          path="/station"
          element={
            <UserRoute>
              <Station />
            </UserRoute>
          }
        />
        <Route
          exact
          path="/tips-updates"
          element={
            <UserRoute>
              <TipsAndUpdates />
            </UserRoute>
          }
        />
        <Route
          exact
          path="/my/transactions"
          element={
            <UserRoute>
              <Transactions />
            </UserRoute>
          }
        />
        <Route
          exact
          path="/my/account"
          element={
            <UserRoute>
              <Account />
            </UserRoute>
          }
        />
        <Route
          exact
          path="/my/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />
        <Route
          exact
          path="/email/change"
          element={
            <UserRoute>
              <EmailChange />
            </UserRoute>
          }
        />
        <Route
          exact
          path="/my/:slug/pocket"
          element={
            <UserRoute>
              <Pocket />
            </UserRoute>
          }
        />
        <Route
          exact
          path="/my/:slug/pocket/settings"
          element={
            <UserRoute>
              <PocketSettings />
            </UserRoute>
          }
        />
        <Route
          exact
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          exact
          path="/admin/account"
          element={
            <AdminRoute>
              <AdminAccount />
            </AdminRoute>
          }
        />
        <Route
          exact
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />
        <Route
          exact
          path="/admin/pockets"
          element={
            <AdminRoute>
              <AdminPockets />
            </AdminRoute>
          }
        />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
