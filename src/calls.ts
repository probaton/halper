import axios, { AxiosRequestConfig, Method } from 'axios';

export async function call(method: Method, url: string, callOptions?: ICallOptions) {
  if (halpMan.pargs.labeled.logUrl || halpMan.pargs.labeled['log-url'] || callOptions?.logUrl) {
    halpMan.log('Calling:', method, url);
  }

  const baseHeaders = { Accept: 'application/json' };
  const headers = callOptions?.headers
    ? { ...baseHeaders, ...callOptions.headers }
    : baseHeaders;

  const options = {
    method,
    url,
    headers,
    errorMessage: 'Request failed',
    ...callOptions,
  };

  if (options.form) {
    options.data = Object.entries(options.form)
      .reduce((a, [key, value]) => {
        a.append(key, value as string);
        return a;
      }, new FormData())
      .toString();
  }

  try {
    const response = await axios(options);
    return options.verbose
      ? response
      : response.data || `Status ${response.status}: ${response.statusText}` || response;
  } catch (e: any) {
    if (options.verbose) {
      return e;
    }
    if (e.isAxiosError && e.response) {
      const errorBody = e.response.data?.message
        || JSON.stringify(e.response.data, undefined, 2)
        || e.response.statusText;
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
  headers?: Record<string, string>;
  errorMessage?: string,
  form?: Record<string, any>,
  logUrl?: boolean,
  verbose?: boolean,
}
