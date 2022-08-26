import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Icon,
  Skeleton,
  Typography,
  Tooltip,
} from "@mui/material";

import FooterNavbar from "../../components/Navbars/FooterNavbar";
import SubNavbar from "../../components/Navbars/SubNavbar";
import { getPockets, getUserPockets } from "../../serverFunctions/pocket";
import AddDefaultPocket from "../../components/PopUps/AddDefaultPocket";
import NonstickyFooter from "../../components/Footers/NonstickyFooter";
import Setups from "../../components/Views.js/Setups";

const Station = () => {
  const [recommendedView, setRecommendedView] = useState("pockets");
  const [userPockets, setUserPockets] = useState([]);
  const [unallocatedPercentage, setUnallocatedPercentage] = useState(Number);
  const [recommendedPockets, setRecommendedPockets] = useState([]);
  const [recommendedLoading, setReommendedLoading] = useState(false);
  const [pocketsLoading, setPocketsLoading] = useState(false);
  const [selectedAddPocket, setSelectedAddPocket] = useState({});
  const [openAddDefaultPocketModal, setOpenAddDefaultPocketModal] =
    useState(false);
  const [openCreatePocketModal, setOpenCreatePocketModal] = useState(false);

  const { user, moneyChange, pocketsView, footerNav } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const dispatch = useDispatch();

  const fetchUserPockets = () => {
    setPocketsLoading(true);
    getUserPockets(user.token, user._id)
      .then((res) => {
        console.log(res.data);
        setUserPockets(res.data.pockets);
        res.data.pockets.some((pocket) => {
          if (pocket.slug === "unallocated")
            setUnallocatedPercentage(pocket.percentage);
        });
        setPocketsLoading(false);
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
    dispatch({ type: "FOOTER_NAVIGATION", payload: 2 });
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
          <Typography
            sx={{
              fontWeight: "bold",
              mb: 4,
              fontFamily: "'Ubuntu', sans-serif",
            }}
            variant="p"
            component="h2"
          >
            Station
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "inherit", mt: 2, mb: 5 }}>
            <Button
              sx={{
                borderRadius: 6,
                flexGrow: 1,
                mx: 1,
                fontWeight: recommendedView === "pockets" ? "bold" : "",
                textTransform: "capitalize",
                boxShadow:
                  recommendedView !== "pockets"
                    ? "0 5px 10px rgba(0, 0, 0, 0.5)"
                    : "",
                fontSize: "12px",
                bgcolor: recommendedView === "pockets" ? "#000" : "#fff",
                color: recommendedView === "pockets" ? "#fff" : "",
                "&:hover": {
                  bgcolor: recommendedView === "pockets" ? "#000" : "#fff",
                  color: recommendedView === "pockets" ? "#fff" : "",
                },
              }}
              size="small"
              onClick={() => setRecommendedView("pockets")}
            >
              Pockets
            </Button>
            <Button
              sx={{
                borderRadius: 6,
                fontWeight: recommendedView === "setups" ? "bold" : "",
                flexGrow: 1,
                textTransform: "capitalize",
                boxShadow:
                  recommendedView !== "setups"
                    ? "0 5px 10px rgba(0, 0, 0, 0.5)"
                    : "",
                fontSize: "12px",
                fontSize: "12px",
                bgcolor: recommendedView === "setups" ? "#000" : "#fff",
                color: recommendedView === "setups" ? "#fff" : "",
                "&:hover": {
                  bgcolor: recommendedView === "setups" ? "#000" : "#fff",
                  color: recommendedView === "setups" ? "#fff" : "",
                },
              }}
              size="small"
              onClick={() => setRecommendedView("setups")}
            >
              Setups
            </Button>
            <Button
              sx={{
                borderRadius: 6,
                flexGrow: 1,
                mx: 1,
                fontWeight: recommendedView === "play-ground" ? "bold" : "",
                textTransform: "capitalize",
                boxShadow:
                  recommendedView !== "play-ground"
                    ? "0 5px 10px rgba(0, 0, 0, 0.5)"
                    : "",
                fontSize: "12px",
                bgcolor: recommendedView === "play-ground" ? "#000" : "#fff",
                color: recommendedView === "play-ground" ? "#fff" : "",
                "&:hover": {
                  bgcolor: recommendedView === "play-ground" ? "#000" : "#fff",
                  color: recommendedView === "play-ground" ? "#fff" : "",
                },
              }}
              size="small"
              onClick={() => setRecommendedView("play-ground")}
            >
              PlayGround
            </Button>
          </Box>
          <Box
            display={{ xs: "none", md: "block" }}
            sx={{ height: "40px" }}
          ></Box>

          <Grid
            display={recommendedView === "pockets" ? "" : "none"}
            align="center"
            alignItems="center"
            justifyContent="center"
            container
            spacing={3}
          >
            {recommendedLoading ? (
              <>
                <Grid align="center" item xs={6} md={3}>
                  {" "}
                  <Skeleton
                    sx={{ borderRadius: "50%" }}
                    height={180}
                    width={120}
                    animation="wave"
                  />
                </Grid>
                <Grid align="center" item xs={6} md={3}>
                  <Skeleton
                    sx={{ borderRadius: "50%" }}
                    height={180}
                    width={120}
                    animation="wave"
                  />
                </Grid>
                <Grid align="center" item xs={6} md={3}>
                  <Skeleton
                    sx={{ borderRadius: "50%" }}
                    height={180}
                    width={120}
                    animation="wave"
                  />
                </Grid>
                <Grid align="center" item xs={6} md={3}>
                  <Skeleton
                    sx={{ borderRadius: "50%" }}
                    height={180}
                    width={120}
                    animation="wave"
                  />
                </Grid>
              </>
            ) : (
              recommendedPockets &&
              recommendedPockets
                .sort((a, b) => {
                  if (userPockets.some((p) => p.slug === a.slug)) return 1;
                  if (userPockets.some((p) => p.slug === b.slug)) return -1;
                })
                .map((pocket, index) => (
                  <Grid key={index} item xs={6} md={3}>
                    <Badge
                      overlap="circular"
                      badgeContent={
                        userPockets.some((p) => p.slug === pocket.slug) ? (
                          <Icon color="success" fontSize="large">
                            check_circle
                          </Icon>
                        ) : (
                          <Icon
                            onClick={() => {
                              if (
                                userPockets.some((p) => p.slug === pocket.slug)
                              )
                                return;
                              setSelectedAddPocket(pocket);
                              setOpenAddDefaultPocketModal(true);
                            }}
                            fontSize="large"
                            sx={{ cursor: "pointer" }}
                          >
                            add_circle
                          </Icon>
                        )
                      }
                    >
                      <Box
                        id={index}
                        onClick={() => {
                          if (userPockets.some((p) => p.slug === pocket.slug))
                            return;
                          setSelectedAddPocket(pocket);
                          setOpenAddDefaultPocketModal(true);
                        }}
                        sx={{
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "120px",
                          height: "120px",
                          padding: "0px !important",
                          cursor: userPockets.some(
                            (p) => p.slug === pocket.slug
                          )
                            ? ""
                            : "pointer",
                          borderRadius: "50%",
                          background: userPockets.some(
                            (p) => p.slug === pocket.slug
                          )
                            ? "#d0d3cf"
                            : "rgba(255, 255, 255, 0.1)",
                          boxShadow: userPockets.some(
                            (p) => p.slug === pocket.slug
                          )
                            ? ""
                            : "0 4px 30px rgba(0, 0, 0, 0.2)",
                          webkitBackdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          "&:hover": {
                            boxShadow: userPockets.some(
                              (p) => p.slug === pocket.slug
                            )
                              ? ""
                              : "0 4px 30px rgba(0, 0, 0, 0.5)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: "80%",
                            boxSizing: "border-box",
                          }}
                        >
                          <Avatar
                            sx={{ bgcolor: pocket.color }}
                            aria-label="recipe"
                          >
                            <Icon sx={{}}>{pocket.icon}</Icon>
                          </Avatar>
                          <Typography
                            variant="small"
                            sx={{
                              fontSize: "small",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {pocket.title}
                          </Typography>
                        </Box>
                      </Box>
                    </Badge>
                  </Grid>
                ))
            )}
          </Grid>
          <Setups
            recommendedView={recommendedView}
            recommendedPockets={recommendedPockets}
          />

          {/* ///////////////floating unallocated Percentage//////////////////// */}
          <Box display={{ md: "none" }}>
            <Avatar
              sx={{
                width: "40px",
                height: "40px",
                bgcolor: "#ffeb7a",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                position: "fixed",
                zIndex: 4,
                top: "80px",
                right: "5px",
              }}
            >
              <Typography
                sx={{ fontSize: "10px", color: "#000", fontWeight: "bold" }}
              >
                {unallocatedPercentage}%
              </Typography>
            </Avatar>
          </Box>
          <Tooltip
            sx={{ position: "fixed", zIndex: 4, top: "100px", right: "100px" }}
            title="unallocated"
          >
            <Box display={{ xs: "none", md: "block" }}>
              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "#ffeb7a",

                  webkitBackdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Typography
                  sx={{ fontSize: "10px", color: "#000", fontWeight: "bold" }}
                >
                  {unallocatedPercentage}%
                </Typography>
              </Avatar>
            </Box>
          </Tooltip>
        </Container>
        <NonstickyFooter sx={{ mt: 8, mb: 4 }} />

        <Box sx={{ height: "70px" }}></Box>
      </Box>
      <FooterNavbar userPockets={userPockets} />
      <AddDefaultPocket
        open={openAddDefaultPocketModal}
        closeModal={() => setOpenAddDefaultPocketModal(false)}
        selectedPocket={selectedAddPocket}
        unallocatedPercentage={unallocatedPercentage}
        user={user}
        fetchUserPockets={fetchUserPockets}
      />
    </>
  );
};

export default Station;
