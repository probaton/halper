import ConfigCache from '../cache/ConfigCache';

export default function getConfig(): IHalpConfig {
  const cache = new ConfigCache();
  return cache.get() || setConfig(cache);
}

export function setConfig(cache: ConfigCache) {
  const envConfig = resolveEnvConfig();
  const config = Object.assign({}, require('../../configs/base.conf.json'), envConfig);
  cache.set(config);
  return config;
}

function resolveEnvConfig(): IHalpConfig {
  switch(getEnv()) {
    case 'dev':
      return require('../../configs/dev.conf.json');
    case 'local':
      return require('../../configs/local.conf.json');
    default:
      throw new RangeError('Valid options for -e are dev and local');
  }
}

export type Env = 'prod' | 'int' | 'dev' | 'local';

export function getEnv(): Env {
  switch(halpMan.pargs.labeled.e as string || 'dev') {
    case 'prod':
      return 'prod';
    case 'i':
    case 'int':
      return 'int';
    case 'd':
    case 'dev':
      return 'dev';
    case 'l':
    case 'local':
      return 'local';
    default:
      throw new RangeError('Valid options for -e are int, dev, and local');
  }
}
