// src/hooks/useRegister.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const register = async (fname, lname, email, role, password, confirmPwd) => {
    if (password !== confirmPwd) {
      setError('Passwords do not match.');
      return;
    }

    let userName = fname + '_' + lname;
    let firstName = fname;
    let lastName = lname;
    const user = { email, userName, firstName, lastName, password, role };

    try {
      const response = await fetch('http://localhost:4000/api/auth/createuser', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const json = await response.json();
        setError(json.message || 'Something went wrong with registration.');
        return;
      }

      const json = await response.json();
      console.log("User registered", json);
      navigate('/home', { state: { user: json.user } });
    } catch (err) {
      setError('Failed to connect to the API.');
    }
  };

  return { register, error };
};

export default useRegister;