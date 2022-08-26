import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Badge, Box, Icon, Tab, Tabs, Typography } from "@mui/material";

function a11yProps(index) {
  return {
    id: `centered-tab-${index}`,
    "aria-controls": `centered-tabpanel-${index}`,
  };
}

const FooterNavbar = ({ userPockets }) => {
  const { footerNav } = useSelector((state) => ({
    ...state,
  }));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    dispatch({ type: "FOOTER_NAVIGATION", payload: newValue });
    window.scrollTo(0, 0);
  };

  return (
    <Box
      display={{ md: "none" }}
      sx={{
        position: "fixed",
        top: "auto",
        bottom: 0,
        zIndex: 3,
        width: "100%",
        background: " rgba(255, 255, 255, 0.8)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        webkitBackdropFilter: "blur(5px)",
      }}
    >
      <Tabs
        centered
        variant="fullWidth"
        scrollButtons
        allowScrollButtonsMobile
        value={footerNav}
        onChange={handleChange}
      >
        <Tab
          onClick={() => navigate("/my/dashboard")}
          sx={{ textTransform: "none" }}
          label={
            <Typography
              variant="small"
              sx={{ fontSize: "10px", fontWeight: "bold" }}
            >
              MyPockets
            </Typography>
          }
          {...a11yProps(0)}
          icon={<Icon>grid_view</Icon>}
        />
        <Tab
          onClick={() => navigate("/my/transactions")}
          icon={<Icon>receipt</Icon>}
          sx={{ textTransform: "none" }}
          label={
            <Typography
              sx={{ fontSize: "10px", fontWeight: "bold" }}
              variant="small"
            >
              Transactions
            </Typography>
          }
          {...a11yProps(1)}
        />
        <Tab
          onClick={() => navigate("/station")}
          icon={<Icon>factory</Icon>}
          sx={{ textTransform: "none" }}
          label={
            userPockets.length <= 4 ? (
              <Badge
                badgeContent=""
                color="info"
                variant="dot"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Typography
                  sx={{ fontSize: "10px", fontWeight: "bold" }}
                  variant="small"
                >
                  Station
                </Typography>
              </Badge>
            ) : (
              <Typography
                sx={{ fontSize: "10px", fontWeight: "bold" }}
                variant="small"
              >
                Station
              </Typography>
            )
          }
          {...a11yProps(2)}
        >
          {" "}
        </Tab>

        <Tab
          onClick={() => navigate("/tips-updates")}
          icon={<Icon>tips_and_updates</Icon>}
          sx={{ textTransform: "none" }}
          label={
            <Typography
              sx={{ fontSize: "10px", fontWeight: "bold" }}
              variant="small"
            >
              Tips/Updates
            </Typography>
          }
          {...a11yProps(3)}
        />
      </Tabs>
    </Box>
  );
};

export default FooterNavbar;
