import API_URL from "../utils/API_URL";
import axios from "axios";

export const generateAudioApi = async ({ inputAudioTitle, inputBookStory }) => {
  const response = await axios.post(`${API_URL}/books/generate/audio`, {
    title_book: inputAudioTitle,
    book_story: inputBookStory,
  });
  return response.data.data.audio_file;
};

export const generateImageApi = async ({ inputAudioTitle, inputBookStory }) => {
  const response = await axios.post(`${API_URL}/books/generate/image`, {
    title_book: inputAudioTitle,
    book_story: inputBookStory,
  });
  return response.data.data.image_link;
};

export const uploadImageApi = async ({ formData }) => {
  const response = await axios.post(`${API_URL}/books/image/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data.image_link;
};
