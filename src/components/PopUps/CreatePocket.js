import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { toast } from "react-toastify";
import LoadingBackdrop from "./LoadingBackdrop";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Badge from "@mui/material/Badge";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { createUserPocket } from "../../serverFunctions/pocket";
import slugify from "slugify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: 250,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  px: 2,
  py: 2,
  overflowY: "scroll",
};

const CreatePocket = ({
  open,
  closeModal,
  user,
  fetchUserPockets,
  userPockets,
  recommendedPockets,
  unallocatedPercentage,
  setOpenAddDefaultPocketModal,
  setSelectedAddPocket,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unallocated, setUnallocated] = useState(Number);
  const [percentage, setPercentage] = useState(Number);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open === false) {
      setTitle("");
      setPercentage("");
      setDescription("");
      setNotes("");
    }
  }, [open]);

  const handleAddPocket = async (e) => {
    e.preventDefault();
    try {
      if (!title || title.length < 2) {
        toast.error("Please input a title of more than 1 character");
        return;
      }
      if (Number(percentage) <= 0) {
        toast.error("Percentage must be greater than 0");
        return;
      }
      if (Number(percentage) > Number(unallocatedPercentage)) {
        toast.error(`Percentage must be lower than ${unallocatedPercentage}%`);
        return;
      }
      setLoading(true);
      const newPocket = {
        title: title,
        percentage: Number(percentage),
        color: "#000",
        description,
        notes,
        primary: false,
      };
      await recommendedPockets.some((p) => {
        if (p.slug === slugify(title).toLocaleLowerCase()) {
          newPocket.icon = p.icon;
          newPocket.color = p.color;
        }
      });
      console.log("recommendedPockets--->", recommendedPockets);

      console.log("NewPocketInfrontEnd--->", newPocket);

      await createUserPocket(user.token, user._id, newPocket)
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.error.message);
            console.log(res.data.error);
            setLoading(false);
            return;
          }
          toast.success(`"${title}" pocket created`);
          setTitle("");
          setPercentage("");
          setDescription("");
          setNotes("");
          closeModal();
          setLoading(false);
          fetchUserPockets();
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => closeModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid sx={{ mb: 4 }} container>
            <Grid item xs={11}>
              <Typography
                sx={{ fontWeight: "bold" }}
                id="modal-modal-title"
                variant="h6"
                component="h2"
              >
                <Icon fontSize="small">dashboard_customize </Icon> Add Pocket
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => closeModal()} size="small">
                <Icon fontSize="small">close</Icon>
              </IconButton>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={7}>
              <Typography sx={{ fontSize: "small", fontWeight: "bold" }}>
                Recommended
              </Typography>
            </Grid>
            <Grid align="right" item xs={5}>
              <Link
                sx={{ fontSize: "10px", cursor: "pointer", color: "#0F7AE7" }}
              >
                See more
              </Link>
            </Grid>
          </Grid>
          <Box
            sx={{
              mb: 1,
              p: 1,
              height: "220px",
              borderRadius: "16px",
              background: " rgba(255, 255, 255, 0.5)",
              webkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(0, 0, 0, 0.2)",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            {/* ////////////////////////////////////////////////// */}
            <Grid container align="center" spacing={1}>
              {recommendedPockets &&
                recommendedPockets
                  .sort((a, b) => {
                    if (userPockets.some((p) => p.slug === a.slug)) return 1;
                    if (userPockets.some((p) => p.slug === b.slug)) return -1;
                  })
                  .map((pocket, index) => (
                    <Grid key={index} item xs>
                      <Badge
                        overlap="circular"
                        badgeContent={
                          userPockets.some((p) => p.slug === pocket.slug) ? (
                            <Icon sx={{ fontSize: "20px" }} color="success">
                              check_circle
                            </Icon>
                          ) : (
                            <Icon
                              sx={{ fontSize: "20px", cursor: "pointer" }}
                              color="primary"
                              onClick={() => {
                                if (
                                  userPockets.some(
                                    (p) => p.slug === pocket.slug
                                  )
                                )
                                  return;
                                setSelectedAddPocket(pocket);
                                setOpenAddDefaultPocketModal(true);
                                // let unallocatedPocket = userPockets.find(
                                //   (pocket) => pocket.slug === "unallocated"
                                // );
                                // setUnallocated(unallocatedPocket.percentage);
                              }}
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
                            // let unallocatedPocket = userPockets.find(
                            //   (pocket) => pocket.slug === "unallocated"
                            // );
                            // setUnallocated(unallocatedPocket.percentage);
                          }}
                          sx={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "85px",
                            height: "85px",
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
                            <Box>
                              <Icon sx={{ color: pocket.color }}>
                                {pocket.icon}
                              </Icon>
                            </Box>
                            <Typography
                              variant="small"
                              sx={{
                                fontSize: "10px",
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
                  ))}
            </Grid>
            {/* ///////////////////////////////////////////////////////////////////////////////// */}
          </Box>
          <Typography
            component="small"
            sx={{ fontSize: "12px" }}
            variant="small"
          >
            <span style={{ fontWeight: "bold" }}>{unallocatedPercentage}%</span>{" "}
            left to allocate
          </Typography>
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary
              expandIcon={<Icon fontSize="small">expand_more</Icon>}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                sx={{ fontSize: "small", fontWeight: "bold" }}
                variant="small"
              >
                Or Create Pocket:
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="form" onSubmit={handleAddPocket} noValidate>
                <TextField
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                  autoFocus
                  disabled={unallocatedPercentage <= 0}
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label={
                    <Typography sx={{ fontSize: "small" }} variant="small">
                      Name
                    </Typography>
                  }
                  name="title"
                  value={title}
                  onChange={(e) =>
                    e.target.value.length < 20 && setTitle(e.target.value)
                  }
                />
                <TextareaAutosize
                  disabled={unallocatedPercentage <= 0}
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Pocket description (optional)"
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <Box sx={{ width: "60%", mt: 0 }}>
                  <TextField
                    size="small"
                    sx={{ mt: 0 }}
                    disabled={unallocatedPercentage <= 0}
                    margin="normal"
                    required
                    fullWidth
                    type="number"
                    id="percentage"
                    label={
                      <Typography sx={{ fontSize: "small" }} variant="small">
                        Percentage
                      </Typography>
                    }
                    name="percentage"
                    value={percentage}
                    onChange={(e) =>
                      e.target.value <= unallocatedPercentage &&
                      e.target.value >= 0 &&
                      setPercentage(e.target.value)
                    }
                  />
                  <Typography
                    component="small"
                    sx={{ fontSize: "12px", mt: 0 }}
                    variant="small"
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {unallocatedPercentage}%
                    </span>{" "}
                    left to allocate
                  </Typography>
                </Box>
                <Grid sx={{ mt: 3 }}>
                  <Button
                    disabled={
                      unallocatedPercentage <= 0 || !percentage || !title
                    }
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      textTransform: "capitalize",
                      borderRadius: 6,
                    }}
                  >
                    Create Pocket
                  </Button>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>

          <LoadingBackdrop open={loading} />
        </Box>
      </Modal>
    </div>
  );
};

export default CreatePocket;
