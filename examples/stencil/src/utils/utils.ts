
export function format(first: string, middle: string, last: string): string {
  return (
    (first || '') +
    (middle ? ` ${middle}` : '') +
    (last ? ` ${last}` : '')
  );
}

export function pluralize(count: number, word: string) {
  return count === 1 ? word : word + 's';
}

export function store(namespace: string, data?: any) {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  let store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
}

export function uuid(): string {
  /*jshint bitwise:false */
  let i, random;
  let uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }

  return uuid;
}

