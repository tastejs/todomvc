function isDefined<T>(arg: T | undefined): arg is T {
  return typeof arg !== 'undefined';
}

export default isDefined;
