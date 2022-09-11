import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../../firebase";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import NonstickyFooter from "../../components/Footers/NonstickyFooter";
import { createOrUpdateUser } from "../../serverFunctions/auth";
import LoadingBackdrop from "../../components/PopUps/LoadingBackdrop";

const SignupComplete = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1Info, setShowPassword1Info] = useState("");
  const [showPassword2Info, setShowPassword2Info] = useState("none");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));

  const roleBasedRedirect = (user) => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/my/dashboard");
    }
  };

  useEffect(() => {
    if (user && user.token) roleBasedRedirect(user);
  });

  useEffect(() => {
    if (window.localStorage.getItem("signupEmail")) {
      setEmail(window.localStorage.getItem("signupEmail"));
    } else {
      setEmailAvailable(false);
    }

    // setEmail(window.localStorage.getItem("signupEmail"));
    // setFirstName(window.localStorage.getItem("signupFirstName"));
    // setLastName(window.localStorage.getItem("signupLastName"));
    // setPhoneNumber(window.localStorage.getItem("signupPhoneNumber"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (password1 !== password2) {
        toast.error("Passwords must match!");
        return;
      }
      if (
        !password1.match(/[A-Z]/g) ||
        !password1.match(/[0-9]/g) ||
        !password1.match(/[a-z]/g) ||
        password1.length < 8
      ) {
        toast.error("Passwords must be in the right format");
        return;
      }
      setLoading(true);

      if (isSignInWithEmailLink(auth, window.location.href)) {
        // let email = window.localStorage.getItem("signupEmail");
        // if (!email) {
        //   email = window.prompt("Please provide your email for confirmation");
        // }
        const result = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );
        if (result.user.emailVerified) {
          window.localStorage.removeItem("signupEmail");
          let fbUser = auth.currentUser;

          await updatePassword(fbUser, password1);

          await updateProfile(fbUser, {
            displayName: `${firstName} ${lastName}`,
          });
          const name = `${firstName} ${lastName}`;
          const idTokenResult = await fbUser.getIdTokenResult();
          createOrUpdateUser(idTokenResult.token, phoneNumber, name)
            .then((res) => {
              console.log(res.data);
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
              toast.success(
                `Welcome ${res.data.name.slice(0, res.data.name.indexOf(" "))}`
              );
              roleBasedRedirect(res.data);
              setLoading(false);
              window.localStorage.removeItem("signupFirstName");
              window.localStorage.removeItem("signupLastName");
              window.localStorage.removeItem("signupPhoneNumber");
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        {/* <CssBaseline /> */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }} component="h1" variant="h5">
            PMMS
          </Typography>
          <Typography sx={{ mt: 2 }} component="h3" variant="h5">
            Almost done!
          </Typography>
          <Typography sx={{ mt: 2 }} component="p" variant="p">
            Choose your password to complete
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled={emailAvailable}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  value={phoneNumber}
                  fullWidth
                  label="Phone"
                  id="outlined-start-adornment"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+233</InputAdornment>
                    ),
                  }}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password1"
                  label="Password"
                  type="password"
                  id="password1"
                  autoComplete="new-password"
                  autoFocus
                  value={password1}
                  onChange={(e) => {
                    setPassword1(e.target.value);
                    if (
                      e.target.value.match(/[A-Z]/g) &&
                      e.target.value.match(/[0-9]/g) &&
                      e.target.value.match(/[a-z]/g) &&
                      e.target.value.length >= 8
                    ) {
                      setShowPassword1Info("none");
                    } else setShowPassword1Info("");
                  }}
                />
                <Typography
                  display={showPassword1Info}
                  sx={{ mb: 3, fontSize: "0.65rem" }}
                  color="red"
                  component="small"
                  variant="small"
                >
                  Must contain at least one number and one uppercase and
                  lowercase letter, and at least 8 or more characters
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Re-enter Password"
                  type="password"
                  title="Must match the above password"
                  id="password2"
                  autoComplete="new-password"
                  value={password2}
                  onChange={(e) => {
                    setPassword2(e.target.value);
                    if (
                      e.target.value === password1 ||
                      e.target.value.length < 1
                    ) {
                      setShowPassword2Info("none");
                    } else setShowPassword2Info("");
                  }}
                />
                <Typography
                  display={showPassword2Info}
                  sx={{ mb: 3, fontSize: "0.65rem" }}
                  color="red"
                  component="small"
                  variant="small"
                >
                  Must match the first password
                </Typography>
              </Grid>
            </Grid>
            <Button
              disabled={!password1 || !password2 || password1 !== password2}
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: 6,
                "&:hover": {
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              Sign Up
            </Button>
            <Divider sx={{ mt: 3 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              <Link href="/login" variant="body2">
                Login instead
              </Link>
            </Typography>
          </Box>
        </Box>
        <NonstickyFooter sx={{ mt: 8, mb: 4 }} />
        <LoadingBackdrop open={loading} />
      </Container>
    </>
  );
};

export default SignupComplete;
