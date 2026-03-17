import React, { useState } from 'react';
import { ArrowLeft, Plus, Play, Settings, Trash2, Edit } from 'lucide-react';

function SavedSequencesListScreen({ onBack, onAdd, onEdit, onTrain, onDelete, sequences }) {
  const [selectedSequence, setSelectedSequence] = useState(null);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Opravdu chcete smazat tuto uloženou sekvenci?')) {
      onDelete(id);
    }
  };

  const handleEdit = (sequence, e) => {
    e.stopPropagation();
    onEdit(sequence);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-800 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-indigo-200 transition-colors mb-8 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zpět do menu
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center text-white">
            <div>
              <h3 className="text-2xl font-bold">Uložené sekvence</h3>
              <p className="text-indigo-200 mt-1">Vaše vlastní data pro trénink a archivaci</p>
            </div>
            <div className="flex space-x-4">
              {sequences && sequences.length > 0 && (
                <button
                  onClick={onTrain}
                  className="flex items-center bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Trénovat všechny
                </button>
              )}
              <button
                onClick={onAdd}
                className="flex items-center bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Přidat novou
              </button>
            </div>
          </div>

          <div className="p-8">
            {!sequences || sequences.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-4 text-indigo-300">
                  <Settings className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Zatím nemáte žádné uložené sekvence</h4>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Můžete si zde vytvořit vlastní sekvence, které si chcete pamatovat. Například rodná čísla, adresy, nebo historická data.
                </p>
                <button
                  onClick={onAdd}
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Vytvořit první sekvenci
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {sequences.map((seq) => (
                  <div 
                    key={seq.id}
                    className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="flex-1 p-5">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{seq.name}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <span className="text-xs font-semibold uppercase text-gray-400 block mb-1">Hodnota</span>
                          <span className="text-gray-800 font-medium break-all">{seq.value || '-'}</span>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <span className="text-xs font-semibold uppercase text-indigo-400 block mb-1">PAO</span>
                          <span className="text-indigo-800 font-medium whitespace-pre-wrap">{seq.pao || '-'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 flex sm:flex-col justify-end sm:justify-center items-center p-4 border-t sm:border-t-0 sm:border-l border-gray-100 space-x-2 sm:space-x-0 sm:space-y-3">
                      <button
                        onClick={(e) => handleEdit(seq, e)}
                        className="flex items-center justify-center w-10 h-10 bg-white text-gray-500 hover:text-primary-600 hover:bg-primary-50 border border-gray-200 rounded-lg transition-colors"
                        title="Upravit sekvenci"
                      >
                         <Edit className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={(e) => handleDelete(seq.id, e)}
                        className="flex items-center justify-center w-10 h-10 bg-white text-gray-500 hover:text-danger-600 hover:bg-danger-50 border border-gray-200 rounded-lg transition-colors"
                        title="Smazat sekvenci"
                      >
                         <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedSequencesListScreen;
