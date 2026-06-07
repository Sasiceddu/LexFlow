const DEFAULT_API_BASE_URL = 'http://localhost:3001'

type ApiClientOptions = {
  baseUrl?: string
}

type RequestOptions = {
  signal?: AbortSignal
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

      if (!response.ok) {
        throw new ApiError(
          `Backend request failed with status ${response.status}`,
          response.status,
        )
      }

      const data: unknown = await response.json()

      return data as TResponse
    },
  }
}

export const apiClient = createApiClient()
