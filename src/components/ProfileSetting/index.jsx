import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Avatar,
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';
import API_URL from "../../utils/API_URL";
import { setUser } from '../../store/userSlice';
import LoadingOverlay from '../LoadingOverlay';

const styleBox = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  textAlignL: 'center'
};
const styleIcon = { margin: '0px 20px 5px 0px' };
const color1 = '#3384d3';
const color2 = '#c2185b';

const ProfileSetting = () => {
  const user = useSelector((state) => state.user.user); // get user
  const dispatch = useDispatch(); // set
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({
    name: user.username,
    phone: user.phone,
    age: user.age,
  });


  const handleUpdateUser = async () => {
    setIsLoading(true);
    try {
      const ageAsNumber = parseInt(updatedUserData.age, 10); //convert string to a number
      const response = await axios.put(`${API_URL}/users/${user.ID}`, {
        ...updatedUserData,
        age: ageAsNumber,
      });
      if (response.data.success) {
        console.log("User updated successfully:", response.data.message);
        dispatch(setUser(response.data.data));
        showSnackbar("success", "User updated successfully");
      } else {
        console.error("Error updating user:", response.data.message);
        showSnackbar("error", "Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
      setUpdateModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setUpdateModalOpen(false);
  };

  const handleUpdateModalOpen = () => {
    setUpdatedUserData({
      name: user.username,
      phone: user.phone,
      age: user.age,
    });
    setUpdateModalOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return (
    <>
      {isLoading ? <LoadingOverlay /> : null}
      <Box display="flex" flexDirection={'column'} justifyContent="center" alignItems="center" height="100vh">
        <Box
          sx={{
            p: 2,
            margin: 3,
            padding: '15px',
            border: "1px dashed grey",
            textAlign: "left",
            wordWrap: "break-word",
          }}
        >
          <Typography variant="h4" sx={{ textAlign: 'center' }}>Profile Setting</Typography>
          <Typography sx={{ textAlign: 'center', margin: '10px', width: '320px' }}>
            You can edit your profile here
          </Typography>
        </Box>
        <Paper sx={{ borderRadius: '16px' }}>
          <Box sx={{ border: `1px solid ${color1}`, backgroundColor: color1, display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '15px' }}>
            <Avatar
              key={user.ID}
              style={{ margin: '1rem auto', backgroundColor: color2, width: '60px', height: '60px', fontSize: '2rem' }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography sx={{ color: 'white', fontSize: '25px' }}>{user.username}</Typography>
          </Box>
          <Box sx={{ padding: '20px' }}>

            <Box sx={styleBox}>
              <PersonIcon sx={styleIcon} />{user.ID}
            </Box>
            <Box sx={styleBox}>
              <EmailIcon sx={styleIcon} />{user.email}
            </Box>
            <Box sx={styleBox}>
              <WorkIcon sx={styleIcon} />{user.role.name}
            </Box>
            <Box sx={styleBox}>
              <FingerprintIcon sx={styleIcon} />{user.age} years old
            </Box>
            <Box sx={styleBox}>
              <PhoneAndroidIcon sx={styleIcon} />{user.phone}
            </Box>
            <Box sx={styleBox}>
              <CalendarMonthIcon sx={styleIcon} />{user.created_date.split('T')[0]}
            </Box>

            {/* Update button */}
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleUpdateModalOpen}>
                Edit Profile
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Update Modal */}
        <Dialog open={isUpdateModalOpen} onClose={handleModalClose}>
          <DialogTitle>Edit User Data</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={updatedUserData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone"
              type="number"
              value={updatedUserData.phone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={updatedUserData.age}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateUser} color="primary">
              Done
            </Button>
            <Button onClick={handleModalClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );

};

export default ProfileSetting;