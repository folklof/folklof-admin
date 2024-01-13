import React, { useState, useRef } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import {
  generateAudioApi,
  generateImageApi,
  uploadImageApi,
} from "../../hooks/useMutation";
import { useSelector } from "react-redux";
import axios from "axios";
import Box from "@mui/system/Box";
import { Error } from "@mui/icons-material";
import { styled } from "@mui/system";
import API_URL from "../../utils/API_URL";

const ErrorAnimation = styled(Error)({
  fontSize: 32,
  color: "red",
});

const GenerateBookPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [inputBookStory, setInputBookStory] = useState("");
  const [inputAudioTitle, setInputAudioTitle] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [audioForm, setAudioForm] = useState("");
  const [imageForm, setImageForm] = useState("");

  const [audioLink, setAudioLink] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [imageUpload, setImageUpload] = useState("");
  const [dataImage, setDataImage] = useState(null);

  const messagesEndRef = useRef(null);
  const audioMutation = useMutation(generateAudioApi);
  const imageMutation = useMutation(generateImageApi);
  const uploadImageMutation = useMutation(uploadImageApi);

  const [loadingUploadImage, setLoadingUploadImage] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorAudio, setErrorAudio] = useState(false);
  const [errorImage, setErrorImage] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const userData = useSelector((state) => state.user.user);

  const showSnackbar = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

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

  const user = "user";
  const chatbot = "Folklof AI";

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmitGenerateAudio = async (e) => {
    e.preventDefault();
    setLoadingAudio(false);
    setErrorAudio(false);

    try {
      setLoadingAudio(true);
      const response = await audioMutation.mutateAsync({
        inputAudioTitle,
        inputBookStory,
      });
      setAudioLink(response);
    } catch (err) {
      setAudioLink("");
      setErrorAudio(true);
      console.error(err, "err");
    } finally {
      setLoadingAudio(false);
    }
  };

  const handleSubmitGenerateImage = async (e) => {
    e.preventDefault();
    setLoadingImage(false);
    setErrorImage(false);

    try {
      setLoadingImage(true);
      const response = await imageMutation.mutateAsync({
        inputAudioTitle,
        inputBookStory,
      });
      setImageLink(response);
    } catch (err) {
      setImageLink("");
      setErrorImage(true);
      console.error(err, "err");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleUploadImage = async () => {
    setErrorUpload(false);
    setLoadingUploadImage(false);

    const formData = new FormData();
    formData.append("image_file", dataImage);

    try {
      setLoadingUploadImage(true);
      const response = await uploadImageMutation.mutateAsync({
        formData,
      });
      setImageUpload(response);
      console.log(response);
    } catch (err) {
      setImageUpload("");
      setErrorUpload(true);
      console.error(err, "err");
    } finally {
      setLoadingUploadImage(false);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (inputPrompt.trim() !== "") {
      setMessages([...messages, { text: inputPrompt, sender: user }]);
    }

    try {
      let prevMessageSender = null;
      let prevMessageText = "";
      const response = await fetch(`${API_URL}/books/generate/chat`, {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title_book: inputTitle,
          user_prompt: inputPrompt,
        }),
      });
      console.log(response);
      if (!response.ok || !response.body) {
        throw response.statusText;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const decodedChunk = decoder.decode(value, { stream: true });
        if (prevMessageSender === chatbot) {
          prevMessageText += decodedChunk;
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { text: prevMessageText, sender: chatbot },
          ]);
        } else {
          prevMessageText = decodedChunk;
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: decodedChunk, sender: chatbot },
          ]);
        }
        prevMessageSender = chatbot;
      }
    } catch (err) {
      console.error(err, "err");
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title: title,
      user_id: userData.ID,
      category_id: selectedCategory,
      agegroup_id: selectedAgeGroup,
      desc: description,
      duration: duration,
      cover_image: imageForm,
      audio_link: audioForm,
    };

    try {
      const response = await axios.post(`${API_URL}/books`, formData);
      console.log("Form submitted successfully:", response.data);
      handleCloseModal();
      showSnackbar("success", "Book added successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      showSnackbar("error", "Error while adding a book");
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={() => {
          setOpenAlert(false);
        }}
      >
        <Alert
          onClose={() => {
            setOpenAlert(false);
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          This is a success message!
        </Alert>
      </Snackbar>

      <Box
        sx={{
          p: 2,
          margin: 1,
          border: "1px dashed grey",
          textAlign: "left",
          wordWrap: "break-word",
        }}
      >
        <Typography variant="h4">Generate Book with Folklof AI</Typography>
        <Typography variant="body1">
          After generate a book, add the data here :
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ margin: "10px" }}
          >
            Add Book Modal
          </Button>
        </Typography>
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add Book Modal</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Book Title"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="User ID"
              readOnly
              fullWidth
              margin="normal"
              value={userData.ID}
            />
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
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="Duration"
              fullWidth
              margin="normal"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <TextField
              label="Image Link"
              fullWidth
              margin="normal"
              value={imageForm}
              onChange={(e) => setImageForm(e.target.value)}
            />
            <TextField
              label="Audio Link"
              fullWidth
              margin="normal"
              value={audioForm}
              onChange={(e) => setAudioForm(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={5}>
        <Grid item container direction="column" xs={6}>
          <Paper elevation={5} style={{ padding: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <form onSubmit={handleSubmitGenerateAudio}>
                  <h2>Generate Audio</h2>
                  <TextField
                    value={inputAudioTitle}
                    label="Book Title"
                    onChange={(e) => setInputAudioTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    value={inputBookStory}
                    label="Book Story"
                    onChange={(e) => setInputBookStory(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
                  <Button variant="contained" color="primary" type="submit">
                    Generate Audio
                  </Button>
                </form>
              </Grid>
              <Grid item xs={6}>
                <h2>Result</h2>
                {loadingAudio && (
                  <div>
                    <CircularProgress />
                    <Typography variant="subtitle1">
                      Please wait a moment...
                    </Typography>
                  </div>
                )}
                {errorAudio && (
                  <div>
                    <ErrorAnimation />
                    <Typography variant="subtitle1">
                      Error while generating audio
                    </Typography>
                  </div>
                )}
                {audioLink && (
                  <>
                    <Box
                      component="section"
                      sx={{
                        p: 2,
                        margin: 1,
                        border: "1px dashed grey",
                        textAlign: "center",
                        wordWrap: "break-word",
                      }}
                    >
                      <Typography variant="body1" gutterBottom>
                        {audioLink}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        margin="normal"
                        onClick={() => handleCopyText(audioLink)}
                      >
                        Copy
                      </Button>
                    </Box>
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
          <Paper elevation={5} style={{ padding: "20px", marginTop: "10px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <form onSubmit={handleSubmitGenerateImage}>
                  <h2>Generate Image</h2>
                  <TextField
                    value={inputAudioTitle}
                    label="Book Title"
                    onChange={(e) => setInputAudioTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    value={inputBookStory}
                    label="Book Story"
                    onChange={(e) => setInputBookStory(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
                  <Button variant="contained" color="primary" type="submit">
                    Generate Image
                  </Button>
                </form>
              </Grid>
              <Grid item xs={6}>
                <h2>Result</h2>
                {loadingImage && (
                  <div>
                    <CircularProgress />
                    <Typography variant="subtitle1">
                      Please wait a moment...
                    </Typography>
                  </div>
                )}
                {errorImage && (
                  <div>
                    <ErrorAnimation />
                    <Typography variant="subtitle1">
                      Error while generating image
                    </Typography>
                  </div>
                )}
                {imageLink && (
                  <>
                    <Box
                      component="section"
                      sx={{
                        p: 2,
                        margin: 1,
                        border: "1px dashed grey",
                        textAlign: "center",
                        wordWrap: "break-word",
                      }}
                    >
                      <img src={imageLink} style={{ width: "200px" }}></img>
                      <Button
                        variant="outlined"
                        size="small"
                        margin="normal"
                        onClick={() => window.open(imageLink, "_blank")}
                      >
                        View FullScreen
                      </Button>
                    </Box>
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box
                  component="section"
                  sx={{
                    p: 2,
                    margin: 1,
                    border: "1px dashed grey",
                    textAlign: "center",
                    wordWrap: "break-word",
                  }}
                >
                  <h3>Upload Image to AWS S3</h3>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ marginBottom: "15px" }}
                    onChange={(event) => setDataImage(event.target.files[0])}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    margin="normal"
                    component="label"
                    onClick={handleUploadImage}
                  >
                    Upload
                  </Button>
                  {loadingUploadImage && (
                    <div>
                      <CircularProgress />
                      <Typography variant="subtitle1">
                        Please wait a moment...
                      </Typography>
                    </div>
                  )}
                  {errorUpload && (
                    <div>
                      <ErrorAnimation />
                      <Typography variant="subtitle1" sx={{ margin: 2 }}>
                        Error while uploading to AWS
                      </Typography>
                    </div>
                  )}
                  {imageUpload && (
                    <>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ margin: 2 }}
                      >
                        {imageUpload}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        margin="normal"
                        onClick={() => handleCopyText(imageUpload)}
                      >
                        Copy
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Third Grid  */}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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

        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: "20px", width: "700px" }}>
            <h2>Folklof AI</h2>
            <List
              style={{ height: "400px", maxHeight: "400px", overflowY: "auto" }}
            >
              {messages.map((message, index) => (
                <div key={index}>
                  <ListItem
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div
                      style={{
                        alignSelf:
                          message.sender === user ? "flex-end" : "flex-start",
                        background:
                          message.sender === user ? "#DCF8C6" : "#ECEFF1",
                        padding: "8px",
                        borderRadius: "8px",
                        maxWidth: "70%",
                      }}
                    >
                      {message.sender === chatbot && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleCopyText(message.text)}
                        >
                          Copy
                        </Button>
                      )}
                      <ListItemText
                        primary={message.text}
                        secondary={message.sender === user ? "You" : chatbot}
                      />
                    </div>
                    {(message.sender === user ||
                      message.sender === chatbot) && (
                      <div
                        style={{
                          alignSelf:
                            message.sender === user ? "flex-end" : "flex-start",
                          fontSize: "0.75rem",
                          color: "black",
                          marginTop: "4px",
                        }}
                      >
                        {message.time}
                      </div>
                    )}
                  </ListItem>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </List>
            <form onSubmit={handleMessageSubmit}>
              <TextField
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                label="Input Title of Book"
                fullWidth
                margin="normal"
              />
              <TextField
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                label="Input Prompt"
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" type="submit">
                Generate Story
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default GenerateBookPage;
