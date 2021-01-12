import React, {useState} from "react";
import loginImg from "../../oomph2.png";
import axios from 'axios';

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

const onSubmit = () => {
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
};
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
        <a onClick={onSubmit} href="/">Register</a>
        </div>
      </div>
    );
}
