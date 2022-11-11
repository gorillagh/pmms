import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import NonstickyFooter from "../../components/Footers/NonstickyFooter";
import { toast } from "react-toastify";
import ForgotPassword from "../../components/PopUps/ForgotPassword";
import { googleLogin, loginUser } from "../../serverFunctions/auth";
import LoadingBackdrop from "../../components/PopUps/LoadingBackdrop";
import Icon from "@mui/material/Icon";
import googleSignInIcon from "../../images/googleSignin.svg";
import LinkButton from "../../components/Buttons/LinkButton";

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [openForgotPasswordModal, setOpenForgotPassworModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error("Enter your email!");
      return;
    }
    if (!password) {
      toast.error("Enter your password");
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      loginUser(idTokenResult.token)
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
      console.log(error.code);
      if (error.code === "auth/user-not-found") {
        toast.error("Email address not registered. Please sign up!");
      } else {
        toast.error(error.message);
      }

      setLoading(false);
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
          <Button
            onClick={googleSignIn}
            type="submit"
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
            Log in with Google
          </Button>
          <Typography
            sx={{ mt: 1 }}
            variant="body2"
            color="text.secondary"
            align="center"
          >
            OR
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={<EmailIcon />}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={<KeyIcon />}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                textTransform: "none",
                borderRadius: 6,
                "&:hover": {
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              Log In
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              <Link
                sx={{ cursor: "pointer" }}
                onClick={() => setOpenForgotPassworModal(true)}
                variant="body2"
              >
                Forgot password?
              </Link>
            </Typography>
            <Divider sx={{ mt: 3 }} />

            <Link href="/signup" variant="body2">
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  mb: 2,
                  textTransform: "none",
                  borderRadius: 6,
                  "&:hover": {
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                Sign Up
              </Button>
            </Link>
          </Box>
        </Box>
        <NonstickyFooter sx={{ mt: 8, mb: 4 }} />
        <ForgotPassword
          openForgotPasswordModal={openForgotPasswordModal}
          email={email}
          setEmail={setEmail}
          setOpenForgotPassworModal={setOpenForgotPassworModal}
        />
        <LoadingBackdrop open={loading} />
      </Container>
    </>
  );
};

export default Login;
