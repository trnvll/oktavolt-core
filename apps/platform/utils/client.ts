import { convertObjectValuesToString } from '@/utils/misc'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface HttpConfig {
  data?: Record<string, any> | string
  queryParams?: Record<string, string | number | boolean | undefined>
  method?: HttpMethod
  token?: string
  headers?: Record<string, any>
  cache?: string
}

export async function client<T>(
  url: string,
  {
    data,
    queryParams,
    token,
    headers: customHeaders,
    method = data ? HttpMethod.POST : HttpMethod.GET,
    ...customConfig
  }: HttpConfig = {},
): Promise<T> {
  const config = {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': data ? 'application/json' : '',
      ...customHeaders,
    },
    ...customConfig,
  }

  const endpoint = `${url}${
    queryParams
      ? `?${new URLSearchParams(convertObjectValuesToString(queryParams))}`
      : ''
  }`

  return fetch(endpoint, config as any).then(async (response) => {
    try {
      const dataText = await response.text()
      const data = dataText ? JSON.parse(dataText) : {}

      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    } catch (err) {
      console.error(response.status, err)
    }
  })
}
