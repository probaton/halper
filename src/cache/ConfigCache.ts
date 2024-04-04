import SoftCache from './SoftCache';

export default class ConfigCache extends SoftCache<IHalpConfig> {
  constructor() {
    super('config');
  }
}
