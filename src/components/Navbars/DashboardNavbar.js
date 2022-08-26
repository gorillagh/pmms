import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";

const pages = ["help"];
const settings = ["dashboard", "profile", "account", "logout"];

const DashboardNavbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleOpenNavMenu = (e) => {
    setAnchorElNav(e.currentTarget);
  };
  const handleOpenUserMenu = (e) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (e) => {
    setAnchorElUser(null);
    if (e.target.id !== "" && e.target.id !== "logout")
      navigate(`/my/${e.target.id}`);

    e.target.id === "logout" && handleSignOut();
  };

  return (
    <AppBar
      sx={{
        backgroundColor: "primary",
      }}
      position="sticky"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex", cursor: "pointer" },
            }}
            onClick={() => navigate("/my/dashboard")}
          >
            PMMS
          </Typography>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            onClick={() => navigate("/my/dashboard")}
          >
            PMMS
          </Typography>
          <Box
            justifyContent="right"
            alignItems="center"
            sx={{ flexGrow: 1, display: "flex" }}
          >
            <Button
              size="small"
              sx={{
                p: 0,
                borderRadius: 6,
                border: "solid #fff",
                borderWidth: 1,
                padding: 2,
                paddingTop: 1,
                paddingBottom: 1,
                "&:hover": {
                  bgcolor: "#336c4c",
                  color: "#fff",
                },
                textTransform: "capitalize",
              }}
              variant="contained"
              onClick={() => dispatch({ type: "ADD_MONEY", payload: true })}
            >
              <Icon fontSize="small">add</Icon>Add Money
            </Button>
          </Box>
          <Box
            alignItems="center"
            justifyContent="right"
            sx={{
              mr: "0.5rem",
              // flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  // background: "#000",
                  textTransform: "capitalize",
                  color: "white",
                  display: "block",
                  mx: 1,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, ml: "1rem", borderLeft: "solid 0.09rem" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenUserMenu}
              color="inherit"
              sx={{ pl: "1rem" }}
            >
              <AccountCircle sx={{ width: "1.5rem", height: "1.5rem" }} />
              <Typography
                sx={{
                  display: { xs: "none", md: "flex" },
                  ml: "0.4rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {user.name}
              </Typography>
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  id={setting}
                  key={setting}
                  onClick={handleCloseUserMenu}
                >
                  <Typography
                    sx={{ textTransform: "capitalize" }}
                    id={setting}
                    textAlign="center"
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default DashboardNavbar;
