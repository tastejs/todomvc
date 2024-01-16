import { DynamicImportKey } from './index';

export default function inject(injectableWalk) {
  return Object.assign({}, injectableWalk, {
    base: Object.assign({}, injectableWalk.base, {
      [DynamicImportKey]() {},
    }),
  });
}
