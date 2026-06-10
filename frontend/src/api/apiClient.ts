const DEFAULT_API_BASE_URL = 'http://localhost:3001'

type ApiClientOptions = {
  baseUrl?: string
}

type RequestOptions = {
  signal?: AbortSignal
}

type JsonRequestOptions = RequestOptions & {
  body?: unknown
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getApiBaseUrl(baseUrl?: string): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL as
    | string
    | undefined

  return (baseUrl ?? configuredBaseUrl ?? DEFAULT_API_BASE_URL).replace(/\/$/, '')
}

function isErrorBody(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  )
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()

    if (isErrorBody(data)) {
      return data.message
    }
  } catch {
    // Fall back to the generic HTTP message below.
  }

  return `Backend request failed with status ${response.status}`
}

async function parseJsonResponse<TResponse>(
  response: Response,
): Promise<TResponse> {
  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status)
  }

  const data: unknown = await response.json()

  return data as TResponse
}

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = getApiBaseUrl(options.baseUrl)

  return {
    async get<TResponse>(
      path: string,
      requestOptions: RequestOptions = {},
    ): Promise<TResponse> {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: {
          Accept: 'application/json',
        },
        signal: requestOptions.signal,
      })

      return parseJsonResponse<TResponse>(response)
    },
    async post<TResponse>(
      path: string,
      requestOptions: JsonRequestOptions = {},
    ): Promise<TResponse> {
      const response = await fetch(`${baseUrl}${path}`, {
        body: JSON.stringify(requestOptions.body ?? {}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        signal: requestOptions.signal,
      })

      return parseJsonResponse<TResponse>(response)
    },
    async patch<TResponse>(
      path: string,
      requestOptions: JsonRequestOptions = {},
    ): Promise<TResponse> {
      const response = await fetch(`${baseUrl}${path}`, {
        body: JSON.stringify(requestOptions.body ?? {}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        signal: requestOptions.signal,
      })

      return parseJsonResponse<TResponse>(response)
    },
    async delete<TResponse>(
      path: string,
      requestOptions: RequestOptions = {},
    ): Promise<TResponse> {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: {
          Accept: 'application/json',
        },
        method: 'DELETE',
        signal: requestOptions.signal,
      })

      return parseJsonResponse<TResponse>(response)
    },
  }
}

export const apiClient = createApiClient()
