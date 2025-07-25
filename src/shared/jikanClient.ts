import axios from 'axios';

export const jikanClient = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 15000
});

jikanClient.interceptors.response.use(null, (error) => {
  if (error.response?.status === 429) {
    error.message = 'Rate limited. Please wait a moment...';
  } else if (error.response?.status === 404) {
    error.message = 'Resource not found';
  } else if (error.response?.status >= 500) {
    error.message = 'Server error. Please try again later.';
  } else if (!error.response) {
    error.message = 'Network error. Check your connection.';
  }

  return Promise.reject(error);
}
);

export default jikanClient;