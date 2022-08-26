import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { auth } from "../../firebase";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import {
  Button,
  Container,
  Grid,
  Popover,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import Card from "@mui/material/Card";
import Badge from "@mui/material/Badge";

import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Icon from "@mui/material/Icon";
import SendMoney from "../../components/PopUps/SendMoney";
import NumberFormat from "react-number-format";
import NonstickyFooter from "../../components/Footers/NonstickyFooter";

import { getPockets, getUserPockets } from "../../serverFunctions/pocket";
import AddDefaultPocket from "../../components/PopUps/AddDefaultPocket";
import CreatePocket from "../../components/PopUps/CreatePocket";
import MorePocketOptions from "../../components/PopUps/MorePocketOptions";
import AddMoney from "../../components/PopUps/AddMoney";
import PocketToPocketTransfer from "../../components/PopUps/PocketToPocketTransfer";
import MoreUnallocatedOptions from "../../components/PopUps/MoreUnallocatedOptions";
import FooterNavbar from "../../components/Navbars/FooterNavbar";
import SubNavbar from "../../components/Navbars/SubNavbar";

const Dashboard = () => {
  const [pocketsLoading, setPocketsLoading] = useState(false);
  const [userPockets, setUserPockets] = useState([]);
  const [selectedPocket, setSelectedPocket] = useState({});
  const [unallocatedPercentage, setUnallocatedPercentage] = useState(Number);
  const [recommendedPockets, setRecommendedPockets] = useState([]);
  const [recommendedView, setRecommendedView] = useState("pockets");
  const [recommendedLoading, setReommendedLoading] = useState(false);
  const [selectedAddPocket, setSelectedAddPocket] = useState({});
  const [openSendMoneyModal, setOpenSendMoneyModal] = useState(false);
  const [openAddMoneyModal, setOpenAddMoneyModal] = useState(false);
  const [openP2PTransferModal, setOpenP2PTransferModal] = useState(false);

  const [openAddDefaultPocketModal, setOpenAddDefaultPocketModal] =
    useState(false);

  const [openCreatePocketModal, setOpenCreatePocketModal] = useState(false);
  const [openMoreUnallocatedOptionsModal, setOpenMoreUnallocatedOptionsModal] =
    useState(false);

  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const { user, moneyChange, pocketsView, footerNav } = useSelector(
    (state) => ({
      ...state,
    })
  );
  const dispatch = useDispatch();

  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [openMorePocketOptionsModal, setOpenMorePocketOptionsModal] =
    useState(false);
  const loadingPockets = [1, 2, 3, 4, 5, 6];
  const handleMoreOptionsClick = async (event) => {
    const e = await event.target;
    setTop(e.getBoundingClientRect().top);
    setLeft(e.getBoundingClientRect().left);
    setOpenMorePocketOptionsModal(true);
  };
  const handleMoreUnallocatedOptionsClick = async (event) => {
    const e = await event.target;
    setTop(e.getBoundingClientRect().top);
    setLeft(e.getBoundingClientRect().left);
    setOpenMoreUnallocatedOptionsModal(true);
  };

  const fetchUserPockets = () => {
    setPocketsLoading(true);
    // let fbUser = auth.currentUser;
    // const idTokenResult = await fbUser.getIdTokenResult();
    getUserPockets(user.token, user._id)
      .then((res) => {
        console.log(res.data);
        setUserPockets(
          res.data.pockets.sort((a, b) => {
            return new Date(b.time) - new Date(a.time);
          })
        );
        res.data.pockets.some((pocket) => {
          if (pocket.slug === "unallocated")
            setUnallocatedPercentage(pocket.percentage);
        });
        setPocketsLoading(false);
        // if (!pockets.data) {
        //   //ask if user wants to generate pockets
        //   //if user replies yes,
        //   //show questionnaire
        //   //if questionnaire completed and saved, update users pockets with appropriate pockets, and fetuserpockets.
        //   //if user replies no,
        //   //take user to dashboard
        // } else {
        //   //take user to dashboard
        // }
      })
      .catch((error) => {
        setPocketsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserPockets();
  }, [moneyChange]);

  const fetchRecommendedPockets = () => {
    setReommendedLoading(true);
    getPockets(user.token)
      .then((res) => {
        setRecommendedPockets(res.data);
        setReommendedLoading(false);
      })
      .catch((error) => {
        setReommendedLoading(false);
        toast.error(error.message);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchRecommendedPockets();
    dispatch({ type: "FOOTER_NAVIGATION", payload: 0 });
  }, []);

  return (
    <>
      <SubNavbar userPockets={userPockets} />
      <Box display={{ xs: "none", md: "block" }} sx={{ mb: 8 }}></Box>
      <Box sx={{ p: 0 }}>
        <Container
          sx={{
            pt: 2,
          }}
        >
          {/* <TabPanel value={footerNav} index={0}> */}
          <Grid container>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  mb: 4,
                  fontFamily: "'Ubuntu', sans-serif",
                }}
                variant="p"
                component="h2"
              >
                My Pockets
              </Typography>
            </Grid>
            <Grid display={{ md: "none" }} align="right" item xs={6}>
              <ToggleButtonGroup
                size="small"
                sx={{ fontSize: "small" }}
                orientation="horizontal"
                value={pocketsView}
                exclusive
                // onChange={(e, nextView) => {
                //   nextView !== null && setView(nextView);
                // }}
                onChange={(e, nextView) => {
                  nextView !== null &&
                    dispatch({ type: "VIEW_CHANGE", payload: nextView });
                }}
              >
                <ToggleButton value="list" aria-label="list">
                  <Icon fontSize="small">view_list</Icon>
                </ToggleButton>
                <ToggleButton value="grid" aria-label="module">
                  <Icon fontSize="small">grid_view</Icon>
                </ToggleButton>
              </ToggleButtonGroup>
              {/* <Button
                  sx={{
                    p: 0,
                    mx: 1,
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                    borderRadius: 6,
                    border: "solid #495e51",
                    borderWidth: 1,
                    padding: 2,
                    paddingTop: 1,
                    paddingBottom: 1,
                    "&:hover": {
                      bgcolor: "#336c4c",
                      color: "#fff",
                    },
                    textTransform: "none",
                  }}
                  variant="contained"
                  onClick={() => setOpenSendMoneyModal(true)}
                >
                  <Icon fontSize="small">arrow_downward</Icon>Send
                </Button> */}
            </Grid>
          </Grid>
          <Grid
            alignItems="center"
            justifyContent="center"
            container
            spacing={4}
            // display={pocketsView === "list" ? "" : "none"}
            display={{
              xs:
                pocketsView === "grid" ? "none" : pocketsView === "list" && "",
              md:
                pocketsView === "grid"
                  ? "flex"
                  : pocketsView === "list" && "flex",
            }}
          >
            {pocketsLoading ? (
              <>
                <Grid align="center" item xs={12} md={4}>
                  <Skeleton
                    sx={{
                      borderRadius: "16px",
                      height: "200px",
                      width: "356px",
                    }}
                    animation="wave"
                  />
                </Grid>
                <Grid align="center" item xs={12} md={4}>
                  <Skeleton
                    sx={{
                      borderRadius: "16px",
                      height: "200px",
                      width: "356px",
                    }}
                    animation="wave"
                  />
                </Grid>
                <Grid align="center" item xs={12} md={4}>
                  <Skeleton
                    sx={{
                      borderRadius: "16px",
                      height: "200px",
                      width: "356px",
                    }}
                    animation="wave"
                  />
                </Grid>
              </>
            ) : (
              userPockets
                .filter((p) => {
                  if (
                    p.slug === "unallocated" &&
                    Number(p.percentage) <= 0 &&
                    Number(p.amount) &&
                    Number(p.amount <= 0)
                  )
                    return false;
                  return true;
                })
                .map((pocket, index) => (
                  <Grid align="center" key={index} item xs={12} md={4}>
                    <Card
                      sx={{
                        // padding: "0px !important",
                        height: pocket.slug === "unallocated" ? "135px" : "",
                        bgcolor: pocket.slug === "unallocated" && "#000",
                        p: pocket.slug !== "unallocated" ? 2 : "4px",
                        cursor: "pointer",
                        borderRadius: "12px",
                        background:
                          pocket.slug === "unallocated"
                            ? "rgba(165,234,191, 0.3)"
                            : "rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          pocket.slug === "unallocated"
                            ? ""
                            : "0 4px 30px rgba(0, 0, 0, 0.2)",
                        webkitBackdropFilter: "blur(5px)",
                        border:
                          pocket.slug === "unallocated"
                            ? ""
                            : "1px solid rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          cursor: pocket.slug === "unallocated" && "auto ",

                          boxShadow:
                            pocket.slug !== "unallocated" &&
                            "0 4px 30px rgba(0, 0, 0, 0.5)",
                        },
                      }}
                      onClick={(e) => {
                        if (e.target.innerHTML === "more_horiz") {
                          setSelectedPocket(pocket);
                          handleMoreOptionsClick(e);
                          return;
                        }
                        if (pocket.slug !== "unallocated")
                          navigate(`/my/${pocket.slug}/pocket`);
                      }}
                    >
                      {pocket.slug === "unallocated" ? (
                        <Box sx={{ p: 1 }}>
                          <CardHeader
                            sx={{ paddingBottom: 0 }}
                            action={
                              <Typography
                                bgcolor="#e27d6d"
                                color="#fff"
                                variant="small"
                                sx={{
                                  borderRadius: "25%",
                                  padding: 0.5,
                                  fontSize: "0.7rem",
                                }}
                              >
                                {pocket.percentage}%
                              </Typography>
                            }
                            title={
                              <>
                                <Typography
                                  sx={{
                                    fontWeight: 800,
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {pocket.title}
                                </Typography>
                                {pocket.amount > 0 && (
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      fontFamily: "'Titillium Web', sans-serif",
                                    }}
                                  >
                                    (
                                    <NumberFormat
                                      value={pocket.amount ? pocket.amount : 0}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                      prefix={"GH₵ "}
                                      decimalSeparator="."
                                      decimalScale={2}
                                    />
                                    )
                                  </Typography>
                                )}
                              </>
                            }
                          />
                          <CardMedia
                            sx={{
                              fontWeight: 600,
                              fontFamily: "'Titillium Web', sans-serif",
                            }}
                            component="h4"
                            height="100"
                            align="center"
                          >
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="center"
                              align="center"
                            >
                              {pocket.amount > 0 && (
                                <Grid item xs={6}>
                                  <Button
                                    sx={{
                                      textTransform: "capitalize",
                                      borderRadius: 6,
                                    }}
                                    variant="outlined"
                                    onClick={() => {
                                      setSelectedPocket(pocket);
                                      setOpenP2PTransferModal(true);
                                    }}
                                  >
                                    transfer Money
                                  </Button>
                                </Grid>
                              )}
                              {pocket.percentage > 0 && (
                                <Grid item xs={6}>
                                  <Button
                                    sx={{
                                      textTransform: "capitalize",
                                      borderRadius: 6,
                                      bgcolor: "#3FA24F",
                                    }}
                                    variant="contained"
                                    onClick={() => {
                                      if (pocket.slug === "unallocated") {
                                        let unallocatedPocket =
                                          userPockets.find(
                                            (pocket) =>
                                              pocket.slug === "unallocated"
                                          );
                                        setUnallocatedPercentage(
                                          unallocatedPocket.percentage
                                        );
                                        setOpenCreatePocketModal(true);
                                      }
                                    }}
                                  >
                                    Add Pocket
                                  </Button>
                                </Grid>
                              )}
                            </Grid>
                          </CardMedia>
                        </Box>
                      ) : (
                        <>
                          <Grid container spacing={1}>
                            <Grid item align="left" xs={10}></Grid>
                            <Grid
                              sx={{ pt: "8px !important" }}
                              item
                              align="right"
                              xs={2}
                            >
                              <Icon
                                sx={{
                                  bgcolor: "#fff",
                                  borderRadius: "25%",
                                  px: "4px",

                                  color: pocket.icon ? pocket.color : "#000",
                                }}
                              >
                                more_horiz
                              </Icon>
                            </Grid>
                          </Grid>

                          <Grid spacing={2} container>
                            <Grid item xs={3}>
                              <Avatar
                                sx={{
                                  bgcolor: pocket.icon ? pocket.color : "#000",
                                  // opacity: "0.9",
                                }}
                                aria-label="pocket"
                              >
                                <Icon sx={{ color: "#fff" }}>
                                  {pocket.icon
                                    ? pocket.icon
                                    : "account_balance_wallet_rounded"}
                                </Icon>
                              </Avatar>
                            </Grid>
                            <Grid item xs={8}>
                              <Box sx={{ textAlign: "left" }}>
                                <Typography
                                  sx={{
                                    // height: "48px",
                                    fontSize: 16,
                                    mb: "5px",
                                    textTransform: "capitalize",
                                    fontWeight: 800,
                                  }}
                                  // variant="p"
                                  component="div"
                                >
                                  {pocket.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontFamily: "'Titillium Web', sans-serif",
                                    mb: "5px",
                                  }}
                                  // variant="h6"
                                  component="div"
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
                                    value={pocket.amount}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    // prefix={"GH₵ "}
                                    decimalSeparator="."
                                    decimalScale={2}
                                  />
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "text.secondary",
                                  }}
                                >
                                  {pocket.percentage}%
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Card>
                  </Grid>
                ))
            )}
          </Grid>
          {/* ///////////////////////////////////////////////////////////// */}
          <Grid
            alignItems="center"
            justifyContent="center"
            container
            spacing={2}
            display={{
              xs: pocketsView === "grid" ? "" : "none",
              md: pocketsView === "grid" ? "none" : "",
            }}
          >
            {" "}
            {pocketsLoading
              ? loadingPockets.map((p, index) => (
                  <Grid align="center" key={index} item xs={6}>
                    <Skeleton
                      sx={{
                        height: "90px",
                        width: "50px",
                        p: 1,
                        borderRadius: "20%",
                      }}
                      animation="wave"
                    />
                  </Grid>
                ))
              : userPockets
                  .filter((p) => {
                    if (
                      p.slug === "unallocated" &&
                      p.percentage <= 0 &&
                      // p.amount &&
                      p.amount <= 0
                    )
                      return false;
                    return true;
                  })
                  .map((pocket, index) => {
                    return (
                      <Grid align="center" key={index} item xs={6}>
                        <Box
                          sx={{
                            bgcolor: "transparent",
                            p: "0px",
                            border: "none",
                          }}
                        >
                          <Badge
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "",
                            }}
                            max={999999999999}
                            sx={{
                              fontSize: "small",
                            }}
                            color="primary"
                            badgeContent={
                              pocket.slug === "unallocated" ? (
                                "Unallocated"
                              ) : (
                                <Typography variant="small">
                                  <NumberFormat
                                    value={
                                      pocket.amount
                                        ? pocket.amount.toFixed(2)
                                        : 0
                                    }
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"₵ "}
                                    decimalSeparator="."
                                    decimalScale={2}
                                  />
                                </Typography>
                              )
                            }
                            onClick={(e) => {
                              if (pocket.slug === "unallocated") {
                                setSelectedPocket(pocket);
                                handleMoreUnallocatedOptionsClick(e);
                              } else navigate(`/my/${pocket.slug}/pocket`);
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignContent: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "70px",
                                width: "70px",
                                p: 1,
                                opacity: "0.9",
                                borderRadius: "20%",
                                bgcolor: pocket.color,
                                boxShadow:
                                  pocket.slug === "unallocated"
                                    ? "0 4px 30px rgba(0, 0, 0, 0.3)"
                                    : "",
                              }}
                            >
                              <Icon
                                sx={{ color: "#fff", my: "auto" }}
                                fontSize="large"
                                onClick={(e) => {
                                  if (pocket.slug === "unallocated") {
                                    setSelectedPocket(pocket);
                                    handleMoreUnallocatedOptionsClick();
                                  } else navigate(`/my/${pocket.slug}/pocket`);
                                }}
                              >
                                {pocket.icon
                                  ? pocket.icon
                                  : "account_balance_wallet_rounded"}
                              </Icon>
                            </Box>
                          </Badge>

                          <Box sx={{ mb: 2 }}>
                            <Typography
                              sx={{
                                fontWeight: "bold",
                                height: "48px",
                              }}
                              align="center"
                            >
                              <span>
                                <span>{pocket.title} </span>

                                <small style={{ fontWeight: "normal" }}>
                                  {pocket.percentage}%
                                </small>
                              </span>
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
          </Grid>
        </Container>
        <FooterNavbar userPockets={userPockets} />
        <AddMoney
          selectedPocket={selectedPocket}
          open={openAddMoneyModal}
          closeModal={() => setOpenAddMoneyModal(false)}
        />
        <SendMoney
          selectedPocket={selectedPocket}
          open={openSendMoneyModal}
          closeModal={() => setOpenSendMoneyModal(false)}
        />
        <PocketToPocketTransfer
          selectedPocket={selectedPocket}
          open={openP2PTransferModal}
          closeModal={() => setOpenP2PTransferModal(false)}
        />
        <AddDefaultPocket
          open={openAddDefaultPocketModal}
          closeModal={() => setOpenAddDefaultPocketModal(false)}
          selectedPocket={selectedAddPocket}
          unallocatedPercentage={unallocatedPercentage}
          user={user}
          fetchUserPockets={fetchUserPockets}
        />

        <CreatePocket
          open={openCreatePocketModal}
          setOpenAddDefaultPocketModal={setOpenAddDefaultPocketModal}
          closeModal={() => setOpenCreatePocketModal(false)}
          unallocatedPercentage={unallocatedPercentage}
          user={user}
          setSelectedAddPocket={setSelectedAddPocket}
          userPockets={userPockets}
          fetchUserPockets={fetchUserPockets}
          recommendedPockets={recommendedPockets}
        />
        <MorePocketOptions
          open={openMorePocketOptionsModal}
          closeModal={() => setOpenMorePocketOptionsModal(false)}
          top={top}
          left={left}
          selectedPocket={selectedPocket}
          setOpenSendMoneyModal={setOpenSendMoneyModal}
          setOpenAddMoneyModal={setOpenAddMoneyModal}
          setOpenP2PTransferModal={setOpenP2PTransferModal}
        />
        <MoreUnallocatedOptions
          open={openMoreUnallocatedOptionsModal}
          closeModal={() => setOpenMoreUnallocatedOptionsModal(false)}
          top={top}
          left={left}
          selectedPocket={selectedPocket}
          setOpenP2PTransferModal={setOpenP2PTransferModal}
          setOpenCreatePocketModal={setOpenCreatePocketModal}
        />

        <NonstickyFooter sx={{ mt: 8, mb: 4 }} />
        <Box sx={{ height: "70px" }}></Box>
      </Box>
    </>
  );
};

export default Dashboard;
