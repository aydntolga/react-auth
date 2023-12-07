import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TotalSize from '../Dashboard/TotalSize';
import Dashboard from '../Dashboard/Dashboard';
import FragmentRatio from '../Dashboard/FragmentRatio';
import '../Home/Home.css';

interface HomeProps {
  isAuthenticated: boolean;
  name?: string;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated, name }) => {
  const [showTotalTableSizeChart, setShowTotalTableSizeChart] = useState(false);
  const [showDashboardChart, setShowDashboardChart] = useState(false);
  const [showFragmentRatioChart, setShowFragmentRatioChart] = useState(false);

  const handleShowTotalTableSizeChart = () => {
    setShowTotalTableSizeChart(true);
    setShowDashboardChart(false);
    setShowFragmentRatioChart(false);
  };

  const handleShowDashboardChart = () => {
    setShowDashboardChart(true);
    setShowTotalTableSizeChart(false);
    setShowFragmentRatioChart(false);
  };

  const handleShowFragmentRatioChart = () => {
    setShowFragmentRatioChart(true);
    setShowTotalTableSizeChart(false);
    setShowDashboardChart(false);
  };

  const handleButtonClick = (chartType: string) => {
    switch (chartType) {
      case 'dashboard':
        handleShowDashboardChart();
        break;
      case 'tableSize':
        handleShowTotalTableSizeChart();
        break;
      case 'fragmentRatio':
        handleShowFragmentRatioChart();
        break;
      default:
        break;
    }
  };

  return (
    <div className="container-fluid mt-5">
      {isAuthenticated ? (
        <>
          <h1 className="mb-4 welcome-text" onClick={handleShowDashboardChart}>
            Welcome, {name}!
          </h1>
          <div className="mb-3 d-flex justify-content-center">
            <button
              className="btn btn-primary btn-lg me-2"
              onClick={() => handleButtonClick('dashboard')}
            >
              Show Index Sizes
            </button>
            <button
              className="btn btn-primary btn-lg me-2"
              onClick={() => handleButtonClick('tableSize')}
            >
              Show Table Sizes
            </button>
            <button
              className="btn btn-primary btn-lg me-2"
              onClick={() => handleButtonClick('fragmentRatio')}
            >
              Show Fragment Ratio
            </button>
          </div>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              {showDashboardChart && <Dashboard isLoggedIn />}
              {showTotalTableSizeChart && <TotalSize />}
              {showFragmentRatioChart && <FragmentRatio />}
            </div>
          </div>
        </>
      ) : (
        <>
          <h1>Login Failed</h1>
          <p>Your login attempt was unsuccessful.</p>
          <Link to="/login" className="btn btn-primary">
            Go back to Login
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;
