const BASE_URL = "https://graphql.anilist.co";
const TIMEOUT_MS = 15000;

interface GraphQLError {
  message: string;
  status?: number;
}

interface GraphQLResponse<T> {
  data?: T | null;
  errors?: GraphQLError[];
}

/**
 * Error thrown for every failed AniList request.
 * `status` is the HTTP status (or the GraphQL error status when AniList sends one);
 * it is null for network failures and timeouts.
 */
export class ApiError extends Error {
  readonly status: number | null;
  readonly graphqlErrors?: GraphQLError[];

  constructor(message: string, status: number | null, graphqlErrors?: GraphQLError[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.graphqlErrors = graphqlErrors;
  }

  get isRateLimited() {
    return this.status === 429;
  }

  get isServerError() {
    return this.status !== null && this.status >= 500;
  }

  /** Network failure or timeout — the request never got a response. */
  get isNetworkError() {
    return this.status === null;
  }
}

function fetchWithTimeout(url: string, options: RequestInit, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

function messageForStatus(status: number): string {
  if (status === 429) return "AniList is receiving too many requests. Please wait a moment and try again.";
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status >= 500) return "AniList is having trouble right now. Please try again later.";
  if (status >= 400) return "The request to AniList was rejected.";
  return "Something went wrong while talking to AniList.";
}

async function readPayload<T>(response: Response): Promise<GraphQLResponse<T> | null> {
  try {
    return (await response.json()) as GraphQLResponse<T>;
  } catch {
    // Non-JSON body (e.g. an HTML error page from a proxy or CDN)
    return null;
  }
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
    throw new ApiError(
      isTimeout ? "The request timed out. Please try again." : "Network error. Check your connection.",
      null
    );
  }

  const payload = await readPayload<T>(response);
  const graphqlErrors = payload?.errors?.length ? payload.errors : undefined;

  if (!response.ok) {
    // HTTP status decides the message, so a 429 is always reported (and retried) as a rate limit
    throw new ApiError(messageForStatus(response.status), response.status, graphqlErrors);
  }

  if (graphqlErrors) {
    const status = graphqlErrors.find(e => typeof e.status === "number")?.status ?? 400;
    throw new ApiError(
      status === 400 ? graphqlErrors.map(e => e.message).join("; ") : messageForStatus(status),
      status,
      graphqlErrors
    );
  }

  if (!payload || payload.data == null) {
    throw new ApiError("AniList returned an empty response.", response.status);
  }

  return payload.data;
}

export default apiClient;
