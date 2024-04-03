// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Nav from './components/Nav';
import Home from './pages/Home/Home';
import Register from './pages/Login/Register';
import Dashboard from './pages/Dashboard/Northwind/Dashboard';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:5280/api/user', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.status === 200) {
          const content = await response.json();

          setName(content.name);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('User fetch error:', error);
      }
    })();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5280/api/user', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.status === 200) {
        const content = await response.json();

        setName(content.name);
        setIsLoggedIn(true);
      } else {
        console.error('Login request failed:', response.status);
      }
    } catch (error) {
      console.error('Login request error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5280/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false);
      setName('');
    } catch (error) {
      console.error('Logout request error:', error);
    }
  };

  return (
    <Router>
      <main className='form-signin'>
        <Nav name={name} setName={setName} onLogout={handleLogout} />
        <Routes>
          <Route
            path='/'
            element={
              <Home isAuthenticated={isLoggedIn} name={name} />
            }
          />
          <Route
            path='/login'
            element={
              <Login onLogin={handleLogin} setName={setName} />
            }
          />
          <Route path='/register' element={<Register />} />
          {isLoggedIn && (
            <>
              <Route
                path='/dashboard'
                element={<Dashboard isLoggedIn={isLoggedIn} />}
              />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
};

export default App;
