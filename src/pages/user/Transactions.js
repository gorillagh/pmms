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
} from "@mui/material";

import FooterNavbar from "../../components/Navbars/FooterNavbar";
import SubNavbar from "../../components/Navbars/SubNavbar";
import { getPockets, getUserPockets } from "../../serverFunctions/pocket";
import AddDefaultPocket from "../../components/PopUps/AddDefaultPocket";
import NonstickyFooter from "../../components/Footers/NonstickyFooter";

const Transactions = () => {
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
    dispatch({ type: "FOOTER_NAVIGATION", payload: 1 });
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
            My Transactions
          </Typography>
          <Grid align="center">
            <Avatar
              sx={{ width: "120px", height: "120px", alignItems: "center" }}
              sizes="large"
              align="center"
              component="h1"
              variant="h1"
            >
              <Icon sx={{ fontSize: "100px" }}>construction</Icon>
            </Avatar>
            <Typography align="center" sx={{ fontSize: "small" }}>
              This page is under construction
            </Typography>
          </Grid>
        </Container>
        <NonstickyFooter sx={{ mt: 8, mb: 4 }} />
        <Box sx={{ height: "70px" }}></Box>
      </Box>
      <FooterNavbar userPockets={userPockets} />
    </>
  );
};

export default Transactions;
