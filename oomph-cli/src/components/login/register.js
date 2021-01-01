import React, {useState} from "react";
import { Link, BrowserRouter as Router } from 'react-router-dom';
import loginImg from "../../carsex.png";
import axios from 'axios';
import history from "../../utils/history.js";
import App from '../../App.js';

export function Register() {
  const [eduEmail, setEduEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = ({ target }) => {
    const newEduEmail = target.value;
    //verify valid email (COME BACK)
    const isValidEmail = true;
    if (isValidEmail) {
        setEduEmail(newEduEmail);
    } else {
        alert("Student email or password is incorrect.");
    }
}

const handlePasswordChange = ({ target }) => {
  const newPassword = target.value;
  //verify valid password (COME BACK)
  const isValidPassword = true;
  if (isValidPassword) {
      setPassword(newPassword);
  } else {
      alert("Student email or password is incorrect.");
  }
}

function onSubmit() {

  axios.post('/newuser', {
    eduEmail: eduEmail,
    password: password
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  console.log("sent axios post");
  history.push("/map");
}

// ref={this.props.containerRef} --> Goes in base Container before switch to functional componentss
    return (

      <div className="base-container" >
        <div className="header">Register with OOMPH!</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="email">Student Email</label>
              <input type="text" name="Student email" placeholder="Student email" onChange={handleEmailChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="text" name="Password" placeholder="Password" onChange={handlePasswordChange} />
            </div>
          </div>
        </div>
        <div className="footer">
        <Link to="/" className="btn" onClick={onSubmit}>
              Register
            </Link>
        </div>
      </div>

    );
}

// <Link to="/"><button type="button" className="btn" onClick={onSubmit}>