import React from 'react';
import ReactDOM from 'react-dom';
/*import './index.css';*/
import Status from './App';
import * as serviceWorker from './serviceWorker';

let d = document;

ReactDOM.render(<Status />, d.getElementsByClassName('section-main')[0]);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
