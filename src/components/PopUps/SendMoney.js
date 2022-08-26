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
import Divider from "@mui/material/Divider";
import { toast } from "react-toastify";
import LoadingBackdrop from "./LoadingBackdrop";
import { cashout } from "../../serverFunctions/pocket";

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

const SendMoney = ({ open, closeModal, selectedPocket }) => {
  const [pocket, setPocket] = useState({});
  const [amount, setAmount] = useState(Number);
  const [recipient, setRecipient] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pocketsLoading, setPocketsLoading] = useState(false);

  const { user, moneyChange } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    if (open === false) {
      setPocket("");
      setAmount("");
      setRecipient("");
      setNotes("");
    }
    setPocket(selectedPocket);
  }, [open]);

  const handleSendMoney = async (e) => {
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
        pocket: pocket.slug,
        amount: Number(amount),
        recipient: recipient === 1 ? [recipient, recipientEmail] : recipient,
        notes,
      };
      await cashout(user.token, user._id, transaction)
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
            `GH¢ ${amount} sent from "${pocket.title}" to ${
              recipient === 1 ? recipientEmail : recipient
            }`
          );
          closeModal();
          setAmount("");
          setPocket({});
          setRecipient("");
          setNotes("");
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
            sx={{ fontWeight: "bold", mb: 3 }}
            id="modal-modal-title"
            variant="p"
            component="h2"
          >
            Send Money
          </Typography>

          <Box
            component="form"
            onSubmit={handleSendMoney}
            noValidate
            sx={{ mt: 1 }}
          >
            <Avatar sx={{ bgcolor: pocket.color }}>
              <Icon sx={{ color: "#fff" }}>
                {pocket.icon ? pocket.icon : "account_balance_wallet_rounded"}{" "}
              </Icon>
            </Avatar>
            <Typography sx={{ fontWeight: "bold" }}>{pocket.title}</Typography>
            <Typography sx={{ fontWeight: "bold", mb: 2, fontSize: "small" }}>
              <NumberFormat
                value={pocket.amount ? pocket.amount : 0}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"GH₵ "}
                decimalSeparator="."
                decimalScale={2}
              />{" "}
              {amount && amount > 0 ? (
                <>
                  <span>- </span>
                  <NumberFormat
                    value={amount}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"GHc "}
                    decimalSeparator="."
                    decimalScale={2}
                  />
                </>
              ) : (
                ""
              )}
            </Typography>

            <TextField
              size="small"
              sx={{ mb: 3 }}
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
            <FormControl required fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                sx={{ fontSize: "small" }}
              >
                Recipient
              </InputLabel>
              <Select
                size="small"
                sx={{ mb: 1 }}
                labelId="demo-simple-select-label"
                id="recipient"
                value={recipient}
                label="Recipient"
                onChange={(e) => setRecipient(e.target.value)}
              >
                <MenuItem value={1}>PMMS</MenuItem>
                <MenuItem value={2}>MTN MoMo</MenuItem>
                <MenuItem value={3}>AirtelTigo Money</MenuItem>
                <MenuItem value={4}>Vodafone Cash</MenuItem>
                <MenuItem value={5}>Vodafone Cash</MenuItem>
                <MenuItem disabled value={6}>
                  Bank
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              required={recipient === 1}
              size="small"
              sx={{ display: recipient === 1 ? "block" : "none" }}
              margin="normal"
              fullWidth
              id="Email"
              label={
                <Typography sx={{ fontSize: "small" }}>
                  Recipient Email
                </Typography>
              }
              name="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
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

export default SendMoney;
