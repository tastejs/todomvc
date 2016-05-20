const h      = require('virtual-dom/h');
const hyperx = require('hyperx');
const ls     = require('duet/bridges/local-storage');

const hasOwnProperty = Object.prototype.hasOwnProperty;

const dom = hyperx(h);

const uuid = () => {
  let uuid = '';

  for (let i = 0; i < 32; i++) {
    const random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }

  return uuid;
};

const storage = (namespace, dataOrFn) => {
  if (typeof dataOrFn === 'function') {
    return ls(namespace, function (json) {
      dataOrFn((json && JSON.parse(json)) || []);
    });
  }

  return ls(namespace, JSON.stringify(dataOrFn));
};

const extend = (...args) => {
  const target = {};

  for (let i = 0; i < args.length; i++) {
    const source = args[i];

    for (let key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
}

module.exports = {
  dom,
  uuid,
  storage,
  extend
};
