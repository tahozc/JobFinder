import { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
// Redux
import store from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistStore } from "redux-persist";
import AppRoutes from "./AppRoutes";
const App = () => {
  const persistor = persistStore(store);
  return (
    <Fragment>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <AppRoutes />
          </Router>
        </PersistGate>
      </Provider>
    </Fragment>
  );
};

export default App;
