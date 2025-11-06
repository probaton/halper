import { Method } from 'axios';
import { call, ICallOptions } from './calls';
import { get, set } from './cache/HardCache';

export async function cacheCall(cacheName: string, method: Method, url: string, callOptions?: ICallOptions) {
  const cachedResponse = await get(cacheName);
  if (cachedResponse) return cachedResponse;

  const response = await call(method, url, callOptions);
  set(cacheName, response);
  return response;
}

export function cacheGet(cacheName: string, url: string, callOptions?: ICallOptions) {
  return cacheCall(cacheName, 'GET', url, callOptions);
}

export function cachePost(cacheName: string, url: string, callOptions?: ICallOptions) {
  return cacheCall(cacheName, 'POST', url, callOptions);
}

export function cachePut(cacheName: string, url: string, callOptions?: ICallOptions) {
  return cacheCall(cacheName, 'PUT', url, callOptions);
}

export function cacheDelete(cacheName: string, url: string, callOptions?: ICallOptions) {
  return cacheCall(cacheName, 'DELETE', url, callOptions);
}
