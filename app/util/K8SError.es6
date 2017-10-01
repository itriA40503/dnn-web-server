/**
 * @constructor
 * @param {int} status
 * @param {string} message
 * @param {int} errorCode
 *
 */
class K8SError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

export default K8SError;
