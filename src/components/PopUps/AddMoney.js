import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import { useDispatch } from "react-redux";
import { addMoney, getUserPockets } from "../../serverFunctions/pocket";
import Icon from "@mui/material/Icon";
import NumberFormat from "react-number-format";
import { Avatar, Grid } from "@mui/material";

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

const AddMoney = ({ open, closeModal, selectedPocket }) => {
  const [pocket, setPocket] = useState({});
  const [amount, setAmount] = useState(Number);
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, moneyChange } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  useEffect(() => {
    setPocket(selectedPocket);
    if (open === false) {
      setPocket("");
      setAmount("");
      setSource("");
      setNotes("");
    }
  }, [open]);

  const handleAddMoney = async (e) => {
    e.preventDefault();

    if (Number(amount) <= 0) {
      toast.error(`Amount should be greater than 0`);
      return;
    }
    try {
      setLoading(true);
      const transaction = {
        destination: pocket.slug,
        amount: Number(amount),
        source,
        notes,
      };

      await addMoney(user.token, user._id, transaction)
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.error.message);
            console.log(res.data.error);
            setLoading(false);
            return;
          }
          setAmount("");
          setPocket({});
          setSource("");
          setNotes("");
          closeModal();
          dispatch({ type: "MONEY_CHANGE", payload: !moneyChange });
          toast.success(`GH¢ ${amount} added to "${pocket.title}"`);
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
            Add Money
          </Typography>

          <Box
            component="form"
            onSubmit={handleAddMoney}
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
                prefix={"GHc "}
                decimalSeparator="."
                decimalScale={2}
              />{" "}
              {amount && amount > 0 ? (
                <>
                  <span>+ </span>
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
                <Typography variant="small" sx={{ fontSize: "small" }}>
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
                sx={{ fontSize: "small" }}
                id="demo-simple-select-label"
              >
                Source
              </InputLabel>
              <Select
                fullWidth
                size="small"
                sx={{ mb: 1 }}
                labelId="demo-simple-select-label"
                id="source"
                value={source}
                label={
                  <Typography sx={{ fontSize: "small" }}>Source</Typography>
                }
                onChange={(e) => setSource(e.target.value)}
              >
                <MenuItem value="mtn-momo">MTN MoMo</MenuItem>
                <MenuItem value="airteltigo-money">AirtelTigo Money</MenuItem>
                <MenuItem value="vodafone-cash">Vodafone Cash</MenuItem>
                <MenuItem disabled value="bank-account">
                  Bank
                </MenuItem>
                <MenuItem disabled value="card">
                  Credit/Debit Card
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
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
                {" "}
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
                  disabled={!pocket || !amount || !source}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: 6,
                  }}
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

export default AddMoney;
