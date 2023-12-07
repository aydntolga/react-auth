import React, { SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Password'lerin eşleşip eşleşmediğini kontrol eta
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check your entries.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5280/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during the registration request');
      console.error('Registration Failed:', error);
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <form onSubmit={submit} className="container">
      <h1 className="h3 mb-3 fw-normal">Please Register</h1>
      {error && <div className="alert alert-danger">{error}</div>}

    <div className='mb-3'>
      <label htmlFor='name'>Name</label>
      <input
        className="form-control"
        placeholder="Name"
        required
        onChange={(e) => setName(e.target.value)}
      />


    </div>

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

  <div className='mb-3'>
    <label>Password Again</label>
    <input
        type="password"
        className="form-control"
        placeholder="Confirm Password"
        required
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
  </div>

  <button type="submit" className="btn btn-primary btn-block">
    Register
  </button>
</form>



  ); 
};

export default Register;
