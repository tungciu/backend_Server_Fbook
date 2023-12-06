'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = request;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _requestDebug = require('request-debug');

var _requestDebug2 = _interopRequireDefault(_requestDebug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function request() {
  let debug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (debug) {
    (0, _requestDebug2.default)(_requestPromise2.default, (req, res) => {
      console.log(req);
      console.log(res);
    });
  }
  return _requestPromise2.default;
}