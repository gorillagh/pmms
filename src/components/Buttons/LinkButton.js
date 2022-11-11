import React from "react";
import Link from "@mui/material/Link";

const LinkButton = (props) => {
  return (
    <Link
      href={props.href}
      underline="hover"
      sx={{
        mr: 1,
        border: "solid",
        borderRadius: 6,
        padding: 2,
        paddingTop: 1,
        paddingBottom: 1,
        backgroundColor: props.backgroundColor,
        color: props.color,
      }}
      {...props}
    >
      {props.text}
    </Link>
  );
};

LinkButton.defaultProps = {
  color: "#fff",
  size: "small",
  backgroundColor: "primary.main",
};

export default LinkButton;
