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
import {
  Accordion,
  AccordionDetails,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

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

const AddMoneyGeneral = ({ open }) => {
  const [pocket, setPocket] = useState({});
  const [destination, setDestination] = useState("spread");
  const [amount, setAmount] = useState(Number);
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pocketsLoading, setPocketsLoading] = useState(false);
  const [userPockets, setUserPockets] = useState([]);
  const { user, moneyChange } = useSelector((state) => ({ ...state }));
  const [checked, setChecked] = useState(null);

  const dispatch = useDispatch();

  const fetchUserPockets = () => {
    setPocketsLoading(true);
    getUserPockets(user.token, user._id)
      .then((res) => {
        setUserPockets(
          res.data.pockets.sort((a, b) => {
            return new Date(b.time) - new Date(a.time);
          })
        );
        setPocketsLoading(false);
      })
      .catch((error) => {
        setPocketsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    if (open === false) {
      setDestination("spread");
      setAmount("");
      setSource("");
      setNotes("");
    }
    fetchUserPockets();
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
        destination,
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
          dispatch({ type: "MONEY_CHANGE", payload: !moneyChange });
          setAmount("");
          setDestination("");
          setSource("");
          setNotes("");
          toast.success(
            destination === "spread"
              ? `GH¢ ${amount} spread on all pockets`
              : `GH¢ ${amount} added to "${destination}"`
          );
          handleClose();
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

  const handleClose = () => {
    dispatch({ type: "CLOSE_ADD_MONEY", payload: false });
    setAmount("");
    setDestination("");
    setSource("");
    setNotes("");
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
            <FormControl required fullWidth>
              <InputLabel
                sx={{ fontSize: "small" }}
                id="demo-simple-select-label"
              >
                Destination
              </InputLabel>
              <Select
                size="small"
                sx={{ mb: 1 }}
                autoFocus
                labelId="demo-simple-select-label"
                id="destination"
                value={destination}
                label={
                  <Typography sx={{ fontSize: "small" }}>
                    Destination
                  </Typography>
                }
                onChange={(e) => setDestination(e.target.value)}
                defaultValue={1}
              >
                {userPockets.length > 1 && (
                  <MenuItem value="spread">Spread Across</MenuItem>
                )}
                {userPockets &&
                  userPockets.map((p) => {
                    return (
                      <MenuItem
                        key={p.slug}
                        value={p.slug}
                        sx={{ textTransform: "capitalize" }}
                        onClick={() => setPocket(p)}
                      >
                        <Icon fontSize="small">
                          {p.icon ? p.icon : "account_balance_wallet_rounded"}{" "}
                        </Icon>
                        <span style={{ marginLeft: "10px" }}>{p.title}</span>
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <Typography
              variant="small"
              sx={{ fontSize: "10px", fontWeight: "bold" }}
            >
              {destination !== "spread" && (
                <>
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
                    <></>
                  )}
                </>
              )}
            </Typography>
            <Grid sx={{ mb: 1 }} spacing={1} container>
              <Grid item xs={9}>
                <TextField
                  size="small"
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
              </Grid>
              <Grid
                sx={{ justifyContent: "center", alignItems: "center" }}
                align="center"
                item
                xs={3}
              >
                {destination === "spread" && amount && amount > 0 ? (
                  <Box
                    sx={{
                      mt: "15px",
                    }}
                  >
                    <ToggleButtonGroup
                      size="small"
                      orientation="horizontal"
                      value={checked}
                      exclusive
                      onChange={(e, nextView) => {
                        setChecked(nextView);
                      }}
                    >
                      <ToggleButton value="list" aria-label="list">
                        <Icon fontSize="small">preview</Icon>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>

            {checked !== null && amount > 0 && destination === "spread" ? (
              <Accordion sx={{ bgcolor: "#E7EFF9", mb: 2 }}>
                <AccordionDetails>
                  <Grid
                    sx={{
                      overflowY: "scroll",
                      maxHeight: "60px",
                    }}
                  >
                    {userPockets &&
                      userPockets.map((p, i) => {
                        return (
                          <Typography key={i} sx={{ fontSize: "10px" }}>
                            <Icon sx={{ color: p.color, fontSize: "10px" }}>
                              {p.icon
                                ? p.icon
                                : "account_balance_wallet_rounded"}
                            </Icon>{" "}
                            {p.title}{" "}
                            {amount && amount > 0 ? (
                              <>
                                <span> +</span>{" "}
                                <span style={{ color: "green" }}>
                                  <NumberFormat
                                    value={(p.percentage / 100) * amount}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalSeparator="."
                                    decimalScale={2}
                                  />{" "}
                                  ={" "}
                                  <NumberFormat
                                    value={
                                      (p.percentage / 100) * amount + p.amount
                                    }
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"GH₵ "}
                                    decimalSeparator="."
                                    decimalScale={2}
                                  />
                                </span>
                              </>
                            ) : (
                              ""
                            )}
                          </Typography>
                        );
                      })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ) : (
              ""
            )}

            {/* <FormControl required fullWidth sx={{ mt: 1 }}>
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
            </FormControl> */}
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
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: 6,
                  }}
                  onClick={handleClose}
                >
                  cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  disabled={!destination || !amount || !source}
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

export default AddMoneyGeneral;
