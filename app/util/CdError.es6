/**
 * @constructor
 * @param {int} status
 * @param {string} message
 * @param {int} errorCode
 *
 */
class CdError extends Error {
  constructor(status, message, errorCode) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
    this.status = status;
    this.errorCode = errorCode;
  }
  getResponseObject() {
    return {
      code: this.errorCode,
      message: this.message
    };
  }
  getStatus() {
    return this.status;
  }
}

export default CdError;

