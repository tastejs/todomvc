import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencil-comp',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'dist-custom-elements-bundle'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
