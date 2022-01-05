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
        // console.log(response.statusCode);
        // console.log(response.headers);
        if (response.statusCode === 301) {
          const {
            path: rdrPath,
            host: rdrHost,
            isHttps: rdrIsHttps,
          } = parseurl(response.headers.location);

          const rdrPort = rdrIsHttps ? 443 : 80;

          const rdrMethod = rdrIsHttps ? https : http;

          let rdrOptions = {
            host: rdrHost,
            port: rdrPort,
            method: options.method,
            path: rdrPath,
          };

          const req = rdrMethod.request(rdrOptions, callback);
          req.on("error", (err) => reject(err));
          req.end();
        } else {
          var str = "";
          response.on("data", function (chunk) {
            str += chunk;
          });

          response.on("end", function () {
            // console.log("buffer check => ", Buffer.byteLength(str));
            console.timeEnd("label");
            debugger;
            resolve(str);
          });

          response.on("error", (err) => {
            reject(err);
          });
        }
      };
      console.time("label");
      const req = method.request(options, callback);
      req.on("error", (err) => reject(err));
      req.end();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
