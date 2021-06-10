import got, { Options, HTTPError } from 'got';
import FormData from 'form-data';

function handleError(e: Error, options: CallOptions) {
  const errorMessage = options.errorMessage || 'Request failed';
  if (!(e instanceof HTTPError)) {
    throw new Error(`${errorMessage}:\n${e}`);
  }

  const { statusCode, statusMessage, body } = e.response;

  // Prevent got from overzealously throwing errors on requests that are not actually broken.
  if (statusCode >= 200 && statusCode < 300) {
    return e.response;
  }

  if (options.returnRawError) {
    return { statusCode, statusMessage, body };
  }

  let errorDetails: string;
  try {
    errorDetails = JSON.parse(body as any).message;
  } catch (e) {
    errorDetails = statusMessage || 'Unknown error';
  }
  throw new Error(`${errorMessage}\n${statusCode}: ${errorDetails}`);
}

async function call(callFunction, url: string, options: CallOptions) {
  const fullOptions = Object.assign({}, {
    https: { rejectUnauthorized: false },
    allowGetBody: true,
  }, options);

  if (fullOptions.formData) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(fullOptions.formData)) {
      formData.append(key, value);
    }
    fullOptions.body = formData;
  }

  let response;
  try {
    response = await callFunction(url, fullOptions);
    if (fullOptions.returnRawError) {
      console.warn('\nreturnRawError == true but the call did not error');
    }
  } catch (e) {
    response = handleError(e, fullOptions);
  }

  try {
    return JSON.parse(response.body);
  // eslint-disable-next-line
  } catch (e) {}
  return response.body || response;
}

export async function get(url: string, options: CallOptions) {
  return call(got, url, options);
}

export async function post(url: string, options: CallOptions) {
  return call(got.post, url, options);
}

export async function deleteCall(url: string, options: CallOptions) {
  return call(got.delete, url, options);
}

export interface CallOptions extends Options {
  errorMessage?: string,
  formData?: Record<string, any>,
  returnRawError?: boolean,
}
