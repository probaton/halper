import yargs from 'yargs';
import ConfigCache from '../cache/ConfigCache';

export default function getConfig(): IHalpConfig {
  const cache = new ConfigCache();
  return cache.get() || setConfig(cache);
}

export function setConfig(cache: ConfigCache) {
  const envConfig = resolveEnvConfig(yargs.argv.e as string || 'dev');
  const config = Object.assign({}, require('../../configs/base.conf.json'), envConfig);
  cache.set(config);
  return config;
}

function resolveEnvConfig(env: string | number): IHalpConfig {
  switch(env) {
    case 'd':
    case 'dev':
      return require('../../configs/dev.conf.json');
    case 'l':
    case 'local':
      return require('../../configs/local.conf.json');
    default:
      throw new RangeError('Valid options for -e are dev and local');
  }
}
