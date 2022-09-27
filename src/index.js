import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/style.css";
import { HashRouter } from "react-router-dom"; // for import react dom navigation components
import { MantineProvider } from "@mantine/core"; //for import mantine required functions and theme
import { ModalsProvider } from "@mantine/modals";
import { createBrowserHistory } from "history";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
const history = createBrowserHistory({ window });
root.render(
  <HashRouter history={history}>
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <ModalsProvider>
        <App />
      </ModalsProvider>
    </MantineProvider>
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
