function compareStates(oldState, newState) {
  let flag = false;
  const newkeys = Object.keys(newState);
  for (let i = 0; i < newkeys.length; i++) {
    const key = newkeys[i];
    if (newState[key] !== oldState[key]) {
      flag = true;
      break;
    }
  }
  return flag;
}
module.exports = class Observable {
  constructor(initialState) {
    let obj = {};

    obj = initialState;

    let subscribers = [];

    this.subscribe = (listener, selector) => {
      const lastVal = selector(obj);
      subscribers.push({ listener, selector, lastVal });
      listener(lastVal);

      return () => {
        subscribers = subscribers.filter((x) => x.listener !== listener);
      };
    };
    this.setState = (newstate) => {
      Object.keys(newstate).forEach((key) => {
        obj[key] = newstate[key];
      });

      subscribers.forEach((sub) => {
        let newval = sub.selector(obj);
        if (compareStates(sub.lastVal, newval)) {
          sub.listener(newval);
          sub.lastVal = newval;
        }
      });
    };

    this.getKey = (key) => obj[key];
  }
};
