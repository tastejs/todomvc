const storage = require('duet/bridges/local-storage');

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

const store = (namespace, dataOrHandler) => {
  if (typeof dataOrHandler === 'function') {
    return storage(namespace, function (storeJSON) {
      dataOrHandler((storeJSON && JSON.parse(storeJSON)) || []);
    });
  }

  return storage(namespace, JSON.stringify(dataOrHandler));
};

const hasOwnProperty = Object.prototype.hasOwnProperty;

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
  uuid,
  store,
  extend
};
