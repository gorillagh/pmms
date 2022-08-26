import React from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Box, Divider, Grid, Icon } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: 250,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "12px",
  p: 4,
};

const Confirmation = ({
  open,
  closeModal,
  confirmationTitle,
  confirmationMessage,
  confirmationNote,
  next,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    next();
    closeModal();
  };
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <Typography align="center">
              <Icon sx={{ my: "auto" }} fontSize="large">
                warning_amber
              </Icon>{" "}
            </Typography>
            <Typography
              align="center"
              sx={{ fontWeight: "bold", mb: 3 }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              {confirmationTitle}
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Typography sx={{ mb: 2 }}>
              {confirmationMessage && confirmationMessage}
            </Typography>
            <Typography sx={{ mb: 2 }} fontSize="small">
              {confirmationNote && confirmationNote}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  sx={{
                    width: "60%",
                    flexGrow: 1,
                    mt: 3,
                    mb: 2,
                    mr: 2,
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
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "60%",
                    flexGrow: 1,
                    mt: 3,
                    mb: 2,
                    textTransform: "capitalize",
                    borderRadius: 6,
                  }}
                >
                  Yes
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ mt: 3, mb: 2 }} />
        </Box>
      </Modal>
    </div>
  );
};

export default Confirmation;
