import React from 'react';
import ChartRenderer from './ChartRenderer';
import DynamicTable from './DynamicTable';

interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  metadata: {
    row_count: number;
    columns: string[];
    execution_time_ms: number;
  };
}

interface DashboardSuggestion {
  type: string;
  title: string;
  description: string;
  confidence: number;
  config: any;
  reasoning: string;
}

interface DashboardViewProps {
  result: QueryResult;
  dashboard: DashboardSuggestion;
  question: string;
}

const DashboardView: React.FC<DashboardViewProps> = ({ result, dashboard, question }) => {
  console.log('DashboardView render:', { result, dashboard, question });

  if (!result.success || !result.data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-600">
          <h3 className="font-semibold mb-2">Erro na consulta:</h3>
          <p>{result.error}</p>
        </div>
      </div>
    );
  }

  // Additional validation
  if (!dashboard || !dashboard.config) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-600">
          <h3 className="font-semibold mb-2">Erro no dashboard:</h3>
          <p>Configuração de dashboard inválida</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📊 Dashboard Automático
        </h2>
        <p className="text-gray-600 mb-4">
          <strong>Pergunta:</strong> {question}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{result.metadata.row_count}</div>
            <div className="text-sm text-blue-700">Registros</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{result.metadata.columns.length}</div>
            <div className="text-sm text-green-700">Colunas</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{result.metadata.execution_time_ms}ms</div>
            <div className="text-sm text-purple-700">Tempo de execução</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          🎯 Visualização Sugerida: {dashboard.title}
        </h3>
        <p className="text-gray-600 mb-2">{dashboard.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Confiança:</strong> {Math.round(dashboard.confidence * 100)}% | 
          <strong> Motivo:</strong> {dashboard.reasoning}
        </p>
        
        {/* Renderizar o gráfico com dados para interpretação */}
        <ChartRenderer 
          key={`chart-${result.metadata.row_count}-${result.metadata.columns.length}`}
          config={dashboard.config} 
          title={dashboard.title} 
          data={result.data} 
        />
      </div>

      <div className="mb-6">
        {/* Usar o novo DynamicTable */}
        <DynamicTable 
          key={`table-${result.metadata.row_count}-${result.metadata.columns.length}`}
          data={result.data} 
          columns={result.metadata.columns} 
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          💡 Sugestões de Análise
        </h3>
        <div className="space-y-2">
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              <strong>Dica:</strong> Tente perguntar sobre tendências temporais ou comparações entre regiões
            </p>
          </div>
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Exemplo:</strong> "Quais produtos vendem melhor em cada região?"
            </p>
          </div>
          <div className="p-3 bg-green-50 border-l-4 border-green-400">
            <p className="text-sm text-green-800">
              <strong>Exemplo:</strong> "Como as vendas variam por mês em cada região?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
