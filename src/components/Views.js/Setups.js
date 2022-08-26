import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Setups = ({ recommendedView, recommendedPockets }) => {
  const [expanded, setExpanded] = useState(false);

  const handlePocketAccordion = (slug) => (event, isExpanded) => {
    setExpanded(isExpanded ? slug : false);
  };
  return (
    <>
      <Grid
        display={recommendedView === "setups" ? "" : "none"}
        align="center"
        alignItems="center"
        justifyContent="center"
        container
        spacing={3}
      >
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              width: "80%",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
              webkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                mb: 2,
                textTransform: "capitalize",
                fontWeight: 800,
              }}
              component="div"
            >
              Worker
            </Typography>
            {recommendedPockets.map((p) => {
              if (p.userClass === "worker" || p.userClass === "all") {
                return (
                  <Accordion
                    sx={{
                      borderTop: "#fff",
                      background: "rgba(255, 255, 255, 0.1)",
                    }}
                    expanded={expanded === p.slug + p.userClass}
                    onChange={handlePocketAccordion(p.slug + p.userClass)}
                  >
                    <AccordionSummary
                      expandIcon={<Icon>expand_more</Icon>}
                      aria-controls={p.slug}
                      id={p.slug}
                    >
                      <Typography
                        align="left"
                        sx={{ width: "15%", flexShrink: 0 }}
                      >
                        <Avatar
                          sx={{
                            fontSize: "small",
                            bgcolor: p.color,
                            height: "25px",
                            width: "25px",
                          }}
                        >
                          <Icon sx={{ fontSize: "15px" }}>{p.icon}</Icon>
                        </Avatar>
                      </Typography>

                      <Typography sx={{ fontSize: "small" }}>
                        {p.title} - {p.percentage}%
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ fontSize: "12px" }}>
                        {p.description}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              }
            })}
            <Button
              sx={{
                mt: 2,
                width: "80%",
                textTransform: "capitalize",
                borderRadius: 6,
              }}
              variant="contained"
            >
              Add
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              width: "80%",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
              webkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <Typography
              sx={{
                mb: 2,
                fontSize: 16,
                textTransform: "capitalize",
                fontWeight: 800,
              }}
              component="div"
            >
              Student
            </Typography>
            {recommendedPockets.map((p) => {
              if (p.userClass === "worker" || p.userClass === "all") {
                return (
                  <Accordion
                    sx={{
                      borderTop: "#fff",
                      background: "rgba(255, 255, 255, 0.1)",
                    }}
                    expanded={expanded === p.slug}
                    onChange={handlePocketAccordion(p.slug)}
                  >
                    <AccordionSummary
                      expandIcon={<Icon>expand_more</Icon>}
                      aria-controls={p.slug}
                      id={p.slug}
                    >
                      <Typography
                        align="left"
                        sx={{ width: "15%", flexShrink: 0 }}
                      >
                        <Avatar
                          sx={{
                            fontSize: "small",
                            bgcolor: p.color,
                            height: "25px",
                            width: "25px",
                          }}
                        >
                          <Icon sx={{ fontSize: "15px" }}>{p.icon}</Icon>
                        </Avatar>
                      </Typography>

                      <Typography sx={{ fontSize: "small" }}>
                        {p.title} - {p.percentage}%
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ fontSize: "12px" }}>
                        {p.description}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              }
            })}
            <Button
              sx={{
                mt: 2,
                width: "80%",
                textTransform: "capitalize",
                borderRadius: 6,
              }}
              variant="contained"
            >
              Add
            </Button>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Setups;
