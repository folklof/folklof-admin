import React, { useState } from "react";
import { useQuery } from "react-query";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination, TextField, Box } from "@mui/material";
import axios from "axios";
import API_URL from "../../utils/API_URL";

const UserManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: allUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery("users", async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  });

  // const handleUpdateUser = async () => {
  //   try {
  //     // Implement your logic to update user information here
  //     await axios.put(`${API_URL}/users/${selectedUser.id}`, selectedUser);
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //   } finally {
  //     handleModalClose(); // Close the modal after updating
  //   }
  // };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {isLoadingUsers ? (
        <CircularProgress size={24} />
      ) : isErrorUsers ? (
        <Box>
          Error while fetching user data
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <TableRow key={user.ID}>
                    <TableCell>{user.ID}</TableCell>
                    <TableCell>{user.role.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell>{user.created_date.split('T')[0]}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdateClick(user)}>Update</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={allUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Modal Update*/}
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <Box margin={'10px'}>
            <TextField id="outlined-basic" label="Name" variant="outlined"
              type="text"
              value={selectedUser?.username || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
            />
          </Box>
          <Box margin={'10px'}>
            <TextField id="outlined-basic" label="Phone" variant="outlined"
              type="text"
              value={selectedUser?.phone || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
            />
          </Box>
          <Box margin={'10px'}>
            <TextField id="outlined-basic" label="Age" variant="outlined"
              type="number"
              value={selectedUser?.age || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, age: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          {/* <Button onClick={handleUpdateUser}>Update</Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserManagement;