import React from 'react';

interface QueryHistory {
  id: string;
  question: string;
  sql: string;
  result: any;
  dashboard: any;
  timestamp: Date;
}

interface HistoryPanelProps {
  history: QueryHistory[];
  onItemClick: (item: QueryHistory) => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onItemClick, onClose }) => {
  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📚 Histórico</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Nenhuma consulta realizada ainda
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <p className="font-medium text-gray-800 text-sm mb-1">
                {item.question}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {item.timestamp.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 font-mono bg-gray-100 p-1 rounded">
                {item.sql.substring(0, 50)}...
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {item.result.metadata.row_count} registros • {item.dashboard.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
