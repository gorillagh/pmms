import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";

const LoadingBackdrop = ({ open, loadingMessage }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Box sx={{ p: 1 }}>
        <CircularProgress color="inherit" />
      </Box>
      {/* <Typography>{loadingMessage ? loadingMessage : "Loading..."}</Typography> */}
    </Backdrop>
  );
};

export default LoadingBackdrop;
