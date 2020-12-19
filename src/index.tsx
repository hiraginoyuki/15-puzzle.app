import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import './index.scss';
import { serviceWorker } from "./utils";

ReactDOM.render(<App />, document.getElementById("app"));

serviceWorker.register();