import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const formAPI = {
  // Form endpoints
  createForm: (formData) => api.post("/forms", formData),
  getForm: (id) => api.get(`/forms/${id}`),

  // Response endpoints - UPDATED
  submitResponse: (responseData) => api.post("/responses", responseData),
  getResponses: (formId) => api.get(`/responses/${formId}`),

  // Upload endpoint
  uploadImage: (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
