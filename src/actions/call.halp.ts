import { Method } from 'axios';
import { call } from '../calls';

export async function callHalper(url: string, method: Method, data?: any) {
  return call(method, url, { data: data && JSON.parse(data) });
}

const halpConfig: IHalper = {
  command: 'call',
  action: callHalper,
  helpText: 'Call an API',
  spinnerText: 'Calling',
  args: [
    { flag: 1, helpText: 'Full URL of the resource you want to call', requiredMessage: 'Missing URL' },
    { flag: 2, helpText: 'Method', default: 'GET' },
  ],
};
export default halpConfig;
