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
  data?: any[]; // Dados originais para interpretação
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ config, title, data = [] }) => {
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

  // Função para interpretar os dados
  const interpretData = () => {
    if (!data.length || !processedData.labels.length) return null;

    const interpretation = {
      totalRecords: data.length,
      uniqueCategories: new Set(processedData.labels).size,
      dataRange: '',
      insights: [] as string[],
      barExplanation: '' as string
    };

    // Analisar range dos dados
    if (processedData.datasets.length > 0 && processedData.datasets[0].data) {
      const values = processedData.datasets[0].data;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      
      interpretation.dataRange = `${min} a ${max} (média: ${avg.toFixed(1)})`;
      
      // Gerar insights
      if (max > avg * 1.5) {
        interpretation.insights.push(`Valor máximo (${max}) está significativamente acima da média`);
      }
      if (min < avg * 0.5) {
        interpretation.insights.push(`Valor mínimo (${min}) está significativamente abaixo da média`);
      }
      if (new Set(values).size < values.length * 0.3) {
        interpretation.insights.push('Há valores repetidos, indicando padrões nos dados');
      }

      // Explicação específica para gráficos de barra
      if (chartType === 'bar_chart' || chartType === 'bar') {
        const dataset = processedData.datasets[0];
        const label = dataset.label || 'Valor';
        
        interpretation.barExplanation = `Cada barra representa o ${label} para uma categoria específica. `;
        interpretation.barExplanation += `A altura da barra indica o valor numérico, permitindo comparação visual entre as categorias. `;
        
        // Adicionar insights específicos baseados nos dados
        const maxIndex = values.indexOf(max);
        const minIndex = values.indexOf(min);
        
        if (maxIndex !== -1 && minIndex !== -1) {
          interpretation.barExplanation += `A categoria "${processedData.labels[maxIndex]}" tem o maior valor (${max}), `;
          interpretation.barExplanation += `enquanto "${processedData.labels[minIndex]}" tem o menor valor (${min}).`;
        }
      }
    }

    return interpretation;
  };

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
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.parsed;
            const category = context.label || '';
            return `${label}: ${value} (${category})`;
          }
        }
      }
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

  const interpretation = interpretData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h4 className="font-semibold text-gray-700 mb-4">
        {title || 'Visualização dos Dados'}
      </h4>
      
      {/* Interpretação dos dados */}
      {interpretation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-800 mb-2">📊 Interpretação dos Dados</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="text-sm">
              <span className="font-medium text-blue-700">Total de registros:</span> {interpretation.totalRecords}
            </div>
            <div className="text-sm">
              <span className="font-medium text-blue-700">Categorias únicas:</span> {interpretation.uniqueCategories}
            </div>
            <div className="text-sm">
              <span className="font-medium text-blue-700">Range dos dados:</span> {interpretation.dataRange}
            </div>
          </div>
          
          {/* Explicação específica para barras */}
          {interpretation.barExplanation && (
            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
              <h6 className="font-medium text-blue-700 mb-1">🎯 Explicação do Gráfico:</h6>
              <p className="text-sm text-blue-600">{interpretation.barExplanation}</p>
            </div>
          )}
          
          {interpretation.insights.length > 0 && (
            <div className="mt-3">
              <h6 className="font-medium text-blue-700 mb-1">💡 Insights:</h6>
              <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                {interpretation.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Legenda explicativa */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h5 className="font-semibold text-gray-700 mb-2">🎯 O que cada elemento representa:</h5>
        <div className="text-sm text-gray-600">
          {processedData.datasets.map((dataset: any, index: number) => (
            <div key={index} className="mb-1">
              <span className="font-medium">{dataset.label}:</span> {dataset.data.length} valores
              {dataset.data.length > 0 && (
                <span className="ml-2">
                  (mín: {Math.min(...dataset.data)}, máx: {Math.max(...dataset.data)})
                </span>
              )}
            </div>
          ))}
          {processedData.labels.length > 0 && (
            <div className="mt-2">
              <span className="font-medium">Categorias:</span> {processedData.labels.slice(0, 3).join(', ')}
              {processedData.labels.length > 3 && ` e mais ${processedData.labels.length - 3}...`}
            </div>
          )}
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-96">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartRenderer;
