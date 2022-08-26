import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Icon from "@mui/material/Icon";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";

import { toast } from "react-toastify";
import { createPocket, getPockets } from "../../serverFunctions/pocket";
import LoadingBackdrop from "../../components/PopUps/LoadingBackdrop";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, m: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const AdminPockets = () => {
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState("");
  const [percentage, setPercentage] = useState("");
  const [userClass, setUserClass] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [subs, setSubs] = useState([]);
  const [pockets, setPockets] = useState([]);
  const [pocketsLoading, setPocketsLoading] = useState(false);
  const [dbUser, setDbUser] = useState({});
  const [loading, setLoading] = useState(false);

  var { user } = useSelector((state) => ({ ...state }));

  const fetchPockets = () => {
    setPocketsLoading(true);
    getPockets(user.token)
      .then((res) => {
        setPockets(res.data);
        setPocketsLoading(false);
      })
      .catch((error) => {
        setPocketsLoading(false);
        toast.error(error.message);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPockets();
  }, []);

  const resetForm = () => {
    setTitle("");
    setPercentage("");
    setUserClass("");
    setIcon("");
    setColor("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (percentage > 100) {
        setLoading(false);
        toast.error("Percentage should be less than 100");
        return;
      }
      await createPocket(user.token, {
        title,
        percentage,
        userClass,
        icon,
        color,
        description,
        subs,
      })
        .then((res) => {
          setLoading(false);
          if (res.data.error) {
            toast.error(res.data.error.message);
            console.log(res.data.error);
            return;
          }
          toast.success(`${title} pocket created!`);
          fetchPockets();
          resetForm();
        })
        .catch((error) => {
          if (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.message);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error);
    }
  };

  const VerticalTabs = () => {
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <Container maxWidth="lg" sx={{ display: { xs: "block", md: "block" } }}>
        <Typography align="center" component="h1" variant="h5">
          Pockets
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "background.paper",

            display: { md: "flex" },

            margin: "10px auto",
            background: " rgba(255, 255, 255, 0.3)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
            webkitBackdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab
              sx={{ textTransform: "none" }}
              label="All Pockets"
              {...a11yProps(0)}
            />
            <Tab
              sx={{ textTransform: "none" }}
              label="Create"
              {...a11yProps(1)}
            />
          </Tabs>
          <Box width="20px" />
          <Box m="auto" width="80%">
            <TabPanel value={value} index={0}>
              <Typography component="h4" variant="h6">
                All Pockets
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Grid container spacing={4}>
                {pockets &&
                  pockets.map((pocket, index) => (
                    <Grid key={index} item xs={12} md={4}>
                      <Card
                        sx={{
                          padding: "0px !important",
                          cursor: "pointer",
                          borderRadius: "16px",
                          background: " rgba(255, 255, 255, 0.5)",
                          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                          webkitBackdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          "&:hover": {
                            bgcolor: pocket.color,
                            color: "#fff",
                          },
                        }}
                      >
                        <CardHeader
                          sx={{ paddingBottom: 0 }}
                          avatar={
                            <Avatar
                              // sx={{ bgcolor: "#c4342d" }}
                              sx={{ bgcolor: pocket.color }}
                              aria-label="recipe"
                            >
                              <Icon>{pocket.icon}</Icon>
                            </Avatar>
                          }
                          action={
                            <Typography
                              bgcolor="#e27d6d"
                              color="#fff"
                              variant="small"
                              sx={{
                                borderRadius: "15%",
                                padding: 0.5,
                                fontSize: "0.7rem",
                              }}
                            >
                              {pocket.percentage}%
                            </Typography>
                          }
                          title={
                            <Typography sx={{ fontWeight: 500 }}>
                              {pocket.title}
                            </Typography>
                          }
                        />
                        <CardMedia
                          sx={{ fontWeight: "normal", fontSize: "small" }}
                          component="h4"
                          height="100"
                          align="center"
                        >
                          {[pocket.description]}
                        </CardMedia>
                        <CardContent
                          align="center"
                          sx={{
                            margin: "0px !important",
                            padding: "0px !important",
                            fontWeight: "bold",
                          }}
                        >
                          {pocket.userClass}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Typography component="h4" variant="h6">
                Create Pocket
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Box
                id="create-form"
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="percentage"
                      label="Percentage"
                      type="number"
                      id="number"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ mt: 2 }} required fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        User Class
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="user-class"
                        value={userClass}
                        label="UserClass"
                        onChange={(e) => setUserClass(e.target.value)}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="worker">Worker</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="retiree">Retiree</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="icon"
                      label="icon"
                      id="icon"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="color"
                      label="color"
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <TextareaAutosize
                  fullWidth
                  aria-label="minimum height"
                  minRows={4}
                  placeholder="Pocket Description"
                  style={{ width: "100%", marginTop: "10px" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <TextareaAutosize
                  fullWidth
                  aria-label="minimum height"
                  minRows={4}
                  placeholder="Subs/Examples (Separate with ',')"
                  style={{ width: "100%", marginTop: "10px" }}
                  value={subs}
                  onChange={(e) => setSubs(e.target.value.split(","))}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      onClick={resetForm}
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Reset
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      disabled={
                        !title ||
                        !percentage ||
                        !userClass ||
                        !icon ||
                        !color ||
                        !description
                      }
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Create
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Box>
        </Box>
        <LoadingBackdrop open={loading} />
      </Container>
    );
  };

  return <Box sx={{ pt: 3 }}>{VerticalTabs()}</Box>;
};

export default AdminPockets;
