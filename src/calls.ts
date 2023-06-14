import axios, { AxiosRequestConfig } from 'axios';

export async function call(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE', url: string, callOptions?: ICallOptions) {
  const baseOptions = {
    method,
    url,
    headers: { Accept: 'application/json' },
    errorMessage: 'Request failed',
  };
  const options = Object.assign(baseOptions, callOptions);

  if (options.form) {
    const form = new URLSearchParams();
    for (const [key, value] of Object.entries(options.form)) {
      form.append(key, value as string);
    }
    options.data = form.toString();
  }

  try {
    const response = await axios(options);
    return options.verbose ? response : (response.data || response);
  } catch (e: any) {
    if (options.verbose) {
      throw e;
    }
    if (e.isAxiosError && e.response) {
      const errorBody = e.response.data?.message || JSON.stringify(e.response.data, undefined, 2) || e.response.statusText;
      throw new Error(`${options.errorMessage}\n${e.response.status}: ${errorBody}`);
    }
    throw new Error(`${options.errorMessage}\n${e}`);
  }
}

export async function get(url: string, options?: ICallOptions) {
  return call('GET', url, options);
}

export async function post(url: string, options?: ICallOptions) {
  return call('POST', url, options);
}

export async function put(url: string, options?: ICallOptions) {
  return call('PUT', url, options);
}

export async function deleteCall(url: string, options?: ICallOptions) {
  return call('DELETE', url, options);
}

export interface ICallOptions extends AxiosRequestConfig {
  errorMessage?: string,
  form?: Record<string, any>,
  verbose?: boolean,
}
