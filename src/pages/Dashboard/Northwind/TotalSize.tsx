import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Chart } from 'chart.js';

type TableData = {
  tableName: string;
  totalTableSizeGB: number;
};

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);

const TotalSize: React.FC = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<TableData[]>('http://localhost:5036/api/Tables/table');
        console.log('API Response:', response.data);

        // Convert totalTableSizeGB to megabytes
        const dataInMegabytes = response.data.map((item) => ({
          ...item,
          totalTableSizeGB: item.totalTableSizeGB * 1024, 
        }));

        setTableData(dataInMegabytes);
      } catch (error) {
        console.error('API veri alma hatası:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: tableData.map((data) => data.tableName),
    datasets: [
      {
        label: 'Total Table Size (MB)', 
        data: tableData.map((data) => data.totalTableSizeGB),
        backgroundColor: tableData.map((data) =>
          data.totalTableSizeGB > 0.15 ? 'red' : 'rgba(41, 128, 185, 0.5)'
        ),
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'TABLE NAME',
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
          text: 'TABLE SIZE (MB)', // Update the y-axis title to MB
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
      {tableData.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <p>Data Loading...</p>
      )}
    </div>
  );
};

export default TotalSize;
