import * as React from "react";
import { useNavigate } from "react-router-dom";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";

import { Grid, Icon } from "@mui/material";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

const CustomizedBreadcrumbs = ({ pocket }) => {
  const navigate = useNavigate();
  return (
    <Grid align="left" container>
      <Grid align="left" item xs={4} md={1}>
        <StyledBreadcrumb
          title="Dashboard"
          component="a"
          href="#"
          label="Pockets"
          icon={<Icon fontSize="small">grid_view</Icon>}
          onClick={() => navigate("/my/dashboard")}
          sx={{ textDecoration: "underline" }}
        />
      </Grid>
      <Grid item xs={4} md={1}>
        <StyledBreadcrumb
          title={pocket.title}
          component="a"
          href="#"
          label={pocket.title}
          icon={
            <span
              style={{
                color: pocket.color ? pocket.color : "#000",
              }}
            >
              <Icon sx={{ bgcolor: "transparent" }} fontSize="small">
                {pocket.icon ? pocket.icon : "account_balance_wallet_rounded"}
              </Icon>
            </span>
          }
          onClick={() => navigate(`/my/${pocket.slug}/pocket`)}
          sx={{ textDecoration: "underline" }}
        />
      </Grid>
      <Grid item xs={4} md={1}>
        <StyledBreadcrumb
          disabled
          label="Settings"
          icon={<Icon fontSize="small">settings</Icon>}
        />
      </Grid>
    </Grid>
  );
};

export default CustomizedBreadcrumbs;
