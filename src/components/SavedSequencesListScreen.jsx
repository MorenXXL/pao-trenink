import React, { useState } from 'react';
import { ArrowLeft, Plus, Play, Settings, Trash2, Edit } from 'lucide-react';

function SavedSequencesListScreen({ onBack, onAdd, onEdit, onTrain, onDelete, onBackup, sequences }) {
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
          <div className="bg-indigo-600 px-8 py-6 flex flex-col items-center text-white">
            <h3 className="text-3xl font-bold mb-6">Uložené sekvence</h3>
            <div className="flex flex-col space-y-3 w-full max-w-sm">
              <button
                onClick={onTrain}
                disabled={!sequences || sequences.length === 0}
                className="flex items-center justify-center bg-white disabled:bg-indigo-400 text-indigo-700 disabled:text-indigo-200 px-6 py-4 rounded-xl font-bold text-lg transition-colors shadow-md"
              >
                <Play className="w-6 h-6 mr-2" />
                Trénovat
              </button>
              <button
                onClick={onAdd}
                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Přidat sekvenci
              </button>
              
              <div className="pt-2">
                 <button
                   onClick={onBackup}
                   className="flex w-full items-center justify-center bg-indigo-700 hover:bg-indigo-800 text-indigo-200 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-indigo-500 hover:border-indigo-400"
                 >
                   <Settings className="w-4 h-4 mr-2" />
                   Nástroje zálohování
                 </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {!sequences || sequences.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-4 text-indigo-300">
                  <Play className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Zatím nemáte žádné sekvence</h4>
              </div>
            ) : (
              <div className="space-y-3">
                {sequences.map((seq) => (
                  <div key={seq.id}>
                    <div 
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedSequence(selectedSequence?.id === seq.id ? null : seq)}
                    >
                      <h4 className="flex-1 text-base font-bold text-gray-900 line-clamp-2 break-words pr-4">{seq.name}</h4>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => handleEdit(seq, e)}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-white"
                          title="Upravit"
                        >
                           <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(seq.id, e)}
                          className="p-2 text-gray-400 hover:text-danger-600 transition-colors rounded-lg hover:bg-white"
                          title="Smazat"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {/* Collapsible Details */}
                    {selectedSequence?.id === seq.id && (
                      <div className="mx-4 mb-2 mt-1 bg-gray-50 rounded-b-xl border border-t-0 border-gray-200 p-4 shadow-inner animate-in slide-in-from-top-2">
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs font-semibold uppercase text-gray-400 block mb-1">Název</span>
                            <span className="text-gray-900 font-bold">{seq.name}</span>
                          </div>
                          {seq.value && (
                            <div>
                               <span className="text-xs font-semibold uppercase text-gray-400 block mb-1">Hodnota</span>
                               <span className="text-gray-800 break-all">{seq.value}</span>
                            </div>
                          )}
                          {seq.pao && (
                            <div>
                               <span className="text-xs font-semibold uppercase text-gray-400 block mb-1">PAO</span>
                               <span className="text-indigo-700 font-medium whitespace-pre-wrap">{seq.pao}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
