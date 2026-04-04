const BASE_URL = "https://graphql.anilist.co";
const TIMEOUT_MS = 15000;

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

function fetchWithTimeout(url: string, options: RequestInit, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

function resolveErrorMessage(status: number | null, graphqlErrors?: GraphQLError[]): string {
  if (graphqlErrors?.length)
    return graphqlErrors.map(e => e.message).join("; ");
  if (status === 429) return "Rate limited. Please wait a moment...";
  if (status === 404) return "Resource not found";
  if (status === 400) return "Bad request. Check your GraphQL query/variables.";
  if (status !== null && status >= 500) return "Server error. Please try again later.";
  return "Network error. Check your connection.";
}

export async function apiClient<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  let response: Response;

  try {
    response = await fetchWithTimeout(
      BASE_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      },
      TIMEOUT_MS
    );
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === "AbortError";
    throw new Error(isTimeout ? "Request timed out. Please try again." : "Network error. Check your connection.");
  }

  const payload: GraphQLResponse<T> = await response.json();

  if (payload?.errors?.length) {
    const err = new Error(resolveErrorMessage(null, payload.errors)) as any;
    err.graphqlErrors = payload.errors;
    throw err;
  }

  if (!response.ok) {
    throw new Error(resolveErrorMessage(response.status));
  }

  return payload.data as T;
}

export default apiClient;