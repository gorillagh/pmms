import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import NonstickyFooter from "../../components/Footers/NonstickyFooter";
import {
  checkEmailAvailability,
  googleLogin,
} from "../../serverFunctions/auth";
import LoadingBackdrop from "../../components/PopUps/LoadingBackdrop";
import googleSignInIcon from "../../images/googleSignin.svg";

const provider = new GoogleAuthProvider();

const Signup = () => {
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [hideForm, setHideForm] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [hideEmailMsg, setHideEmailMsg] = useState("none");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const navigate = useNavigate();

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

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

  const googleSignIn = async () => {
    try {
      setLoading(true);

      // await signInWithRedirect(auth, provider);
      // const result = await getRedirectResult(auth);
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      googleLogin(idTokenResult.token)
        .then((res) => {
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
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      if (error.message === "Firebase: Error (auth/popup-closed-by-user).") {
        toast.error("Google sign in cancelled!");
        setLoading(false);
        return;
      }
      console.log(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const availability = await checkEmailAvailability(email);
      setEmailError(false);
      if (availability.data === null) {
        setLoading(false);
        toast.error("This email has already been used!");
        setEmailError(true);
        return;
      }

      // if (!/^[0-9]+$/.test(phoneNumber) || phoneNumber.length < 9) {
      //   toast.error("Please enter a valid phone number.");
      //   setLoading(false);
      //   setPhoneError(true);
      //   return;
      // }

      const config = {
        url: process.env.REACT_APP_SIGNUP_REDIRECT_URL,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, config);

      window.localStorage.setItem("signupEmail", email);
      // window.localStorage.setItem("signupFirstName", firstName);
      // window.localStorage.setItem("signupLastName", lastName);
      // window.localStorage.setItem("signupPhoneNumber", phoneNumber);

      toast.success(`Verificaton link sent to ${email}.`);

      // setFirstName("");
      // setLastName("");
      setEmail("");
      // setPhoneNumber("");
      setEmailMsg(email);
      setHideForm("none");
      setHideEmailMsg("");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
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
            Let's get started
          </Typography>
          <Typography
            display={hideEmailMsg}
            sx={{ mt: 2 }}
            component="p"
            variant="p"
          >
            Click on the link sent to <Link underline="none">{emailMsg}</Link>{" "}
            to continue signing up...
          </Typography>
          <Typography
            display={hideEmailMsg}
            sx={{ mt: 2 }}
            component="small"
            variant="small"
          >
            made a mistake?{" "}
            <Link
              onClick={() => {
                setHideEmailMsg("none");
                setHideForm("");
              }}
              sx={{ cursor: "pointer" }}
            >
              Re-enter details
            </Link>
          </Typography>

          <Box
            display={hideForm}
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Button
              onClick={googleSignIn}
              fullWidth
              variant="contained"
              sx={{
                mt: 3,

                borderRadius: 6,
                mb: 2,
                bgcolor: "#E34133",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#E34133",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <Icon sx={{ mr: 2 }}>
                {" "}
                <img src={googleSignInIcon} />{" "}
              </Icon>
              {/* <GoogleIcon sx={{ mr: 2, cursor: "pointer" }} /> */}
              Join with Google
            </Button>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {/* <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                /> */}
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                /> */}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={emailError}
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
                {/* <TextField
                  error={phoneError}
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  fullWidth
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  label="Phone"
                  id="outlined-start-adornment"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+233</InputAdornment>
                    ),
                  }}
                /> */}
              </Grid>
            </Grid>
            <Button
              disabled={!email}
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
              Continue
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

export default Signup;
