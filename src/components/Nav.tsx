import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavProps {
  name: string;
  setName: (name: string) => void;
  onLogout: () => void; // onLogout prop'u ekleniyor
}

const Nav: React.FC<NavProps> = ({ name, setName, onLogout }) => {
  const logout = async () => {
    await fetch('http://localhost:5280/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    onLogout(); // onLogout prop'u çağrılıyor
  };

  let menu;

  if (name === '') {
    menu = (
      <ul className='navbar-nav me-auto mb-2 mb-md-0'>
        <li className='nav-item active'>
          <NavLink to='/login' className='nav-link'>
            Login
          </NavLink>
        </li>
        <li className='nav-item active'>
          <NavLink to='/register' className='nav-link'>
            Register
          </NavLink>
        </li>
      </ul>
    );
  } else {
    menu = (
      <ul className='navbar-nav me-auto mb-2 mb-md-0'>
        <li className='nav-item active'>
          <NavLink to='/login' className='nav-link' onClick={logout}>
            Logout
          </NavLink>
        </li>
      </ul>
    );
  }

  return (
    <nav className='navbar navbar-expand-md navbar-dark bg-dark mb-4'>
      <div className='container-fluid'>
        <NavLink to='/' className='navbar-brand'>
          Home
        </NavLink>
        <div>{menu}</div>
      </div>
    </nav>
  );
};

export default Nav;
