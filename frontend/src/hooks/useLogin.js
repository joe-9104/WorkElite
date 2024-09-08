import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const json = await response.json();

      if (!response.ok) {
        setError('Login failed! Please try again.');
        return;
      }

      console.log("User logged in", json);
      localStorage.setItem("user_id", json.user._id);
      navigate('/', { state: { user: json.user } });

    } catch (err) {
      setError('Oops! Failed to connect to the API.');
    }
  };

  return { login, error };
};

export default useLogin;