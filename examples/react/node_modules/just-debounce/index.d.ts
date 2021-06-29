declare function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
  atStart?: boolean,
  guarantee?: boolean
): (...args: Parameters<T>) => void;

export default debounce;
