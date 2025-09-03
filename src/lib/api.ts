type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string | number>;
  body?: unknown;
  headers?: Record<string, string>;
  token?: boolean
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", params, body, headers = {}, token = false } = options

  // Construir query string si hay params
  const query = params
    ? "?" +
      Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&")
    : ""

  const url = `${BASE_URL}${endpoint}${query}`

  console.log('Preguntando a ', url)

  // Incluir token si se solicita
  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  }

  if (token) {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      finalHeaders["Authorization"] = `Bearer ${storedToken}`
    }
  }


  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: method !== "GET" ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error en la solicitud")
  }

  return response.json()
}

