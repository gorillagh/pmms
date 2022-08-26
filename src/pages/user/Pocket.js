import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import {
  getUserPocket,
  getPocketActivities,
} from "../../serverFunctions/pocket";
import NumberFormat from "react-number-format";
import AddMoney from "../../components/PopUps/AddMoney";
import SendMoney from "../../components/PopUps/SendMoney";
import PocketToPocketTransfer from "../../components/PopUps/PocketToPocketTransfer";
const menu = ["offers", "settings"];

const Pocket = () => {
  const [pocket, setPocket] = useState({});
  const [activities, setActivities] = useState([]);
  const [pocketLoading, setPocketLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [openAddMoneyModal, setOpenAddMoneyModal] = useState(false);
  const [openSendMoneyModal, setOpenSendMoneyModal] = useState(false);
  const [openP2PTransferModal, setOpenP2PTransferModal] = useState(false);
  const { user, moneyChange } = useSelector((state) => ({ ...state }));
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  const fetchPocket = () => {
    setPocketLoading(true);
    getUserPocket(user.token, user._id, slug)
      .then((res) => {
        console.log(res.data);
        if (res.data.error) {
          toast.error(res.data.error.message);
          console.log(res.data.error);
          setPocketLoading(false);
          return;
        }
        setPocket(res.data);
        setPocketLoading(false);
      })
      .catch((error) => {
        setPocketLoading(false);
        toast.error(error.message);
        console.log(error);
      });
  };

  const fetchPocketActivities = () => {
    setActivitiesLoading(true);
    getPocketActivities(user.token, user._id, slug)
      .then((res) => {
        console.log("Activities--->", res.data);
        if (res.data.error) {
          toast.error(res.data.error.message);
          console.log(res.data.error);
          setActivitiesLoading(false);
          return;
        }
        setActivities(res.data);
        setActivitiesLoading(false);
      })
      .catch((error) => {
        setPocketLoading(false);
        toast.error(error.message);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPocket();
    fetchPocketActivities();
  }, [moneyChange]);

  const handleOpenMenu = (e) => {
    setAnchorElMenu(e.currentTarget);
  };

  const handleCloseMenu = (e) => {
    setAnchorElMenu(null);
    if (e.target.id !== "" && e.target.id !== "logout")
      navigate(`/my/${pocket.slug}/pocket/${e.target.id}`);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          zIndex: 3,
          width: "100%",
          background: " rgba(255, 255, 255, 0.9)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          webkitBackdropFilter: "blur(5px)",
          py: 1,
        }}
      >
        <Container maxWidth="xl">
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={1} display={{ xs: "none", md: "block" }}>
              <IconButton
                title="Back to Dashboard"
                onClick={() => navigate("/my/dashboard")}
              >
                <Icon>grid_view</Icon>
              </IconButton>{" "}
            </Grid>
            <Grid item xs={1} display={{ xs: "block", md: "none" }}>
              <IconButton
                title="Back to Dashboard"
                onClick={() => navigate("/my/dashboard")}
              >
                <Icon>keyboard_backspace</Icon>
              </IconButton>{" "}
            </Grid>
            <Grid align="center" item xs={10} sx={{ px: 2 }}>
              <Typography>
                {pocketLoading ? (
                  <Skeleton width="50%" />
                ) : (
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                    style={{ textTransform: "capitalize" }}
                  >
                    <Avatar sx={{ bgcolor: pocket.color }}>
                      <Icon fontSize="small">
                        {pocket.icon
                          ? pocket.icon
                          : "account_balance_wallet_rounded"}
                      </Icon>
                    </Avatar>
                    {pocket.title}{" "}
                    <span style={{ fontWeight: "normal" }}>
                      ({pocket.percentage}%)
                    </span>
                  </Typography>
                )}
              </Typography>
            </Grid>
            <Grid item align="right" xs={1}>
              {pocketLoading ? (
                ""
              ) : (
                <>
                  <IconButton onClick={handleOpenMenu} title="Pocket Menu">
                    <Icon>menu</Icon>
                  </IconButton>{" "}
                </>
              )}
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElMenu)}
                onClose={handleCloseMenu}
              >
                {menu.map((item, index) => (
                  <MenuItem id={item} key={index} onClick={handleCloseMenu}>
                    <Typography
                      sx={{ textTransform: "capitalize" }}
                      id={item}
                      textAlign="center"
                    >
                      {item}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container sx={{ pt: 14 }} maxWidth="lg">
        <Grid container spacing={3}>
          <Grid align="left" item xs={12} md={4}>
            {pocketLoading ? (
              <Skeleton
                animation="wave"
                sx={{
                  p: 1,
                  borderRadius: "16px",
                  webkitBackdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
                variant="rectangular"
                width={350}
                height={207}
              />
            ) : (
              <Card
                fullWidth
                sx={{
                  p: 1,
                  borderRadius: "16px",
                  background: " rgba(255, 255, 255, 0.5)",
                  webkitBackdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Balance:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Titillium Web', sans-serif",
                  }}
                  variant="h4"
                  component="div"
                  gutterBottom
                >
                  <Typography
                    component="span"
                    style={{
                      fontWeight: 600,

                      paddingBottom: "50%",
                      fontSize: "small",
                    }}
                  >
                    GH₵{" "}
                  </Typography>
                  <NumberFormat
                    value={pocket.amount ? pocket.amount : 0}
                    displayType={"text"}
                    thousandSeparator={true}
                    // prefix={"GH₵ "}
                    decimalSeparator="."
                    decimalScale={2}
                  />
                </Typography>
                <Button
                  sx={{
                    bgcolor: pocket.color,
                    width: "60%",
                    p: 0,
                    my: 2,
                    borderRadius: 6,
                    borderWidth: 1,
                    padding: 2,
                    paddingTop: 1,
                    paddingBottom: 1,
                    "&:hover": {
                      bgcolor: pocket.color,
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                    },
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                  onClick={() => setOpenAddMoneyModal(true)}
                >
                  Add Money<Icon fontSize="small">add</Icon>
                </Button>

                <Typography
                  align="left"
                  sx={{ fontSize: "small" }}
                  color="text.secondary"
                  gutterBottom
                >
                  Total In{" "}
                  <Icon fontSize="small" color="success">
                    arrow_upward
                  </Icon>
                  :
                </Typography>

                <Typography
                  align="left"
                  sx={{ fontSize: "small" }}
                  color="text.secondary"
                >
                  Total Out{" "}
                  <Icon fontSize="small" color="error">
                    arrow_downward
                  </Icon>
                  :
                </Typography>
              </Card>
            )}

            <Grid display={pocketLoading ? "none" : ""} container>
              <Grid item xs={6} md={6}>
                <Button
                  sx={{
                    width: "80%",
                    p: 0,
                    mt: 2,
                    borderRadius: 6,
                    borderWidth: 1,
                    padding: 2,
                    paddingTop: 1,
                    paddingBottom: 1,
                    "&:hover": {
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                    },
                    textTransform: "capitalize",
                  }}
                  variant="outlined"
                  onClick={() => setOpenP2PTransferModal(true)}
                >
                  P2P{" "}
                  <Icon sx={{ ml: 1 }} fontSize="small">
                    move_down
                  </Icon>
                </Button>
              </Grid>
              <Grid item xs={6} md={6}>
                <Button
                  disabled={!pocket.amount || pocket.amount <= 0}
                  sx={{
                    width: "80%",
                    p: 0,
                    mt: 2,
                    borderRadius: 6,
                    borderWidth: 1,
                    bgcolor: pocket.color,

                    padding: 2,
                    paddingTop: 1,
                    paddingBottom: 1,
                    "&:hover": {
                      bgcolor: pocket.color,

                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                    },
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                  onClick={() => setOpenSendMoneyModal(true)}
                >
                  send{" "}
                  <Icon sx={{ ml: 1 }} fontSize="small">
                    arrow_forward
                  </Icon>
                </Button>
              </Grid>
            </Grid>
            {pocketLoading ? (
              <Skeleton
                animation="wave"
                sx={{
                  my: 5,
                  p: 1,
                  borderRadius: "16px",
                  webkitBackdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
                variant="rectangular"
                width={350}
                height={22}
              />
            ) : (
              pocket.description && (
                <Box my={5}>
                  <Typography
                    sx={{ fontSize: 14, mb: 1 }}
                    align="left"
                    color="text.secondary"
                  >
                    Description:
                  </Typography>
                  <Card
                    fullWidth
                    sx={{
                      borderRadius: "16px",
                      p: 1,
                      background: " rgba(255, 255, 255, 0.5)",
                      webkitBackdropFilter: "blur(5px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <Typography
                      align="left"
                      sx={{
                        fontSize: "0.75rem",
                      }}
                      color="text.primary"
                      gutterBottom
                    >
                      {pocket.description}
                    </Typography>
                  </Card>
                </Box>
              )
            )}
          </Grid>
          <Grid align="center" item xs={12} md={8}>
            {activitiesLoading ? (
              <Box>
                <Skeleton sx={{ mt: 2, height: 40 }} animation="wave" />
                <Skeleton sx={{ mt: 2, height: 40 }} animation="wave" />
                <Skeleton sx={{ mt: 2, height: 40 }} animation="wave" />
                <Skeleton sx={{ mt: 2, height: 40 }} animation="wave" />
              </Box>
            ) : (
              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    mb: 1,
                  }}
                  align="left"
                  color="text.secondary"
                >
                  Activity:
                </Typography>
                <Card
                  fullWidth
                  sx={{
                    p: 1,
                    borderRadius: "16px",
                    background: " rgba(255, 255, 255, 0.5)",
                    webkitBackdropFilter: "blur(5px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {activities &&
                    activities
                      .sort((a, b) => {
                        return new Date(b.time) - new Date(a.time);
                      })
                      .map((activity, i) => (
                        <Box
                          key={i}
                          sx={{
                            p: 1,
                            bgcolor: "transparent",
                            webkitBackdropFilter: "blur(5px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            borderBottom: "solid 0.5px #D6D7D7",
                            "&:hover": {
                              bgcolor: "#ebeded",
                            },
                          }}
                        >
                          <Grid container spacing={1}>
                            <Grid item xs={3}>
                              <Typography
                                align="left"
                                sx={{ fontSize: "0.75rem" }}
                                color="text.primary"
                              >
                                {new Date().getFullYear() ===
                                new Date(activity.time).getFullYear()
                                  ? String(new Date(activity.time)).slice(3, 10)
                                  : new Date(activity.time).slice(3, 15)}
                              </Typography>
                              <Typography
                                align="left"
                                sx={{
                                  fontSize: "0.7rem",
                                }}
                                color="text.primary"
                              >
                                {String(new Date(activity.time)).slice(15, 21)}
                              </Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography
                                align="left"
                                sx={{
                                  fontSize: "0.75rem",
                                  textTransform: "capitalize",
                                }}
                                // color="text.primary"
                              >
                                {activity.activityType}
                              </Typography>
                              <Typography
                                align="left"
                                sx={{
                                  fontSize: "0.7rem",
                                }}
                                color="text.primary"
                              >
                                {activity.details}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              alignItems="center"
                              justifyContent="center"
                              xs={1}
                            >
                              <Icon
                                title={activity.status}
                                sx={{
                                  fontSize: "1rem",
                                  "&:hover": { cursor: "pointer" },
                                }}
                                color={activity.status}
                              >
                                {activity.status === "success"
                                  ? "check_circle_outline"
                                  : activity.status === "failed"
                                  ? "highlight_off"
                                  : "adjust"}
                              </Icon>
                            </Grid>
                          </Grid>
                          {/* <Divider sx={{ my: 1 }} /> */}
                        </Box>
                      ))}
                </Card>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ height: "70px" }}></Box>
      {/* <FooterNavbar /> */}
      <AddMoney
        selectedPocket={pocket}
        open={openAddMoneyModal}
        closeModal={() => setOpenAddMoneyModal(false)}
      />
      <SendMoney
        selectedPocket={pocket}
        open={openSendMoneyModal}
        closeModal={() => setOpenSendMoneyModal(false)}
      />
      <PocketToPocketTransfer
        selectedPocket={pocket}
        open={openP2PTransferModal}
        closeModal={() => setOpenP2PTransferModal(false)}
      />
    </>
  );
};

export default Pocket;
