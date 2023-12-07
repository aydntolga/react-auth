import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

type TableData = {
  indexName: string;
  indexSizeGB: number;
};

type DashboardProps = {
  isLoggedIn: boolean;
};

const Dashboard: React.FC<DashboardProps> = ({ isLoggedIn }) => {
  const [tableData, setTableData] = useState<TableData[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get<TableData[]>('http://localhost:5036/api/Tables/GetIndexSizes');
        console.log('API Response:', response.data);
        setTableData(response.data);
      } catch (error) {
        console.error('API veri alma hatası:', error);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const chartData = {
    labels: tableData.map((data) => data.indexName),
    datasets: [
      {
        label: 'Total Index Sizes (GB)',
        data: tableData.map((data) => data.indexSizeGB),
        backgroundColor: 'rgba(41, 128, 185, 0.5)',
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions:any = {
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'INDEX NAME', 
          font: {
            size: 16, 
            weight: 'bold', 
            family: 'Arial, sans-serif'
          }
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'INDEX SIZE (GB)',
          font: {
            size: 16, 
            weight: 'bold', 
            family: 'Arial, sans-serif'
          } 
        },
      },
    },
  };

  return (
    <div>
      {isLoggedIn && tableData.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>Data Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
