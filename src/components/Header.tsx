import React from 'react';

interface HeaderProps {
  onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              🚀 Askadb
            </h1>
            <span className="ml-3 text-sm text-gray-500">
              Banco de Dados Revolucionário
            </span>
          </div>
          
          <button
            onClick={onHistoryClick}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            📚 Histórico
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
