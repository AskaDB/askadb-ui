import React, { useState } from 'react';

interface QueryEditorProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  currentQuery: string;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ onSubmit, isLoading, currentQuery }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
      setQuestion('');
    }
  };

  const exampleQuestions = [
    "Quero vendas por região no mês de maio",
    "Mostre os top 5 produtos por quantidade vendida",
    "Qual foi o crescimento de vendas entre janeiro e fevereiro?",
    "Quais regiões tiveram melhor performance?",
    "Compare vendas por produto e região"
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        💬 Faça sua pergunta em linguagem natural
      </h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: Quero vendas por região no mês de maio"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Processando...' : 'Perguntar'}
          </button>
        </div>
      </form>

      {currentQuery && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Última pergunta:</h3>
          <p className="text-blue-700">{currentQuery}</p>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Exemplos de perguntas:</h3>
        <div className="space-y-2">
          {exampleQuestions.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuestion(example)}
              className="block w-full text-left p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryEditor;
