import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";

const HomeNavbar = () => {
  const pages = ["FAMILY", "PERSONAL", "HELP"];

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      sx={{ backgroundColor: "#fff", color: "inherit" }}
      position="static"
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            PMMS
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography color="inherit" textAlign="center">
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            PMMS
          </Typography>
          <Box
            alignItems="center"
            justifyContent="center"
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <Link
                underline="none"
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  padding: 2,
                  color: "#495e51",
                  display: "block",
                  mx: 3,
                  "&:hover": {
                    borderBottom: "solid 3px",
                    cursor: "pointer",
                  },
                }}
              >
                {page}
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Link
              href="/login"
              underline="hover"
              color="#495e51"
              sx={{
                p: 0,
                mx: 1,
                borderRadius: 6,
                border: "solid #495e51",
                borderWidth: 1,
                padding: 2,
                paddingTop: 1,
                paddingBottom: 1,
              }}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              underline="hover"
              color="#fff"
              sx={{
                p: 0,

                borderRadius: 6,
                padding: 2,
                paddingTop: 1,
                paddingBottom: 1,
                backgroundColor: "#495e51",
              }}
            >
              Sign Up
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HomeNavbar;
