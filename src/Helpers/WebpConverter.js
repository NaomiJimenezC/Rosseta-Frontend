import axios from 'axios';

async function uploadFormImageWebpAxios(imageFile) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD;
  const apiKey =import.meta.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET_KEY;

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("cloud_name", cloudName);
  formData.append("api_key", apiKey);
  formData.append("format", "webp");

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("¡Ups! Hubo un error al subir la imagen:", response.status);
      return null;
    }
  } catch (error) {
    console.error("¡Vaya! Algo salió mal al subir la imagen:", error);
    return null;
  }
}
