import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import LoadingBackdrop from "./LoadingBackdrop";
import { p2pTransfer, getUserPockets } from "../../serverFunctions/pocket";

import NumberFormat from "react-number-format";
import { Avatar, Grid, Icon } from "@mui/material";

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

const PocketToPocketTransfer = ({ open, closeModal, selectedPocket }) => {
  const [pocket, setPocket] = useState({});
  const [userPockets, setUserPockets] = useState([]);
  const [chosenPocket, setChosenPocket] = useState({});
  const [amount, setAmount] = useState(Number);
  const [recipient, setRecipient] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pocketsLoading, setPocketsLoading] = useState(false);

  const { user, moneyChange } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const fetchUserPockets = () => {
    getUserPockets(user.token, user._id)
      .then((res) => {
        console.log(res.data);
        setUserPockets(
          res.data.pockets.sort((a, b) => {
            return new Date(b.time) - new Date(a.time);
          })
        );
      })
      .catch((error) => {
        setPocketsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    setPocket(selectedPocket);
    fetchUserPockets();
    if (open === false) {
      setPocket("");
      setChosenPocket({});
      setAmount("");
      setRecipient("");
      setNotes("");
    }
  }, [open]);

  const handleP2PTransfer = async (e) => {
    e.preventDefault();
    console.log("selected==>", pocket);
    if (
      Number(pocket.amount) < Number(amount) ||
      !pocket.amount ||
      Number(pocket.amount) <= 0
    ) {
      toast.error(
        !pocket.amount ||
          (pocket.amount < amount &&
            `Amount should be less than ${pocket.amount}!`)
      );
      return;
    }
    if (Number(amount) <= 0) {
      toast.error(`Amount should be greater than 0`);
      return;
    }
    try {
      setLoading(true);
      const transaction = {
        pocket,
        amount: Number(amount),
        recipient: chosenPocket,
        notes,
      };
      await p2pTransfer(user.token, user._id, transaction)
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.error.message);
            console.log(res.data.error);
            setLoading(false);
            return;
          }
          console.log("result---->", res);
          dispatch({ type: "MONEY_CHANGE", payload: !moneyChange });
          toast.success(
            <Typography
              sx={{ fontSize: "small", fontWeight: "bold" }}
              variant="small"
            >
              "₵ {amount}" transfered from "{pocket.title}" to "
              {chosenPocket.title}"
            </Typography>
          );
          closeModal();
          setAmount("");
          setPocket({});
          setRecipient("");
          setNotes("");
          setChosenPocket({});
          setLoading(false);
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
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ fontWeight: "bold", mb: 4, p: 0 }}
            id="modal-modal-title"
            variant="p"
            component="h2"
            align="left"
          >
            Pocket Transfer <Icon> move_down</Icon>
          </Typography>

          <Box
            component="form"
            onSubmit={handleP2PTransfer}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid sx={{ mb: 3 }} container>
              <Grid align="left" item xs={4}>
                <Avatar sx={{ bgcolor: pocket.color }}>
                  <Icon sx={{ color: "#fff" }}>
                    {pocket.icon
                      ? pocket.icon
                      : "account_balance_wallet_rounded"}{" "}
                  </Icon>
                </Avatar>
                <Typography sx={{ fontWeight: "bold" }}>
                  {pocket.title}
                </Typography>
                <Typography sx={{ mb: 2, fontSize: "small" }}>
                  <NumberFormat
                    value={pocket.amount ? pocket.amount : 0}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"GH₵ "}
                    decimalSeparator="."
                    decimalScale={2}
                  />{" "}
                </Typography>
              </Grid>

              <Grid align="center" item xs={4}>
                <Box
                  sx={{
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ mt: 2, fontSize: "small" }}>
                    <NumberFormat
                      value={amount}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"GH₵ "}
                      decimalSeparator="."
                      decimalScale={2}
                    />{" "}
                  </Typography>
                  <Icon>arrow_forward</Icon>
                </Box>
              </Grid>
              <Grid align="right" item xs={4}>
                {chosenPocket.title ? (
                  <Avatar sx={{ bgcolor: chosenPocket.color }}>
                    <Icon sx={{ color: "#fff" }}>
                      {chosenPocket.icon
                        ? chosenPocket.icon
                        : "account_balance_wallet_rounded"}{" "}
                    </Icon>
                  </Avatar>
                ) : (
                  <Avatar>
                    <Icon>question_mark</Icon>
                  </Avatar>
                )}

                <Typography sx={{ fontWeight: "bold" }}>
                  {chosenPocket.title ? chosenPocket.title : "Select Pocket"}
                </Typography>
                <Typography sx={{ mb: 2, fontSize: "small" }}>
                  {chosenPocket.amount ? (
                    <NumberFormat
                      value={chosenPocket.amount ? chosenPocket.amount : 0}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"GH₵ "}
                      decimalSeparator="."
                      decimalScale={2}
                    />
                  ) : (
                    ""
                  )}{" "}
                </Typography>
              </Grid>
            </Grid>
            <FormControl
              sx={{ mt: 2, mb: 2, width: "70%", align: "right", ml: "30%" }}
              required
            >
              <InputLabel
                id="demo-simple-select-label"
                sx={{ fontSize: "small" }}
              >
                Receiving Pocket
              </InputLabel>
              <Select
                size="small"
                sx={{ mb: 1 }}
                labelId="demo-simple-select-label"
                id="receivingPocket"
                value={recipient}
                label="Recipient"
                onChange={(e) => setRecipient(e.target.value)}
              >
                {userPockets &&
                  userPockets
                    .filter((p) => {
                      if (p.slug !== pocket.slug) return true;
                    })
                    .map((p) => {
                      return (
                        <MenuItem
                          key={p.slug}
                          value={p.slug}
                          sx={{
                            textTransform: "capitalize",
                            fontSize: "small",
                          }}
                          onClick={() => setChosenPocket(p)}
                        >
                          <Icon fontSize="small">
                            {p.icon ? p.icon : "account_balance_wallet_rounded"}{" "}
                          </Icon>
                          <Typography
                            variant="span"
                            style={{ marginLeft: "5px", fontSize: "small" }}
                          >
                            {p.title}
                          </Typography>
                        </MenuItem>
                      );
                    })}
              </Select>
            </FormControl>
            <TextField
              size="small"
              sx={{ mb: 2 }}
              margin="normal"
              required
              fullWidth
              type="number"
              id="amount"
              label={
                <Typography sx={{ fontSize: "small" }} variant="small">
                  Amount(GH¢)
                </Typography>
              }
              name="amount"
              value={amount}
              onChange={(e) => {
                if (e.target.value >= 0) setAmount(e.target.value);
              }}
            />

            <TextField
              size="small"
              sx={{ mb: 2 }}
              margin="normal"
              fullWidth
              id="notes"
              label={<Typography sx={{ fontSize: "small" }}>Notes</Typography>}
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
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
                {" "}
                <Button
                  disabled={!pocket || !amount || !recipient}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: 6,
                  }}
                  onClick={() => console.log("Cash Out")}
                >
                  continue
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

export default PocketToPocketTransfer;
