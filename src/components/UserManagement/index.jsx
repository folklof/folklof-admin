import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Typography,
  Snackbar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import API_URL from '../../utils/API_URL';
import LoadingOverlay from '../LoadingOverlay';

const color1 = '#3384d3';
const white = { color: 'white' };

const roles = {
  1: 'Member',
  2: 'Supervisor',
  3: 'Admin',
};

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedUserData, setClickedUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const {
    data: allUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery('users', async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  });



  const handleUpdateUser = async () => {
    setIsLoading(true);
    try {
      const updatedUser = {
        name: selectedUser.username,
        phone: selectedUser.phone,
        age: parseInt(selectedUser.age, 10),
        role_id: parseInt(selectedUser.role_id, 10),
      };
      const response = await axios.put(`${API_URL}/users/admin/${selectedUser.ID}`, updatedUser);

      if (response.data.success) {
        console.log('User updated successfully:', response.data.message);
        showSnackbar('success', 'User updated successfully');
        queryClient.invalidateQueries('users');

      } else {
        console.error('Error updating user:', response.data);
        showSnackbar('error', 'Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
      handleModalClose();
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setClickedUserData(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Snackbar
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

  const columns = [
    { field: 'ID', headerName: 'ID', flex: 0.7 },
    { field: 'role', headerName: 'Role', flex: 0.7, valueGetter: (params) => params.row.role.name },
    { field: 'username', headerName: 'Name', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'phone', headerName: 'Phone', flex: 1.2 },
    { field: 'age', headerName: 'Age', flex: 0.5 },
    { field: 'created_date', headerName: 'Created Date', flex: 1, valueGetter: (params) => params.row.created_date.split('T')[0] },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.6,
      renderCell: (params) => (
        <IconButton onClick={() => handleUpdateClick(params.row)}>
          <EditIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  // Handling map before entering rows in DataGrid
  const fetchUsers = allUsers ?
    allUsers.map((user) => ({ id: user.ID, ...user }))
    : []

  return (
    <>
      {isLoading ? <LoadingOverlay /> : null}
      {isErrorUsers ? (
        <Box>Error while fetching user data</Box>
      ) : (
        <>
          <Box
            sx={{
              p: 2,
              margin: 1,
              padding: '15px',
              border: "1px dashed grey",
              textAlign: "left",
              wordWrap: "break-word",
            }}
          >
            <Typography variant="h4" sx={{ textAlign: 'center' }}>User Management</Typography>
            <Typography sx={{ textAlign: 'center', margin: '10px' }}>
              In user management, you can perform listing user data and editing user data.
            </Typography>
          </Box>
          <Box style={{ height: 400, width: '100%' }}>
            <DataGrid sx={{ minWidth: '1000px' }}
              loading={isLoadingUsers}
              rows={fetchUsers}
              columns={columns}
              pageSize={rowsPerPage}
              page={page}
              onPageChange={(params) => handleChangePage(params.page)}
              rowsPerPageOptions={[5, 10]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </>
      )}

      {/* Modal Update*/}
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle sx={{ backgroundColor: color1, color: white }}>Update User</DialogTitle>
        <DialogContent>
          <Box sx={{ padding: '10px' }}>
            {clickedUserData && (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlignL: 'center' }}>
                <PermIdentityIcon />
                <Typography sx={{ margin: '5px', alignItems: 'center', justifyContent: 'center' }}>
                  {clickedUserData.ID}
                </Typography>
              </Box>
            )}
          </Box>
          <Box margin={'10px'}>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              type="text"
              value={selectedUser?.username || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
            />
          </Box>
          <Box margin={'10px'}>
            <TextField
              id="outlined-basic"
              label="Phone"
              variant="outlined"
              type="number"
              value={selectedUser?.phone || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
            />
          </Box>
          <Box margin={'10px'}>
            <TextField
              id="outlined-basic"
              label="Age"
              variant="outlined"
              type="number"
              value={selectedUser?.age || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, age: e.target.value })}
            />
          </Box>
          <Box margin={'10px'}>
            <TextField
              id="outlined-select-role"
              select
              label="Role"
              value={selectedUser?.role_id || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, role_id: e.target.value })}
              variant="outlined"
            >
              {Object.entries(roles).map(([id, role]) => (
                <MenuItem key={id} value={id}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleUpdateUser}>Update</Button>
          <Button onClick={handleModalClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bot', horizontal: 'left' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default UserManagement;
