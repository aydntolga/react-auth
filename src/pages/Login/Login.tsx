import React, { SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';


interface LoginProps {
  onLogin: () => void;
  setName: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, setName }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Hata durumu için state
  const navigate = useNavigate();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5280/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.status === 200) {
        const content = await response.json();

        setName(content.name);
        onLogin();
        navigate('/');
      } else {
        setError('Login failed. Please try again'); // Hata durumunu ayarla
      }
    } catch (error) {
      setError('An error occurred during the login request'); // Hata durumunu ayarla
      console.error('Login Failed:', error);
    }
  };
  return (
    <form onSubmit={submit} className="container">
  <h1 className="h3 mb-3 fw-normal">Sign In</h1>
  {error && <div className="alert alert-danger">{error}</div>}

  <div className="mb-3">
    <label htmlFor="email">Email address</label>
    <input
      type="email"
      className="form-control"
      id="email"
      placeholder="Enter your email"
      required
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="password">Password</label>
    <input
      type="password"
      className="form-control"
      id="password"
      placeholder="Enter your password"
      required
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>

  <button type="submit" className="btn btn-primary btn-block">
    Sign in
  </button>
</form>

  );
  
    
  
};

export default Login;
