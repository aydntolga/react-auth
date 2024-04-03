import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TotalSize from '../Dashboard/Northwind/TotalSize';
import Dashboard from '../Dashboard/Northwind/Dashboard';
import GratisTotalSize from '../Dashboard/Gratis/GratisTotalSize';
import GratisIndexSize from '../Dashboard/Gratis/GratisIndexSize';
import FragmentRatio from '../Dashboard/Northwind/FragmentRatio';
import CustomerInfoGraph from '../Dashboard/ServiceGraphics/CustomerInfoGraph';
import AdventureWorkTotalSize from '../Dashboard/AdventureWorks/AdventureWorksTotalSize';
import '../Home/Home.css';
import AdventureWorksIndexSize from '../Dashboard/AdventureWorks/AdventureWorksIndexSize';
import GratisFragmentRatio from '../Dashboard/Gratis/GratisFragmentRatio';
import AdventureWorksFragmentationRatio from '../Dashboard/AdventureWorks/AdventureWorksFragmentationRatio';

interface HomeProps {
  isAuthenticated: boolean;
  name?: string;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated, name }) => {
  const [showTotalTableSizeChart, setShowTotalTableSizeChart] = useState(false);
  const [showDashboardChart, setShowDashboardChart] = useState(false);
  const [showFragmentRatioChart, setShowFragmentRatioChart] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [selectedConnectionString, setSelectedConnectionString] = useState<string | null>(null);
  const [chartType, setChartType] = useState<string>('totalTableSizeGb');

  const handleShowTotalTableSizeChart = () => {
    setShowTotalTableSizeChart(true);
    setShowDashboardChart(false);
    setShowFragmentRatioChart(false);
    setShowArchive(false);
  };

  const handleShowDashboardChart = () => {
    setShowDashboardChart(true);
    setShowTotalTableSizeChart(false);
    setShowFragmentRatioChart(false);
    setShowArchive(false);
  };

  const handleShowFragmentRatioChart = () => {
    setShowFragmentRatioChart(true);
    setShowTotalTableSizeChart(false);
    setShowDashboardChart(false);
    setShowArchive(false);
  };

  const handleShowArchive = () => {
    setShowArchive(true);
    setShowTotalTableSizeChart(false);
    setShowDashboardChart(false);
    setShowFragmentRatioChart(false);
  };

  const handleBackButtonClick = () => {
    setShowArchive(false);
  };

  const handleButtonClick = async (chartType: string) => {
    if (selectedConnectionString) {
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
        case 'archive':
          handleShowArchive();
          break;
        default:
          break;
      }
    } else {
      console.error('No connection string selected.');
    }
  };

  const isCustomerSelected = selectedConnectionString !== null;

  return (
    <div className="container-fluid mt-5">
      {isAuthenticated ? (
        <>
          <h1 className="mb-4 welcome-text" onClick={handleShowDashboardChart} style={{ marginBottom: '15px' }}>
            Welcome, {name}!
          </h1>
          {showArchive && (
            <div className="archive-banner">
              <h2>Archive</h2>
            </div>
          )}
          {showArchive || (
            <div className="mb-3 d-flex justify-content-center">
              <select
                className="dropdown-toggle form-select me-2"
                onChange={(e) => setSelectedConnectionString(e.target.value)}
                value={selectedConnectionString || ''}
              >
                <option value="">SELECT A CUSTOMER</option>
                <option value="DatabaseConnectionGratis">Gratis</option>
                <option value="DatabaseConnectionNorthwind">Northwind</option>
                <option value="AdventureWorks">AdventureWorks</option>
              </select>

              <button
                className="btn btn-primary btn-lg me-2"
                onClick={() => handleButtonClick('dashboard')}
                disabled={!isCustomerSelected || !selectedConnectionString} 
              >
                Show Index Sizes
              </button>
              <button
                className="btn btn-primary btn-lg me-2"
                onClick={() => handleButtonClick('tableSize')}
                disabled={!isCustomerSelected || !selectedConnectionString} 
              >
                Show Table Sizes
              </button>
              <button
                className="btn btn-primary btn-lg me-2"
                onClick={() => handleButtonClick('fragmentRatio')}
                disabled={!isCustomerSelected || !selectedConnectionString} 
              >
                Show Fragment Ratio
              </button>
              <button
                className="btn btn-primary btn-lg me-2"
                onClick={() => handleButtonClick('archive')}
                disabled={!isCustomerSelected || !selectedConnectionString} 
              >
                Show Archive
              </button>
            </div>
          )}
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              {showDashboardChart && selectedConnectionString === 'DatabaseConnectionGratis' && <GratisIndexSize isLoggedIn />}
              {showDashboardChart && selectedConnectionString === 'DatabaseConnectionNorthwind' && <Dashboard isLoggedIn />}
              {showDashboardChart && selectedConnectionString === 'AdventureWorks' && <AdventureWorksIndexSize isLoggedIn={true} />}
              {showTotalTableSizeChart && selectedConnectionString === 'DatabaseConnectionGratis' && <GratisTotalSize isLoggedIn={true} />}
              {showTotalTableSizeChart && selectedConnectionString === 'DatabaseConnectionNorthwind' && <TotalSize />}
              {showTotalTableSizeChart && selectedConnectionString === 'AdventureWorks' && <AdventureWorkTotalSize isLoggedIn={true} />}
              {showFragmentRatioChart && selectedConnectionString === 'DatabaseConnectionNorthwind' && <FragmentRatio  /> }
              {showFragmentRatioChart && selectedConnectionString ==='AdventureWorks' && <AdventureWorksFragmentationRatio  />}
              
              {showArchive && (selectedConnectionString === 'DatabaseConnectionGratis' || selectedConnectionString === 'DatabaseConnectionNorthwind' || selectedConnectionString === 'AdventureWorks') && (
                <div>
                  <label className="dropdown-label">Graph Type:</label>
                  <select className="dropdown-select" onChange={(e) => setChartType(e.target.value)} value={chartType}>
                    <option value="totalTableSizeGb">Table Size</option>
                    <option value="totalIndexSize">Index Size</option>
                  </select>
                  <CustomerInfoGraph chartType={chartType} onBack={handleBackButtonClick} />
                </div>
              )}
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
