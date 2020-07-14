require('coffee-coverage').register({
  basePath: __dirname,
  path: 'relative',
  exclude: ['/test', '/node_modules', '/.git'],
});
