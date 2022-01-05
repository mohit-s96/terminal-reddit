const Observable = require("./src/observable/index");
const { printToStdout, runOnInput } = require("./src/input/index");
const fetch = require("./src/promisify-http-request/index");

const observer = new Observable({
  uistate: null,
  loading: false,
  data: null,
  error: null,
});

const welcomemessage =
  "Welcome to test app:\n1. Fetch data\n2. Open file\n3. Greet\n";

function updateUI({ uistate }) {
  if (!uistate) {
    console.clear();
    printToStdout(welcomemessage);
  }
}

function updateLoading({ loading }) {
  if (loading) {
    if (observer.getKey("uistate") !== "1") console.clear();
    printToStdout("loading...");
  }
}

function updateData({ data }) {
  if (data) {
    console.clear();
    if (!Array.isArray(data.items)) return;
    data.items.map((x, i) => {
      let str = "";
      str += i + 1 + " - " + x.data.title + "\n";
      str += `https://www.reddit.com${x.data.permalink}\n\n`;
      printToStdout(str);
    });
    printToStdout("press m/M from more...\n");
  }
}

function updateError({ error }) {
  if (error) {
    console.clear();
    printToStdout(error);
  }
}

observer.subscribe(updateUI, (state) => ({ uistate: state.uistate }));
observer.subscribe(updateData, (state) => ({ data: state.data }));
observer.subscribe(updateError, (state) => ({ error: state.error }));
observer.subscribe(updateLoading, (state) => ({ loading: state.loading }));

function processInput(key) {
  switch (key) {
    case "1":
      if (!observer.getKey("uistate")) {
        observer.setState({ loading: true });
        fetch("reddit.com/.json?limit=10")
          .then((res) => {
            const data = JSON.parse(res);
            observer.setState({
              uistate: key,
              loading: false,
              data: { items: data.data.children, after: data.data.after },
            });
          })
          .catch((err) => {
            observer.setState({
              loading: false,
              uistate: "3",
              error: JSON.stringify(err),
            });
          });
      }
      break;
    case "2":
      if (!observer.getKey("uistate"))
        observer.setState({
          uistate: key,
          error: "oops file not found...\n",
        });
      break;
    case "3":
      if (!observer.getKey("uistate"))
        observer.setState({
          uistate: key,
          data: "hello world\n",
        });
      break;
    case "m":
    case "M":
      if (observer.getKey("uistate") === "1") {
        observer.setState({ loading: true });
        const prevData = observer.getKey("data");
        fetch("reddit.com/.json?limit=10&after=" + prevData.after)
          .then((res) => {
            const data = JSON.parse(res);
            observer.setState({
              uistate: "1",
              loading: false,
              data: {
                items: [...prevData.items, ...data.data.children],
                after: data.data.after,
              },
            });
          })
          .catch((err) => {
            observer.setState({
              loading: false,
              uistate: "3",
              error: JSON.stringify(err),
            });
          });
      }
      break;
    default:
      observer.setState({
        uistate: null,
      });
      break;
  }
}
runOnInput(processInput);
