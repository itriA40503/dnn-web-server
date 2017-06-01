/**
 *
 * @param {Function} fn
 * @return {Function}
 */
const asyncWrap = (fn) => {
  return (...args) => {
    return fn(...args).catch(args[args.length - 1]);
  };
};

export default asyncWrap;
