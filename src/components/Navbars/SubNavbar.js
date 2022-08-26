import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Tabs from "@mui/material/Tabs";
import { Badge, Box, Container, Tab, Typography } from "@mui/material";

function a11yProps(index) {
  return {
    id: `centered-tab-${index}`,
    "aria-controls": `centered-tabpanel-${index}`,
  };
}

const SubNavbar = ({ userPockets }) => {
  const { user, moneyChange, pocketsView, footerNav } = useSelector(
    (state) => ({
      ...state,
    })
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    // navigate("/my/dashboard");
    dispatch({ type: "FOOTER_NAVIGATION", payload: newValue });
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Box
        display={{ xs: "none", md: "block" }}
        sx={{
          // bgcolor: "background.paper",
          position: "fixed",
          zIndex: 3,
          width: "100%",
          background: " rgba(255, 255, 255, 0.8)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          webkitBackdropFilter: "blur(5px)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              mx: "auto",
              width: "100%",
              // bgcolor: "background.paper",
            }}
          >
            <Tabs
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              value={footerNav}
              onChange={handleChange}
            >
              <Tab
                sx={{ textTransform: "none" }}
                label="MyPockets"
                {...a11yProps(0)}
                onClick={() => navigate("/my/dashboard")}
              />
              <Tab
                sx={{ textTransform: "none" }}
                label="Transactions"
                {...a11yProps(1)}
                onClick={() => navigate("/my/transactions")}
              />
              <Tab
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
                      Station
                    </Badge>
                  ) : (
                    "Station"
                  )
                }
                {...a11yProps(2)}
                onClick={() => navigate("/station")}
              >
                {" "}
              </Tab>

              <Tab
                sx={{ textTransform: "none" }}
                label="Tips/Updates"
                {...a11yProps(3)}
                onClick={() => navigate("/tips-updates")}
              />
            </Tabs>
          </Box>
        </Container>
      </Box>
      {/* ///////////////////////// */}
    </>
  );
};

export default SubNavbar;
