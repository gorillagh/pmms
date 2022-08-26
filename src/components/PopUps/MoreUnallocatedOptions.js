import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Typography } from "@mui/material";

const MoreUnallocatedOptions = ({
  open,
  closeModal,
  top,
  left,
  selectedPocket,
  setOpenCreatePocketModal,
  setOpenP2PTransferModal,
}) => {
  const style = {
    position: "absolute",
    borderRadius: "12px",
    top: top,
    left: left,
    transform: "translate(50%, 50%)",
    width: "100px",
    bgcolor: "rgba(255, 255, 255, 0.9)",
    boxShadow: 10,
    border: "none",
    p: "4px",
  };

  const handleAddPocket = () => {
    setOpenCreatePocketModal(true);
    closeModal();
  };

  const handleP2PTransfer = () => {
    setOpenP2PTransferModal(true);
    closeModal();
  };

  return (
    <Box>
      <Modal
        keepMounted
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={closeModal}
        bgcolor="transparent"
        BackdropProps={{
          invisible: true,
        }}
      >
        <Box sx={style}>
          <Button
            sx={{
              width: "100%",
              textTransform: "capitalize",
              fontSize: "10px",
              borderRadius: "12px",
              "&:hover": {
                bgcolor: selectedPocket.color ? selectedPocket.color : "#000",
                opacity: "0.8",
                color: "#fff",
              },
            }}
            fullWidth
            onClick={() => handleAddPocket}
          >
            Add Pocket
            <Typography>({selectedPocket.percentage}%)</Typography>
          </Button>
          {selectedPocket.amount && Number(selectedPocket.amount) > 0 ? (
            <Button
              sx={{
                width: "100%",
                textTransform: "capitalize",
                fontSize: "10px",
                borderRadius: "12px",
                "&:hover": {
                  bgcolor: selectedPocket.color ? selectedPocket.color : "#000",
                  opacity: "0.8",
                  color: "#fff",
                },
              }}
              fullWidth
              onClick={() => handleP2PTransfer()}
            >
              Transfer
              <Typography variant="p">
                ({selectedPocket.amount.toFixed(2)})
              </Typography>
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MoreUnallocatedOptions;
