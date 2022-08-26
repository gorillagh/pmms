import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Typography } from "@mui/material";

const MorePocketOptions = ({
  open,
  closeModal,
  top,
  left,
  selectedPocket,
  setOpenSendMoneyModal,
  setOpenAddMoneyModal,
  setOpenP2PTransferModal,
}) => {
  const style = {
    position: "absolute",
    borderRadius: "12px",
    top: top,
    left: left,
    transform: "translate(-70%, 20%)",
    width: "70px",
    bgcolor: "rgba(255, 255, 255, 0.9)",
    boxShadow: 10,
    border: "none",
    p: "4px",
  };

  const navigate = useNavigate();

  const handleAddMoney = () => {
    setOpenAddMoneyModal(true);
    closeModal();
  };

  const handleP2PTransfer = () => {
    setOpenP2PTransferModal(true);
    closeModal();
  };

  const handleSendMoney = async () => {
    setOpenSendMoneyModal(true);
    closeModal();
  };

  const handleSettings = () => {
    navigate(`/my/${selectedPocket.slug}/pocket/settings`);
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
          <Box
            sx={{
              width: "100%",
              textTransform: "capitalize",
              borderRadius: "12px",
              "&:hover": {
                bgcolor: selectedPocket.color ? selectedPocket.color : "#000",
                opacity: "0.8",
                color: "#fff",
              },
            }}
            fullWidth
            onClick={() => handleAddMoney()}
          >
            <Typography
              sx={{ fontSize: "10px", px: "8px", py: "6px", cursor: "pointer" }}
            >
              Add Money
            </Typography>
          </Box>
          {selectedPocket.amount && Number(selectedPocket.amount) > 0 ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  textTransform: "capitalize",
                  borderRadius: "12px",
                  "&:hover": {
                    bgcolor: selectedPocket.color
                      ? selectedPocket.color
                      : "#000",
                    opacity: "0.8",
                    color: "#fff",
                  },
                }}
                fullWidth
                onClick={() => handleSendMoney()}
              >
                <Typography
                  sx={{
                    fontSize: "10px",
                    px: "8px",
                    py: "6px",
                    cursor: "pointer",
                  }}
                >
                  Send
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  textTransform: "capitalize",
                  borderRadius: "12px",
                  "&:hover": {
                    bgcolor: selectedPocket.color
                      ? selectedPocket.color
                      : "#000",
                    opacity: "0.8",
                    color: "#fff",
                  },
                }}
                fullWidth
                onClick={() => handleP2PTransfer()}
              >
                <Typography
                  sx={{
                    fontSize: "10px",
                    px: "8px",
                    py: "6px",
                    cursor: "pointer",
                  }}
                >
                  P2P
                </Typography>
              </Box>
            </>
          ) : (
            <></>
          )}
          <Box
            sx={{
              width: "100%",
              textTransform: "capitalize",
              borderRadius: "12px",
              "&:hover": {
                bgcolor: selectedPocket.color ? selectedPocket.color : "#000",
                opacity: "0.8",
                color: "#fff",
              },
            }}
            fullWidth
            onClick={() => handleSettings()}
          >
            <Typography
              sx={{ fontSize: "10px", px: "8px", py: "6px", cursor: "pointer" }}
            >
              settings{" "}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MorePocketOptions;
