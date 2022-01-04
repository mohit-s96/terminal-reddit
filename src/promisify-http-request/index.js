const https = require("https");
const http = require("http");
const { parseurl } = require("./helper");

module.exports = function (url, options_) {
  if (!url) {
    throw Error(
      "expected first argument to be a string with length > 0 instead got " +
        typeof url
    );
  }
  options_ = options_ || {};
  return new Promise((resolve, reject) => {
    try {
      const { path, host, isHttps } = parseurl(url);

      const port = isHttps ? 443 : 80;

      const method = isHttps ? https : http;

      const options = {
        host: host,
        port,
        method: options_.method || "GET",
        path,
      };

      const callback = function (response) {
        var str = "";
        response.on("data", function (chunk) {
          str += chunk;
        });

        response.on("end", function () {
          resolve(str);
        });

        response.on("error", (err) => {
          reject(err);
        });
      };

      const req = method.request(options, callback);
      req.on("error", (err) => reject(err));
      req.end();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
