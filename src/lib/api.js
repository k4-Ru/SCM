const ACCESS_TOKEN_KEY = 'scm_access_token'
export const AUTH_EXPIRED_EVENT = 'scm:auth-expired'

function decodeBase64Url(value) {
  if (!value) return ''

  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')

  try {
    return atob(padded)
  } catch {
    return ''
  }
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null

  const parts = token.split('.')
  if (parts.length < 2) return null

  const payload = decodeBase64Url(parts[1])
  return parseJsonSafely(payload)
}

function parseJsonSafely(value) {
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function normalizeBody(body) {
  if (body == null) return undefined
  if (typeof body === 'string') return body
  return JSON.stringify(body)
}

function buildHeaders(headers = {}, includeJsonHeader = true) {
  const finalHeaders = { ...headers }
  if (includeJsonHeader && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json'
  }
  return finalHeaders
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getCurrentUserRole() {
  const token = getAccessToken()
  const payload = decodeJwtPayload(token)
  const role = payload?.role
  return typeof role === 'string' ? role : ''
}

export function getCurrentUserInfo() {
  const token = getAccessToken()
  const payload = decodeJwtPayload(token)

  if (!payload || typeof payload !== 'object') {
    return {
      name: '',
      email: '',
      role: '',
    }
  }

  return {
    name: typeof payload.name === 'string' ? payload.name : '',
    email: typeof payload.email === 'string' ? payload.email : '',
    role: typeof payload.role === 'string' ? payload.role : '',
  }
}

export function setAuthTokens({ accessToken } = {}) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

function extractTokens(payload) {
  return {
    accessToken: payload?.accessToken ?? payload?.access_token ?? payload?.token,
  }
}

async function parseResponse(response) {
  const text = await response.text()
  const data = parseJsonSafely(text)
  return data ?? text
}

async function doRequest(path, options = {}, auth = true) {
  const method = options.method ?? 'GET'
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  const headers = buildHeaders(options.headers, !isFormData)

  if (auth) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(path, {
    ...options,
    method,
    headers,
    body: isFormData ? options.body : normalizeBody(options.body),
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && (payload.message || payload.error)) ||
      (typeof payload === 'string' && payload) ||
      `Request failed with status ${response.status}`

    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export async function apiRequest(path, options = {}, config = {}) {
  const useAuth = config.auth !== false

  try {
    return await doRequest(path, options, useAuth)
  } catch (error) {
    if (useAuth && error.status === 401) {
      clearAuthTokens()

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
      }
    }

    throw error
  }
}




export async function login(credentials) {
  const identifier = (credentials?.identifier ?? '').trim()
  const password = credentials?.password

  const loginBodies = identifier
    ? (identifier.includes('@')
      ? [
          { email: identifier, password },
          { username: identifier, password },
          { name: identifier, password },
          { identifier, password },
        ]
      : [
          { username: identifier, password },
          { name: identifier, password },
          { email: identifier, password },
          { identifier, password },
        ])
    : [credentials]

  let payload = null
  let lastError = null

  for (let i = 0; i < loginBodies.length; i += 1) {
    try {
      payload = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: loginBodies[i],
      }, { auth: false, retry: false })
      break
    } catch (error) {
      lastError = error
      if (error.status !== 400 && error.status !== 401 && error.status !== 422) throw error
    }
  }

  if (!payload) throw lastError

  setAuthTokens(extractTokens(payload))
  return payload
}








export function register(userData) {
  const payload = {
    name: userData?.name ?? userData?.username,
    email: userData?.email,
    password: userData?.password,
  }

  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: payload,
  }, { auth: false, retry: false })
}

export async function logout() {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' }, { retry: false })
  } catch {
    await apiRequest('/logout', { method: 'POST' }, { retry: false })
  } finally {
    clearAuthTokens()
  }
}
