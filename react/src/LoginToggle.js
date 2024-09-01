// LoginToggle.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LoginToggle.css';

const LoginToggle = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const history = useHistory();

  const handleToggle = () => {
    setIsAdminLogin((prevIsAdminLogin) => {
      // Redirect based on the current state
      if (prevIsAdminLogin) {
        history.push('/');
      } else {
        history.push('/Login2');
      }
      return !prevIsAdminLogin;
    });
  };

  return (
    <div className="login-toggle">
      <span className={`login-option ${isAdminLogin ? 'admin' : 'user'}`}>User</span>
      <label className="switch">
        <input type="checkbox" onChange={handleToggle} />
        <span className="slider round"></span>
      </label>
      <span className={`login-option ${isAdminLogin ? 'user' : 'admin'}`}>Admin</span>
    </div>
  );
};

export default LoginToggle;
