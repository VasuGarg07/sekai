import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://graphql.anilist.co",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data;

    // Handle GraphQL-level errors if present
    if (payload?.errors?.length) {
      const message = payload.errors.map((e: any) => e.message).join("; ");
      const err = new Error(message);
      (err as any).graphqlErrors = payload.errors;
      return Promise.reject(err);
    }

    return payload?.data; // unwrap GraphQL data
  },
  (error) => {
    const status = error.response?.status;
    const graphQLErrors = error.response?.data?.errors;

    if (graphQLErrors?.length) {
      error.message = graphQLErrors.map((e: any) => e.message).join("; ");
    } else if (status === 429) {
      error.message = "Rate limited. Please wait a moment...";
    } else if (status === 404) {
      error.message = "Resource not found";
    } else if (status === 400) {
      error.message = "Bad request. Check your GraphQL query/variables.";
    } else if (status >= 500) {
      error.message = "Server error. Please try again later.";
    } else if (!error.response) {
      error.message = "Network error. Check your connection.";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
