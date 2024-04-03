import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

type TableData = {
  tableName: string;
  totalTableSizeGB: number;
  totalTableSizeMB?: number; // MB cinsinden değeri ekledik
};

type GratisTotalSizeProps = {
  isLoggedIn: boolean;
};

const GratisTotalSize: React.FC<GratisTotalSizeProps> = ({ isLoggedIn }) => {
  const [tableData, setTableData] = useState<TableData[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get<TableData[]>('http://localhost:5205/api/Tables/table?customer=DatabaseConnectionGratis');
        console.log('API Response:', response.data);

        // GB'den MB'ye dönüştürme işlemi ve yeni özellik eklemesi
        const dataInMB = response.data.map((data) => ({
          ...data,
          totalTableSizeMB: data.totalTableSizeGB * 1024,
        }));

        setTableData(dataInMB);
      } catch (error) {
        console.error('API veri alma hatası:', error);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const chartData = {
    labels: tableData.map((data) => data.tableName),
    datasets: [
      {
        label: 'Total Table Sizes (MB)',
        data: tableData.map((data) => data.totalTableSizeMB || 0), 
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
          text: 'TABLE SIZE (MB)',
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

export default GratisTotalSize;
