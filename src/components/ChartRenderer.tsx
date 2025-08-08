import React from 'react';

interface ChartRendererProps {
  config: any;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ config }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold text-gray-700 mb-2">Visualização:</h4>
      <div className="text-sm text-gray-600">
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ChartRenderer;
