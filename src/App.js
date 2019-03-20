import React, { Component } from 'react';
/*import logo from './logo.svg';*/
/*import './App.css';*/
import './css/app_status.css'

class App extends Component {
  render() {
    return (
      <center>
      {/* STEP2 */}
      <div className="content" style={{display:'block'}}>
        <div className="status_bar" style={{display:'block'}}>
        <img style={{position: 'relative',left: '4px'}} width="49" height="49" src="assets/svg/step0_disabled.svg" />
        <img style={{position: 'relative',left: '3px'}} width="34" height="4" src="assets/svg/line3.svg" />
        <img style={{position: 'relative',left: '2px'}} width="49" height="49" src="assets/svg/step1_disabled.svg" />
        <img style={{position: 'relative',left: '1px'}} width="34" height="4" src="assets/svg/line3.svg" />
        <img style={{position: 'relative',right: '2px'}} width="49" height="49" src="assets/svg/step2_disabled.svg" />
        <img style={{position: 'relative',right: '2px'}} width="34" height="4" src="assets/svg/line3.svg" />
        <img style={{position: 'relative',right: '4px'}} width="49" height="49" src="assets/svg/step3_disabled.svg" />
        </div>
        <div className="quest">
          <font>Enter the code</font>
          <font id="requestId">Request ID #######</font>
        </div><br /><br />
        <div className="stat">We will call you now on +39335752323 Please listen for the 4-digit code</div>
        <div className="input">
          <input id="authSMSCode" type="text" maxLength="4" placeholder="Enter code" /><button id="checkSMSCode">Next</button>
          <font id="errorSMSCode" style={{color: 'red'}}></font>
        </div>
        <div className="links">
          <a href="#" id="WrongPhoneNumber" style={{float:'left'}}>Wrong phone number?</a>
          <a href="#" id="resendCallConfirmation" style={{float:'right'}}>Haven`t received a call?</a>
        </div>
      </div>
      {/* STEP2 Phone */}
      <div className="content" style={{display:'none'}}>
        <div className="status_bar">
          <img style={{position: 'relative',left: '4px'}} width="49" height="49" src="assets/svg/step0_disabled.svg" />
          <img style={{position: 'relative',left: '3px'}} width="34" height="4" src="assets/svg/line3.svg" />
          <img style={{position: 'relative',left: '2px'}} width="49" height="49" src="assets/svg/step1_disabled.svg" />
          <img style={{position: 'relative',left: '1px'}} width="34" height="4" src="assets/svg/line3.svg" />
          <img style={{position: 'relative',right: '2px'}} width="49" height="49" src="assets/svg/step2_disabled.svg" />
          <img style={{position: 'relative',right: '2px'}} width="34" height="4" src="assets/svg/line3.svg" />
          <img style={{position: 'relative',right: '4px'}} width="49" height="49" src="assets/svg/step3_disabled.svg" />
        </div>
        <div className="quest">
          <font>Change number</font>
          <font id="requestId">Request ID #######</font>
        </div><br /><br />
        <div className="stat">Your phone number +39335752323<br />Insert a new number in the field</div>
        <div className="input">
          <input type="text" placeholder="You phone" /><button id="inputNewPhone">Change</button>
        </div>
      </div>
      {/* STEP3 / STEP4 */}
      <div className="content" style={{display:'none'}}>
        <div className="status_bar">
        <img style={{position: 'relative',left: '4px'}} width="49" height="49" src="assets/svg/step0_disabled.svg" />
        <img style={{position: 'relative',left: '3px'}} width="34" height="4" src="assets/svg/line3.svg" />
        <img style={{position: 'relative',left: '2px'}} width="49" height="49" src="assets/svg/step1_disabled.svg" />
        <img style={{position: 'relative',left: '1px'}} width="34" height="4" src="assets/svg/line3.svg" />
        <img style={{position: 'relative',right: '2px'}} width="49" height="49" src="assets/svg/step2_disabled.svg" />
        <img style={{position: 'relative',right: '2px'}} width="34" height="4" src="assets/svg/line3.svg" />
        <img style={{position: 'relative',right: '4px'}} width="49" height="49" src="assets/svg/step3_disabled.svg" />
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
