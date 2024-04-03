import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

type TableData = {
  indexName: string;
  indexSizeGB: number;
};

type GratisIndexSizeProps = {
  isLoggedIn: boolean;
};

const GratisIndexSize: React.FC<GratisIndexSizeProps> = ({ isLoggedIn }) => {
  const [tableData, setTableData] = useState<TableData[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get<TableData[]>('http://localhost:5205/api/Tables/GetIndexSizes?customer=DatabaseConnectionGratis');
        console.log('API Response:', response.data);

        // Convert indexSizeGB to megabytes
        const dataInMegabytes = response.data.map((item) => ({
          ...item,
          indexSizeGB: item.indexSizeGB * 1024, // Convert GB to MB
        }));

        setTableData(dataInMegabytes);
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
        label: 'Total Index Sizes (MB)', // Update the label to MB
        data: tableData.map((data) => data.indexSizeGB),
        backgroundColor: 'rgba(41, 128, 185, 0.5)',
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: any = {
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'INDEX NAME',
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
          text: 'INDEX SIZE (MB)', // Update the y-axis title to MB
          font: {
            size: 16,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
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

export default GratisIndexSize;
