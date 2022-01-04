const fetch = require("./index");
const { parseurl } = require("./helper");

describe("checking for promisified fetch wrapper on http request", () => {
  it("expects fetch to be a function", () => {
    expect(typeof fetch).toBe("function");
  });

  // it("expects fetch to return a promise", () => {
  //   expect(fetch()).toThrow();
  // });

  it("expects valid fetch call to resolve with data", () => {
    let uri1 = "https://jsonplaceholder.typicode.com/todos/1";
    return fetch(uri1).then((data) => {
      console.log("Bytes received => ", Buffer.byteLength(data));
      expect(data).toBeDefined();
    });
  });
});

describe("checking urlparser helper", () => {
  it("checks if the parseurl function exists and returns object", () => {
    let uri1 = "https://reddit.com/memes.json";
    let uri2 = "http://reddit.com/memes.json";
    let uri3 = "www.reddit.com/memes.json";
    let uri4 = "reddit.com/memes.json";

    expect(typeof parseurl).toBe("function");
    expect(typeof parseurl(uri1)).toBe("object");

    const expectedHost = "www.reddit.com";
    const expectedPath = "/memes.json";

    expect(parseurl(uri1).isHttps).toBe(true);
    expect(parseurl(uri2).isHttps).toBe(false);
    expect(parseurl(uri3).isHttps).toBe(true);
    expect(parseurl(uri4).isHttps).toBe(true);

    // expect(parseurl(uri1).host).toBe(expectedHost);
    // expect(parseurl(uri2).host).toBe(expectedHost);
    // expect(parseurl(uri3).host).toBe(expectedHost);
    // expect(parseurl(uri4).host).toBe(expectedHost);

    // expect(parseurl(uri1).path).toBe(expectedPath);
    // expect(parseurl(uri4).path).toBe(expectedPath);
    // expect(parseurl(uri4).path).toBe(expectedPath);
    // expect(parseurl(uri4).path).toBe(expectedPath);
  });
});
