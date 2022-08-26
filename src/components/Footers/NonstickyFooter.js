import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const NonstickyFooter = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
      sx={{ fontSize: "10px", mt: 7, mb: 4 }}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        PMMS
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default NonstickyFooter;
