function extractHost(uri) {
  let length = uri.length;

  // reddit.com[/ | # | ? | &....]memes.json
  let buffer = "";
  let i = 0;
  const isUriOrPeriod = /[a-zA-Z0-9.]$/;
  for (; i < length; i++) {
    if (isUriOrPeriod.test(uri[i])) {
      buffer += uri[i];
    } else {
      break;
    }
  }

  return [buffer, uri.slice(i)];
}

function trimPrefix(uri) {
  let temp = "";
  if (uri.startsWith("https")) {
    temp = uri.slice(8);
  } else if (uri.startsWith("http")) {
    temp = uri.slice(7);
  } else if (uri.startsWith("www")) {
    temp = uri;
  }
  if (temp) {
    return temp;
  } else {
    return uri;
  }
}

exports.parseurl = function (url) {
  const result = {};

  const isHttps = url.startsWith("https") || !url.startsWith("http");
  result.isHttps = isHttps;

  const [host, path] = extractHost(trimPrefix(url));

  result.host = host;
  result.path = path;

  return result;
};
