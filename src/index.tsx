import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import './index.scss';
import { serviceWorker } from "./utils";
import { disableScroll } from './utils';

disableScroll();
ReactDOM.render(<App />, document.getElementById("app"));
serviceWorker.register();
