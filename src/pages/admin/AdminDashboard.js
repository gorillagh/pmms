import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import NonstickyFooter from "../../components/Footers/NonstickyFooter";
import { Box, Container } from "@mui/material";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Box>
      <Container>
        <NonstickyFooter sx={{ mt: 8, mb: 4 }} />
      </Container>
    </Box>
  );
};

export default AdminDashboard;
