export function isFunction(f: any) {
  return f && {}.toString.call(f) === "[object Function]";
}
