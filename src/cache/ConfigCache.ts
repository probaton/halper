import ValueCache from './ValueCache';

export default class ConfigCache extends ValueCache<IHalpConfig> {
  constructor() {
    super('config');
  }
}
