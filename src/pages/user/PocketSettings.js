import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Container,
  Divider,
  FilledInput,
  Icon,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import StyledBreadcrump from "../../components/Navbars/StyledBreadcrump";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import {
  getUserPocket,
  getPocketActivities,
  editPocket,
  deleteUserPocket,
  getUserPockets,
} from "../../serverFunctions/pocket";
import NumberFormat from "react-number-format";
import Confirmation from "../../components/PopUps/Confirmation";
import LoadingBackdrop from "../../components/PopUps/LoadingBackdrop";
import slugify from "slugify";

const PocketSettings = () => {
  const [pocket, setPocket] = useState({});
  const [userPockets, setUserPockets] = useState([]);
  const [unallocatedPercentage, setUnallocatedPercentage] = useState(Number);
  const [newTitle, setNewTitle] = useState("");
  const [newPercentage, setNewPercentage] = useState("");
  const [titleDisplay, setTitleDisplay] = useState("");
  const [titleFieldDisplay, setTitleFieldDisplay] = useState("none");
  const [percentageDisplay, setPercentageDisplay] = useState("");
  const [percentageFieldDisplay, setPercentageFieldDisplay] = useState("none");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationNote, setConfirmationNote] = useState("");
  const [titleChange, setTitleChange] = useState(false);
  const [percentageChange, setPercentageChange] = useState(false);
  const [status, setStatus] = useState("");
  const [dissolve, setDissolve] = useState(false);
  const [statusChange, setStatusChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pocketLoading, setPocketLoading] = useState(false);
  const { user, moneyChange } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const fetchUnallocatedPercentage = () => {
    getUserPockets(user.token, user._id)
      .then((res) => {
        console.log(res.data);
        res.data.pockets.some((p) => {
          if (p.slug === "unallocated")
            setUnallocatedPercentage(Number(p.percentage));
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  useEffect(() => {
    fetchPocket();
    fetchUnallocatedPercentage();
  }, [moneyChange, slug]);

  const handleTitleChange = async () => {
    try {
      setLoading(true);
      await editPocket(user.token, user._id, pocket.slug, {
        title: newTitle,
      }).then((res) => {
        if (res.data.error) {
          toast.error(res.data.error.message);
          console.log(res.data.error);
          setLoading(false);
          return;
        }
        toast.success(
          `Pocket name changed from "${pocket.title}" to "${newTitle}"`
        );
        setTitleDisplay("");
        setTitleFieldDisplay("none");
        setTitleChange(false);
        navigate(`/my/${slugify(newTitle).toLowerCase()}/pocket/settings`);
        setLoading(false);
      });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  const handlePercentageChange = async () => {
    try {
      setLoading(true);
      await editPocket(user.token, user._id, pocket.slug, {
        percentage: Number(newPercentage),
      }).then((res) => {
        if (res.data.error) {
          toast.error(res.data.error.message);
          console.log(res.data.error);
          setLoading(false);
          return;
        }
        toast.success(
          `Pocket percentage changed from "${pocket.percentage}%" to "${newPercentage}%"`
        );
        setPercentageDisplay("");
        setPercentageFieldDisplay("none");
        setPercentageChange(false);
        fetchPocket();
        fetchUnallocatedPercentage();
        setLoading(false);
      });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  const handleStatusChange = async () => {
    try {
      setLoading(true);
      await editPocket(user.token, user._id, pocket.slug, {
        status,
      }).then((res) => {
        if (res.data.error) {
          toast.error(res.data.error.message);
          console.log(res.data.error);
          setLoading(false);
          return;
        }
        toast.success(
          `"${pocket.title}" ${
            pocket.status === "active" ? "frozen" : "unfrozen"
          } `
        );

        setStatusChange(false);
        setStatus("");
        fetchPocket();
        setLoading(false);
      });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  const handleDissolve = async () => {
    try {
      setLoading(true);
      await deleteUserPocket(user.token, user._id, pocket.slug).then((res) => {
        if (res.data.error) {
          toast.error(res.data.error.message);
          console.log(res.data.error);
          setLoading(false);
          return;
        }
        toast.success(`"${pocket.title}" deleted`);

        setDissolve(false);

        navigate(`/my/dashboard`);
        setLoading(false);
      });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Box
        display={{ xs: "none", md: "block" }}
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
          <StyledBreadcrump pocket={pocket} />
        </Container>
      </Box>
      {/* /////////////////////////////////////////////////// */}
      <Box
        display={{ xs: "block", md: "none" }}
        sx={{
          // bgcolor: "background.paper",
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
            <Grid item xs={1}>
              <IconButton
                title="Back to Dashboard"
                onClick={() => navigate(`/my/${pocket.slug}/pocket`)}
              >
                {/* <Icon>keyboard_backspace</Icon>  */}
                <Icon>keyboard_backspace</Icon>
              </IconButton>{" "}
            </Grid>
            <Grid align="center" item xs={11} sx={{ px: 2 }}>
              {pocketLoading ? (
                <Skeleton width="50%" />
              ) : (
                <Typography
                  align="center"
                  sx={{
                    textTransform: "capitalize",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  <Icon
                    sx={{ color: pocket.color ? pocket.color : "#000" }}
                    fontSize="small"
                  >
                    settings{" "}
                  </Icon>{" "}
                  Settings - {pocket.title}
                </Typography>
              )}
            </Grid>
            {/* <Grid item align="right" xs={1}>
              <IconButton
                onClick={() => navigate(`/my/${pocket.slug}/pocket/settings`)}
                title="Pocket Settings"
              >
                <Icon>menu</Icon>
              </IconButton>{" "}
            </Grid> */}
          </Grid>
        </Container>
      </Box>

      {/* ///////////////////////////////////////////////////////// */}
      <Container sx={{ pt: 8 }} maxWidth="xl">
        <Typography
          display={{ xs: "none", md: "block" }}
          // component="h1"
          // variant="h6"
          align="center"
          sx={{
            // fontWeight: "bold",
            textTransform: "capitalize",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {pocketLoading ? (
            <Skeleton sx={{ margin: "auto" }} width="50%" />
          ) : (
            <>
              <Icon fontSize="small">settings </Icon> Settings - {pocket.title}
            </>
          )}
        </Typography>

        <Grid mt={2} container spacing={2}>
          <Grid
            item
            sx={{ display: { xs: "none", md: "block" } }}
            md={3}
          ></Grid>
          <Grid item xs={12} md={6}>
            <Card
              fullWidth
              sx={{
                p: 1,
                borderRadius: "16px",
                background: " rgba(255, 255, 255, 0.5)",
                // boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                webkitBackdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {" "}
              {pocketLoading ? (
                <Skeleton sx={{ margin: "auto" }} width="70%" />
              ) : (
                <Grid container>
                  <Grid align="center" item xs={4}>
                    <Typography fontSize="small">Pocket Name:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography
                      sx={{ textTransform: "capitalize" }}
                      display={titleDisplay}
                    >
                      {pocket.title}
                    </Typography>
                    <Typography display={titleFieldDisplay}>
                      <Input
                        autoFocus
                        size="small"
                        sx={{ width: "80%" }}
                        margin="normal"
                        required
                        id="newTitle"
                        name="newTitle"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography
                      display={titleDisplay}
                      title="Change pocket name"
                      sx={{
                        cursor:
                          pocket.slug === "unallocated" ||
                          pocket.primary === true
                            ? "auto"
                            : "pointer",
                      }}
                      fontSize="small"
                      onClick={() => {
                        if (
                          pocket.slug === "unallocated" ||
                          pocket.primary === true
                        )
                          return;
                        setNewTitle(pocket.title);
                        setTitleDisplay("none");
                        setTitleFieldDisplay("");
                        setPercentageDisplay("");
                        setPercentageFieldDisplay("none");
                      }}
                    >
                      <Icon
                        sx={{
                          color:
                            pocket.slug === "unallocated" ||
                            pocket.primary === true
                              ? "#BDBDBD"
                              : "#0F7AE7",
                        }}
                        fontSize="small"
                      >
                        edit
                      </Icon>{" "}
                    </Typography>
                    <Typography fullWidth display={titleFieldDisplay}>
                      <Icon
                        variant="outlined"
                        title="Save"
                        sx={{
                          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",

                          bgcolor: "green",
                          color: "#fff",
                          cursor: "pointer",
                          borderRadius: 6,
                          mx: 0,
                          px: 1,
                        }}
                        fontSize="small"
                        onClick={() => {
                          if (
                            pocket.title.toLowerCase() ===
                            newTitle.toLowerCase()
                          ) {
                            setTitleDisplay("");
                            setTitleFieldDisplay("none");
                            return;
                          }
                          setConfirmationTitle("Change Pocket Name");
                          setConfirmationMessage(
                            `Are you sure you want to change pocket name from "${pocket.title}" to "${newTitle}"?`
                          );
                          setOpenConfirmationModal(true);
                          setTitleChange(true);
                        }}
                      >
                        <Icon fontSize="small">check</Icon>{" "}
                      </Icon>
                    </Typography>
                  </Grid>
                </Grid>
              )}
              <Divider sx={{ my: 2 }} />
              {/* ///////PercentageChange////////////// */}
              {pocketLoading ? (
                <Skeleton sx={{ margin: "auto" }} width="70%" />
              ) : (
                <Grid container>
                  <Grid align="center" item xs={4}>
                    <Typography fontSize="small">Percentage:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography
                      sx={{ textTransform: "capitalize" }}
                      display={percentageDisplay}
                    >
                      {pocket.percentage}%
                    </Typography>
                    <Typography
                      sx={{ m: 0, p: 0 }}
                      display={percentageFieldDisplay}
                    >
                      <Input
                        type="number"
                        focused="true"
                        size="small"
                        sx={{ width: "30%", m: 0, p: 0 }}
                        margin="normal"
                        required
                        id="newPercentage"
                        name="newPercentage"
                        value={newPercentage}
                        onChange={(e) => {
                          setNewPercentage(e.target.value);
                        }}
                        endAdornment={
                          <InputAdornment sx={{ m: 0, p: 0 }} position="end">
                            %
                          </InputAdornment>
                        }
                      />
                      <Typography fontSize="small">
                        You can increase percentage by a maximum of{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {unallocatedPercentage}%{" "}
                        </span>
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography
                      display={percentageDisplay}
                      title="Change percentage"
                      sx={{
                        cursor:
                          pocket.slug === "unallocated" ? "auto" : "pointer",
                      }}
                      fontSize="small"
                      onClick={() => {
                        if (pocket.slug === "unallocated") return;
                        setNewPercentage(pocket.percentage);
                        setPercentageDisplay("none");
                        setPercentageFieldDisplay("");
                        setTitleDisplay("");
                        setTitleFieldDisplay("none");
                      }}
                    >
                      <Icon
                        sx={{
                          color:
                            pocket.slug === "unallocated"
                              ? "#BDBDBD"
                              : "#0F7AE7",
                        }}
                        fontSize="small"
                      >
                        edit
                      </Icon>{" "}
                    </Typography>
                    <Typography fullWidth display={percentageFieldDisplay}>
                      <Icon
                        variant="outlined"
                        title="Save"
                        sx={{
                          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",

                          bgcolor: "green",
                          color: "#fff",
                          cursor: "pointer",
                          borderRadius: 6,
                          mx: 0,
                          px: 1,
                        }}
                        fontSize="small"
                        onClick={() => {
                          if (
                            Number(newPercentage) - Number(pocket.percentage) >
                              unallocatedPercentage ||
                            newPercentage < 0 ||
                            !newPercentage ||
                            newPercentage === ""
                          ) {
                            toast.error(
                              `Please set the right percentage for this pocket (0 - ${
                                unallocatedPercentage + pocket.percentage
                              })%`
                            );
                            return;
                          }
                          if (
                            Number(pocket.percentage) === Number(newPercentage)
                          ) {
                            setPercentageDisplay("");
                            setPercentageFieldDisplay("none");
                            return;
                          }
                          setConfirmationTitle("Change Percentage");
                          setConfirmationMessage(
                            `Are you sure you want to change pocket percentage from "${pocket.percentage}%" to "${newPercentage}%"?`
                          );
                          setOpenConfirmationModal(true);
                          setPercentageChange(true);
                        }}
                      >
                        <Icon fontSize="small">save</Icon>{" "}
                      </Icon>
                    </Typography>
                  </Grid>
                </Grid>
              )}
              <Divider sx={{ mt: 2, mb: 3 }} />
              {/* ///////////////freez////////////////////         */}
              {pocketLoading ? (
                <Skeleton sx={{ margin: "auto" }} width="50%" />
              ) : pocket.slug === "unallocated" ? (
                ""
              ) : (
                <Grid
                  display={pocket.slug === "unallocated" ? "none" : ""}
                  container
                >
                  <Grid align="center" item xs={4}></Grid>
                  <Grid item xs={8}>
                    <Link
                      title={`Freeze ${pocket.title} pocket`}
                      variant="contained"
                      sx={{
                        color: "#0F7AE7",
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                      onClick={() => {
                        if (pocket.status === "active") {
                          setStatus("frozen");
                          setConfirmationTitle("Freeze Pocket");
                          setConfirmationMessage(
                            `Are you sure you want to freeze "${pocket.title}" pocket?`
                          );
                          setConfirmationNote(
                            <Typography fontSize="small">
                              When you freeze a pocket, you will neither be able
                              to cashout nor transfer money from the pocket. You
                              may only add money to the pocket.
                              <Link color="#0F7AE7"> Learn more </Link>
                              about freezing a pocket
                            </Typography>
                          );
                        } else {
                          setStatus("active");
                          setConfirmationTitle("Unfreeze Pocket");
                          setConfirmationMessage(
                            `Are you sure you want to Unfreeze "${pocket.title}" pocket`
                          );
                          setConfirmationNote("");
                        }
                        setTitleFieldDisplay("none");
                        setTitleDisplay("");
                        setPercentageFieldDisplay("none");
                        setPercentageDisplay("");
                        setOpenConfirmationModal(true);
                        setStatusChange(true);
                      }}
                    >
                      {pocket.status === "frozen" ? "Unfreeze" : "Freeze"}{" "}
                      Pocket
                    </Link>

                    <Button
                      sx={{
                        cursor: "auto",
                        ml: 2,
                        padding: 0,
                        "&:hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <Tooltip
                        title="When you freeze a pocket, you will not be able cashout nor transfer money from the pocket. You can only add money to the pocket"
                        arrow
                        placement="top"
                      >
                        <Icon
                          sx={{ cursor: "pointer", m: 0, p: 0 }}
                          fontSize="small"
                        >
                          info
                        </Icon>
                      </Tooltip>
                    </Button>
                  </Grid>
                </Grid>
              )}
              {pocket.slug === "unallocated" ? (
                ""
              ) : (
                <Divider sx={{ mt: 2, mb: 3 }} />
              )}
              {/* ////////////Dissolve///////////////// */}
              {pocketLoading ? (
                <Skeleton sx={{ margin: "auto" }} width="50%" />
              ) : pocket.slug === "unallocated" ? (
                ""
              ) : (
                <Grid
                  display={pocket.slug === "unallocated" ? "none" : ""}
                  container
                >
                  <Grid align="center" item xs={4}></Grid>
                  <Grid item xs={7}>
                    <Link
                      title={`Freeze ${pocket.title} pocket`}
                      variant="contained"
                      sx={{
                        color: "#df4759",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setConfirmationTitle("Delete Pocket");
                        setConfirmationMessage(
                          `Are you sure you want to delete "${pocket.title}" pocket?`
                        );
                        setConfirmationNote(
                          "Money in the pocket will be transfered to your unallocated pocket and the pocket will be deleted."
                        );
                        setTitleFieldDisplay("none");
                        setTitleDisplay("");
                        setPercentageFieldDisplay("none");
                        setPercentageDisplay("");
                        setOpenConfirmationModal(true);
                        setDissolve(true);
                      }}
                    >
                      Delete Pocket
                    </Link>
                  </Grid>
                  <Grid item xs={1}></Grid>
                </Grid>
              )}
            </Card>
          </Grid>
          <Grid
            item
            sx={{ display: { xs: "none", md: "block" } }}
            md={3}
          ></Grid>
        </Grid>
        <Confirmation
          open={openConfirmationModal}
          closeModal={() => setOpenConfirmationModal(false)}
          confirmationTitle={confirmationTitle}
          confirmationMessage={confirmationMessage}
          confirmationNote={confirmationNote}
          next={
            titleChange
              ? handleTitleChange
              : percentageChange
              ? handlePercentageChange
              : statusChange
              ? handleStatusChange
              : dissolve
              ? handleDissolve
              : null
          }
        />
      </Container>
      <LoadingBackdrop open={loading} />
    </>
  );
};

export default PocketSettings;
