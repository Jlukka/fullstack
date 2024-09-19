import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux"

import App from "./App";
import "./index.css";

import notificationReducer from "./reducers/notificationReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
  }
})

ReactDOM.createRoot(document.getElementById("root")).render(
<Provider store = {store}>
  <App />
</Provider>
);
