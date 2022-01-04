const Observable = require("./src/observable/index");
const { printToStdout, runOnInput } = require("./src/input/index");

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
    console.clear();
    printToStdout("loading...");
  }
}
function updateData({ data }) {
  if (data) {
    console.clear();
    printToStdout(data);
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
        setTimeout(() => {
          observer.setState({
            uistate: key,
            loading: false,
            data: "Online - 6\nTotal - 124\n",
          });
        }, 3000);
        break;
      }
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
    default:
      observer.setState({
        uistate: null,
      });
      break;
  }
}
runOnInput(processInput);
