import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Chart } from 'chart.js';
import './Archive.css'; // Import your CSS file

type CustomerInfo = {
  tableName: string;
  totalTableSizeGb: number;
  totalIndexSize: number;
  date: string;
  customerName: string;
};

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);

interface CustomerInfoGraphProps {
  chartType: string;
  onBack: () => void;
}

const CustomerInfoGraph: React.FC<CustomerInfoGraphProps> = ({ chartType, onBack }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [customerNameFilter, setCustomerNameFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [timeFilter, customerNameFilter]);

  const fetchData = async () => {
    try {
      const response = await axios.get<CustomerInfo[]>('https://localhost:7138/api/CustomerInfos');
      console.log('API Response:', response.data);

      let filteredData = response.data;

      if (customerNameFilter) {
        filteredData = filteredData.filter((data) => data.customerName === customerNameFilter);
      }

      if (timeFilter === '1week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredData = filteredData.filter((data) => new Date(data.date) > oneWeekAgo);
      } else if (timeFilter === '1month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filteredData = filteredData.filter((data) => new Date(data.date) > oneMonthAgo);
      }

      const dataWithDayPart = filteredData.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString(),
      }));

      setCustomerInfo(dataWithDayPart);
    } catch (error) {
      console.error('API veri alma hatası:', error);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFilter(event.target.value);
  };

  const handleCustomerNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomerNameFilter(event.target.value);
  };

  const chartData = {
    labels: customerInfo.map((data) => data.date),
    datasets: [
      {
        label: chartType === 'totalTableSizeGb' ? 'Total Table Size (GB)' : 'Index Size',
        data: customerInfo.map((data) => (chartType === 'totalTableSizeGb' ? data.totalTableSizeGb : data.totalIndexSize)),
        backgroundColor: 'rgba(41, 128, 185, 0.5)',
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: chartType === 'totalTableSizeGb' ? 'Total Table Size' : 'Index Size',
        font: {
          size: 20,
          weight: 'bold',
          family: 'Arial, sans-serif',
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 16,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
        },
      
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: chartType === 'totalTableSizeGb' ? 'Tablo Boyutu (GB)' : 'Index Size',
          font: {
            size: 16,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2.5,
  };

  return (
    <div className="customer-info-graph-container">
      <header className="graph-header">
        <button id="back-button" className="back-button" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <div className="graph-title">
          {chartType === 'totalTableSizeGb' ? 'Total Table Size (GB)' : 'Total Index Size'}
        </div>
        <div className="filter-container">
          <label className="dropdown-label">Customer:</label>
          <select
            id="customer-dropdown"
            className="dropdown-select"
            onChange={handleCustomerNameChange}
            value={customerNameFilter || ''}
          >
            <option value="">All Customers</option>
            <option value="Northwind">Northwind</option>
            <option value="Gratis">Gratis</option>
            <option value="AdventureWorks">AdventureWorks</option>
          </select>
          <label className="dropdown-label">Date:</label>
          <select
            id="date-dropdown"
            className="dropdown-select"
            onChange={handleFilterChange}
            value={timeFilter}
          >
            <option value="all">All </option>
            <option value="1week">Last 1 Week</option>
            <option value="1month">Last 1 Month</option>
          </select>
        </div>
      </header>
      <div className="chart-container">
        {customerInfo.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>Data Loading...</p>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoGraph;
