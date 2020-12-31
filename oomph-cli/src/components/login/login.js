import React, {useState} from "react";
import loginImg from "../../cars_sex.jpg";
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3000"




export function Login() {
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



        
  const onSubmit = () => {
    axios.post('/getuser', {
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
  };


  // after header div end tag ref={this.props.containerRef}
    return (
      <div className="base-container" >
        <div className="header">Login to OOMPH!</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Student Email</label>
              <input type="text" name="Student Email" placeholder="Student email" onChange={handleEmailChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="Password" placeholder="Password" onChange={handlePasswordChange} />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={onSubmit}>
            Login
          </button>
        </div>
      </div>
    );
    }
