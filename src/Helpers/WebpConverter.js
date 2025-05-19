import axios from 'axios';

export async function uploadFormImageWebpAxios(imageFile) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD;
  const uploadPreset = 'ml_default';

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("cloud_name", cloudName);
  formData.append("upload_preset", uploadPreset);

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
/**
 * Convierte una URL de Cloudinary a su versión WebP.
 * @param {string} secureUrl - URL original segura (e.g. termina en .png, .jpg).
 * @returns {string} - URL transformada para entregar WebP.
 */
export function toWebpUrl(secureUrl) {

  const withFlag = secureUrl.replace(
    '/upload/',
    '/upload/f_webp/'
  );

  return withFlag.replace(/\.\w+$/, '.webp');
}
