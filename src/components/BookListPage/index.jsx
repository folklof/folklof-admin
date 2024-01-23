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
  InputLabel,
  FormControl,
  Select,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import API_URL from '../../utils/API_URL';
import LoadingOverlay from '../LoadingOverlay';

const color1 = '#3384d3';
const white = { color: 'white' };

const BookListPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [clickedBookData, setClickedBookData] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [audioForm, setAudioForm] = useState("");
  const [imageForm, setImageForm] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const {
    data: allBooks,
    isLoading: isLoadingBooks,
    isError: isErrorBooks,
  } = useQuery('books', async () => {
    try {
      const response = await axios.get(`${API_URL}/books`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery("categories", async () => {
    try {
      const response = await axios.get(`${API_URL}/category`);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  });

  const {
    data: ageGroups,
    isLoading: isLoadingAgeGroups,
    isError: isErrorAgeGroups,
  } = useQuery("ageGroups", async () => {
    const response = await axios.get(`${API_URL}/age-groups`);
    return response.data.data;
  });

  const handleUpdateBook = async () => {
    setIsLoading(true);
    try {
      // Update book data as needed
      const updatedBook = {
        title: selectedBook.title,
        desc: selectedBook.desc,
        duration: selectedBook.duration,
        category_id: selectedCategory,
        agegroup_id: selectedAgeGroup,
        cover_image: imageForm,
        audio_link: audioForm,
      };
      const response = await axios.put(`${API_URL}/books/${clickedBookData.id}`, updatedBook);
      if (response.data.success) {
        console.log('Book updated successfully:', response.data.message);
        showSnackbar('success', 'Book updated successfully');
        queryClient.invalidateQueries('books');
      } else {
        console.error('Error updating book:', response.data);
        showSnackbar('error', 'Error updating book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      showSnackbar('error', 'Sorry, the book title already exists');
    } finally {
      setIsLoading(false);
      handleModalClose();
    }
  };

  const handleDeleteBook = async (ID) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/books/${ID}`);

      if (response.data.success) {
        console.log('Book deleted successfully:', response.data.message);
        showSnackbar('success', 'Book deleted successfully');
        queryClient.invalidateQueries('books');
      } else {
        console.error('Error deleting book:', response.data);
        showSnackbar('error', 'Error deleting book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      showSnackbar('error', `Sorry, can't delete this book perhaps it has reviews.`);
    } finally {
      setIsLoading(false);
      handleModalClose();
    }
  };

  const handleUpdateClick = (book) => {
    setSelectedBook(book);
    setClickedBookData(book);
    setIsModalOpen(true);
  };


  const handleModalClose = () => {
    setSelectedBook(null);
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
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 2.2 },
    { field: 'desc', headerName: 'Description', flex: 1.5 },
    { field: 'duration', headerName: 'Duration', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1.7, valueGetter: (params) => params.row.category.name },
    { field: 'agegroup', headerName: 'Age Group', flex: 1.3, valueGetter: (params) => params.row.agegroup.name },
    { field: 'user', headerName: 'Author', flex: 1.5, valueGetter: (params) => params.row.user.username },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleUpdateClick(params.row)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDeleteBook(params.row.ID)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  // Handling map before entering rows in DataGrid
  const fetchBooks = allBooks ?
    allBooks.map((book) => ({ id: book.ID, ...book }))
    : []

  return (
    <>
      {isLoading ? <LoadingOverlay /> : null}
      {isErrorBooks ? (
        <Box>Error while fetching book data</Box>
      ) : (
        <>
          <Box
            sx={{
              p: 2,
              margin: 1,
              padding: '15px',
              border: '1px dashed grey',
              textAlign: 'left',
              wordWrap: 'break-word',
            }}
          >
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              Book List
            </Typography>
            <Typography sx={{ textAlign: 'center', margin: '10px' }}>
              In book list page, you can perform listing book data and editing book data.
            </Typography>
          </Box>
          <Box style={{ height: 400, width: '100%' }}>
            <DataGrid
              sx={{ width: '1200px' }}
              loading={isLoadingBooks}
              rows={fetchBooks}
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
      <Dialog open={isModalOpen} onClose={handleModalClose} >
        <DialogTitle sx={{ backgroundColor: color1, color: white }}>Update Book</DialogTitle>
        <DialogContent>
          <Box sx={{ padding: '10px' }}>
            {clickedBookData && (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                {/* Replace textAlignL with textAlign */}
                <MenuBookIcon />
                <Typography sx={{ margin: '5px', alignItems: 'center', justifyContent: 'center' }}>
                  {clickedBookData.id}
                </Typography>
              </Box>
            )}
          </Box>
          <Box margin={'10px'}>
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              type="text"
              fullWidth // Make the TextField full-width
              value={selectedBook?.title || ''}
              onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
            />
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              {isLoadingCategories ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                categories.map((category) => (
                  <MenuItem key={category.ID} value={category.ID}>
                    {category.name}
                  </MenuItem>
                ))
              )}
              {isErrorCategories && (
                <MenuItem disabled>
                  <ErrorAnimation />
                  <Typography variant="subtitle1">
                    Error while fetching categories..
                  </Typography>
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="agegroup-select-label">Age Group</InputLabel>
            <Select
              labelId="agegroup-select-label"
              id="agegroup-select"
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              label="Age Group"
            >
              {isErrorAgeGroups && (
                <MenuItem disabled>
                  <ErrorAnimation />
                  <Typography variant="subtitle1">
                    Error while fetching age groups..
                  </Typography>
                </MenuItem>
              )}
              {isLoadingAgeGroups ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                ageGroups.map((ageGroup) => (
                  <MenuItem key={ageGroup.ID} value={ageGroup.ID}>
                    {ageGroup.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <Box margin={'10px'}>
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              type="text"
              fullWidth // Make the TextField full-width
              value={selectedBook?.desc || ''}
              onChange={(e) => setSelectedBook({ ...selectedBook, desc: e.target.value })}
            />
          </Box>
          <Box margin={'10px'}>
            <TextField
              id="outlined-basic"
              label="Duration"
              variant="outlined"
              type="text"
              fullWidth // Make the TextField full-width
              value={selectedBook?.duration || ''}
              onChange={(e) => setSelectedBook({ ...selectedBook, duration: e.target.value })}
            />
          </Box>
          <Box margin={'10px'}>
            <TextField
              label="Image Link"
              fullWidth
              margin="normal"
              value={imageForm}
              onChange={(e) => setImageForm(e.target.value)}
            />
          </Box>
          <Box margin={'10px'}>
            <TextField
              label="Audio Link"
              fullWidth
              margin="normal"
              value={audioForm}
              onChange={(e) => setAudioForm(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleUpdateBook}>Update</Button>
          <Button onClick={handleModalClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default BookListPage;
