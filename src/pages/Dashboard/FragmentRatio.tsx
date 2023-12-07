import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

type FragmentData = {
  indexName: string;
  fragmentationRatio: number;
};

const FragmentRatio: React.FC = () => {
  const [fragmentData, setFragmentData] = useState<FragmentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<FragmentData[]>('http://localhost:5036/fragmentedindex');
        console.log('API Response:', response.data);
        setFragmentData(response.data);
      } catch (error) {
        console.error('API veri alma hatası:', error);
      }
    };

    fetchData();
  }, []); // Bu useEffect sadece bir kere çağrılacak, çünkü bağımlılık yok.

  const data = {
    labels: fragmentData.map((data) => data.indexName),
    datasets: [
      {
        label: 'Fragmentation Ratio',
        data: fragmentData.map((data) => data.fragmentationRatio),
        backgroundColor: 'rgba(41, 128, 185, 0.5)',
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    scales: {
      x: { // Yatay ekseni belirt
        beginAtZero: true,
        title: {
          display: true,
          text: 'INDEX NAME', 
          font: {
            size: 16, // Font büyüklüğü
            weight: 'bold', // Kalınlık (bold)
            family: 'Arial, sans-serif', // Font ailesi
          },// x ekseni etiketi
        },
      },
      y: {
        beginAtZero: true,
        max: 100, // Fragmentation ratio is a percentage, so the maximum value is 100
        title: {
          display: true,
          text: 'FRAGMENTATION RATIO %',
            font: {
            size: 16, // Font büyüklüğü
            weight: 'bold', // Kalınlık (bold)
            family: 'Arial, sans-serif', // Font ailesi
          },
        },
      },
    },
  };

  return (
    <div>
      {fragmentData.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <p>Data Loading...</p>
      )}
    </div>
  );
};

export default FragmentRatio;
