var stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode(true);

let listeners = [];

exports.runOnInput = function (callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((x) => x !== callback);
  };
};

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

exports.printToStdout = function (string) {
  process.stdout.write(string || "");
};

// i don't want binary, do you?
stdin.setEncoding("utf8");
stdin.on("data", function (key) {
  // ctrl-c ( end of text )
  if (key === "\u0003") {
    process.exit();
  }

  listeners.forEach((x) => x(key));
});
