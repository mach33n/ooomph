import React, {useState} from "react";
import loginImg from "/Users/samkofi/Desktop/ooomph/oomph-cli/src/oomph2.png";
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3000"




export function Login() {
  const [eduEmail, setEduEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hrefLoc, setHrefLoc] = useState('');
  let inSystem = false;

  const handleEmailChange = ({ target }) => {
    if (eduEmail.includes("@gatech.edu")) {
      inSystem = true;
    }
  }

//   const updateHrefLoc = ({ target }) => {
//     const newHrefLoc = target.value;
//     setHrefLoc(newHrefLoc);
// }

  const updateEduEmail = ({ target }) => {
      const newEduEmail = target.value;
      handleEmailChange(newEduEmail)
      setEduEmail(newEduEmail);
  }

  const updatePassword = ({ target }) => {
    const newPassword = target.value;
    setPassword(newPassword);
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

  // const onLoginClick = () => {
  //   if (inSystem) {
  //     updateHrefLoc('/');
  //   } else {
  //     updateHrefLoc('');
  //     alert("Nah");
  //   }
  // }

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
              <input value={eduEmail} type="text" name="Student Email" placeholder="Student email" onChange={updateEduEmail} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="Password" placeholder="Password" onChange={updatePassword} />
            </div>
          </div>
        </div>
        <div className="footer">
          <a /*onClick={onLoginClick}*/ href='/'>Log in</a>
        </div>
      </div>
    );
    }
