import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  Grid,
  Autocomplete,
  Box,
  Snackbar
} from "@mui/material";
import axios from "axios";
import MuiAlert from '@mui/material/Alert';
import API_URL from "../../utils/API_URL";
import LoadingOverlay from "../LoadingOverlay";

const CreateQuizPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState({
    option1: false,
    option2: false,
    option3: false,
  });
  const [optionValues, setOptionValues] = useState({
    option1: "",
    option2: "",
    option3: "",
  });
  const [selectedOption, setSelectedOption] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/books`);
        setBooks(response.data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleOptionChange = (key) => {
    setOptions((prevOptions) => ({
      option1: key === "option1",
      option2: key === "option2",
      option3: key === "option3",
    }));
    setSelectedOption(key);
  };

  const handleTextFieldChange = (key, value) => {
    setOptionValues((prevOptionValues) => ({
      ...prevOptionValues,
      [key]: value,
    }));
  };

  const handleSubmitQuiz = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/book-quiz`, {
        book_id: selectedBookId,
        question,
        option1: optionValues.option1 || '',
        option2: optionValues.option2 || '',
        option3: optionValues.option3 || '',
        correct_answer: optionValues[selectedOption] || '',
      });
      console.log(response)

      setQuestion("");
      setOptions({
        option1: false,
        option2: false,
        option3: false,
      });
      setOptionValues({
        option1: "",
        option2: "",
        option3: "",
      });
      setSelectedOption("");
      setSelectedBook(null);
      setSelectedBookId(null);
      setIsLoading(false)
      showSnackbar('success', 'Quiz Created Successfully!!');
    } catch (error) {
      setIsLoading(false)
      showSnackbar('error', 'Create Quiz Failed!');
      console.log("Error submitting quiz", error);
    }
    console.log(selectedBookId, question, optionValues, selectedOption);
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

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <>
      <Box
        sx={{
          p: 2,
          margin: 1,
          border: "1px dashed grey",
          textAlign: "center",
          wordWrap: "break-word",
        }}
      >
        <Typography variant="h4">Create quiz with Folklof</Typography>
      </Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Quiz Question Form
          </Typography>
          <Autocomplete
            options={books}
            getOptionLabel={(option) => option.title}
            value={selectedBook}
            onChange={(_, newValue) => {
              setSelectedBook(newValue);
              setSelectedBookId(newValue ? newValue.ID : null);
            }}
            renderInput={(params) => <TextField {...params} label="Select Book" />}
          />
          <TextField
            label="Question"
            multiline
            fullWidth
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Grid container spacing={2}>
            {Object.entries(options).map(([key, checked]) => (
              <Grid item xs={4} key={key}>
                <Checkbox
                  checked={checked}
                  onChange={() => handleOptionChange(key)}
                  color="primary"
                />
                <TextField
                  label={`Option ${key.substring(key.length - 1)}`}
                  value={optionValues[key]}
                  onChange={(e) => handleTextFieldChange(key, e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitQuiz}
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
          <Typography variant="body2" sx={{ marginTop: 2, color: "gray", display: "flex", justifyContent: "flex-start" }}>
            *Check one of the options to indicate the correct answer.
          </Typography>
        </CardContent>
      </Card>

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

export default CreateQuizPage;
