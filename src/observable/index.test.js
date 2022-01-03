const Observable = require("./index");

test("observable object methods present", () => {
  const observer = new Observable();
  expect(typeof observer.subscribe).toBe("function");
  expect(typeof observer.setState).toBe("function");
  expect(typeof observer.getKey).toBe("function");
});

test("state initialization check", () => {
  const observer = new Observable({ count: 10 });
  expect(observer.getKey("count")).toBe(10);
});

test("subscribe callbacks check", () => {
  const observer = new Observable({ count: 10 });
  let updatingValue = 0;
  function setUpdatingValue(val) {
    updatingValue = val;
  }
  observer.subscribe(setUpdatingValue, (state) => state.count);
  expect(updatingValue).toBe(10);
});

test("setting part of state and check to see if subscribed listeners are called", () => {
  const observer = new Observable({ count: 10 });
  let updatingValue = 0;
  function setUpdatingValue(val) {
    updatingValue = val.count;
  }
  observer.subscribe(setUpdatingValue, (state) => ({
    count: state.count,
  }));
  observer.setState({ count: 69 });
  expect(updatingValue).toBe(69);
});

test("unsubscribe from change events", () => {
  const observer = new Observable({ count: 10 });
  let updatingValue = 0;
  function setUpdatingValue(val) {
    updatingValue = val.count;
  }
  const unsub = observer.subscribe(setUpdatingValue, (state) => ({
    count: state.count,
  }));
  observer.setState({ count: 69 });
  expect(updatingValue).toBe(69);

  unsub();

  observer.setState({ count: 420 });
  expect(updatingValue).toBe(69);
});
