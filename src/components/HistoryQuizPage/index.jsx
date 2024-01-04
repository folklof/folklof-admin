import React, { useState, useEffect, useCallback } from "react";
import {
  CardContent,
  Typography,
  IconButton,
  Modal,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import API_URL from "../../utils/API_URL";

const HistoryQuizPage = () => {
  const [quizHistory, setQuizHistory] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editedScores, setEditedScores] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Define the fetchQuizHistory function with useCallback
  const fetchQuizHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/history-quiz`);
      setQuizHistory(response.data.data);
    } catch (error) {
      console.error("Error fetching quiz history:", error);
    }
  }, []); // Empty dependency array as there are no dependencies

  // Use the fetchQuizHistory function within useEffect
  useEffect(() => {
    fetchQuizHistory();
  }, [fetchQuizHistory]); 

  const handleEditModalOpen = (quiz) => {
    setSelectedQuiz(quiz);
    setEditedScores(quiz.scores);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedQuiz(null);
    setEditedScores(0);
  };

  const handleEditScores = async (quizId) => {
    try {
      console.log(editedScores);
      await axios.put(`${API_URL}/history-quiz/${quizId}`, {
        scores: parseInt(editedScores, 10),
      });
      fetchQuizHistory();
      showSnackbar("Scores updated successfully", "success");
    } catch (error) {
      console.error("Error editing scores:", error);
      showSnackbar("Failed to update scores", "error");
    }

    handleEditModalClose();
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`${API_URL}/history-quiz/${quizId}`);
      fetchQuizHistory();
      showSnackbar("Quiz deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      showSnackbar("Failed to delete quiz", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const columns = [
    { field: "ID", 
      headerName: "ID", 
      width: 150,
      headerAlign: 'center',
      align: 'center',
      marginLeft: 200
    },
    { field: "bookquiz_id",
      headerName: "Question", 
      width: 350,
      headerAlign: 'center',
      valueGetter: (params) => params.row.bookquiz.question,
    },
    { field: "user_id", 
      headerName: "Username", 
      width: 150,
      headerAlign: 'center', 
      align: 'center',
      valueGetter: (params) => params.row.user.username
    },
    { field: "scores", 
      headerName: "Scores", 
      type: "number", 
      width: 100, 
      headerAlign: 'center',
      align: 'center', 
    },
    {
      field: 'created_date',
      headerName: 'Created Date',
      type: 'dateTime',
      width: 180,
      headerAlign: 'center',
      align: 'center', 
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      headerAlign: 'center',
      align: 'center', 
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEditModalOpen(params.row)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteQuiz(params.row.ID)}
            color="secondary"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const formattedQuizHistory = quizHistory.map((item) => ({
    ...item,
    id: item.ID,
  }));

  return (
    <div>
      <Box
        sx={{
          p: 2,
          border: "1px dashed grey",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">History Quizzes by Folklof</Typography>
      </Box>
        <CardContent sx={{ margin: "8px" }}>
          <div style={{ height: 450, width: "100%" }}>
            <DataGrid
              rows={formattedQuizHistory}
              columns={columns}
              pageSize={5}
            />
          </div>
        </CardContent>

      {/* Modal untuk mengedit scores */}
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit Scores
          </Typography>
          <TextField
            label="Edited Scores"
            type="number"
            value={editedScores}
            onChange={(e) => setEditedScores(e.target.value)}
            fullWidth
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={() => handleEditScores(selectedQuiz.ID)}>
            Save
          </Button>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
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
    </div>
  );
};

export default HistoryQuizPage;
