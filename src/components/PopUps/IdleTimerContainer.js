import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import IdleTimer from "react-idle-timer";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import Countdown from "react-countdown";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  minWidth: 250,
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  p: 4,
};

const IdleTimerContainer = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const renderer = ({ seconds }) => {
    return <span>{seconds}</span>;
  };

  const handleActive = () => {
    setOpen(false);
    clearTimeout(sessionTimeoutRef.current);
    //Keep user signed in
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
      clearTimeout(sessionTimeoutRef.current);
      navigate("/");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const idleTimerRef = useRef(null);
  const sessionTimeoutRef = useRef(null);

  const onIdle = () => {
    setOpen(true);
    sessionTimeoutRef.current = setTimeout(async () => {
      try {
        await signOut(auth);
        dispatch({
          type: "LOGOUT",
          payload: null,
        });
        clearTimeout(sessionTimeoutRef.current);
        navigate("/login");
        setOpen(false);
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }, 60000);
  };

  return (
    <div>
      <IdleTimer
        ref={idleTimerRef}
        timeout={540 * 1000}
        onIdle={onIdle}
        crossTab={true}
      >
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              sx={{ fontWeight: "bold", mb: 3 }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Are you still there?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mb: 2 }}>
              You have been inactive for a while. You be logged out in{" "}
              <Countdown date={Date.now() + 60000} renderer={renderer} />{" "}
              seconds
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={handleLogout}
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 3,
                    mb: 2,
                    textTransform: "capitalize",
                    borderRadius: 6,
                  }}
                >
                  Log Out
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={handleActive}
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    textTransform: "capitalize",
                    borderRadius: 6,
                  }}
                >
                  I'm here
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </IdleTimer>
    </div>
  );
};

export default IdleTimerContainer;
