import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import LoadingBackdrop from "./LoadingBackdrop";
import { useDispatch } from "react-redux";
import { Avatar, Icon, TextareaAutosize } from "@mui/material";
import { createUserPocket } from "../../serverFunctions/pocket";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: 250,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "12px",
  p: 4,
};

const AddDefaultPocket = ({
  open,
  selectedPocket,
  closeModal,
  unallocatedPercentage,
  user,
  fetchUserPockets,
}) => {
  const [pocket, setPocket] = useState({});
  const [unallocated, setUnallocated] = useState(Number);
  const [percentage, setPercentage] = useState(Number);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setPocket(selectedPocket);
    setUnallocated(unallocatedPercentage);
    if (open === false) {
      setPercentage("");
      setNotes("");
    }
  }, [open]);

  const handleAddPocket = async (e) => {
    e.preventDefault();
    try {
      if (Number(percentage) <= 0 || Number(percentage) > Number(unallocated)) {
        toast.error(`Percentage must be between 0 and ${unallocated}`);
        return;
      }

      setLoading(true);
      const newPocket = {
        title: pocket.title,
        percentage: Number(percentage),
        icon: pocket.icon,
        color: pocket.color,
        description: pocket.description,
        notes,
      };
      console.log("NewPocketInfrontEnd--->", newPocket);

      await createUserPocket(user.token, user._id, newPocket)
        .then((res) => {
          setLoading(false);
          if (res.data.error) {
            toast.error(res.data.error.message);
            console.log(res.data.error);
            return;
          }
          toast.success(`"${pocket.title}" added to pockets`);
          setPercentage("");
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
          <Box
            component="form"
            onSubmit={handleAddPocket}
            noValidate
            sx={{ mt: 1 }}
          >
            <Typography sx={{ fontWeight: "bold", mb: 2 }}>
              <Avatar sx={{ bgcolor: pocket.color }}>
                <Icon sx={{ color: "#fff" }}>{pocket.icon} </Icon>
              </Avatar>
              {pocket.title}
            </Typography>
            <Typography component="small" variant="small">
              {pocket.description}
            </Typography>
            <p></p>
            {pocket.subs
              ? pocket.subs.map((sub) => (
                  <Typography>
                    <Icon fontSize="small">circle </Icon>
                    {sub}
                  </Typography>
                ))
              : ""}

            <Box sx={{ width: "80%" }}>
              <TextField
                sx={{ mt: 3 }}
                disabled={unallocated <= 0}
                margin="normal"
                required
                type="number"
                id="percentage"
                label="Percentage"
                name="percentage"
                // focused={open === true}
                value={percentage}
                onChange={(e) =>
                  e.target.value <= unallocated &&
                  e.target.value >= 0 &&
                  setPercentage(e.target.value)
                }
              />
            </Box>
            <Typography sx={{ fontSize: "small" }} variant="small">
              <span style={{ fontWeight: "bold" }}>{unallocated}%</span> left to
              allocate.
            </Typography>
            <Grid sx={{ mt: 3 }} container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: 6,
                  }}
                  onClick={closeModal}
                >
                  cancel
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  disabled={unallocated <= 0 || !percentage}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: 6,
                  }}
                  onClick={() => console.log("Add Pocket")}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>

          <LoadingBackdrop open={loading} />
        </Box>
      </Modal>
    </div>
  );
};

export default AddDefaultPocket;
