import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

type FragmentData = {
  indexName: string;
  fragmentationRatio: number;
};

const AdventureWorksFragmentationRatio: React.FC = () => {
  const [fragmentData, setFragmentData] = useState<FragmentData[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<FragmentData[]>('http://localhost:5235/fragmentedindex');
        console.log('API Response:', response.data);
        setFragmentData(response.data);
      } catch (error) {
        console.error('API veri alma hatası:', error);
      }
    };

    fetchData();
  }, []); 

  const handleBarHover = (event: any, chart: any) => {
    if (chart.length > 0) {
      const activeIndex = chart[0].index;
      setHoveredIndex(activeIndex);
    }
  };

  const handleBarLeave = () => {
    setHoveredIndex(null);
  };

  const data = {
    labels: fragmentData.map(() => ''), // Index Name'leri boş dize olarak ayarla
    datasets: [
      {
        label: 'Fragmentation Ratio',
        data: fragmentData.map((data) => data.fragmentationRatio),
        backgroundColor: fragmentData.map((data) =>
          data.fragmentationRatio > 35 ? 'red' : 'rgba(41, 128, 185, 0.5)'
        ),
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    indexAxis: 'y', // X ekseninde Index Name'leri gösterme
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '', // Grafiğin üzerinde Index Name olmayacak
          font: {
            size: 16,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
        },
      },
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'FRAGMENTATION RATIO %',
          font: {
            size: 16,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false
      }
    },
    onHover: handleBarHover,
    onLeave: handleBarLeave
  };

  return (
    <div>
      {fragmentData.length > 0 ? (
        <div className="chart-container" style={{ width: '800px', height: '600px' }}> {/* Grafik boyutunu ayarla */}
          <Bar data={data} options={options} />
          {hoveredIndex !== null && (
            <div className="index-name-tooltip">
              <p style={{ position: 'absolute', bottom: '5px', fontWeight: 'bold', fontSize: '16px' }}>Index Name = {hoveredIndex !== null ? fragmentData[hoveredIndex].indexName : ''}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Data Loading...</p>
      )}
    </div>
  );
};

export default AdventureWorksFragmentationRatio;
