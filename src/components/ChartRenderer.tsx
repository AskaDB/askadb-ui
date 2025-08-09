import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartRendererProps {
  config: any;
  title?: string;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ config, title }) => {
  // Debug: log the config to see what we're receiving
  console.log('ChartRenderer config:', config);

  if (!config || !config.data) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">Visualização:</h4>
        <div className="text-sm text-gray-600">
          <p>Configuração de gráfico inválida</p>
          <pre className="mt-2 text-xs">{JSON.stringify(config, null, 2)}</pre>
        </div>
      </div>
    );
  }

  const chartType = config.type || 'bar_chart';
  const chartData = config.data;
  const chartOptions = config.options || {};

  // Ensure proper structure for Chart.js
  const processedData = {
    labels: chartData.labels || [],
    datasets: chartData.datasets || []
  };

  // Debug: log the processed data
  console.log('Processed data:', processedData);

  // Add default options if not provided
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title || 'Gráfico',
      },
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...chartOptions,
  };

  const renderChart = () => {
    try {
      switch (chartType) {
        case 'bar_chart':
        case 'bar':
          return <Bar data={processedData} options={finalOptions} />;
        
        case 'line_chart':
        case 'line':
          return <Line data={processedData} options={finalOptions} />;
        
        case 'pie_chart':
        case 'pie':
          return <Pie data={processedData} options={finalOptions} />;
        
        case 'doughnut':
          return <Doughnut data={processedData} options={finalOptions} />;
        
        case 'horizontal_bar':
          return (
            <Bar 
              data={processedData} 
              options={{
                ...finalOptions,
                indexAxis: 'y' as const,
              }} 
            />
          );
        
        default:
          return <Bar data={processedData} options={finalOptions} />;
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
      return (
        <div className="text-red-600 p-4">
          <p>Erro ao renderizar gráfico: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        </div>
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h4 className="font-semibold text-gray-700 mb-4">
        {title || 'Visualização dos Dados'}
      </h4>
      <div className="w-full h-96">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartRenderer;
