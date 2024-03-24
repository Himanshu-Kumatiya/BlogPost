import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux";
import {store,persistor} from "./redux/store.js"
import {PersistGate} from "redux-persist/integration/react";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
      </PersistGate>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
