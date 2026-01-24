import React, { useState } from 'react';
import { ArrowLeft, Save, X, RotateCcw, Edit3 } from 'lucide-react';

// Helper function to format values for display
const formatValue = (value, system) => {
  if (system === 'velky') {
    if (typeof value === 'object' && value.person && value.action && value.object) {
      return `${value.person} | ${value.action} | ${value.object}`;
    }
    return String(value);
  }
  return String(value);
};

// Helper function to parse edited values back to correct format
const parseEditValue = (editValue, system) => {
  if (system === 'velky') {
    const parts = editValue.split('|').map(part => part.trim());
    if (parts.length === 3) {
      return {
        person: parts[0],
        action: parts[1],
        object: parts[2]
      };
    }
    // Fallback if not properly formatted
    return { person: editValue, action: "", object: "" };
  }
  return editValue;
};

function EditScreen({ system, data, onBack, onSave, onReset }) {
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');

  const systemTitles = {
    velky: 'Velký systém (PAO)',
    maly: 'Malý systém',
    binarni: 'Binární systém'
  };

  const entries = Object.entries(data).sort((a, b) => {
    if (system === 'binarni') {
      return a[0].localeCompare(b[0]);
    }
    return parseInt(a[0]) - parseInt(b[0]);
  });

  const handleEdit = (key, value) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const handleSave = () => {
    const processedValue = parseEditValue(editValue, system);
    onSave(editingKey, processedValue);
    setEditingKey(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-purple-700 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:text-primary-200 transition-colors text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zpět na menu
          </button>

          <button
            onClick={onReset}
            className="flex items-center bg-danger-600 hover:bg-danger-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Obnovit výchozí
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Upravit {systemTitles[system]}</h2>
          <p className="text-xl text-primary-100">Přizpůsobte si systém podle svých potřeb</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {entries.map(([key, value]) => (
                <div key={key} className="flex items-center p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-16 text-center">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-700 rounded-lg font-bold text-lg">
                      {key}
                    </span>
                  </div>

                  <div className="flex-1 ml-6">
                    {editingKey === key ? (
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-primary-300 rounded-lg focus:border-primary-500 focus:ring-0 text-lg"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                          placeholder={system === 'velky' ? 'Osoba | Akce | Objekt' : ''}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="flex items-center justify-center w-12 h-12 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex items-center justify-center w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-gray-800 leading-relaxed">{formatValue(value, system)}</span>
                        <button
                          onClick={() => handleEdit(key, formatValue(value, system))}
                          className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditScreen;